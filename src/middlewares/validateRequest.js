import { ALLOWED_CHANNELS, ALLOWED_LOCALES } from "../utils/constants.js";

/**
 * Validate the POST /sort-ticket request body.
 * Returns an array of error strings. Empty array means valid.
 */
export function validateTicketInput(body) {
  const errors = [];

  // ticket_id — required string
  if (!body.ticket_id) {
    errors.push("ticket_id is required");
  } else if (typeof body.ticket_id !== "string" || body.ticket_id.trim().length === 0) {
    errors.push("ticket_id must be a non-empty string");
  }

  // message — required string, minimum length 3
  if (!body.message) {
    errors.push("message is required");
  } else if (typeof body.message !== "string") {
    errors.push("message must be a string");
  } else if (body.message.trim().length < 3) {
    errors.push("message must be at least 3 characters long");
  }

  // channel — optional, enum
  if (body.channel !== undefined) {
    if (typeof body.channel !== "string" || !ALLOWED_CHANNELS.includes(body.channel)) {
      errors.push(
        `channel must be one of: ${ALLOWED_CHANNELS.join(", ")}`
      );
    }
  }

  // locale — optional, enum
  if (body.locale !== undefined) {
    if (typeof body.locale !== "string" || !ALLOWED_LOCALES.includes(body.locale)) {
      errors.push(
        `locale must be one of: ${ALLOWED_LOCALES.join(", ")}`
      );
    }
  }

  return errors;
}
