import * as XLSX from "xlsx";
import { ParseResult, MetricInput } from "./types";

export async function parseT24(buffer: Buffer): Promise<ParseResult> {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const rawData: Record<string, unknown> = {};
  const metrics: MetricInput[] = [];

  const quarters = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"];
  const columns = ["C", "D", "E", "F", "G", "H", "I", "J"];

  // Parse P&L Inputs sheet
  const plSheet = workbook.Sheets["P&L Inputs"];
  if (plSheet) {
    const plData: Record<string, unknown> = {};

    const plLineItems = [
      // Revenue
      { row: 5, key: "product_revenue", label: "Product / SaaS Revenue", section: "REVENUE" },
      { row: 6, key: "services_revenue", label: "Services / Implementation Revenue", section: "REVENUE" },
      { row: 7, key: "other_revenue", label: "Other Revenue", section: "REVENUE" },
      { row: 8, key: "total_revenue", label: "Total Revenue", section: "REVENUE" },
      
      // COGS
      { row: 10, key: "direct_labour", label: "Direct Labour / Delivery Costs", section: "COST OF REVENUE" },
      { row: 11, key: "cloud_infra_cogs", label: "Cloud & Infrastructure COGS", section: "COST OF REVENUE" },
      { row: 12, key: "materials_costs", label: "Materials & Third-Party Costs", section: "COST OF REVENUE" },
      { row: 13, key: "total_cogs", label: "Total COGS", section: "COST OF REVENUE" },
      { row: 14, key: "gross_profit", label: "Gross Profit", section: "COST OF REVENUE" },
      { row: 15, key: "gross_margin_pct", label: "Gross Margin %", section: "COST OF REVENUE" },
      
      // OPEX
      { row: 17, key: "rd_expense", label: "Research & Development", section: "OPERATING EXPENSES" },
      { row: 18, key: "sales_marketing_expense", label: "Sales & Marketing", section: "OPERATING EXPENSES" },
      { row: 19, key: "ga_expense", label: "General & Administrative", section: "OPERATING EXPENSES" },
      { row: 20, key: "total_opex", label: "Total OPEX", section: "OPERATING EXPENSES" },
      { row: 21, key: "ebitda", label: "EBITDA", section: "OPERATING EXPENSES" },
      { row: 22, key: "ebitda_margin_pct", label: "EBITDA Margin %", section: "OPERATING EXPENSES" },
      
      // D&A
      { row: 24, key: "depreciation", label: "Depreciation", section: "D&A" },
      { row: 25, key: "amortisation", label: "Amortisation", section: "D&A" },
      { row: 26, key: "total_da", label: "Total D&A", section: "D&A" },
      { row: 27, key: "ebit", label: "EBIT", section: "D&A" },
      { row: 28, key: "ebit_margin_pct", label: "EBIT Margin %", section: "D&A" },
    ];

    for (const item of plLineItems) {
      const itemData: Record<string, unknown> = {};
      for (let i = 0; i < quarters.length; i++) {
        const cellAddress = `${columns[i]}${item.row}`;
        const value = plSheet[cellAddress]?.v;
        itemData[quarters[i]] = value;

        if (value !== undefined && value !== null && value !== 0) {
          metrics.push({
            sheetName: "P&L Inputs",
            section: item.section,
            metricKey: `t24_${item.key}_${quarters[i]}`,
            label: `${item.label} — ${quarters[i].toUpperCase()}`,
            numericValue: typeof value === "number" ? value : null,
            period: quarters[i],
            unit: item.key.includes("margin_pct") || item.key.includes("pct") ? "%" : "₹ Cr",
          });
        }
      }
      plData[item.key] = itemData;
    }
    rawData.plInputs = plData;
  }

  // Parse Below-the-Line sheet
  const btlSheet = workbook.Sheets["Below-the-Line"];
  if (btlSheet) {
    const btlData: Record<string, unknown> = {};

    const btlLineItems = [
      { row: 4, key: "interest_income", label: "Interest Income", section: "BELOW THE LINE" },
      { row: 5, key: "interest_expense", label: "Interest Expense", section: "BELOW THE LINE" },
      { row: 6, key: "other_finance", label: "Other Finance Income / (Costs)", section: "BELOW THE LINE" },
      { row: 7, key: "pbt", label: "PBT (Profit Before Tax)", section: "BELOW THE LINE" },
      { row: 8, key: "income_tax", label: "Income Tax (Current)", section: "BELOW THE LINE" },
      { row: 9, key: "deferred_tax", label: "Deferred Tax Adjustment", section: "BELOW THE LINE" },
      { row: 10, key: "pat", label: "PAT (Profit After Tax)", section: "BELOW THE LINE" },
      { row: 11, key: "pat_margin_pct", label: "PAT Margin %", section: "BELOW THE LINE" },
      { row: 13, key: "one_off_items", label: "One-Off Items (Exceptional)", section: "BELOW THE LINE" },
      { row: 14, key: "normalised_pat", label: "Normalised PAT", section: "BELOW THE LINE" },
      { row: 15, key: "normalised_pat_margin_pct", label: "Normalised PAT Margin %", section: "BELOW THE LINE" },
    ];

    for (const item of btlLineItems) {
      const itemData: Record<string, unknown> = {};
      for (let i = 0; i < quarters.length; i++) {
        const cellAddress = `${columns[i]}${item.row}`;
        const value = btlSheet[cellAddress]?.v;
        itemData[quarters[i]] = value;

        if (value !== undefined && value !== null && value !== 0) {
          metrics.push({
            sheetName: "Below-the-Line",
            section: item.section,
            metricKey: `t24_${item.key}_${quarters[i]}`,
            label: `${item.label} — ${quarters[i].toUpperCase()}`,
            numericValue: typeof value === "number" ? value : null,
            period: quarters[i],
            unit: item.key.includes("margin_pct") || item.key.includes("pct") ? "%" : "₹ Cr",
          });
        }
      }
      btlData[item.key] = itemData;
    }
    rawData.belowTheLine = btlData;
  }

  return { rawData, metrics };
}
