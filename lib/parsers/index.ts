import { TemplateParser } from "./types";
import { parseT1 } from "./parse-t1";
import { parseT23 } from "./parse-t23";
import { parseT24 } from "./parse-t24";
import { parseT32 } from "./parse-t32";

export const TEMPLATE_PARSERS: Record<string, TemplateParser> = {
  T1: parseT1,
  T23: parseT23,
  T24: parseT24,
  T32: parseT32,
};

export function getParser(templateId: string): TemplateParser | null {
  return TEMPLATE_PARSERS[templateId] || null;
}
