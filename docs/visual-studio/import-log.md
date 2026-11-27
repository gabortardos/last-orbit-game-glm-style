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


## Import #2 - 2026-11-27 - 16 V1 captain runtime assets (QA-G-021 verdicts + D-047 delegated owner approval)

- **Owner clearance:** delegated per **D-047** - GAME approval = owner approval; D-046 gate satisfied by QA-G-021 individual verdicts + certified 48px pair tests (shared mailbox `Q_AND_A.md`, visual repo).
- **Verification:** every file SHA-256 + bytes matched the pack manifest (pack 04/05/06/08 ZIPs first hash-verified against VISUAL's declared ZIP SHA-256) BEFORE copy; copies byte-identical, no re-encode. WebP as reviewed.
- **Tracks:** Mercury = pack-08 rematte derivatives (native 745x1000 exception APPROVED in QA-G-021); Earth = byte-exact pack-05 framing outputs; remaining six = pack-06 approved-master derivatives (all 8 masters proven from locked batch-04 sources via `approved_reference_sha256`). Venus/Saturn masters byte-identical to locked originals.

| # | assetId | SHA-256 | bytes | target |
|---|---------|---------|-------|--------|
| 1 | `LO-CAPT-MERCURY-PORTRAIT-V1` | `7dd14aab5f4b905b849ea8633f8df0826e99c3fb00cf716f56481deb47e2fb1b` | 162272 | `apps/hotseat/public/visual/LO-CAPT-MERCURY-PORTRAIT-V1.webp` |
| 2 | `LO-CAPT-MERCURY-AVATAR-V1` | `3fdffaaab60a22d7f87b3d519d8d20c4d7ec026db1464ca1fd448d4c275d5d1f` | 88400 | `apps/hotseat/public/visual/LO-CAPT-MERCURY-AVATAR-V1.webp` |
| 3 | `LO-CAPT-VENUS-PORTRAIT-V1` | `c9b8380820efa559b2162af9acbf146eefdc084b37a6ddb5758bf875bc981e6e` | 205472 | `apps/hotseat/public/visual/LO-CAPT-VENUS-PORTRAIT-V1.webp` |
| 4 | `LO-CAPT-VENUS-AVATAR-V1` | `3a8d78fd127d35805138a0051d01eed35d3c4687dc49c48375257da9a2bd8f38` | 105376 | `apps/hotseat/public/visual/LO-CAPT-VENUS-AVATAR-V1.webp` |
| 5 | `LO-CAPT-EARTH-PORTRAIT-V1` | `654d83650513999aa2dd5ea78f92c55b896115d448a34c78213f5be1ade8d2df` | 196340 | `apps/hotseat/public/visual/LO-CAPT-EARTH-PORTRAIT-V1.webp` |
| 6 | `LO-CAPT-EARTH-AVATAR-V1` | `4fc26413e2d28db2a99549e47c0a37c9dc89a5d36b3b76378e9adf1ff1fd626a` | 119544 | `apps/hotseat/public/visual/LO-CAPT-EARTH-AVATAR-V1.webp` |
| 7 | `LO-CAPT-MARS-PORTRAIT-V1` | `af8cdacdc2903ef19349781ce34ea4c25dcadf58b7fa6e0f475036ef72ff80fd` | 228766 | `apps/hotseat/public/visual/LO-CAPT-MARS-PORTRAIT-V1.webp` |
| 8 | `LO-CAPT-MARS-AVATAR-V1` | `33bef24d150a6004b902ba03530a067cfa6ae81bb550e05afe864dbedb872b32` | 139754 | `apps/hotseat/public/visual/LO-CAPT-MARS-AVATAR-V1.webp` |
| 9 | `LO-CAPT-JUPITER-PORTRAIT-V1` | `196e5f69e1025c5a2438b4c3e239e36a728ae5cb8d2b848ab6ad0f6fc52b9307` | 159960 | `apps/hotseat/public/visual/LO-CAPT-JUPITER-PORTRAIT-V1.webp` |
| 10 | `LO-CAPT-JUPITER-AVATAR-V1` | `1e8b2125ef295750957cb578dbfec36f31a7ac98277e6543e0b273038a374fcf` | 104058 | `apps/hotseat/public/visual/LO-CAPT-JUPITER-AVATAR-V1.webp` |
| 11 | `LO-CAPT-SATURN-PORTRAIT-V1` | `bb71eadf31554caed75ab176cd68a1f83143e63475778b5b75247f56f1ab4114` | 140182 | `apps/hotseat/public/visual/LO-CAPT-SATURN-PORTRAIT-V1.webp` |
| 12 | `LO-CAPT-SATURN-AVATAR-V1` | `db89a0b9e5e3c8dde940e5f06547433ecef50c573b8c9d53c491fece5621ed13` | 93410 | `apps/hotseat/public/visual/LO-CAPT-SATURN-AVATAR-V1.webp` |
| 13 | `LO-CAPT-URANUS-PORTRAIT-V1` | `39ca6c211f88bed436dce5713af0ac82c8911032e9e19c46cbe1f6335f8de994` | 165262 | `apps/hotseat/public/visual/LO-CAPT-URANUS-PORTRAIT-V1.webp` |
| 14 | `LO-CAPT-URANUS-AVATAR-V1` | `192528439547fd3a1910bce7e27cfefc0d0df13d3f75d6566ef3738b4bec59e1` | 86724 | `apps/hotseat/public/visual/LO-CAPT-URANUS-AVATAR-V1.webp` |
| 15 | `LO-CAPT-NEPTUNE-PORTRAIT-V1` | `92fa3cda5315661a661756830418dec9fff6a9f010e69eeca602627546bea38a` | 155664 | `apps/hotseat/public/visual/LO-CAPT-NEPTUNE-PORTRAIT-V1.webp` |
| 16 | `LO-CAPT-NEPTUNE-AVATAR-V1` | `c2786fb7457ae474bf51fe089fceef03b5c38e82511ef76ce2dc466a27e18338` | 87870 | `apps/hotseat/public/visual/LO-CAPT-NEPTUNE-AVATAR-V1.webp` |


## Import #3 - 2026-11-27 - 16 V1 environment runtime assets (QA-G-021 + locked QA-G-020 tracks)

- **Owner clearance:** delegated per **D-047** - GAME approval = owner approval; D-046 gate satisfied by QA-G-021 individual verdicts + certified 48px pair tests (shared mailbox `Q_AND_A.md`, visual repo).
- **Verification:** every file SHA-256 + bytes matched the pack manifest (pack 04/05/06/08 ZIPs first hash-verified against VISUAL's declared ZIP SHA-256) BEFORE copy; copies byte-identical, no re-encode. WebP as reviewed.
- **Tracks:** Mercury/Earth/Mars = pack-08 corrected derivatives (sealed conduits re-render / sky mattes; 100% native crop inspection clean); Venus/Jupiter/Saturn/Uranus/Neptune = locked batch-04 originals re-pinned vs pack-08 `qa/unchanged-environments.json`.

| # | assetId | SHA-256 | bytes | target |
|---|---------|---------|-------|--------|
| 1 | `LO-ENV-MERCURY-BACKGROUND-V1` | `5df07fb934cef860afa23eb81fbca834f4aeb6e79b98b4158d3d1aca54a1a8d5` | 359292 | `apps/hotseat/public/visual/LO-ENV-MERCURY-BACKGROUND-V1.webp` |
| 2 | `LO-ENV-MERCURY-THUMB-V1` | `7dd8d4460cd2e61968ea66f1d0e036fa87abb65671e0cfef188e3447bc1cf135` | 103856 | `apps/hotseat/public/visual/LO-ENV-MERCURY-THUMB-V1.webp` |
| 3 | `LO-ENV-EARTH-BACKGROUND-V1` | `43a0d12335037ea74a504f4ce4ac81feba0de8d589a018097d9c5e9af7305f4d` | 466744 | `apps/hotseat/public/visual/LO-ENV-EARTH-BACKGROUND-V1.webp` |
| 4 | `LO-ENV-EARTH-THUMB-V1` | `2c3c473f3dbd616aed3751ebc3ccf8c1afce9af834ac11ca6db387936c7f6102` | 141984 | `apps/hotseat/public/visual/LO-ENV-EARTH-THUMB-V1.webp` |
| 5 | `LO-ENV-MARS-BACKGROUND-V1` | `1795e65346dce477b8918cd9928905346e4b12ca693225050dd77f1aee0daed1` | 366276 | `apps/hotseat/public/visual/LO-ENV-MARS-BACKGROUND-V1.webp` |
| 6 | `LO-ENV-MARS-THUMB-V1` | `8c83e9a33fa1634c4f4a2b7b762818fcc6b43fc2d1e60da62d08adda7d01e518` | 105854 | `apps/hotseat/public/visual/LO-ENV-MARS-THUMB-V1.webp` |
| 7 | `LO-ENV-VENUS-BACKGROUND-V1` | `77bbf7e05f40654f52e5d77191abbf544fed679f8276c334e50338f0ca4ea1a4` | 272156 | `apps/hotseat/public/visual/LO-ENV-VENUS-BACKGROUND-V1.webp` |
| 8 | `LO-ENV-VENUS-THUMB-V1` | `9fbdfb342a0c08c697e910a99a0891ba298e55cd8343312d7827cceb0efdfef2` | 80056 | `apps/hotseat/public/visual/LO-ENV-VENUS-THUMB-V1.webp` |
| 9 | `LO-ENV-JUPITER-BACKGROUND-V1` | `5c0d48c63fff3b5f456dcde780183984873ef62baf05ab3186d7e7b7a3e99093` | 326134 | `apps/hotseat/public/visual/LO-ENV-JUPITER-BACKGROUND-V1.webp` |
| 10 | `LO-ENV-JUPITER-THUMB-V1` | `1295a4779c99260a8279621172bb10dec45d61c1f7557c60f7d17bf5ee96d3cf` | 91352 | `apps/hotseat/public/visual/LO-ENV-JUPITER-THUMB-V1.webp` |
| 11 | `LO-ENV-SATURN-BACKGROUND-V1` | `9b21e2dc0b9b4944e763cd58c87e9150ea44a1ab0539c53abd7a4993ae668aab` | 326280 | `apps/hotseat/public/visual/LO-ENV-SATURN-BACKGROUND-V1.webp` |
| 12 | `LO-ENV-SATURN-THUMB-V1` | `8308a1958dabc281d6def0f174b912e9c6514938f7d1e7566345b3ccaeaeb43a` | 86652 | `apps/hotseat/public/visual/LO-ENV-SATURN-THUMB-V1.webp` |
| 13 | `LO-ENV-URANUS-BACKGROUND-V1` | `229cd48df99dd46d1804976623394a0675922f6491852c2d3152a8293f47ea23` | 225338 | `apps/hotseat/public/visual/LO-ENV-URANUS-BACKGROUND-V1.webp` |
| 14 | `LO-ENV-URANUS-THUMB-V1` | `49770eca34791ecd3f8a3e42215e773cc9e7130aa58b53b365252e85de106301` | 64244 | `apps/hotseat/public/visual/LO-ENV-URANUS-THUMB-V1.webp` |
| 15 | `LO-ENV-NEPTUNE-BACKGROUND-V1` | `779f1662e6f112c376b8c24149f7199f8aa4451257f372b3211db620916b065e` | 237980 | `apps/hotseat/public/visual/LO-ENV-NEPTUNE-BACKGROUND-V1.webp` |
| 16 | `LO-ENV-NEPTUNE-THUMB-V1` | `09c29fb78dd505e645243b9f71d8b7ebb2b0cbcc9d2812f07bcd0cb8d644c500` | 68294 | `apps/hotseat/public/visual/LO-ENV-NEPTUNE-THUMB-V1.webp` |

