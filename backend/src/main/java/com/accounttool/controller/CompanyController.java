package com.accounttool.controller;

import com.accounttool.entity.Company;
import com.accounttool.entity.User;
import com.accounttool.repository.CompanyRepository;
import com.accounttool.repository.UserRepository;
import com.accounttool.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/companies")
public class CompanyController {
    private static final Logger logger = LoggerFactory.getLogger(CompanyController.class);
    
    @Autowired
    private CompanyRepository companyRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ACCOUNTANT') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Company>> getAllCompanies() {
        return ResponseEntity.ok(companyRepository.findAll());
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ACCOUNTANT') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Company> getCompanyById(@PathVariable Long id) {
        return companyRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ACCOUNTANT') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> createCompany(@Valid @RequestBody Company company, Authentication authentication) {
        if (authentication != null) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            logger.info("User {} attempting to create company. Authorities: {}", 
                userDetails.getUsername(), userDetails.getAuthorities());
        } else {
            logger.warn("Authentication is null when creating company");
        }
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        company.setCreatedBy(user);
        Company savedCompany = companyRepository.save(company);
        logger.info("Company created successfully: {}", savedCompany.getName());
        return ResponseEntity.ok(savedCompany);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ACCOUNTANT') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Company> updateCompany(@PathVariable Long id, @Valid @RequestBody Company companyDetails) {
        return companyRepository.findById(id)
                .map(company -> {
                    company.setName(companyDetails.getName());
                    company.setGstin(companyDetails.getGstin());
                    company.setPan(companyDetails.getPan());
                    company.setAddress(companyDetails.getAddress());
                    company.setCity(companyDetails.getCity());
                    company.setState(companyDetails.getState());
                    company.setPinCode(companyDetails.getPinCode());
                    company.setPhone(companyDetails.getPhone());
                    company.setEmail(companyDetails.getEmail());
                    company.setFinancialYearStart(companyDetails.getFinancialYearStart());
                    company.setFinancialYearEnd(companyDetails.getFinancialYearEnd());
                    return ResponseEntity.ok(companyRepository.save(company));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteCompany(@PathVariable Long id) {
        return companyRepository.findById(id)
                .map(company -> {
                    companyRepository.delete(company);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
