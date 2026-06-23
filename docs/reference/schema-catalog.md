---
id: schema-catalog
title: Schema catalog
description: Deal and event schemas used across asset classes.
---

<div className="eyebrow">Reference</div>

<StatusBadge status="draft" reviewed="2026-06-23" />

# Schema catalog

OpenTRMS validates every captured deal against a JSON schema per product and
asset class. Schemas are reloadable at runtime via
`/api/v1/config/schemas/reload`, so new products can be onboarded without a
redeploy.

The table below is generated from the schemas in the backend repository — see
[CONTRIBUTING.md](https://github.com/ichagas/OpenTRMS) for how to regenerate it.

{/* BEGIN GENERATED:schemas */}
| Schema | Title | Description |
| --- | --- | --- |
| `_common/enums.json` | TRMS Common Enumerations |  |
| `_common/leg.json` | TRMS Swap Leg |  |
| `accounting/chart_of_accounts.json` | accounting/chart_of_accounts.json |  |
| `accounting/posting_rules.json` | accounting/posting_rules.json |  |
| `accounting/posting_rules_meta.json` | PostingRules | Meta-schema for schemas/accounting/posting_rules.json. Validates the posting rule configuration file loaded at startup by PostingRuleLoader. |
| `approval/chains.json` | approval/chains.json |  |
| `closeout/rules.json` | closeout/rules.json |  |
| `deals/custom/rates/acme_range_accrual.json` | ACME Range Accrual |  |
| `deals/deposit/money_market/vanilla.json` | Term Deposit | Fixed-term deposit or loan. Principal + interest at maturity. |
| `deals/extension/generic_v1.json` | Generic Extension Deal Schema | Permissive fallback schema for client-defined extension asset class deals. Validates only the mandatory notional and currency fields; all other fields are permitted. |
| `deals/forward/fx/ndf.json` | Non-Deliverable Forward | Cash-settled FX forward for restricted currencies (BRL, KRW, INR, CNY offshore, etc.). |
| `deals/forward/fx/vanilla.json` | FX Forward | Deliverable FX forward. Exchange of two currencies at a future date at agreed rate. |
| `deals/fra/rates/vanilla.json` | Forward Rate Agreement | Cash-settled agreement on a future interest rate period. |
| `deals/option/equity/vanilla.json` | Vanilla Option Deal Details | Black-Scholes-Merton details for a vanilla equity or equity-like option. |
| `deals/option/fx/barrier.json` | FX Barrier Option | FX option with knock-in or knock-out barrier. Extends vanilla option with barrier conditions. |
| `deals/option/fx/vanilla.json` | FX Vanilla Option | European or American call/put on a currency pair. |
| `deals/repo/money_market/vanilla.json` | Repurchase Agreement | Classic repo: sell security near leg, buy back far leg. Overnight or term. |
| `deals/spot/fixed_income/vanilla.json` | Bond Purchase | Bond purchase deal. Buy or sell a fixed-income debt security with coupon and maturity terms. Settles T+2/T+3 as a cash instrument. |
| `deals/spot/fx/vanilla.json` | FX Spot | Spot foreign exchange transaction. Settlement T+2 (or T+1 for CAD/USD, T+0 for same-currency). |
| `deals/swap/credit/vanilla.json` | Credit Default Swap | Single-name CDS. Protection buyer pays periodic premium; protection seller pays on credit event. |
| `deals/swap/rates/basis.json` | Basis Swap | Float vs float, same currency, different indices (e.g., 3M vs 6M, or CORRA vs CDOR). |
| `deals/swap/rates/ois.json` | Overnight Index Swap | Fixed vs compounded overnight rate (CORRA, SOFR, ESTR). Inherits vanilla IRS structure with overnight-specific constraints. |
| `deals/swap/rates/vanilla.json` | Vanilla Interest Rate Swap | Fixed vs float single-currency IRS. The most common OTC derivative globally. |
| `deals/swap/rates/xccy.json` | Cross-Currency Swap | Two legs in different currencies. May include initial and final exchange of notionals. |
| `deals/swaption/rates/vanilla.json` | European Swaption Deal Details | Black-model details for a European swaption (payer or receiver) on a vanilla interest-rate swap. |
| `extensions/counterparties.json` | Counterparty Extensions |  |
| `extensions/deals.json` | Deal Extensions — Reference Institution |  |
| `extensions/journal_lines.json` | Journal Line Extensions |  |
| `instruments/bond.json` | Bond Instrument | Covers all bond subtypes via conditional blocks: government, corporate, municipal, covered, sukuk, convertible, inflation_linked, at1, zero_coupon, frn. |
| `instruments/cds.json` | Credit Default Swap |  |
| `instruments/equity.json` | Equity (Perpetual) |  |
| `instruments/futures_contract.json` | Futures Contract (Sharable) |  |
| `instruments/fx_pair.json` | FX Pair (Perpetual) | Currency pair instrument. No maturity, no lifecycle events. |
| `marketdata/curve.json` | TRMS Market Curve | Schema-driven market curve definition with a stable curve ID, as-of date, and tenor/rate grid. |
| `marketdata/curves/CORRA_CAD_OIS.json` | marketdata/curves/CORRA_CAD_OIS.json |  |
| `marketdata/curves/ESTR_EUR_OIS.json` | marketdata/curves/ESTR_EUR_OIS.json |  |
| `marketdata/curves/EURIBOR_3M.json` | marketdata/curves/EURIBOR_3M.json |  |
| `marketdata/curves/EURIBOR_6M.json` | marketdata/curves/EURIBOR_6M.json |  |
| `marketdata/curves/SOFR_USD_OIS.json` | marketdata/curves/SOFR_USD_OIS.json |  |
| `marketdata/curves/SONIA_GBP_OIS.json` | marketdata/curves/SONIA_GBP_OIS.json |  |
| `marketdata/curves/TONA_JPY_OIS.json` | marketdata/curves/TONA_JPY_OIS.json |  |
| `marketdata/curves/USD_LIBOR_3M.json` | marketdata/curves/USD_LIBOR_3M.json |  |
| `marketdata/shock_spec.json` | ShockSpec | Market shock specification for bump-and-reprice and scenario analysis. All shifts are additive/multiplicative overlays on top of the base market view. |
| `product_compatibility.json` | product_compatibility.json |  |
| `product_registry.json` | product_registry.json |  |
| `stp/rules.json` | stp/rules.json |  |
| `templates/bond_cad_corra_lockout.json` | templates/bond_cad_corra_lockout.json | Canadian CORRA FRN with a rate cutoff (lockout) before period end. Trader provides: issuer, face_value, issue_date, maturity_date, float_spread, rate_cutoff_days. |
| `templates/bond_cad_corra_standard.json` | templates/bond_cad_corra_standard.json | Standard Canadian CORRA FRN, plain in-arrears. Trader provides: issuer, face_value, issue_date, maturity_date, float_spread. |
| `templates/fx_ndf_brl.json` | templates/fx_ndf_brl.json | BRL/USD NDF. Trader provides: counterparty, book, notional, contracted_rate, fixing_date, value_date, buy_sell. |
| `templates/irs_cad_standard.json` | templates/irs_cad_standard.json | Standard CAD vanilla IRS vs CORRA. Trader provides: counterparty, book, notional, rate, effective_date, maturity_date. |
| `templates/irs_usd_standard.json` | templates/irs_usd_standard.json | Standard USD vanilla IRS vs SOFR. Trader provides: counterparty, book, notional, rate, effective_date, maturity_date. |
| `templates/repo_overnight_goc.json` | templates/repo_overnight_goc.json | Overnight repo against Government of Canada bonds. Trader provides: counterparty, book, collateral_instrument_id, collateral_quantity, near_amount, repo_rate. |
| `valuation/metrics.json` | Valuation Metrics — Sparse/Extensible Measures | Strict schema for the metrics JSONB column on domain.valuations. All values are numeric (BigDecimal-precision). Unknown keys are rejected. Typed columns (market_value, unrealized_pnl, etc.) must not be duplicated here — only sparse, product-specific, or extensible measures belong in this object. |
{/* END GENERATED:schemas */}
