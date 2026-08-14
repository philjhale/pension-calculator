# Deflate pot-derived outputs to today's money

ADR-0001 assumed that presenting future, un-discounted £ figures would match how MoneyHelper and Vanguard present their results. Checking against a real multi-year MoneyHelper projection (age 43 → 68, £300k pot, £100k salary, 8% combined contribution, 5% growth) showed that assumption was wrong: MoneyHelper's headline figures are materially smaller than ours for the same inputs, consistent with MoneyHelper deflating its output to today's purchasing power rather than showing nominal future pounds. The gap (roughly the size of `(1 + inflation)^years`) disappears once deflation is applied, and no existing verification fixture actually exercised the multi-year accumulation phase — the two prior fixtures both used zero years to retirement or zero growth/inflation, so this was never caught.

Accumulation still compounds nominally, year by year, exactly as ADR-0001 describes — Salary and Contributions still grow with inflation. The change is at the output boundary: Total Pot Value, Lump Sum, and Pot Income are now divided by `(1 + inflation)^yearsToRetirement` before being returned. State Pension is left undiscounted, since `STATE_PENSION_ANNUAL` already represents a current-day rate rather than a nominal future one — deflating it again would misrepresent it as today's rate reduced twice.

**Status**: accepted
