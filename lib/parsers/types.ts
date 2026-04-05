export interface MetricInput {
  sheetName: string;
  section: string;
  metricKey: string;
  label: string;
  numericValue?: number | null;
  textValue?: string | null;
  period?: string | null;
  unit?: string | null;
}

export interface ParseResult {
  rawData: Record<string, unknown>;
  metrics: MetricInput[];
}

export type TemplateParser = (buffer: Buffer) => Promise<ParseResult>;
