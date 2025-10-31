package com.accounttool.repository;

import com.accounttool.entity.Company;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    @Cacheable(value = "companies", key = "#gstin")
    Optional<Company> findByGstin(String gstin);
    
    Boolean existsByGstin(String gstin);
    
    @Cacheable(value = "companies", key = "#id")
    @Override
    Optional<Company> findById(Long id);
}
