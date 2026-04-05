import * as XLSX from "xlsx";
import { ParseResult, MetricInput } from "./types";

export async function parseT23(buffer: Buffer): Promise<ParseResult> {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const rawData: Record<string, unknown> = {};
  const metrics: MetricInput[] = [];

  // Parse Customer Revenue sheet
  const customerSheet = workbook.Sheets["Customer Revenue"];
  if (customerSheet) {
    const customers: Array<Record<string, unknown>> = [];
    for (let i = 4; i <= 23; i++) {
      const customerName = customerSheet[`B${i}`]?.v;
      const annualRev = customerSheet[`C${i}`]?.v;
      const monthlyArr = customerSheet[`D${i}`]?.v;
      const revenueType = customerSheet[`E${i}`]?.v;
      const since = customerSheet[`F${i}`]?.v;
      const contractEnd = customerSheet[`G${i}`]?.v;
      const renewalRisk = customerSheet[`H${i}`]?.v;

      if (annualRev !== undefined && annualRev !== null && annualRev !== 0) {
        const customerNum = String(i - 3).padStart(2, "0");
        customers.push({
          name: customerName,
          annualRev,
          monthlyArr,
          revenueType,
          since,
          contractEnd,
          renewalRisk,
        });

        metrics.push({
          sheetName: "Customer Revenue",
          section: "TOP 20 CUSTOMERS",
          metricKey: `t23_customer_${customerNum}_annual_rev`,
          label: `Customer ${customerNum} Annual Revenue`,
          numericValue: typeof annualRev === "number" ? annualRev : null,
          unit: "₹ Cr",
        });

        if (monthlyArr !== undefined && monthlyArr !== null && monthlyArr !== 0) {
          metrics.push({
            sheetName: "Customer Revenue",
            section: "TOP 20 CUSTOMERS",
            metricKey: `t23_customer_${customerNum}_monthly_arr`,
            label: `Customer ${customerNum} Monthly ARR`,
            numericValue: typeof monthlyArr === "number" ? monthlyArr : null,
            unit: "₹ Cr",
          });
        }
      }
    }
    rawData.customers = customers;
  }

  // Parse Revenue Mix sheet
  const revMixSheet = workbook.Sheets["Revenue Mix"];
  if (revMixSheet) {
    const revenueMix: Record<string, unknown> = {};
    const revenueStreams = [
      { row: 4, key: "recurring_subscription", label: "Recurring — Subscription / SaaS ARR" },
      { row: 5, key: "recurring_retainer", label: "Recurring — Retainer Fees" },
      { row: 6, key: "recurring_usage", label: "Recurring — Usage-Based (predictable)" },
      { row: 7, key: "transactional_project", label: "Transactional — Project Revenue" },
      { row: 8, key: "transactional_product", label: "Transactional — Product Sales" },
      { row: 9, key: "transactional_adhoc", label: "Transactional — Ad Hoc / Variable" },
      { row: 10, key: "other_revenue", label: "Other Revenue" },
    ];

    const months = ["mo1", "mo2", "mo3", "mo4", "mo5", "mo6"];
    const columns = ["C", "D", "E", "F", "G", "H"];

    for (const stream of revenueStreams) {
      const streamData: Record<string, unknown> = {};
      for (let i = 0; i < months.length; i++) {
        const cellAddress = `${columns[i]}${stream.row}`;
        const value = revMixSheet[cellAddress]?.v;
        streamData[months[i]] = value;

        if (value !== undefined && value !== null && value !== 0) {
          metrics.push({
            sheetName: "Revenue Mix",
            section: "REVENUE MIX",
            metricKey: `t23_${stream.key}_${months[i]}`,
            label: `${stream.label} — ${months[i].toUpperCase()}`,
            numericValue: typeof value === "number" ? value : null,
            period: months[i],
            unit: "₹ Cr",
          });
        }
      }
      revenueMix[stream.key] = streamData;
    }
    rawData.revenueMix = revenueMix;
  }

  // Parse Cohort Revenue sheet
  const cohortSheet = workbook.Sheets["Cohort Revenue"];
  if (cohortSheet) {
    const cohorts: Array<Record<string, unknown>> = [];
    const cohortNames = [
      "Q1 FY–1",
      "Q2 FY–1",
      "Q3 FY–1",
      "Q4 FY–1",
      "Q1 Current",
      "Q2 Current",
      "Q3 Current",
      "Q4 Current",
    ];
    const periods = ["p0", "p1", "p2", "p3", "p4", "p6", "p8", "p12"];
    const columns = ["C", "D", "E", "F", "G", "H", "I", "J"];

    for (let i = 0; i < cohortNames.length; i++) {
      const row = 4 + i;
      const cohortData: Record<string, unknown> = { name: cohortNames[i] };
      
      for (let j = 0; j < periods.length; j++) {
        const cellAddress = `${columns[j]}${row}`;
        const value = cohortSheet[cellAddress]?.v;
        cohortData[periods[j]] = value;

        if (value !== undefined && value !== null && value !== 0 && value !== 1) {
          const cohortKey = cohortNames[i].toLowerCase().replace(/\s+/g, "").replace(/–/g, "");
          metrics.push({
            sheetName: "Cohort Revenue",
            section: "COHORT REVENUE DURABILITY",
            metricKey: `t23_cohort_${cohortKey}_${periods[j]}`,
            label: `Cohort ${cohortNames[i]} — ${periods[j].toUpperCase()}`,
            numericValue: typeof value === "number" ? value : null,
            period: periods[j],
          });
        }
      }
      cohorts.push(cohortData);
    }
    rawData.cohorts = cohorts;
  }

  // Parse Context & Additional Inputs sheet
  const contextSheet = workbook.Sheets["Context & Additional Inputs"];
  if (contextSheet) {
    const contextQuestions: Record<string, unknown> = {};
    const questions = [
      { row: 3, key: "t23_growth_driver", label: "Primary growth driver" },
      { row: 4, key: "t23_logo_churn_rate", label: "Current logo churn rate" },
      { row: 5, key: "t23_nrr", label: "Net revenue retention (NRR)" },
      { row: 6, key: "t23_pipeline_source", label: "% of pipeline from referrals vs outbound" },
      { row: 7, key: "t23_top_customer_desc", label: "Top 1 customer description" },
      { row: 8, key: "t23_lost_customer_5pct", label: "Lost customer >5% of ARR in last 12 months" },
      { row: 9, key: "t23_avg_contract_length", label: "Average contract length" },
      { row: 10, key: "t23_arpu_trend", label: "ARPU trend over last 12 months" },
    ];

    for (const q of questions) {
      const value = contextSheet[`C${q.row}`]?.v;
      contextQuestions[q.key] = value;

      if (value !== undefined && value !== null && value !== "") {
        metrics.push({
          sheetName: "Context & Additional Inputs",
          section: "CONTEXT",
          metricKey: q.key,
          label: q.label,
          numericValue: typeof value === "number" ? value : null,
          textValue: typeof value === "string" ? value : null,
        });
      }
    }
    rawData.context = contextQuestions;
  }

  return { rawData, metrics };
}
