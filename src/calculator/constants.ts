/**
 * Default assumed annuity rate used to convert the post-lump-sum pot into Pot Income, expressed
 * as a percentage (not a fraction). User-editable; see ADR-0002 and ADR-0005. Matches the rate
 * implied by the Vanguard reference calculator.
 */
export const DEFAULT_ANNUITY_RATE_PERCENTAGE = 4;

/** Annuity rate implied by MoneyHelper's reference calculator. See ADR-0005. */
export const MONEYHELPER_ANNUITY_RATE_PERCENTAGE = 5.28;

/** Full new UK State Pension, current annual figure. */
export const STATE_PENSION_ANNUAL = 12548;

/** Default annual pension charges, taken from the pot each year. See ADR-0004. */
export const DEFAULT_PENSION_CHARGES_PERCENTAGE = 0.75;

export const MIN_LUMP_SUM_PERCENTAGE = 0;
export const MAX_LUMP_SUM_PERCENTAGE = 25;

export const MIN_ANNUITY_RATE_PERCENTAGE = 0;
export const MAX_ANNUITY_RATE_PERCENTAGE = 20;
