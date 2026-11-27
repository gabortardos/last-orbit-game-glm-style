# Visual asset import log

Append-only per D-042. One row per asset ever imported into this (public) repo. Gate for every row: **owner sign-off + a license the owner approved for public distribution + SHA-256 verified against the visual repo manifest before copy**.

## Import #1 - 2026-11-27 - the 19 approved V6 card assets (D-042 gate LIFTED, D-045)

- **Owner clearance (blanket, zero exceptions):** "All 19 cleared - I checked the AI tool terms and I am fine publishing them" - Gabor, 2026-11-27 (decision **D-045**; visual mailbox QA-G-017). Scope = the 18 approved V6 card faces + the V6 card back ONLY; captain portraits/masters/derivatives are NOT covered and still need their own clearance call at the export gate.
- **Manifest authority:** visual repo `contracts/asset-manifest.json` - GAME flipped the 19 assets to `runtime_approved: true`, `rights: "owner-cleared-public-distribution (D-045 blanket, 2026-11-27)"`, `approval_ref: "QA-G-017"` (visual commit `f9c18b8`); all non-V6 assets untouched.
- **Verification:** each file SHA-256 + byte-size matched the manifest BEFORE copy; copies are byte-identical to the approved Drive assets (no re-encoding).
- **Format note:** PNG as reviewed - no local WebP encoder this session; WebP optimization is a follow-up lane and must add a NEW import row with re-pinned hashes when done. Runtime path: `/visual/<assetId>.png` via the Vite default `publicDir` (`apps/hotseat/public/`). UI wiring not yet done - no code references these files yet.

| # | assetId | SHA-256 | bytes | target |
|---|---------|---------|-------|--------|
| 1 | `LO-CARD-BACK-V6` | `ac6e63ff8d43ef7890b5535f2ccda59f9eb334fca44ce3f4b00504f849870bbb` | 1062185 | `apps/hotseat/public/visual/LO-CARD-BACK-V6.png` |
| 2 | `LO-CARD-BOARDING-V6` | `599cecc637dc796bc402b049169f3aefe66b233442436cc74c39b4aef78a67d4` | 2101024 | `apps/hotseat/public/visual/LO-CARD-BOARDING-V6.png` |
| 3 | `LO-CARD-BURN-V6` | `2df9822741bf65c338859907b28b7302e3eab4b0227d732a972daadce0654637` | 1951119 | `apps/hotseat/public/visual/LO-CARD-BURN-V6.png` |
| 4 | `LO-CARD-CONTAINMENT-V6` | `a2913b9c263caec6bfc52c3c210df3c67ad11027399608a28db84691be93a809` | 2366030 | `apps/hotseat/public/visual/LO-CARD-CONTAINMENT-V6.png` |
| 5 | `LO-CARD-COOLANT-V6` | `341704bb6eed54787a6faf8c9ca355999a38d6ee4cd674d61743046aae5e9982` | 1748704 | `apps/hotseat/public/visual/LO-CARD-COOLANT-V6.png` |
| 6 | `LO-CARD-DEFLECTOR-V6` | `2b95beee7fd15f230d125a51692280c1f736e295276ed42bb139dd612ffb566b` | 2007008 | `apps/hotseat/public/visual/LO-CARD-DEFLECTOR-V6.png` |
| 7 | `LO-CARD-FLYBY-V6` | `f2ac4b4aae9bc656d505f9275f547e8c24b1a7325ed611cb1975d831ae8578d5` | 2320949 | `apps/hotseat/public/visual/LO-CARD-FLYBY-V6.png` |
| 8 | `LO-CARD-HULL-V6` | `606a00c0e0c51beb70582e06f6aafc361bdf58e2423d8997247cba200741ab5f` | 1906340 | `apps/hotseat/public/visual/LO-CARD-HULL-V6.png` |
| 9 | `LO-CARD-ION-SURGE-V6` | `6360442bd21821978b98c43d1dbc7703d8f9c93c2ef743a7dc6742a81e5571ab` | 2110310 | `apps/hotseat/public/visual/LO-CARD-ION-SURGE-V6.png` |
| 10 | `LO-CARD-OVERRIDE-V6` | `c5a1dbe8fc31987c421e5a1e6e5103182558750f5a95acb594fa5655b54651a8` | 2058102 | `apps/hotseat/public/visual/LO-CARD-OVERRIDE-V6.png` |
| 11 | `LO-CARD-REQUISITION-V6` | `8272b9efe149757d2909f6d9ad9102ef0350510f55e2cdab30da1482c5df1016` | 2333031 | `apps/hotseat/public/visual/LO-CARD-REQUISITION-V6.png` |
| 12 | `LO-CARD-REVERSAL-V6` | `caa93af1e5322b05a636e72335996604b9918317a026578140fe9861f566bd9f` | 1929775 | `apps/hotseat/public/visual/LO-CARD-REVERSAL-V6.png` |
| 13 | `LO-CARD-RUPTURE-V6` | `9afc2ea57421bc6bbc36e02356d48088c3fe67f656e5eeec934a04de0e61b74a` | 1888894 | `apps/hotseat/public/visual/LO-CARD-RUPTURE-V6.png` |
| 14 | `LO-CARD-SALVAGE-V6` | `7afa294d81239106912ddb66e1ce4f0c2b3bdcc4c56d9fd225ab6b93f21be527` | 1867650 | `apps/hotseat/public/visual/LO-CARD-SALVAGE-V6.png` |
| 15 | `LO-CARD-SCAN-V6` | `fe6416e2c5352461d3bb9ea78986fc33eeaba18ce06f1c64150d91f28c2ad0b3` | 1951159 | `apps/hotseat/public/visual/LO-CARD-SCAN-V6.png` |
| 16 | `LO-CARD-SLINGSHOT-V6` | `0396a4fd13fdf831803af5bfa0d32ee1423692162d5e382ba23cfb8b68486c1a` | 1995481 | `apps/hotseat/public/visual/LO-CARD-SLINGSHOT-V6.png` |
| 17 | `LO-CARD-STORM-V6` | `27f6a3eb681a83742263c3b2cf91256268a655c5b113934cbbc8ef0efd7bbb8d` | 2252012 | `apps/hotseat/public/visual/LO-CARD-STORM-V6.png` |
| 18 | `LO-CARD-TRACTOR-V6` | `e6661b13d6c51679726cf3bfade448072b42bba72af8f2feeedaef3c6b63b07b` | 2255470 | `apps/hotseat/public/visual/LO-CARD-TRACTOR-V6.png` |
| 19 | `LO-CARD-WIND-V6` | `7c74cabe90c09ea5ce81531e453137bc0eee5edb343c7fc04c9cb8bf95fc94ad` | 2193786 | `apps/hotseat/public/visual/LO-CARD-WIND-V6.png` |

