package com.accounttool.repository;

import com.accounttool.entity.GSTInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface GSTInvoiceRepository extends JpaRepository<GSTInvoice, Long> {
    Optional<GSTInvoice> findByInvoiceNumber(String invoiceNumber);
    List<GSTInvoice> findByCompanyId(Long companyId);
    List<GSTInvoice> findByCompanyIdAndInvoiceType(Long companyId, GSTInvoice.InvoiceType invoiceType);
}
