export const MODEL_TEMPLATES = [
  {
    id: "T1",
    name: "P&L Summary",
    filename: "T1_PnL_Summary.xlsx",
    description: "Profit and loss summary for the last 12 months",
    hint: "Fill in monthly revenue, COGS, gross profit, operating expenses, and EBITDA.",
  },
  {
    id: "T23",
    name: "Unit Economics",
    filename: "T23_Unit_Economics.xlsx",
    description: "Customer-level unit economics and cohort data",
    hint: "Include CAC, LTV, payback period, and cohort retention by acquisition channel.",
  },
  {
    id: "T24",
    name: "Cash Flow",
    filename: "T24_Cash_Flow.xlsx",
    description: "Monthly cash flow statement and working capital",
    hint: "Fill in operating, investing, and financing cash flows plus working capital movements.",
  },
  {
    id: "T32",
    name: "Revenue Model",
    filename: "T32_Revenue_Model.xlsx",
    description: "Revenue breakdown by segment, channel, and type",
    hint: "Break down revenue by product/service, customer segment, and geography.",
  },
] as const;

export type ModelTemplateId = (typeof MODEL_TEMPLATES)[number]["id"];

export const TEMPLATE_IDS: ModelTemplateId[] = MODEL_TEMPLATES.map((t) => t.id);

export function isValidTemplateId(id: string): id is ModelTemplateId {
  return TEMPLATE_IDS.includes(id as ModelTemplateId);
}
