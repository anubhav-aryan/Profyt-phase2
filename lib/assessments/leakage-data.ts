export interface LeakageAnswer {
  label: string;
  score: number;
}

export interface LeakageQuestion {
  text: string;
  hint: string;
  answers: LeakageAnswer[];
}

export interface LeakageBucket {
  id: string;
  num: string;
  title: string;
  sub: string;
  questions: LeakageQuestion[];
}

export interface LeakageVerdict {
  min: number;
  max: number;
  title: string;
  body: string;
  color: number;
}

export const BUCKETS: LeakageBucket[] = [
  {
    id: "revenue",
    num: "01",
    title: "Revenue Quality",
    sub: "Assess the durability, concentration and pricing integrity of the revenue base.",
    questions: [
      {
        text: "What share of revenue comes from your top 2–3 customers?",
        hint: "High concentration creates fragility — a single departure can destroy profitability.",
        answers: [
          { label: "Less than 20%", score: 0 },
          { label: "20–35%", score: 1 },
          { label: "35–50%", score: 2 },
          { label: "50–70%", score: 3 },
          { label: "More than 70%", score: 4 },
        ],
      },
      {
        text: "How is revenue growth primarily being driven?",
        hint: "Volume-led growth compresses margin over time; pricing power protects it.",
        answers: [
          { label: "Pricing power + volume", score: 0 },
          { label: "Mostly pricing", score: 1 },
          { label: "Mostly volume", score: 2 },
          { label: "Discounting to win deals", score: 3 },
          { label: "Discounting to retain", score: 4 },
        ],
      },
      {
        text: "How often are discounts given, and who approves them?",
        hint: "Undisciplined discounting permanently erodes contribution margin.",
        answers: [
          { label: "Rarely — formal approval needed", score: 0 },
          { label: "Occasionally — structured process", score: 1 },
          { label: "Frequently — case by case", score: 2 },
          { label: "Often — at sales team discretion", score: 3 },
          { label: "Routinely — no approval required", score: 4 },
        ],
      },
      {
        text: "How well do you track and understand churn or non-renewal?",
        hint: "Revenue that cannot be retained is not durable revenue.",
        answers: [
          { label: "Tracked, improving, root-caused", score: 0 },
          { label: "Tracked and broadly understood", score: 1 },
          { label: "Tracked but not acted on", score: 2 },
          { label: "Partially tracked", score: 3 },
          { label: "Not tracked", score: 4 },
        ],
      },
      {
        text: "What is happening to your customer acquisition cost over time?",
        hint: "If CAC rises faster than revenue, growth is destroying value.",
        answers: [
          { label: "Declining as we scale", score: 0 },
          { label: "Stable", score: 1 },
          { label: "Rising slightly", score: 2 },
          { label: "Rising significantly", score: 3 },
          { label: "Rising fast — not understood", score: 4 },
        ],
      },
    ],
  },
  {
    id: "unit",
    num: "02",
    title: "Unit Economics",
    sub: "Examine contribution margin integrity, acquisition economics, and whether each unit of revenue is genuinely profitable.",
    questions: [
      {
        text: "How clearly do you know the contribution margin per customer or product line?",
        hint: "Without unit-level clarity, every scale decision is uninformed.",
        answers: [
          { label: "Clearly tracked and reviewed monthly", score: 0 },
          { label: "Broadly understood", score: 1 },
          { label: "Roughly estimated", score: 2 },
          { label: "Unclear — some uncertainty", score: 3 },
          { label: "Not tracked at unit level", score: 4 },
        ],
      },
      {
        text: "How long does it take to recover your customer acquisition cost?",
        hint: "Capital tied up in customer acquisition for over a year creates compounding cash pressure.",
        answers: [
          { label: "Under 6 months", score: 0 },
          { label: "6–12 months", score: 1 },
          { label: "12–18 months", score: 2 },
          { label: "18–24 months", score: 3 },
          { label: "Over 24 months / unknown", score: 4 },
        ],
      },
      {
        text: "What is your LTV to CAC ratio, and do you track it?",
        hint: "The ratio is the single most important indicator of sustainable acquisition economics.",
        answers: [
          { label: "Above 5:1 — tracked monthly", score: 0 },
          { label: "3:1 to 5:1 — tracked", score: 1 },
          { label: "2:1 to 3:1", score: 2 },
          { label: "Below 2:1", score: 3 },
          { label: "Not tracked", score: 4 },
        ],
      },
      {
        text: "What has happened to gross margin over the last 2–3 quarters?",
        hint: "Declining gross margin at scale is a structural, not cyclical, warning sign.",
        answers: [
          { label: "Improving steadily", score: 0 },
          { label: "Stable", score: 1 },
          { label: "Slight decline", score: 2 },
          { label: "Meaningful decline", score: 3 },
          { label: "Declining fast", score: 4 },
        ],
      },
      {
        text: "Do you have any customer segments or products that are loss-making?",
        hint: "Unexamined loss-making segments consume margin from profitable ones.",
        answers: [
          { label: "None — all segments profitable", score: 0 },
          { label: "One — understood and being corrected", score: 1 },
          { label: "One or two — understood but not actioned", score: 2 },
          { label: "Some — not fully understood", score: 3 },
          { label: "Several — unclear picture", score: 4 },
        ],
      },
    ],
  },
  {
    id: "cost",
    num: "03",
    title: "Cost Architecture",
    sub: "Evaluate whether the cost structure scales with revenue — or whether fixed commitments are hardening ahead of it.",
    questions: [
      {
        text: "How have fixed costs moved relative to revenue in the last 12 months?",
        hint: "Fixed cost outpacing revenue is the most reliable early indicator of margin erosion.",
        answers: [
          { label: "Fixed costs growing slower than revenue", score: 0 },
          { label: "Fixed costs growing in line with revenue", score: 1 },
          { label: "Fixed costs slightly ahead of revenue growth", score: 2 },
          { label: "Fixed costs growing noticeably faster", score: 3 },
          { label: "Fixed costs significantly outpacing revenue", score: 4 },
        ],
      },
      {
        text: "How are hiring decisions financially assessed before they are made?",
        hint: "Hiring without payback analysis is the most common source of fixed cost overrun.",
        answers: [
          { label: "Formal payback model required before every hire", score: 0 },
          { label: "Revenue/cost impact estimated before hire", score: 1 },
          { label: "Reviewed case by case — no standard process", score: 2 },
          { label: "Mostly based on team request and gut feel", score: 3 },
          { label: "No financial assessment before hiring", score: 4 },
        ],
      },
      {
        text: "When did you last review vendor and SaaS costs for actual utilisation?",
        hint: "Unutilised subscriptions and renewals accumulate silently.",
        answers: [
          { label: "Last month — regular process", score: 0 },
          { label: "Last quarter", score: 1 },
          { label: "6–12 months ago", score: 2 },
          { label: "Over a year ago", score: 3 },
          { label: "Never formally reviewed", score: 4 },
        ],
      },
      {
        text: "Do approved budgets exist for non-headcount spend categories?",
        hint: "Without category budgets, spend migrates toward convenience rather than return.",
        answers: [
          { label: "Yes — budgets set and monitored monthly", score: 0 },
          { label: "Yes — set annually, reviewed quarterly", score: 1 },
          { label: "Partial — some categories have budgets", score: 2 },
          { label: "Very loose — more guideline than budget", score: 3 },
          { label: "No formal budgets for non-headcount spend", score: 4 },
        ],
      },
      {
        text: "Has the cost of delivering your product or service risen without a matching rise in quality or output?",
        hint: "Rising delivery cost without measurable improvement is pure margin compression.",
        answers: [
          { label: "No — delivery cost is flat or declining", score: 0 },
          { label: "Slight rise — matched by output improvement", score: 1 },
          { label: "Rising — partially matched", score: 2 },
          { label: "Rising — not matched by output improvement", score: 3 },
          { label: "Rising significantly — no improvement to show", score: 4 },
        ],
      },
    ],
  },
  {
    id: "cash",
    num: "04",
    title: "Cash Conversion",
    sub: "Assess how efficiently the business converts revenue into cash — and where working capital is being trapped.",
    questions: [
      {
        text: "What has happened to your average debtor days (time to collect payment) recently?",
        hint: "Rising debtor days mean revenue is being created but cash is not arriving.",
        answers: [
          { label: "Improving — below 30 days", score: 0 },
          { label: "Stable — 30 to 45 days", score: 1 },
          { label: "Slightly rising — 45 to 60 days", score: 2 },
          { label: "Rising — 60 to 90 days", score: 3 },
          { label: "Over 90 days or getting worse", score: 4 },
        ],
      },
      {
        text: "Do you collect advance payments or deposits from customers — and are you using that leverage?",
        hint: "Under-utilised advances represent free capital being left on the table.",
        answers: [
          { label: "Yes — structured advances on all/most contracts", score: 0 },
          { label: "Sometimes — on larger contracts", score: 1 },
          { label: "Rarely — only when asked by customer", score: 2 },
          { label: "We have tried — customers resist", score: 3 },
          { label: "No advance payments collected", score: 4 },
        ],
      },
      {
        text: "How do your vendor payment terms compare to your customer collection cycle?",
        hint: "Paying vendors before collecting from customers creates a structural cash gap.",
        answers: [
          { label: "We pay vendors after we collect — net positive cycle", score: 0 },
          { label: "Roughly aligned — small gap", score: 1 },
          { label: "We pay before collecting — manageable gap", score: 2 },
          { label: "We pay significantly before we collect", score: 3 },
          { label: "Significant mismatch — creates regular cash stress", score: 4 },
        ],
      },
      {
        text: "How long is inventory or work-in-progress held before it converts to revenue?",
        hint: "Excess inventory is cash that cannot be deployed elsewhere.",
        answers: [
          { label: "Not applicable to our model", score: 0 },
          { label: "Under 30 days — well within cycle", score: 1 },
          { label: "30–60 days — acceptable", score: 2 },
          { label: "60–90 days — higher than ideal", score: 3 },
          { label: "Over 90 days or growing", score: 4 },
        ],
      },
      {
        text: "How predictable is your cash position at the end of each month?",
        hint: "No cash forecast means no cash discipline — surprises are an early warning.",
        answers: [
          { label: "We have a rolling 13-week forecast — rarely surprised", score: 0 },
          { label: "We forecast monthly — occasionally surprised", score: 1 },
          { label: "We estimate — surprises happen", score: 2 },
          { label: "We track but don't forecast well", score: 3 },
          { label: "End-of-month cash is often a surprise", score: 4 },
        ],
      },
    ],
  },
  {
    id: "governance",
    num: "05",
    title: "Decision Governance",
    sub: "Examine whether financial authority is structured, delegated, and whether decisions are made with adequate financial context.",
    questions: [
      {
        text: "Who has the authority to approve significant financial decisions in the business?",
        hint: "Centralised decision-making creates bottlenecks and slows execution at scale.",
        answers: [
          { label: "Defined authority matrix — decisions flow without me", score: 0 },
          { label: "Most decisions delegated — I approve above threshold", score: 1 },
          { label: "I approve most significant decisions", score: 2 },
          { label: "Nearly everything comes to me", score: 3 },
          { label: "Everything financial routes through me personally", score: 4 },
        ],
      },
      {
        text: "Are there formal approval thresholds for capital expenditure and operating spend?",
        hint: "Without thresholds, every decision is negotiated — expensive and inconsistent.",
        answers: [
          { label: "Yes — documented thresholds by category and value", score: 0 },
          { label: "Yes — broadly understood thresholds", score: 1 },
          { label: "Partial — some categories have thresholds", score: 2 },
          { label: "Informal — generally understood but not written", score: 3 },
          { label: "No formal thresholds", score: 4 },
        ],
      },
      {
        text: "Before a hire is approved, what financial analysis is required?",
        hint: "Headcount without payback modelling is the most common form of capital misallocation.",
        answers: [
          { label: "Payback period and ROI model — mandatory", score: 0 },
          { label: "Revenue or cost impact estimate — required", score: 1 },
          { label: "Budget check only", score: 2 },
          { label: "Justification from team lead — no financial model", score: 3 },
          { label: "No financial analysis required before hiring", score: 4 },
        ],
      },
      {
        text: "How are pricing changes decided and approved?",
        hint: "Ad hoc pricing is the fastest route to margin erosion at scale.",
        answers: [
          { label: "Structured process — finance sign-off required", score: 0 },
          { label: "Reviewed by leadership before any change", score: 1 },
          { label: "Discussed — but no formal sign-off", score: 2 },
          { label: "Sales or account team can change within loose limits", score: 3 },
          { label: "Pricing changed at sales discretion — no formal process", score: 4 },
        ],
      },
      {
        text: "When are the financial consequences of a decision assessed?",
        hint: "Post-commitment financial analysis is damage assessment, not governance.",
        answers: [
          { label: "Always before commitment — no exceptions", score: 0 },
          { label: "Usually before — occasionally after", score: 1 },
          { label: "Sometimes before — often during execution", score: 2 },
          { label: "Mostly after commitment is made", score: 3 },
          { label: "Rarely assessed before — usually discovered after", score: 4 },
        ],
      },
    ],
  },
  {
    id: "forecast",
    num: "06",
    title: "Forecast Integrity",
    sub: "Assess the reliability of financial forecasts and whether variance is understood, tracked, and corrected.",
    questions: [
      {
        text: "How close does actual revenue typically land versus the forecast set at the start of the quarter?",
        hint: "Consistent large forecast variance signals a structural modelling problem.",
        answers: [
          { label: "Within 5% — very reliable", score: 0 },
          { label: "Within 10% — mostly reliable", score: 1 },
          { label: "Within 15% — some variance", score: 2 },
          { label: "15–25% variance — unreliable", score: 3 },
          { label: "Over 25% or no forecast in place", score: 4 },
        ],
      },
      {
        text: "How often are profit forecasts revised during the quarter?",
        hint: "Frequent revision indicates underlying assumptions are not grounded in reality.",
        answers: [
          { label: "Rarely — forecasts are stable", score: 0 },
          { label: "Once — for a material unforeseen event", score: 1 },
          { label: "Once or twice — minor adjustments", score: 2 },
          { label: "Multiple times — expected revisions", score: 3 },
          { label: "Constantly revised — forecasts not trusted", score: 4 },
        ],
      },
      {
        text: "When a forecast is missed, how is the variance formally reviewed?",
        hint: "Without variance attribution, the same errors compound in future forecasts.",
        answers: [
          { label: "Root cause identified — model updated immediately", score: 0 },
          { label: "Discussed in leadership meeting — notes kept", score: 1 },
          { label: "Informally discussed — not formally documented", score: 2 },
          { label: "Noted but not deeply investigated", score: 3 },
          { label: "Variances not formally reviewed", score: 4 },
        ],
      },
      {
        text: "Do your board or investor reports use the same numbers as internal management accounts?",
        hint: "Divergent reporting creates information asymmetry and erodes board trust.",
        answers: [
          { label: "Yes — exactly the same numbers", score: 0 },
          { label: "Yes — with clear reconciliation notes", score: 1 },
          { label: "Mostly — small presentation differences", score: 2 },
          { label: "Some differences — occasionally questioned", score: 3 },
          { label: "Different numbers used — not reconciled", score: 4 },
        ],
      },
      {
        text: "Does the leadership team have a shared 13-week rolling cash flow view?",
        hint: "Without a near-term rolling cash view, decisions are made on incomplete context.",
        answers: [
          { label: "Yes — reviewed weekly as a leadership team", score: 0 },
          { label: "Yes — available but reviewed less frequently", score: 1 },
          { label: "We have a monthly cash view — not 13-week", score: 2 },
          { label: "CFO or finance has it — leadership doesn't review it", score: 3 },
          { label: "No rolling cash forecast in place", score: 4 },
        ],
      },
    ],
  },
  {
    id: "capital",
    num: "07",
    title: "Capital Allocation",
    sub: "Assess whether capital is being deployed with rigour — or whether investment decisions are made on instinct, optimism, or incomplete data.",
    questions: [
      {
        text: "How do you decide which initiatives receive capital investment?",
        hint: "Capital without a return model is a donation, not an investment.",
        answers: [
          { label: "Formal ROI or payback model required for all investments", score: 0 },
          { label: "Financial model for major investments only", score: 1 },
          { label: "Financial estimates prepared but not rigorously reviewed", score: 2 },
          { label: "Investment decisions made primarily on strategic narrative", score: 3 },
          { label: "No formal investment framework — decisions made reactively", score: 4 },
        ],
      },
      {
        text: "How do you track the actual return on investments once made?",
        hint: "Without post-investment tracking, you have no feedback loop to improve future decisions.",
        answers: [
          { label: "Formal post-investment review against original business case", score: 0 },
          { label: "Returns tracked informally — discussed in leadership", score: 1 },
          { label: "Tracked for large investments only", score: 2 },
          { label: "Initial optimism — returns rarely reviewed once deployed", score: 3 },
          { label: "No tracking of investment outcomes", score: 4 },
        ],
      },
      {
        text: "What happens to underperforming investments or initiatives?",
        hint: "Sunk cost bias is expensive. The ability to exit quickly is a competitive advantage.",
        answers: [
          { label: "Formal review triggered — exit or pivot decision made within 90 days", score: 0 },
          { label: "Reviewed — sometimes exited, sometimes continued", score: 1 },
          { label: "Continued with modified targets", score: 2 },
          { label: "Continued until project team flags failure", score: 3 },
          { label: "Underperformance rarely acknowledged — investments run until natural end", score: 4 },
        ],
      },
      {
        text: "How concentrated is your capital deployment across initiatives?",
        hint: "Spreading capital too thinly means nothing gets enough resource to succeed.",
        answers: [
          { label: "3 or fewer funded priorities — clearly ranked by expected return", score: 0 },
          { label: "4–5 priorities — some resource tension but manageable", score: 1 },
          { label: "6–8 initiatives — competing for the same resource pool", score: 2 },
          { label: "Many simultaneous initiatives — resource chronically spread thin", score: 3 },
          { label: "No prioritisation — everything gets some funding", score: 4 },
        ],
      },
      {
        text: "How do you manage capital allocation between growth and operational stability?",
        hint: "Over-investing in growth while under-investing in systems creates a fragile foundation.",
        answers: [
          { label: "Explicit framework — growth vs stability balance reviewed quarterly", score: 0 },
          { label: "Informal balance maintained — discussed at leadership level", score: 1 },
          { label: "Growth prioritised — stability addressed reactively", score: 2 },
          { label: "Growth dominates — operational debt accumulating", score: 3 },
          { label: "No framework — allocation driven by loudest internal voice", score: 4 },
        ],
      },
    ],
  },
];

