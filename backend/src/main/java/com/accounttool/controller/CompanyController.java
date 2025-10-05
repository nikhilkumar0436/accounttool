package com.accounttool.controller;

import com.accounttool.entity.Company;
import com.accounttool.service.CompanyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
@Tag(name = "Companies", description = "Company management APIs with GSTIN validation")
public class CompanyController {
    
    private final CompanyService companyService;
    
    @PostMapping
    @Operation(summary = "Create new company", description = "Create a new company with GSTIN validation")
    public ResponseEntity<Company> createCompany(@Valid @RequestBody Company company) {
        Company created = companyService.createCompany(company);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @GetMapping
    @Operation(summary = "Get all companies", description = "Retrieve all companies")
    public ResponseEntity<List<Company>> getAllCompanies() {
        List<Company> companies = companyService.getAllCompanies();
        return ResponseEntity.ok(companies);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get company by ID", description = "Retrieve a specific company by its ID")
    public ResponseEntity<Company> getCompanyById(@PathVariable Long id) {
        Company company = companyService.getCompanyById(id);
        return ResponseEntity.ok(company);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update company", description = "Update an existing company")
    public ResponseEntity<Company> updateCompany(
            @PathVariable Long id,
            @Valid @RequestBody Company company) {
        Company updated = companyService.updateCompany(id, company);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete company", description = "Soft delete a company")
    public ResponseEntity<Void> deleteCompany(@PathVariable Long id) {
        companyService.deleteCompany(id);
        return ResponseEntity.noContent().build();
    }
}
