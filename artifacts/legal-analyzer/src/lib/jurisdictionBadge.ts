// NOTE: Detection patterns intentionally mirror detectJurisdiction() in
// artifacts/api-server/src/routes/relief.ts — keep these in sync if state
// support is added or patterns change on the server side.

export type JurisdictionBadge = {
  displayText: string;
  circuit: string | null;
};

export type StateName = "Wisconsin" | "Illinois" | "Minnesota" | "Indiana" | "Iowa" | "Other";

export function detectStateName(jurisdiction: string | null | undefined): StateName | null {
  if (!jurisdiction) return null;
  const lower = jurisdiction.toLowerCase().trim();

  if (
    lower.includes("wisconsin") ||
    lower === "wi" || lower === "wis" || lower === "wis." ||
    lower.startsWith("wi ") || lower.startsWith("wis ") || lower.startsWith("wis.") ||
    lower.includes(", wi") || lower.includes(" wi,") ||
    lower.includes("(wi)") || lower.includes("(wis)")
  ) return "Wisconsin";

  if (
    lower.includes("illinois") ||
    lower === "il" || lower === "ill" || lower === "ill." ||
    lower.startsWith("il ") || lower.startsWith("ill ") ||
    lower.includes(", il") || lower.includes(" il,") ||
    lower.includes("(il)") || lower.includes("(ill)") ||
    lower.includes("cook county") || lower.includes("chicago")
  ) return "Illinois";

  if (
    lower.includes("minnesota") ||
    lower === "mn" ||
    lower.startsWith("mn ") || lower.includes(", mn") || lower.includes(" mn,") ||
    lower.includes("(mn)") ||
    lower.includes("minneapolis") || lower.includes("st. paul") || lower.includes("saint paul")
  ) return "Minnesota";

  if (
    lower.includes("indiana") ||
    lower === "in" || lower === "ind" || lower === "ind." ||
    lower.startsWith("ind ") || lower.startsWith("ind.") ||
    lower.includes(", in") || lower.includes(" in,") ||
    lower.includes("(in)") || lower.includes("(ind)") ||
    lower.includes("indianapolis")
  ) return "Indiana";

  if (
    lower.includes("iowa") ||
    lower === "ia" ||
    lower.startsWith("ia ") || lower.includes(", ia") || lower.includes(" ia,") ||
    lower.includes("(ia)") ||
    lower.includes("des moines")
  ) return "Iowa";

  const looksReal =
    jurisdiction.includes(",") ||
    /county|court|district|circuit|judicial|parish|borough/i.test(jurisdiction);
  return looksReal ? "Other" : null;
}

export function parseJurisdictionBadge(jurisdiction: string | null | undefined): JurisdictionBadge | null {
  const state = detectStateName(jurisdiction);
  if (!state) return null;

  if (state === "Other") {
    return { displayText: jurisdiction!, circuit: null };
  }

  const circuitMap: Record<string, string> = {
    Wisconsin: "7th Circuit",
    Illinois: "7th Circuit",
    Indiana: "7th Circuit",
    Minnesota: "8th Circuit",
    Iowa: "8th Circuit",
  };

  const firstPart = jurisdiction!.split(",")[0].trim();
  const cleanLocation = firstPart
    .replace(/\s+(circuit court|district court|superior court|municipal court|county court|court)\s*$/i, "")
    .trim();

  return { displayText: `${cleanLocation} · ${state}`, circuit: circuitMap[state] ?? null };
}
