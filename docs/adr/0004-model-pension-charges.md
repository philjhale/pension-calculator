# Model pension charges as a configurable annual drag on the pot

Building the multi-year verification fixture from a real MoneyHelper projection (age 43 → 68, £300k pot, £100k salary, 8% combined contribution, 5% growth, 2.5% inflation) exposed a second gap beyond the deflation issue fixed by [ADR-0003](./0003-deflate-pot-derived-outputs-to-todays-money.md): even after deflating correctly, our Pot Income came out ~18.5% above MoneyHelper's (£32,499 vs £27,422). MoneyHelper's own stated assumptions explain the gap — it deducts pension charges of 0.75%/yr from the pot, which our engine didn't model at all.

Pension Charges is added as a new input, `pensionChargesPercentage`, defaulting to 0.75 (MoneyHelper's stated default) but user-editable like every other assumption in this calculator. Each year, charges are deducted from the whole pot at year-end, after that year's growth and Contribution are applied: `pot = (pot * (1 + growthRate) + contribution) * (1 - chargesRate)`. This ordering was chosen empirically — of the orderings tried (charges folded into the growth rate; charges applied before the contribution; charges applied after), it reproduced the reference figure most closely (within ~0.6%, comfortably inside the existing 1% verification tolerance).

Charges apply only during accumulation, same as Growth Rate — they have no effect on the post-retirement annuity conversion, matching how MoneyHelper presents them ("Charges of 0.75% a year are taken from your pension pot").

**Status**: accepted
