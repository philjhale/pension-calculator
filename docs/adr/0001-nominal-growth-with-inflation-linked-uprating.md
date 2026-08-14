# Nominal growth rate, with inflation used only to uprate salary and State Pension

The growth rate slider could be applied as a nominal rate (raw £ growth) or a real rate (inflation already stripped out). We chose nominal: the pot accumulates year-on-year at the raw Growth Rate, with no inflation adjustment applied during the compounding itself. Inflation is instead used to grow Salary (and therefore Contributions, which are % of Salary) year-on-year, and to uprate the State Pension constant, matching how State Pension actually behaves in reality.

This ADR originally also stated that the resulting pot and income figures would be shown undiscounted, as future £, matching how the reference calculators (MoneyHelper, Vanguard) present their results. That turned out to be wrong: checked against a real multi-year MoneyHelper projection, undiscounted figures ran far above MoneyHelper's for the same inputs. [ADR-0003](./0003-deflate-pot-derived-outputs-to-todays-money.md) supersedes that part — the accumulation described above is unchanged, but Total Pot Value, Lump Sum, and Pot Income are now deflated to today's money before being returned.

**Status**: accepted (display behaviour amended by ADR-0003; accumulation model above still applies)
