import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GSTCalculationService {
  
  /**
   * Calculate GST breakdown for a given amount and rate
   * @param amount Base amount (before GST)
   * @param gstRate GST rate in percentage
   * @param isIntraState Whether transaction is within same state
   */
  calculateGST(amount: number, gstRate: number, isIntraState: boolean = true): {
    subtotal: number;
    cgst: number;
    sgst: number;
    igst: number;
    total: number;
  } {
    const gstAmount = (amount * gstRate) / 100;
    
    if (isIntraState) {
      // Intra-state: Split GST into CGST and SGST
      const cgst = gstAmount / 2;
      const sgst = gstAmount / 2;
      return {
        subtotal: amount,
        cgst,
        sgst,
        igst: 0,
        total: amount + gstAmount
      };
    } else {
      // Inter-state: Full GST as IGST
      return {
        subtotal: amount,
        cgst: 0,
        sgst: 0,
        igst: gstAmount,
        total: amount + gstAmount
      };
    }
  }

  /**
   * Calculate reverse GST (when total includes GST)
   * @param totalAmount Amount including GST
   * @param gstRate GST rate in percentage
   * @param isIntraState Whether transaction is within same state
   */
  calculateReverseGST(totalAmount: number, gstRate: number, isIntraState: boolean = true): {
    subtotal: number;
    cgst: number;
    sgst: number;
    igst: number;
    total: number;
  } {
    const baseAmount = totalAmount / (1 + (gstRate / 100));
    const gstAmount = totalAmount - baseAmount;
    
    if (isIntraState) {
      const cgst = gstAmount / 2;
      const sgst = gstAmount / 2;
      return {
        subtotal: baseAmount,
        cgst,
        sgst,
        igst: 0,
        total: totalAmount
      };
    } else {
      return {
        subtotal: baseAmount,
        cgst: 0,
        sgst: 0,
        igst: gstAmount,
        total: totalAmount
      };
    }
  }

  /**
   * Determine if transaction is intra-state based on state codes
   */
  isIntraState(companyStateCode: string, partyStateCode: string): boolean {
    return companyStateCode === partyStateCode;
  }

  /**
   * Get state code from GSTIN (first 2 digits)
   */
  getStateCodeFromGSTIN(gstin: string): string {
    if (!gstin || gstin.length < 2) return '';
    return gstin.substring(0, 2);
  }
}
