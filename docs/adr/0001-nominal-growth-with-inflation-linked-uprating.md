# Nominal growth rate, with inflation used only to uprate salary and State Pension

The growth rate slider could be applied as a nominal rate (raw £ growth, discounted back to "today's money" at the end) or a real rate (inflation already stripped out). We chose nominal: the pot and income projections are shown as future £ figures with no separate "today's money" discounting step. Inflation is instead used to grow Salary (and therefore Contributions, which are % of Salary) year-on-year, and to uprate the State Pension constant, matching how the reference calculators (MoneyHelper, Vanguard) present their results and how State Pension actually behaves in reality.

**Status**: accepted (amended by [ADR-0003](./0003-deflate-pot-derived-outputs-to-todays-money.md) — accumulation still compounds nominally as described here, but pot-derived outputs are now deflated to today's money before display)
