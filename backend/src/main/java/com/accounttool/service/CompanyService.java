package com.accounttool.service;

import com.accounttool.entity.Company;
import com.accounttool.repository.CompanyRepository;
import com.accounttool.util.GstinValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyService {
    
    private final CompanyRepository companyRepository;
    private final GstinValidator gstinValidator;
    
    @Transactional
    public Company createCompany(Company company) {
        if (!gstinValidator.isValidGstin(company.getGstin())) {
            throw new RuntimeException("Invalid GSTIN format");
        }
        
        if (companyRepository.existsByGstin(company.getGstin())) {
            throw new RuntimeException("Company with this GSTIN already exists");
        }
        
        return companyRepository.save(company);
    }
    
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }
    
    public Company getCompanyById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));
    }
    
    @Transactional
    public Company updateCompany(Long id, Company companyDetails) {
        Company company = getCompanyById(id);
        
        if (!company.getGstin().equals(companyDetails.getGstin()) 
                && !gstinValidator.isValidGstin(companyDetails.getGstin())) {
            throw new RuntimeException("Invalid GSTIN format");
        }
        
        company.setName(companyDetails.getName());
        company.setAddress(companyDetails.getAddress());
        company.setCity(companyDetails.getCity());
        company.setState(companyDetails.getState());
        company.setPincode(companyDetails.getPincode());
        company.setPan(companyDetails.getPan());
        company.setEmail(companyDetails.getEmail());
        company.setPhone(companyDetails.getPhone());
        
        return companyRepository.save(company);
    }
    
    @Transactional
    public void deleteCompany(Long id) {
        Company company = getCompanyById(id);
        company.setActive(false);
        companyRepository.save(company);
    }
}
