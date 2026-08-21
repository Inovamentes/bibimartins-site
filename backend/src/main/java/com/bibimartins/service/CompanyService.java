package com.bibimartins.service;

import com.bibimartins.dto.CompanyCreateRequest;
import com.bibimartins.dto.CompanyResponse;
import com.bibimartins.entity.Company;
import com.bibimartins.repository.CompanyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Transactional
    public CompanyResponse createCompany(CompanyCreateRequest request) {
        if (companyRepository.findByContactEmail(request.getContactEmail()).isPresent()) {
            throw new IllegalArgumentException("Ja existe uma empresa cadastrada com este e-mail de contato.");
        }

        if (request.getCnpj() != null && !request.getCnpj().isBlank()) {
            if (companyRepository.findByCnpj(request.getCnpj()).isPresent()) {
                throw new IllegalArgumentException("Ja existe uma empresa cadastrada com este CNPJ.");
            }
        }

        Company company = new Company(
                request.getName(),
                request.getContactEmail(),
                request.getPhone(),
                request.getCnpj(),
                request.getProductInterest()
        );

        Company saved = companyRepository.save(company);
        return new CompanyResponse(saved);
    }

    public List<CompanyResponse> listAllCompanies() {
        return companyRepository.findAll().stream()
                .map(CompanyResponse::new)
                .collect(Collectors.toList());
    }

    public CompanyResponse getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Empresa nao encontrada para o ID: " + id));
        return new CompanyResponse(company);
    }
}
