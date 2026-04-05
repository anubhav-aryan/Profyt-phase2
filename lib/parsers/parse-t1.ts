import * as XLSX from "xlsx";
import { ParseResult, MetricInput } from "./types";

export async function parseT1(buffer: Buffer): Promise<ParseResult> {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const inputsSheet = workbook.Sheets["Inputs"];

  if (!inputsSheet) {
    throw new Error("T1: 'Inputs' sheet not found");
  }

  const rawData: Record<string, unknown> = {};
  const metrics: MetricInput[] = [];

  const fieldMappings: Array<{
    row: number;
    key: string;
    label: string;
    section: string;
    unit?: string;
  }> = [
    // Company Profile
    { row: 6, key: "t1_company_name", label: "Company Name", section: "A. COMPANY PROFILE" },
    { row: 7, key: "t1_industry_sector", label: "Industry / Sector", section: "A. COMPANY PROFILE" },
    { row: 8, key: "t1_business_model", label: "Business Model", section: "A. COMPANY PROFILE" },
    { row: 9, key: "t1_growth_stage", label: "Growth Stage", section: "A. COMPANY PROFILE" },
    { row: 10, key: "t1_fy_end_month", label: "Financial Year End Month", section: "A. COMPANY PROFILE" },
    
    // Cash Position
    { row: 14, key: "t1_cash_in_bank", label: "Cash & Cash Equivalents in Bank", section: "B. CURRENT CASH POSITION", unit: "₹ Cr" },
    { row: 15, key: "t1_short_term_investments", label: "Short-Term Investments / Liquid FDs", section: "B. CURRENT CASH POSITION", unit: "₹ Cr" },
    { row: 16, key: "t1_total_accessible_cash", label: "Total Accessible Cash", section: "B. CURRENT CASH POSITION", unit: "₹ Cr" },
    { row: 17, key: "t1_accounts_receivable_60d", label: "Accounts Receivable Due Within 60 Days", section: "B. CURRENT CASH POSITION", unit: "₹ Cr" },
    { row: 18, key: "t1_undrawn_credit", label: "Undrawn Sanctioned Credit / OD Facility", section: "B. CURRENT CASH POSITION", unit: "₹ Cr" },
    
    // Monthly Revenue
    { row: 21, key: "t1_primary_revenue", label: "Primary Revenue Stream", section: "C. MONTHLY REVENUE", unit: "₹ Cr / month" },
    { row: 22, key: "t1_secondary_revenue", label: "Secondary Revenue Stream", section: "C. MONTHLY REVENUE", unit: "₹ Cr / month" },
    { row: 23, key: "t1_tertiary_revenue", label: "Tertiary Revenue Stream", section: "C. MONTHLY REVENUE", unit: "₹ Cr / month" },
    { row: 24, key: "t1_other_revenue", label: "Other / Miscellaneous Revenue", section: "C. MONTHLY REVENUE", unit: "₹ Cr / month" },
    { row: 25, key: "t1_total_monthly_revenue", label: "Total Monthly Revenue", section: "C. MONTHLY REVENUE", unit: "₹ Cr" },
    
    // Monthly Expenses
    { row: 28, key: "t1_salaries_expense", label: "Salaries, Benefits & Contractor Fees", section: "D. MONTHLY EXPENSES / BURN", unit: "₹ Cr" },
    { row: 29, key: "t1_cloud_tech_expense", label: "Cloud, Tech & SaaS Subscriptions", section: "D. MONTHLY EXPENSES / BURN", unit: "₹ Cr" },
    { row: 30, key: "t1_marketing_expense", label: "Marketing & Customer Acquisition Spend", section: "D. MONTHLY EXPENSES / BURN", unit: "₹ Cr" },
    { row: 31, key: "t1_rent_facilities_expense", label: "Rent, Facilities & Utilities", section: "D. MONTHLY EXPENSES / BURN", unit: "₹ Cr" },
    { row: 32, key: "t1_cogs_expense", label: "Cost of Delivery / COGS", section: "D. MONTHLY EXPENSES / BURN", unit: "₹ Cr" },
    { row: 33, key: "t1_professional_fees_expense", label: "Professional Fees (Legal, Finance, HR)", section: "D. MONTHLY EXPENSES / BURN", unit: "₹ Cr" },
    { row: 34, key: "t1_loan_emi_expense", label: "Loan / Debt EMI Repayments", section: "D. MONTHLY EXPENSES / BURN", unit: "₹ Cr" },
    { row: 35, key: "t1_other_fixed_expense", label: "Other Fixed Expenses", section: "D. MONTHLY EXPENSES / BURN", unit: "₹ Cr" },
    { row: 36, key: "t1_other_variable_expense", label: "Other Variable / Discretionary Expenses", section: "D. MONTHLY EXPENSES / BURN", unit: "₹ Cr" },
    { row: 37, key: "t1_total_monthly_burn", label: "Total Monthly Expenses / Burn", section: "D. MONTHLY EXPENSES / BURN", unit: "₹ Cr" },
    
    // Growth Assumptions
    { row: 41, key: "t1_revenue_growth_rate", label: "Expected Monthly Revenue Growth Rate", section: "E. GROWTH ASSUMPTIONS", unit: "%" },
    { row: 42, key: "t1_burn_growth_rate", label: "Expected Monthly Burn Growth Rate", section: "E. GROWTH ASSUMPTIONS", unit: "%" },
    
    // One-Time Events
    { row: 46, key: "t1_expected_fundraise", label: "Expected Fundraise / Capital Infusion", section: "F. KNOWN ONE-TIME CASH EVENTS", unit: "₹ Cr" },
    { row: 47, key: "t1_month_of_fundraise", label: "Month of Expected Fundraise", section: "F. KNOWN ONE-TIME CASH EVENTS", unit: "months" },
    { row: 48, key: "t1_expected_large_expense", label: "Expected Large One-Time Expense", section: "F. KNOWN ONE-TIME CASH EVENTS", unit: "₹ Cr" },
    { row: 49, key: "t1_month_of_large_expense", label: "Month of Expected Large Expense", section: "F. KNOWN ONE-TIME CASH EVENTS", unit: "months" },
    { row: 50, key: "t1_expected_advance_payment", label: "Confirmed Advance Payments Expected", section: "F. KNOWN ONE-TIME CASH EVENTS", unit: "₹ Cr" },
    { row: 51, key: "t1_month_of_advance_payment", label: "Month of Expected Advance Payment", section: "F. KNOWN ONE-TIME CASH EVENTS", unit: "months" },
    
    // Context Questions
    { row: 54, key: "t1_revenue_risk", label: "Single biggest revenue risk in the next 6 months", section: "G. CONTEXT FOR YOUR PROFYT ANALYST" },
    { row: 55, key: "t1_cost_risk", label: "Single biggest cost risk in the next 6 months", section: "G. CONTEXT FOR YOUR PROFYT ANALYST" },
    { row: 56, key: "t1_cost_to_cut", label: "Cost you could cut immediately if cash position required it", section: "G. CONTEXT FOR YOUR PROFYT ANALYST" },
    { row: 57, key: "t1_fundraise_description", label: "Successful fundraise description", section: "G. CONTEXT FOR YOUR PROFYT ANALYST" },
  ];

  for (const mapping of fieldMappings) {
    const cellAddress = `C${mapping.row}`;
    const cell = inputsSheet[cellAddress];
    const value = cell?.v;

    rawData[mapping.key] = value;

    if (value !== undefined && value !== null && value !== "") {
      const isNumeric = typeof value === "number";
      const isText = typeof value === "string";

      metrics.push({
        sheetName: "Inputs",
        section: mapping.section,
        metricKey: mapping.key,
        label: mapping.label,
        numericValue: isNumeric ? value : null,
        textValue: isText ? String(value) : null,
        unit: mapping.unit || null,
      });
    }
  }

  return { rawData, metrics };
}
