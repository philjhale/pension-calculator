# Retirement income via fixed-rate annuity purchase, not sustainable withdrawal

Pot Income (the "income per year/month" output) is calculated as the post-lump-sum pot multiplied by a fixed assumed annuity rate (~4%, refined during verification against reference calculators), rather than a sustainable-withdrawal-rate model (e.g. pot × growth rate, or a 4% rule with an indefinite pot). This was chosen specifically to match how MoneyHelper's and Vanguard's public pension calculators present results, since those two tools' output screenshots are used as verification fixtures for this project's calculation engine. A sustainable-withdrawal model would not reproduce those reference figures.

**Status**: accepted
