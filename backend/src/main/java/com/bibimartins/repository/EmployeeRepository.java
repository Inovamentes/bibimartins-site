package com.bibimartins.repository;

import com.bibimartins.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findByCompanyId(Long companyId);
    boolean existsByCompanyIdAndEmail(Long companyId, String email);
}