export const VERDICTS: LeakageVerdict[] = [
  { min: 0, max: 19, title: "Strong Financial Discipline", body: "Leakage is minimal. The business has solid financial controls. Maintain discipline through the next growth phase.", color: 0 },
  { min: 20, max: 44, title: "Moderate Leakage Present", body: "Specific buckets show structural gaps that will compound at scale. Targeted corrections now prevent larger corrections later.", color: 1 },
  { min: 45, max: 64, title: "Significant Leakage Identified", body: "Multiple buckets are under meaningful pressure. Financial structure is not ready to support next-stage scale without intervention.", color: 2 },
  { min: 65, max: 84, title: "High Leakage — Intervention Advised", body: "Widespread financial control gaps across several buckets. Scaling now will amplify losses. Structured intervention is required before further growth.", color: 3 },
  { min: 85, max: 100, title: "Critical Leakage — Immediate Action", body: "The financial structure is under severe stress. Every growth decision is compounding losses. Immediate forensic intervention is advised.", color: 4 },
];

export const ACTIONS: Record<string, string[]> = {
  revenue: [
    "Install formal revenue concentration limits and customer diversification targets",
    "Implement pricing governance with defined discount approval thresholds",
    "Build churn tracking and revenue durability scoring into monthly reporting",
  ],
  unit: [
    "Map contribution margin at customer and product segment level immediately",
    "Define and enforce maximum acceptable CAC payback period by channel",
    "Deprecate or restructure loss-making segments with a defined timeline",
  ],
  cost: [
    "Conduct immediate fixed cost audit against revenue trajectory",
    "Install headcount payback modelling as a mandatory pre-hire requirement",
    "Implement quarterly vendor and SaaS utilisation review process",
  ],
  cash: [
    "Build a rolling 13-week cash flow model and review it weekly",
    "Restructure customer payment terms to reduce debtor days below 45",
    "Align vendor payment cycles to match or exceed customer collection cycles",
  ],
  governance: [
    "Define financial authority matrix with approval thresholds by category and value",
    "Install pre-commitment financial impact assessment for all capital decisions",
    "Separate pricing decisions from founder and assign to finance function",
  ],
  forecast: [
    "Introduce formal variance attribution — every miss must be explained and corrected",
    "Align internal management accounts with board reporting immediately",
    "Build 13-week rolling cash forecast into weekly leadership rhythm",
  ],
  capital: [
    "Install a formal investment framework — ROI or payback model required before capital is committed",
    "Implement post-investment reviews at 90 days and 6 months for all material investments",
    "Reduce active initiatives to 3 funded priorities — ruthlessly deprioritise or defund the rest",
  ],
};

export const STATUSES = ["Healthy", "Monitored", "At Risk", "Stressed", "Failing"];
