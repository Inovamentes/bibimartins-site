package com.bibimartins.repository;

import com.bibimartins.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByContactEmail(String contactEmail);
    Optional<Company> findByCnpj(String cnpj);
}
