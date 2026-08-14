/**
 * Default assumed annuity rate used to convert the post-lump-sum pot into Pot Income, expressed
 * as a percentage (not a fraction). User-editable; see ADR-0002 and ADR-0005.
 */
export const DEFAULT_ANNUITY_RATE_PERCENTAGE = 4;

/** Full new UK State Pension, current annual figure. */
export const STATE_PENSION_ANNUAL = 12548;

/** Default annual pension charges, taken from the pot each year. See ADR-0004. */
export const DEFAULT_PENSION_CHARGES_PERCENTAGE = 0.75;

export const MIN_LUMP_SUM_PERCENTAGE = 0;
export const MAX_LUMP_SUM_PERCENTAGE = 25;
