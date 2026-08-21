package com.bibimartins.service;

import com.bibimartins.dto.EmployeeUploadResponse;
import com.bibimartins.entity.Company;
import com.bibimartins.entity.Employee;
import com.bibimartins.repository.CompanyRepository;
import com.bibimartins.repository.EmployeeRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final CompanyRepository companyRepository;

    public EmployeeService(EmployeeRepository employeeRepository, CompanyRepository companyRepository) {
        this.employeeRepository = employeeRepository;
        this.companyRepository = companyRepository;
    }

    @Transactional
    public EmployeeUploadResponse uploadEmployeesCsv(Long companyId, MultipartFile file) {
        EmployeeUploadResponse response = new EmployeeUploadResponse();

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Empresa nao encontrada para o ID: " + companyId));

        if (file == null || file.isEmpty()) {
            response.setSuccess(false);
            response.setMessage("Nenhum arquivo de planilha foi enviado.");
            response.getErrorDetails().add("O arquivo CSV esta vazio ou ausente.");
            return response;
        }

        List<Employee> toSave = new ArrayList<>();
        int processedCount = 0;
        int importedCount = 0;
        int errorCount = 0;

        try {
            // Ler todo o conteudo com UTF-8 e remover BOM se existir
            String content = new String(file.getBytes(), StandardCharsets.UTF_8);
            if (content.startsWith("\uFEFF")) {
                content = content.substring(1);
            }

            // Detectar automaticamente se o delimitador e ponto-e-virgula (padrao Excel PT-BR) ou virgula
            char delimiter = ',';
            String firstLine = content.lines().findFirst().orElse("");
            if (firstLine.contains(";") && !firstLine.contains(",")) {
                delimiter = ';';
            } else if (firstLine.contains(";") && firstLine.contains(",")) {
                // Se tiver ambos, conta qual aparece mais no cabecalho
                long countSemi = firstLine.chars().filter(ch -> ch == ';').count();
                long countComma = firstLine.chars().filter(ch -> ch == ',').count();
                if (countSemi > countComma) {
                    delimiter = ';';
                }
            }

            CSVFormat format = CSVFormat.DEFAULT.builder()
                    .setDelimiter(delimiter)
                    .setHeader()
                    .setSkipHeaderRecord(true)
                    .setIgnoreHeaderCase(true)
                    .setTrim(true)
                    .build();

            try (BufferedReader reader = new BufferedReader(new StringReader(content));
                 CSVParser parser = format.parse(reader)) {

                for (CSVRecord record : parser) {
                    processedCount++;
                    long lineNumber = record.getRecordNumber() + 1;

                    String name = getField(record, "nome", "Nome");
                    String email = getField(record, "email", "Email", "E-mail");
                    String role = getField(record, "cargo", "Cargo", "funcao", "Funcao");
                    String department = getField(record, "setor", "Setor", "departamento", "Departamento");
                    String school = getField(record, "escola", "Escola", "instituicao", "Instituicao");
                    String companyName = getField(record, "empresa", "Empresa", "razao_social", "Razao Social");
                    String city = getField(record, "cidade", "Cidade");
                    String state = getField(record, "estado", "Estado", "UF", "uf");
                    String zipCode = getField(record, "cep", "CEP", "Cep");

                    List<String> missingFields = new ArrayList<>();
                    if (name == null || name.isBlank()) missingFields.add("Nome");
                    if (email == null || email.isBlank()) missingFields.add("Email");

                    if (!missingFields.isEmpty()) {
                        errorCount++;
                        response.getErrorDetails().add("Linha " + lineNumber + ": Campos obrigatorios ausentes (" + String.join(", ", missingFields) + ")");
                        continue;
                    }

                    if (!isValidEmail(email)) {
                        errorCount++;
                        response.getErrorDetails().add("Linha " + lineNumber + ": Formato de e-mail invalido (" + email + ")");
                        continue;
                    }

                    if (employeeRepository.existsByCompanyIdAndEmail(companyId, email)) {
                        errorCount++;
                        response.getErrorDetails().add("Linha " + lineNumber + ": Colaborador com e-mail '" + email + "' ja esta cadastrado nesta empresa.");
                        continue;
                    }

                    Employee employee = new Employee(
                            name,
                            email,
                            role,
                            department,
                            school,
                            companyName,
                            city,
                            state,
                            zipCode,
                            company
                    );

                    toSave.add(employee);
                    importedCount++;
                    response.getSuccessDetails().add("Linha " + lineNumber + ": Colaborador '" + name + "' (" + email + ") validado com sucesso.");
                }
            }

            if (!toSave.isEmpty()) {
                employeeRepository.saveAll(toSave);
            }

            response.setTotalProcessed(processedCount);
            response.setTotalImported(importedCount);
            response.setTotalErrors(errorCount);

            if (errorCount == 0 && importedCount > 0) {
                response.setSuccess(true);
                response.setMessage("Sucesso total! Todos os " + importedCount + " colaboradores foram cadastrados perfeitamente.");
            } else if (importedCount > 0 && errorCount > 0) {
                response.setSuccess(true);
                response.setMessage("Importacao concluida com ressalvas: " + importedCount + " colaboradores importados, " + errorCount + " linhas com problemas.");
            } else {
                response.setSuccess(false);
                response.setMessage("Nenhum colaborador foi importado. Verifique os erros apontados na lista abaixo.");
            }

        } catch (Exception e) {
            response.setSuccess(false);
            response.setMessage("Falha ao processar arquivo de planilha: " + e.getMessage());
            response.getErrorDetails().add(e.getMessage());
        }

        return response;
    }

    public List<Employee> getEmployeesByCompany(Long companyId) {
        return employeeRepository.findByCompanyId(companyId);
    }

    private String getField(CSVRecord record, String... headers) {
        for (String header : headers) {
            if (record.isMapped(header)) {
                String val = record.get(header);
                if (val != null && !val.isBlank()) {
                    return val.trim();
                }
            }
        }
        return null;
    }

    private boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }
}
