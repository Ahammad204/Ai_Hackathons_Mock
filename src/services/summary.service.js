import { SUMMARIES, CASE_TYPES } from "../utils/constants.js";

// Words that must NEVER appear in summaries (security requirement)
const FORBIDDEN_WORDS = [
  "otp",
  "pin",
  "password",
  "card number",
  "cvv",
  "secret",
];

/**
 * Return the agent summary for a given case type.
 * Returns a safe, hardcoded summary that never requests sensitive info.
 */
export function getSummary(caseType) {
  const summary = SUMMARIES[caseType] || SUMMARIES[CASE_TYPES.OTHER];

  // Defensive check — strip forbidden words if any somehow slipped in
  let safe = summary;
  for (const word of FORBIDDEN_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    safe = safe.replace(regex, "[REDACTED]");
  }

  return safe;
}
