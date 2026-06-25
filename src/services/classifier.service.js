import { KEYWORDS, CASE_TYPES, CASE_TYPE_CONFIG } from "../utils/constants.js";

/**
 * Classify a ticket message into a case type.
 * Checks keywords in priority order: phishing > wrong_transfer > payment_failed > refund_request > other
 * Returns the first case type whose keywords match, or "other" if none match.
 */
export function classifyTicket(message) {
  if (!message || typeof message !== "string") {
    return buildResult(CASE_TYPES.OTHER);
  }

  const normalized = message.toLowerCase().trim();

  const priorityOrder = [
    CASE_TYPES.PHISHING,
    CASE_TYPES.WRONG_TRANSFER,
    CASE_TYPES.PAYMENT_FAILED,
    CASE_TYPES.REFUND_REQUEST,
  ];

  for (const caseType of priorityOrder) {
    const keywords = KEYWORDS[caseType];
    for (const keyword of keywords) {
      if (normalized.includes(keyword.toLowerCase())) {
        return buildResult(caseType);
      }
    }
  }

  return buildResult(CASE_TYPES.OTHER);
}

function buildResult(caseType) {
  const config = CASE_TYPE_CONFIG[caseType];
  return {
    case_type: caseType,
    severity: config.severity,
    department: config.department,
    confidence: config.confidence,
    human_review_required:
      config.humanReviewRequired || config.severity === "critical",
  };
}
