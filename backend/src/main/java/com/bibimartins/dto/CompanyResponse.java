package com.bibimartins.dto;

import com.bibimartins.entity.Company;
import com.bibimartins.entity.ProductInterest;
import java.time.LocalDateTime;

public class CompanyResponse {

    private Long id;
    private String name;
    private String contactEmail;
    private String phone;
    private String cnpj;
    private ProductInterest productInterest;
    private LocalDateTime createdAt;
    private int totalEmployees;

    public CompanyResponse() {}

    public CompanyResponse(Company company) {
        this.id = company.getId();
        this.name = company.getName();
        this.contactEmail = company.getContactEmail();
        this.phone = company.getPhone();
        this.cnpj = company.getCnpj();
        this.productInterest = company.getProductInterest();
        this.createdAt = company.getCreatedAt();
        this.totalEmployees = (company.getEmployees() != null) ? company.getEmployees().size() : 0;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getContactEmail() { return contactEmail; }
    public String getPhone() { return phone; }
    public String getCnpj() { return cnpj; }
    public ProductInterest getProductInterest() { return productInterest; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public int getTotalEmployees() { return totalEmployees; }
}
