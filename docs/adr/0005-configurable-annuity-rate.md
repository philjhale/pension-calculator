# Make the annuity rate a user-editable input, not a shared constant

ADR-0002 fixed the Pot Income conversion at a flat 4% annuity rate, chosen to match both Vanguard's and MoneyHelper's public calculators, on the assumption that the two used comparable rates.

Re-verifying the multi-year MoneyHelper fixture (age 43 → 68, £300k pot, £100k salary, 8% combined contribution, 5% growth, 2.5% inflation, 0.75% charges) against a fresh MoneyHelper run exposed two problems. First, the existing fixture's `lumpSumPercentage: 0` was itself a transcription error — the £39,970/yr reference figure was actually captured at 25% lump sum, not 0%; fixed in the test alongside this change. Second, and more significantly, MoneyHelper's real output at both 0% and 25% lump sum consistently implies an annuity rate of ~5.28% — not 4%:

- 0% lump sum: £36,483/yr Pot Income on a £691,911 pot → 5.27%
- 25% lump sum: £27,422/yr Pot Income on a £518,934 remaining pot → 5.28%

This is materially different from the ~4.00% implied by the Vanguard zero-year fixture (£818,189 pot, 25% lump sum, £24,546/yr income) that ADR-0002 was originally calibrated against. A single shared constant cannot satisfy both references simultaneously — they appear to use genuinely different annuity pricing assumptions (plausibly: different providers, product types, or the effect of age/gilt-yield-based pricing that a flat rate can't capture).

Rather than pick one provider's rate as canonically "correct", `annuityRatePercentage` becomes a normal user-editable input (`PensionProjectionInputs.annuityRatePercentage`), like Growth Rate, Inflation Rate, and Pension Charges. `DEFAULT_ANNUITY_RATE_PERCENTAGE` (4%, in `constants.ts`) remains the app's default value, preserving prior behaviour for existing users, but it's no longer treated as a fixed truth — the UI now exposes it directly so a user can dial it to match whichever reference calculator (or real annuity quote) they're checking against.

Verification fixtures are updated accordingly: the Vanguard fixture and existing unit-behaviour tests continue to pass an explicit (or default) 4% rate; the two MoneyHelper multi-year fixtures (0% and 25% lump sum) now pass the ~5.28% rate implied by MoneyHelper's own output.

**Status**: accepted
