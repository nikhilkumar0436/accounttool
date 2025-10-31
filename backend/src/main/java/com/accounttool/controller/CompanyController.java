package com.accounttool.controller;

import com.accounttool.entity.Company;
import com.accounttool.entity.User;
import com.accounttool.repository.CompanyRepository;
import com.accounttool.repository.UserRepository;
import com.accounttool.security.UserDetailsImpl;
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
    @Autowired
    private CompanyRepository companyRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ACCOUNTANT') or hasRole('ADMIN')")
    public ResponseEntity<List<Company>> getAllCompanies() {
        return ResponseEntity.ok(companyRepository.findAll());
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ACCOUNTANT') or hasRole('ADMIN')")
    public ResponseEntity<Company> getCompanyById(@PathVariable Long id) {
        return companyRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ACCOUNTANT') or hasRole('ADMIN')")
    public ResponseEntity<?> createCompany(@RequestBody Company company, Authentication authentication) {
        if (companyRepository.existsByGstin(company.getGstin())) {
            return ResponseEntity.badRequest().body("Error: GSTIN already exists!");
        }
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        company.setCreatedBy(user);
        return ResponseEntity.ok(companyRepository.save(company));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ACCOUNTANT') or hasRole('ADMIN')")
    public ResponseEntity<Company> updateCompany(@PathVariable Long id, @RequestBody Company companyDetails) {
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCompany(@PathVariable Long id) {
        return companyRepository.findById(id)
                .map(company -> {
                    companyRepository.delete(company);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
