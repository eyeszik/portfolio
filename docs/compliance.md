# Outreach & Marketing Compliance Gate (Draft-Only Default)
## Operating principle
- The system generates *drafts* and *plans*, not autonomous mass-sending.
- Any outreach-like action is classified as MEDIUM risk by default and requires human review.

## Gate states
- DRAFT_ONLY: Generates copy + sequences; no sending; requires opt-out language guidance.
- HUMAN_REVIEW_REQUIRED: Same, but blocks “next-step automation” unless user attests:
  - Consent source exists
  - Suppression lists exist
  - Rate limits configured
  - Human approval for each send
- BLOCKED: PII or deceptive claims detected or governance fails.

## Minimum safe controls (required)
- Consent capture for email/SMS lists
- Suppression lists (unsubscribe, do-not-contact)
- Rate limits (per domain/account/day)
- Content checks:
  - No deceptive earnings claims
  - No impersonation
  - No scraping without explicit permission

## Suggested implementation detail
- Keep the “send” action in n8n behind a manual approval node.
- Store evidence of consent and suppression checks in audit logs.

## Notes
This is a technical gating layer, not legal advice. Align with your jurisdiction and platform terms.
