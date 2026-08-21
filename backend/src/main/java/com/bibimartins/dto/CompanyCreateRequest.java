package com.bibimartins.dto;

import com.bibimartins.entity.ProductInterest;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CompanyCreateRequest {

    @NotBlank(message = "Nome da empresa/instituicao e obrigatorio.")
    private String name;

    @NotBlank(message = "E-mail de contato e obrigatorio.")
    @Email(message = "Formato de e-mail invalido.")
    private String contactEmail;

    private String phone;

    private String cnpj;

    @NotNull(message = "Escolha de produto (SINAPSE_360_EMPRESAS ou SINAPSE_360_EDUCACAO) e obrigatoria.")
    private ProductInterest productInterest;

    public CompanyCreateRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCnpj() { return cnpj; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }

    public ProductInterest getProductInterest() { return productInterest; }
    public void setProductInterest(ProductInterest productInterest) { this.productInterest = productInterest; }
}
