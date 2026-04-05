import * as XLSX from "xlsx";
import { ParseResult, MetricInput } from "./types";

export async function parseT32(buffer: Buffer): Promise<ParseResult> {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const rawData: Record<string, unknown> = {};
  const metrics: MetricInput[] = [];

  // Parse Monthly KPIs sheet
  const kpiSheet = workbook.Sheets["Monthly KPIs"];
  if (kpiSheet) {
    const kpiData: Record<string, unknown> = {};

    const kpiItems = [
      // Growth & Revenue
      { row: 5, key: "mrr", label: "MRR / Monthly Revenue", section: "GROWTH & REVENUE", unit: "₹ Crore" },
      { row: 6, key: "arr", label: "ARR (annualised run rate)", section: "GROWTH & REVENUE", unit: "₹ Crore" },
      { row: 7, key: "net_new_arr", label: "Net New ARR added this month", section: "GROWTH & REVENUE", unit: "₹ Crore" },
      { row: 8, key: "revenue_vs_plan_pct", label: "Revenue vs Plan (% of target)", section: "GROWTH & REVENUE", unit: "%" },
      { row: 9, key: "yoy_growth_pct", label: "YoY Revenue Growth %", section: "GROWTH & REVENUE", unit: "%" },
      { row: 10, key: "mom_growth_pct", label: "MoM Revenue Growth %", section: "GROWTH & REVENUE", unit: "%" },
      
      // Customers & Retention
      { row: 12, key: "total_customers", label: "Total Paying Customers", section: "CUSTOMERS & RETENTION", unit: "count" },
      { row: 13, key: "new_customers", label: "New Customers Added", section: "CUSTOMERS & RETENTION", unit: "count" },
      { row: 14, key: "churned_customers", label: "Churned Customers", section: "CUSTOMERS & RETENTION", unit: "count" },
      { row: 15, key: "net_customer_growth", label: "Net Customer Growth", section: "CUSTOMERS & RETENTION", unit: "count" },
      { row: 16, key: "nrr", label: "NRR — Net Revenue Retention", section: "CUSTOMERS & RETENTION", unit: "%" },
      { row: 17, key: "logo_churn_rate", label: "Logo Churn Rate (monthly)", section: "CUSTOMERS & RETENTION", unit: "%" },
      
      // Unit Economics
      { row: 19, key: "blended_cac", label: "Blended CAC", section: "UNIT ECONOMICS", unit: "₹" },
      { row: 20, key: "cac_payback", label: "CAC Payback Period", section: "UNIT ECONOMICS", unit: "months" },
      { row: 21, key: "ltv_cac_ratio", label: "LTV : CAC Ratio", section: "UNIT ECONOMICS" },
      { row: 22, key: "gross_margin_pct", label: "Gross Margin %", section: "UNIT ECONOMICS", unit: "%" },
      { row: 23, key: "contribution_margin_pct", label: "Contribution Margin %", section: "UNIT ECONOMICS", unit: "%" },
      
      // Pipeline & Sales
      { row: 25, key: "new_sqls", label: "New SQLs this month", section: "PIPELINE & SALES", unit: "count" },
      { row: 26, key: "pipeline_value", label: "Pipeline Value Created", section: "PIPELINE & SALES", unit: "₹ Cr" },
      { row: 27, key: "weighted_pipeline", label: "Weighted Pipeline", section: "PIPELINE & SALES", unit: "₹ Cr" },
      { row: 28, key: "deals_won", label: "Deals Won", section: "PIPELINE & SALES", unit: "count" },
      { row: 29, key: "win_rate_pct", label: "Win Rate %", section: "PIPELINE & SALES", unit: "%" },
      { row: 30, key: "avg_deal_size", label: "Avg Deal Size — Won", section: "PIPELINE & SALES", unit: "₹ Cr" },
      
      // Operational
      { row: 32, key: "headcount", label: "Headcount (end of month)", section: "OPERATIONAL", unit: "count" },
      { row: 33, key: "new_hires", label: "New Hires this month", section: "OPERATIONAL", unit: "count" },
      { row: 34, key: "open_roles", label: "Open Roles", section: "OPERATIONAL", unit: "count" },
      { row: 35, key: "support_resolution_hrs", label: "Support Tickets — Avg Resolution", section: "OPERATIONAL", unit: "hours" },
      { row: 36, key: "nps_score", label: "NPS Score", section: "OPERATIONAL" },
      { row: 37, key: "product_uptime_pct", label: "Product Uptime %", section: "OPERATIONAL", unit: "%" },
    ];

    const kpiColumns = { actual: "C", target: "D", prior: "E" };

    for (const item of kpiItems) {
      const itemData: Record<string, unknown> = {};
      
      for (const [type, col] of Object.entries(kpiColumns)) {
        const cellAddress = `${col}${item.row}`;
        const value = kpiSheet[cellAddress]?.v;
        itemData[type] = value;

        if (value !== undefined && value !== null && value !== 0) {
          metrics.push({
            sheetName: "Monthly KPIs",
            section: item.section,
            metricKey: `t32_${item.key}_${type}`,
            label: `${item.label} — ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            numericValue: typeof value === "number" ? value : null,
            unit: item.unit || null,
          });
        }
      }
      kpiData[item.key] = itemData;
    }
    rawData.monthlyKpis = kpiData;
  }

  // Parse Financials sheet
  const finSheet = workbook.Sheets["Financials"];
  if (finSheet) {
    const finData: Record<string, unknown> = {};

    const finItems = [
      // Revenue
      { row: 5, key: "total_revenue", label: "Total Revenue", section: "REVENUE" },
      { row: 6, key: "recurring_revenue", label: "Recurring Revenue", section: "REVENUE" },
      { row: 7, key: "non_recurring_revenue", label: "Non-Recurring Revenue", section: "REVENUE" },
      
      // COGS
      { row: 9, key: "total_cogs", label: "Total COGS", section: "COST OF REVENUE" },
      { row: 10, key: "gross_profit", label: "Gross Profit", section: "COST OF REVENUE" },
      { row: 11, key: "gross_margin_pct", label: "Gross Margin %", section: "COST OF REVENUE" },
      
      // OPEX
      { row: 13, key: "sm_expense", label: "S&M Expense", section: "OPERATING EXPENSES" },
      { row: 14, key: "rd_expense", label: "R&D Expense", section: "OPERATING EXPENSES" },
      { row: 15, key: "ga_expense", label: "G&A Expense", section: "OPERATING EXPENSES" },
      { row: 16, key: "total_opex", label: "Total OPEX", section: "OPERATING EXPENSES" },
      { row: 17, key: "ebitda", label: "EBITDA", section: "OPERATING EXPENSES" },
      { row: 18, key: "ebitda_margin_pct", label: "EBITDA Margin %", section: "OPERATING EXPENSES" },
      
      // Below the Line
      { row: 20, key: "da", label: "D&A", section: "BELOW THE LINE" },
      { row: 21, key: "interest_net", label: "Interest (net)", section: "BELOW THE LINE" },
      { row: 22, key: "tax_provision", label: "Tax Provision", section: "BELOW THE LINE" },
      { row: 23, key: "pat", label: "PAT", section: "BELOW THE LINE" },
      { row: 24, key: "pat_margin_pct", label: "PAT Margin %", section: "BELOW THE LINE" },
    ];

    const finColumns = { this_month: "C", plan: "D", prior_month: "E", ytd: "F" };

    for (const item of finItems) {
      const itemData: Record<string, unknown> = {};
      
      for (const [type, col] of Object.entries(finColumns)) {
        const cellAddress = `${col}${item.row}`;
        const value = finSheet[cellAddress]?.v;
        itemData[type] = value;

        if (value !== undefined && value !== null && value !== 0) {
          metrics.push({
            sheetName: "Financials",
            section: item.section,
            metricKey: `t32_fin_${item.key}_${type}`,
            label: `${item.label} — ${type.replace(/_/g, " ")}`,
            numericValue: typeof value === "number" ? value : null,
            unit: item.key.includes("margin_pct") || item.key.includes("pct") ? "%" : "₹ Cr",
          });
        }
      }
      finData[item.key] = itemData;
    }

    // Cash position metrics
    const cashItems = [
      { row: 28, key: "opening_cash", label: "Opening Cash Balance" },
      { row: 29, key: "cash_inflows", label: "Cash Inflows — Revenue Collected" },
      { row: 30, key: "cash_outflows", label: "Cash Outflows — Total Burn" },
      { row: 31, key: "net_cash_movement", label: "Net Cash Movement" },
      { row: 32, key: "closing_cash", label: "Closing Cash Balance" },
      { row: 33, key: "net_monthly_burn", label: "Net Monthly Burn" },
      { row: 34, key: "cash_runway", label: "Cash Runway" },
    ];

    for (const item of cashItems) {
      const thisMonthVal = finSheet[`C${item.row}`]?.v;
      const priorMonthVal = finSheet[`D${item.row}`]?.v;

      if (thisMonthVal !== undefined && thisMonthVal !== null && thisMonthVal !== 0) {
        metrics.push({
          sheetName: "Financials",
          section: "CASH POSITION",
          metricKey: `t32_cash_${item.key}_this_month`,
          label: `${item.label} — This Month`,
          numericValue: typeof thisMonthVal === "number" ? thisMonthVal : null,
          unit: item.key === "cash_runway" ? "months" : "₹ Cr",
        });
      }

      if (priorMonthVal !== undefined && priorMonthVal !== null && priorMonthVal !== 0) {
        metrics.push({
          sheetName: "Financials",
          section: "CASH POSITION",
          metricKey: `t32_cash_${item.key}_prior_month`,
          label: `${item.label} — Prior Month`,
          numericValue: typeof priorMonthVal === "number" ? priorMonthVal : null,
          unit: item.key === "cash_runway" ? "months" : "₹ Cr",
        });
      }
    }

    rawData.financials = finData;
  }

  // Parse OKR Progress sheet
  const okrSheet = workbook.Sheets["OKR Progress"];
  if (okrSheet) {
    const okrs: Array<Record<string, unknown>> = [];
    
    for (let row = 4; row <= 15; row++) {
      const id = okrSheet[`B${row}`]?.v;
      const objective = okrSheet[`C${row}`]?.v;
      const status = okrSheet[`D${row}`]?.v;
      const pctComplete = okrSheet[`E${row}`]?.v;
      const owner = okrSheet[`F${row}`]?.v;
      const update = okrSheet[`G${row}`]?.v;

      if (objective) {
        okrs.push({ id, objective, status, pctComplete, owner, update });

        if (pctComplete !== undefined && pctComplete !== null) {
          const okrKey = String(id).toLowerCase().replace(/\./g, "_");
          metrics.push({
            sheetName: "OKR Progress",
            section: "OKR PROGRESS",
            metricKey: `t32_okr_${okrKey}_pct_complete`,
            label: `${id} — % Complete`,
            numericValue: typeof pctComplete === "number" ? pctComplete : null,
            textValue: status ? String(status) : null,
            unit: "%",
          });
        }
      }
    }
    rawData.okrs = okrs;
  }

  // Parse Risks & Decisions sheet
  const riskSheet = workbook.Sheets["Risks & Decisions"];
  if (riskSheet) {
    const risks: Array<Record<string, unknown>> = [];
    const decisions: Array<Record<string, unknown>> = [];
    const commitments: Array<Record<string, unknown>> = [];

    // Parse key risks (rows 5-10)
    for (let row = 5; row <= 10; row++) {
      const num = riskSheet[`B${row}`]?.v;
      const description = riskSheet[`C${row}`]?.v;
      const severity = riskSheet[`D${row}`]?.v;
      const likelihood = riskSheet[`E${row}`]?.v;
      const mitigation = riskSheet[`F${row}`]?.v;
      const owner = riskSheet[`G${row}`]?.v;

      if (description) {
        risks.push({ num, description, severity, likelihood, mitigation, owner });

        metrics.push({
          sheetName: "Risks & Decisions",
          section: "KEY RISKS",
          metricKey: `t32_risk_${num}`,
          label: `Risk ${num}`,
          textValue: String(description),
        });
      }
    }

    // Parse decisions (rows 14-17)
    for (let row = 14; row <= 17; row++) {
      const num = riskSheet[`B${row}`]?.v;
      const decision = riskSheet[`C${row}`]?.v;
      const options = riskSheet[`D${row}`]?.v;
      const recommendation = riskSheet[`E${row}`]?.v;
      const deadline = riskSheet[`F${row}`]?.v;
      const owner = riskSheet[`G${row}`]?.v;

      if (decision) {
        decisions.push({ num, decision, options, recommendation, deadline, owner });

        metrics.push({
          sheetName: "Risks & Decisions",
          section: "DECISIONS REQUIRED",
          metricKey: `t32_decision_${num}`,
          label: `Decision ${num}`,
          textValue: String(decision),
        });
      }
    }

    // Parse commitments (rows 21-24)
    for (let row = 21; row <= 24; row++) {
      const num = riskSheet[`B${row}`]?.v;
      const commitment = riskSheet[`C${row}`]?.v;
      const madeBy = riskSheet[`D${row}`]?.v;
      const status = riskSheet[`E${row}`]?.v;
      const update = riskSheet[`F${row}`]?.v;
      const dueDate = riskSheet[`G${row}`]?.v;

      if (commitment) {
        commitments.push({ num, commitment, madeBy, status, update, dueDate });

        metrics.push({
          sheetName: "Risks & Decisions",
          section: "COMMITMENTS",
          metricKey: `t32_commitment_${num}`,
          label: `Commitment ${num}`,
          textValue: String(commitment),
        });
      }
    }

    rawData.risks = risks;
    rawData.decisions = decisions;
    rawData.commitments = commitments;
  }

  return { rawData, metrics };
}
