import { validateTicketInput } from "../middlewares/validateRequest.js";
import { createError } from "../middlewares/errorHandler.js";
import { classifyTicket } from "../services/classifier.service.js";
import { getSummary } from "../services/summary.service.js";

export function sortTicket(req, res) {
  const errors = validateTicketInput(req.body);
  if (errors.length > 0) {
    throw createError(400, errors.join("; "));
  }

  const { ticket_id, message } = req.body;

  const classification = classifyTicket(message);
  const agent_summary = getSummary(classification.case_type);

  res.json({
    ticket_id,
    case_type: classification.case_type,
    severity: classification.severity,
    department: classification.department,
    agent_summary,
    human_review_required: classification.human_review_required,
    confidence: classification.confidence,
  });
}
