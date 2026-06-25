export const ALLOWED_CHANNELS = ["app", "sms", "call_center", "merchant_portal"];

export const ALLOWED_LOCALES = ["en", "bn", "mixed"];

export const CASE_TYPES = {
  WRONG_TRANSFER: "wrong_transfer",
  PAYMENT_FAILED: "payment_failed",
  REFUND_REQUEST: "refund_request",
  PHISHING: "phishing_or_social_engineering",
  OTHER: "other",
};

export const SEVERITY = {
  CRITICAL: "critical",
  HIGH: "high",
  LOW: "low",
};

export const DEPARTMENTS = {
  DISPUTE_RESOLUTION: "dispute_resolution",
  PAYMENTS_OPS: "payments_ops",
  CUSTOMER_SUPPORT: "customer_support",
  FRAUD_RISK: "fraud_risk",
};

// Keywords per case type — order of CASE_TYPES keys determines priority
export const KEYWORDS = {
  [CASE_TYPES.PHISHING]: [
    // English
    "otp",
    "pin",
    "password",
    "scam",
    "fraud",
    "suspicious call",
    "verification code",
    "suspicious message",
    "suspicious link",
    "phishing",
    "social engineering",
    // Bangla
    "ওটিপি",
    "পিন",
    "পাসওয়ার্ড",
    "প্রতারণা",
    "স্ক্যাম",
    "ভুয়া কল",
    "ভুয়া মেসেজ",
    "ভুয়া লিংক",
  ],
  [CASE_TYPES.WRONG_TRANSFER]: [
    // English
    "wrong number",
    "wrong recipient",
    "mistaken transfer",
    "sent money by mistake",
    "wrong account",
    "transferred to wrong person",
    "sent to wrong",
    "transferred by mistake",
    "incorrect recipient",
    // Bangla
    "ভুল নাম্বার",
    "ভুল নম্বর",
    "ভুল একাউন্ট",
    "ভুল অ্যাকাউন্ট",
    "ভুলে টাকা পাঠিয়েছি",
    "অন্যকে টাকা পাঠিয়েছি",
    "ভুল মানুষকে পাঠিয়েছি",
  ],
  [CASE_TYPES.PAYMENT_FAILED]: [
    // English
    "payment failed",
    "transaction failed",
    "balance deducted",
    "money deducted",
    "payment pending",
    "transaction unsuccessful",
    "payment unsuccessful",
    "deducted but",
    // Bangla
    "পেমেন্ট ফেল",
    "টাকা কেটে নিয়েছে",
    "ব্যালেন্স কেটে গেছে",
    "ট্রানজেকশন ফেল",
    "পেমেন্ট হয়নি",
  ],
  [CASE_TYPES.REFUND_REQUEST]: [
    // English
    "refund",
    "money back",
    "return payment",
    "cancel transaction",
    "want my money back",
    "reverse the payment",
    // Bangla
    "রিফান্ড",
    "টাকা ফেরত",
    "টাকা ব্যাক",
    "ফেরত চাই",
    "পেমেন্ট ফেরত দাও",
    "টাকা ফেরত দাও",
  ],
};

export const CASE_TYPE_CONFIG = {
  [CASE_TYPES.WRONG_TRANSFER]: {
    severity: SEVERITY.HIGH,
    department: DEPARTMENTS.DISPUTE_RESOLUTION,
    confidence: 0.92,
    humanReviewRequired: false,
  },
  [CASE_TYPES.PAYMENT_FAILED]: {
    severity: SEVERITY.HIGH,
    department: DEPARTMENTS.PAYMENTS_OPS,
    confidence: 0.90,
    humanReviewRequired: false,
  },
  [CASE_TYPES.REFUND_REQUEST]: {
    severity: SEVERITY.LOW,
    department: DEPARTMENTS.CUSTOMER_SUPPORT,
    confidence: 0.88,
    humanReviewRequired: false,
  },
  [CASE_TYPES.PHISHING]: {
    severity: SEVERITY.CRITICAL,
    department: DEPARTMENTS.FRAUD_RISK,
    confidence: 0.97,
    humanReviewRequired: true,
  },
  [CASE_TYPES.OTHER]: {
    severity: SEVERITY.LOW,
    department: DEPARTMENTS.CUSTOMER_SUPPORT,
    confidence: 0.75,
    humanReviewRequired: false,
  },
};

export const SUMMARIES = {
  [CASE_TYPES.WRONG_TRANSFER]:
    "Customer reports sending funds to an incorrect recipient and requests assistance recovering the transfer.",
  [CASE_TYPES.PAYMENT_FAILED]:
    "Customer reports a failed transaction while funds may have been deducted from the account.",
  [CASE_TYPES.REFUND_REQUEST]:
    "Customer requests a refund for a recent transaction.",
  [CASE_TYPES.PHISHING]:
    "Customer reports a suspicious request for sensitive account credentials.",
  [CASE_TYPES.OTHER]:
    "Customer reports a general issue requiring support review.",
};
