# Changelog

All notable changes to Twico UI are documented here (newest first). This file is generated automatically on each release by [semantic-release](https://semantic-release.gitbook.io/) from [Conventional Commits](https://www.conventionalcommits.org/) — do not edit it by hand. The same notes appear on each [GitHub Release](https://github.com/EncryptionL/twico-ui/releases).

# [1.14.0](https://github.com/EncryptionL/twico-ui/compare/v1.13.0...v1.14.0) (2026-07-13)


### Features

* **datatable:** async/searchable "is any of" filter options via loadValueOptions ([#232](https://github.com/EncryptionL/twico-ui/issues/232)) ([2db2b32](https://github.com/EncryptionL/twico-ui/commit/2db2b3212bcda8cdea9430b6766f02a2b3dd0048)), closes [#208](https://github.com/EncryptionL/twico-ui/issues/208)

# [1.13.0](https://github.com/EncryptionL/twico-ui/compare/v1.12.0...v1.13.0) (2026-07-13)


### Features

* **data-display:** narrow-column sizing + menu gating; fix Move-menu & CardGrid sort clipping ([a4f4937](https://github.com/EncryptionL/twico-ui/commit/a4f4937d00c4c3c9be0b199c8eac98d0d60f5572)), closes [#228](https://github.com/EncryptionL/twico-ui/issues/228) [#226](https://github.com/EncryptionL/twico-ui/issues/226) [#227](https://github.com/EncryptionL/twico-ui/issues/227) [#228](https://github.com/EncryptionL/twico-ui/issues/228)

# [1.12.0](https://github.com/EncryptionL/twico-ui/compare/v1.11.1...v1.12.0) (2026-07-10)


### Bug Fixes

* a11y + consistency batch — reduced-motion, aria-current, required asterisk, Spinner tone ([#217](https://github.com/EncryptionL/twico-ui/issues/217),[#218](https://github.com/EncryptionL/twico-ui/issues/218),[#219](https://github.com/EncryptionL/twico-ui/issues/219),[#222](https://github.com/EncryptionL/twico-ui/issues/222)) ([8a4262c](https://github.com/EncryptionL/twico-ui/commit/8a4262cba3f9a40f97bc4e1b709cdedefbb72c9a)), closes [#51](https://github.com/EncryptionL/twico-ui/issues/51)


### Features

* **data-display:** add CardGrid — server-mode paginated card grid ([#204](https://github.com/EncryptionL/twico-ui/issues/204)) ([c58ba0a](https://github.com/EncryptionL/twico-ui/commit/c58ba0a11d87d6c746adb60cd950d2ece857e6b5))
* **data-display:** add DiffTable — row + field-level dataset comparison ([#205](https://github.com/EncryptionL/twico-ui/issues/205)) ([6d7f30e](https://github.com/EncryptionL/twico-ui/commit/6d7f30ef8e203b0d4e5d6da6cb5f9a613c1be66b))
* **datatable:** valueGetter, searchFields, formatted filter options ([#213](https://github.com/EncryptionL/twico-ui/issues/213),[#214](https://github.com/EncryptionL/twico-ui/issues/214),[#215](https://github.com/EncryptionL/twico-ui/issues/215)) ([ec05b74](https://github.com/EncryptionL/twico-ui/commit/ec05b745501fdd035214f34e222dbac6f2d8600f))
* **inputs:** add FilterBar — schema-driven faceted filter bar ([#203](https://github.com/EncryptionL/twico-ui/issues/203)) ([ab60176](https://github.com/EncryptionL/twico-ui/commit/ab60176087d2ae5a4ff69d1fad14b49a1d923fc6))
* **inputs:** add TimePicker + DateTimePicker for time-of-day selection ([#223](https://github.com/EncryptionL/twico-ui/issues/223)) ([e862359](https://github.com/EncryptionL/twico-ui/commit/e862359e520f77a546fbefc94a7b38cafc18f0b1))
* **inputs:** date-picker parity + size on Slider/ColorPicker/FileUpload ([#200](https://github.com/EncryptionL/twico-ui/issues/200),[#201](https://github.com/EncryptionL/twico-ui/issues/201),[#210](https://github.com/EncryptionL/twico-ui/issues/210),[#211](https://github.com/EncryptionL/twico-ui/issues/211),[#220](https://github.com/EncryptionL/twico-ui/issues/220)) ([eb59d15](https://github.com/EncryptionL/twico-ui/commit/eb59d15f4241054686348b7e0de7fe5d2bc9eb5e))
* MultiSelect async options, DateRangePicker custom presets, WithSx type ([#208](https://github.com/EncryptionL/twico-ui/issues/208),[#212](https://github.com/EncryptionL/twico-ui/issues/212),[#221](https://github.com/EncryptionL/twico-ui/issues/221)) ([8aaff89](https://github.com/EncryptionL/twico-ui/commit/8aaff89df612dbc3dcaf0cfa1f3641596de734b3))
* **pickers:** add month + year/decade view tiers to the calendar header ([#206](https://github.com/EncryptionL/twico-ui/issues/206), [#207](https://github.com/EncryptionL/twico-ui/issues/207)) ([8cf681c](https://github.com/EncryptionL/twico-ui/commit/8cf681c74da676718b97cb41486797f6387e79a0))
* Toast live-region announcements + Grid justifyItems ([#209](https://github.com/EncryptionL/twico-ui/issues/209), [#216](https://github.com/EncryptionL/twico-ui/issues/216)) ([5de96d9](https://github.com/EncryptionL/twico-ui/commit/5de96d96450d84712b0a7b9c2bfeb22f98761fa7))

## [1.11.1](https://github.com/EncryptionL/twico-ui/compare/v1.11.0...v1.11.1) (2026-07-09)


### Bug Fixes

* **datatable:** pointer cursor on the Columns-panel visibility toggle ([9d30343](https://github.com/EncryptionL/twico-ui/commit/9d303434f51c4a4131cf393e56f8534d53f0a7bb))
* **tooltip:** grow horizontally + point the arrow at the trigger ([19aa76a](https://github.com/EncryptionL/twico-ui/commit/19aa76a6ffe597d81aff00a4144182661db0971b))

# [1.11.0](https://github.com/EncryptionL/twico-ui/compare/v1.10.0...v1.11.0) (2026-07-07)


### Bug Fixes

* **app-shell:** suppress the focus ring on the tabindex=-1 skip target ([#190](https://github.com/EncryptionL/twico-ui/issues/190)) ([88fd874](https://github.com/EncryptionL/twico-ui/commit/88fd874d659115407492d7ab78997f5b88ee46fa))
* **styles:** omit CSP nonce from React 19 precedence styles ([#189](https://github.com/EncryptionL/twico-ui/issues/189)) ([c86c7e8](https://github.com/EncryptionL/twico-ui/commit/c86c7e8c09d559f1749431cc8c5075d382f6ca8f))
* **sx:** normalize box-model shorthands to longhands ([#188](https://github.com/EncryptionL/twico-ui/issues/188)) ([3807718](https://github.com/EncryptionL/twico-ui/commit/38077184aeb58cfe5e4a4989b8cacb10e6068475))


### Features

* **datatable:** expose column visibility to server mode ([#191](https://github.com/EncryptionL/twico-ui/issues/191)) ([1412c13](https://github.com/EncryptionL/twico-ui/commit/1412c135095f091557697ea04a9f700ee0b472cc))

# [1.10.0](https://github.com/EncryptionL/twico-ui/compare/v1.9.0...v1.10.0) (2026-07-05)


### Bug Fixes

* **charts:** make on-mark data labels legible on any fill colour ([f75e7e3](https://github.com/EncryptionL/twico-ui/commit/f75e7e3fdbfc69ee91a2366087dfbb3c6b25c841))


### Features

* **charts:** click handlers, selection, legend focus, crosshair, zoom & pan ([79e36dc](https://github.com/EncryptionL/twico-ui/commit/79e36dc63eb466c747914864dbff062a75238581))
* **charts:** equalize interactivity — zoom for all axis/grid charts, explode + focus-dim for the rest ([6b4fcbe](https://github.com/EncryptionL/twico-ui/commit/6b4fcbeb2cf22e80d0e83c01b7e4991a085aa19c))

# [1.9.0](https://github.com/EncryptionL/twico-ui/compare/v1.8.1...v1.9.0) (2026-07-05)


### Bug Fixes

* **docs:** update the docs version selector (was stuck at v1.3) ([94a19d9](https://github.com/EncryptionL/twico-ui/commit/94a19d9b2f601cc1a811cd791f9b7ba7c930558b))


### Features

* **charts:** ApexCharts/MUI-X-style interactivity — tooltips, hover, animation ([57d944d](https://github.com/EncryptionL/twico-ui/commit/57d944d57ba687b1bb179397a01a877c74af661f))
* **charts:** expand Chart + add 14 dedicated chart components ([18d059d](https://github.com/EncryptionL/twico-ui/commit/18d059df093b7f11cd697a52aeba37c7e03e4fc0))

## [1.8.1](https://github.com/EncryptionL/twico-ui/compare/v1.8.0...v1.8.1) (2026-07-04)


### Bug Fixes

* **security:** resolve 11 CodeQL code-scanning alerts ([7e36962](https://github.com/EncryptionL/twico-ui/commit/7e36962084bf20f0854f4ee95853ee221ee432fe))
* **security:** resolve 11 CodeQL code-scanning alerts ([#184](https://github.com/EncryptionL/twico-ui/issues/184)) ([7dc58e4](https://github.com/EncryptionL/twico-ui/commit/7dc58e42098aa17cc811d64eb27930d39efa5596))

# [1.8.0](https://github.com/EncryptionL/twico-ui/compare/v1.7.0...v1.8.0) (2026-07-04)


### Features

* **datatable:** controlled pagination and page-size state ([c5553c7](https://github.com/EncryptionL/twico-ui/commit/c5553c75bda88047f85f9f128856161f5ac5e4bb)), closes [#45](https://github.com/EncryptionL/twico-ui/issues/45)
* **inputs:** ColorPicker alpha channel + 3/8-digit hex support ([1ad249a](https://github.com/EncryptionL/twico-ui/commit/1ad249a106dcbf2c0aa1d13559dc9d5114479357)), closes [#107](https://github.com/EncryptionL/twico-ui/issues/107) [#106](https://github.com/EncryptionL/twico-ui/issues/106)
* **inputs:** optional typed date entry for DatePicker + DateRangePicker ([3530476](https://github.com/EncryptionL/twico-ui/commit/3530476ec3a1e274fc3d98201fa7f884820b2624)), closes [#105](https://github.com/EncryptionL/twico-ui/issues/105)
* **primitives:** add `sx` style-prop escape hatch (pseudo-classes, media, tokens) ([7f5e87f](https://github.com/EncryptionL/twico-ui/commit/7f5e87f94d20892ebcd7160924b787ff60ec0035)), closes [#57](https://github.com/EncryptionL/twico-ui/issues/57) [#53](https://github.com/EncryptionL/twico-ui/issues/53)
* **select:** opt-in option-list virtualization for Select/Combobox/MultiSelect ([2676fab](https://github.com/EncryptionL/twico-ui/commit/2676fab7ba81c76343c8988ce0506b5c6262cafe)), closes [#92](https://github.com/EncryptionL/twico-ui/issues/92)
* **types:** infer polymorphic props + ref from `as` on the primitives ([4bca600](https://github.com/EncryptionL/twico-ui/commit/4bca600601058517f7e084b836414842e5c77426)), closes [#55](https://github.com/EncryptionL/twico-ui/issues/55)

# [1.7.0](https://github.com/EncryptionL/twico-ui/compare/v1.6.0...v1.7.0) (2026-07-04)


### Bug Fixes

* **inputs:** keyboard navigation for the DatePicker month grid + DateRangePicker day grid ([e276b39](https://github.com/EncryptionL/twico-ui/commit/e276b39cfc5d86e9c8ab509b5ca09506879e967d)), closes [#100](https://github.com/EncryptionL/twico-ui/issues/100) [#109](https://github.com/EncryptionL/twico-ui/issues/109)
* **inputs:** trap focus + aria-modal in Date/Range/Color picker popovers ([#108](https://github.com/EncryptionL/twico-ui/issues/108)) ([feb7470](https://github.com/EncryptionL/twico-ui/commit/feb74705f61f94db3613e1041a4775b281d1d905)), closes [100/#109](https://github.com/EncryptionL/twico-ui/issues/109)


### Features

* **foundational:** Form primitive + ThemeProvider/createTheme ([fb48c3f](https://github.com/EncryptionL/twico-ui/commit/fb48c3fece3ad30bfb44a14de4de519054274045)), closes [#60](https://github.com/EncryptionL/twico-ui/issues/60) [#61](https://github.com/EncryptionL/twico-ui/issues/61)
* **foundational:** forwardRef primitives, CSP nonce, tree-shaking budgets, docs metadata ([09f6b60](https://github.com/EncryptionL/twico-ui/commit/09f6b60a0ffe5bb29faf553a39975ea7dc002b7f)), closes [#55](https://github.com/EncryptionL/twico-ui/issues/55) [#54](https://github.com/EncryptionL/twico-ui/issues/54) [#57](https://github.com/EncryptionL/twico-ui/issues/57) [#58](https://github.com/EncryptionL/twico-ui/issues/58) [#59](https://github.com/EncryptionL/twico-ui/issues/59) [#62](https://github.com/EncryptionL/twico-ui/issues/62)
* **primitives:** add VisuallyHidden, Image, Label, Anchor, Kbd, Pre, Portal + ColorSchemeScript ([0256651](https://github.com/EncryptionL/twico-ui/commit/02566512779de5520b98b954de15e5ffcb08bb0a)), closes [#52](https://github.com/EncryptionL/twico-ui/issues/52) [#56](https://github.com/EncryptionL/twico-ui/issues/56)

# [1.6.0](https://github.com/EncryptionL/twico-ui/compare/v1.5.0...v1.6.0) (2026-07-04)


### Bug Fixes

* **data-display:** List/Table/Pagination a11y — roles, names, empty/loading states ([2dce9ad](https://github.com/EncryptionL/twico-ui/commit/2dce9ada5bcbc8e528de68ab592d06e3432aeb0a)), closes [#123](https://github.com/EncryptionL/twico-ui/issues/123) [#124](https://github.com/EncryptionL/twico-ui/issues/124) [#125](https://github.com/EncryptionL/twico-ui/issues/125) [#126](https://github.com/EncryptionL/twico-ui/issues/126) [#127](https://github.com/EncryptionL/twico-ui/issues/127) [#128](https://github.com/EncryptionL/twico-ui/issues/128) [#129](https://github.com/EncryptionL/twico-ui/issues/129) [#123](https://github.com/EncryptionL/twico-ui/issues/123) [#124](https://github.com/EncryptionL/twico-ui/issues/124) [#125](https://github.com/EncryptionL/twico-ui/issues/125) [#126](https://github.com/EncryptionL/twico-ui/issues/126) [#127](https://github.com/EncryptionL/twico-ui/issues/127) [#128](https://github.com/EncryptionL/twico-ui/issues/128) [#129](https://github.com/EncryptionL/twico-ui/issues/129)
* **inputs:** Currency/CurrencyField numeric correctness + readOnly/disabled states ([7f27219](https://github.com/EncryptionL/twico-ui/commit/7f27219275f139c3d58b33b7d17f49d81792f7e6)), closes [#63](https://github.com/EncryptionL/twico-ui/issues/63) [#64](https://github.com/EncryptionL/twico-ui/issues/64) [#65](https://github.com/EncryptionL/twico-ui/issues/65) [#66](https://github.com/EncryptionL/twico-ui/issues/66) [#67](https://github.com/EncryptionL/twico-ui/issues/67) [#73](https://github.com/EncryptionL/twico-ui/issues/73)
* **navigation,data-display:** Breadcrumb inert crumbs + Card header actions slot ([8979150](https://github.com/EncryptionL/twico-ui/commit/897915010d3163c027a9f7837607c0fbfccb1246)), closes [#46](https://github.com/EncryptionL/twico-ui/issues/46) [#50](https://github.com/EncryptionL/twico-ui/issues/50)
* **overlay,feedback:** overlay a11y — focus traps, inert, scroll-lock, tooltip, menu, toast ([21d2d3b](https://github.com/EncryptionL/twico-ui/commit/21d2d3b217f082a50c1751c3e7a0f5b3183adbff)), closes [#48](https://github.com/EncryptionL/twico-ui/issues/48) [#111](https://github.com/EncryptionL/twico-ui/issues/111) [#112](https://github.com/EncryptionL/twico-ui/issues/112) [#113](https://github.com/EncryptionL/twico-ui/issues/113) [#114](https://github.com/EncryptionL/twico-ui/issues/114) [#115](https://github.com/EncryptionL/twico-ui/issues/115) [#116](https://github.com/EncryptionL/twico-ui/issues/116) [#117](https://github.com/EncryptionL/twico-ui/issues/117) [#118](https://github.com/EncryptionL/twico-ui/issues/118) [#119](https://github.com/EncryptionL/twico-ui/issues/119) [#120](https://github.com/EncryptionL/twico-ui/issues/120)


### Features

* **datatable:** customizable empty state, per-column reorderable, tooltip actions, grid roles ([37adbfa](https://github.com/EncryptionL/twico-ui/commit/37adbfa45903391f8de00c6e9b3b1af2e967ac99)), closes [#45](https://github.com/EncryptionL/twico-ui/issues/45) [#44](https://github.com/EncryptionL/twico-ui/issues/44) [#49](https://github.com/EncryptionL/twico-ui/issues/49) [#51](https://github.com/EncryptionL/twico-ui/issues/51) [#121](https://github.com/EncryptionL/twico-ui/issues/121) [#122](https://github.com/EncryptionL/twico-ui/issues/122)
* **inputs:** FileUpload validation, picker bounds/a11y (Date/Range/Color) ([15b28e7](https://github.com/EncryptionL/twico-ui/commit/15b28e7176077d553afe75a32834037988322580)), closes [#100](https://github.com/EncryptionL/twico-ui/issues/100) [#109](https://github.com/EncryptionL/twico-ui/issues/109) [#105](https://github.com/EncryptionL/twico-ui/issues/105) [#106](https://github.com/EncryptionL/twico-ui/issues/106) [#108](https://github.com/EncryptionL/twico-ui/issues/108) [#101](https://github.com/EncryptionL/twico-ui/issues/101) [#102](https://github.com/EncryptionL/twico-ui/issues/102) [#103](https://github.com/EncryptionL/twico-ui/issues/103) [#104](https://github.com/EncryptionL/twico-ui/issues/104) [#107](https://github.com/EncryptionL/twico-ui/issues/107) [#110](https://github.com/EncryptionL/twico-ui/issues/110)
* **inputs:** RadioGroup + native required, name warnings, checkbox indeterminate sync ([f1df662](https://github.com/EncryptionL/twico-ui/commit/f1df66217f274507c5e4e8853e1355d7a978bbae)), closes [#74](https://github.com/EncryptionL/twico-ui/issues/74) [#76](https://github.com/EncryptionL/twico-ui/issues/76) [#77](https://github.com/EncryptionL/twico-ui/issues/77) [#85](https://github.com/EncryptionL/twico-ui/issues/85)
* **inputs:** Rating fractional fill, read-only role=img, clearable + clean formatting ([f3cfd6c](https://github.com/EncryptionL/twico-ui/commit/f3cfd6cb16169debdfd303c9167d282d2462da1a)), closes [#78](https://github.com/EncryptionL/twico-ui/issues/78) [#79](https://github.com/EncryptionL/twico-ui/issues/79) [#83](https://github.com/EncryptionL/twico-ui/issues/83) [#87](https://github.com/EncryptionL/twico-ui/issues/87)
* **inputs:** Select/Combobox/MultiSelect — a11y, async, form, disabled options, caps ([2ba152d](https://github.com/EncryptionL/twico-ui/commit/2ba152d6f9a799284ac783d9495a128d36a376ac)), closes [#90](https://github.com/EncryptionL/twico-ui/issues/90) [#91](https://github.com/EncryptionL/twico-ui/issues/91) [#89](https://github.com/EncryptionL/twico-ui/issues/89) [#96](https://github.com/EncryptionL/twico-ui/issues/96) [#47](https://github.com/EncryptionL/twico-ui/issues/47) [#97](https://github.com/EncryptionL/twico-ui/issues/97) [#88](https://github.com/EncryptionL/twico-ui/issues/88) [#94](https://github.com/EncryptionL/twico-ui/issues/94) [#95](https://github.com/EncryptionL/twico-ui/issues/95) [#98](https://github.com/EncryptionL/twico-ui/issues/98) [#99](https://github.com/EncryptionL/twico-ui/issues/99) [#92](https://github.com/EncryptionL/twico-ui/issues/92) [#47](https://github.com/EncryptionL/twico-ui/issues/47) [#88](https://github.com/EncryptionL/twico-ui/issues/88) [#89](https://github.com/EncryptionL/twico-ui/issues/89) [#90](https://github.com/EncryptionL/twico-ui/issues/90) [#91](https://github.com/EncryptionL/twico-ui/issues/91) [#93](https://github.com/EncryptionL/twico-ui/issues/93) [#94](https://github.com/EncryptionL/twico-ui/issues/94) [#95](https://github.com/EncryptionL/twico-ui/issues/95) [#96](https://github.com/EncryptionL/twico-ui/issues/96) [#97](https://github.com/EncryptionL/twico-ui/issues/97) [#98](https://github.com/EncryptionL/twico-ui/issues/98) [#99](https://github.com/EncryptionL/twico-ui/issues/99)
* **inputs:** Slider range mode, keyboard/precision/a11y fixes + form submission ([308b035](https://github.com/EncryptionL/twico-ui/commit/308b035f443fb986ef04b29b918c5b0dfc9bac5f)), closes [#75](https://github.com/EncryptionL/twico-ui/issues/75) [#80](https://github.com/EncryptionL/twico-ui/issues/80) [#81](https://github.com/EncryptionL/twico-ui/issues/81) [#82](https://github.com/EncryptionL/twico-ui/issues/82) [#84](https://github.com/EncryptionL/twico-ui/issues/84) [#86](https://github.com/EncryptionL/twico-ui/issues/86)
* **inputs:** Textarea autosize + ref, char counter, Input addons, Field/aria wiring ([044050e](https://github.com/EncryptionL/twico-ui/commit/044050e35b1cb9d2ee5b323e5efb9d7b1e1c4e2f)), closes [#68](https://github.com/EncryptionL/twico-ui/issues/68) [#69](https://github.com/EncryptionL/twico-ui/issues/69) [#70](https://github.com/EncryptionL/twico-ui/issues/70) [#71](https://github.com/EncryptionL/twico-ui/issues/71) [#72](https://github.com/EncryptionL/twico-ui/issues/72)

# [1.5.0](https://github.com/EncryptionL/twico-ui/compare/v1.4.0...v1.5.0) (2026-07-04)


### Bug Fixes

* **accordion:** heading-wrapped triggers, roving keyboard nav, per-item disabled ([b95018e](https://github.com/EncryptionL/twico-ui/commit/b95018e7521b975f76d0238a626778de967f158c)), closes [#147](https://github.com/EncryptionL/twico-ui/issues/147) [#146](https://github.com/EncryptionL/twico-ui/issues/146) [#148](https://github.com/EncryptionL/twico-ui/issues/148) [#146](https://github.com/EncryptionL/twico-ui/issues/146) [#147](https://github.com/EncryptionL/twico-ui/issues/147) [#148](https://github.com/EncryptionL/twico-ui/issues/148)
* **carousel:** keyboard nav, reduced-motion pause, accessible name, live region ([3046ca7](https://github.com/EncryptionL/twico-ui/commit/3046ca7976e6d5890048c4c01413291419279c92)), closes [#153](https://github.com/EncryptionL/twico-ui/issues/153) [#154](https://github.com/EncryptionL/twico-ui/issues/154) [#155](https://github.com/EncryptionL/twico-ui/issues/155) [#156](https://github.com/EncryptionL/twico-ui/issues/156) [#153](https://github.com/EncryptionL/twico-ui/issues/153) [#154](https://github.com/EncryptionL/twico-ui/issues/154) [#155](https://github.com/EncryptionL/twico-ui/issues/155) [#156](https://github.com/EncryptionL/twico-ui/issues/156)
* **feedback:** a11y names/live-regions for Alert, Progress, and Skeleton ([09c1e3f](https://github.com/EncryptionL/twico-ui/commit/09c1e3f48edca8995b222ab47af1a54a77bb0aa7)), closes [#157](https://github.com/EncryptionL/twico-ui/issues/157) [#158](https://github.com/EncryptionL/twico-ui/issues/158) [#159](https://github.com/EncryptionL/twico-ui/issues/159) [#164](https://github.com/EncryptionL/twico-ui/issues/164) [#157](https://github.com/EncryptionL/twico-ui/issues/157) [#158](https://github.com/EncryptionL/twico-ui/issues/158) [#159](https://github.com/EncryptionL/twico-ui/issues/159) [#164](https://github.com/EncryptionL/twico-ui/issues/164)
* **layout:** AppShell skip-to-content link + Divider labeled orientation ([ecf6c9e](https://github.com/EncryptionL/twico-ui/commit/ecf6c9e084f2d487c032461b5b58bebb4556f2e7)), closes [#134](https://github.com/EncryptionL/twico-ui/issues/134) [#151](https://github.com/EncryptionL/twico-ui/issues/151) [#134](https://github.com/EncryptionL/twico-ui/issues/134) [#151](https://github.com/EncryptionL/twico-ui/issues/151)
* **navigation,data-display:** APG semantics for TreeView, Stepper, Kanban ([585aad0](https://github.com/EncryptionL/twico-ui/commit/585aad0feac0b9092036cbbaed52e4421f5b0bbc)), closes [#132](https://github.com/EncryptionL/twico-ui/issues/132) [#133](https://github.com/EncryptionL/twico-ui/issues/133) [#135](https://github.com/EncryptionL/twico-ui/issues/135) [#130](https://github.com/EncryptionL/twico-ui/issues/130) [#131](https://github.com/EncryptionL/twico-ui/issues/131) [#130](https://github.com/EncryptionL/twico-ui/issues/130) [#131](https://github.com/EncryptionL/twico-ui/issues/131) [#132](https://github.com/EncryptionL/twico-ui/issues/132) [#133](https://github.com/EncryptionL/twico-ui/issues/133) [#135](https://github.com/EncryptionL/twico-ui/issues/135)
* **navigation:** Sidebar/Navbar landmark names, list semantics, toggle state ([dda6345](https://github.com/EncryptionL/twico-ui/commit/dda63459bfc10805f7e238bc84fe4792bc794243)), closes [#139](https://github.com/EncryptionL/twico-ui/issues/139) [#140](https://github.com/EncryptionL/twico-ui/issues/140) [#140](https://github.com/EncryptionL/twico-ui/issues/140) [#141](https://github.com/EncryptionL/twico-ui/issues/141) [#139](https://github.com/EncryptionL/twico-ui/issues/139) [#140](https://github.com/EncryptionL/twico-ui/issues/140) [#141](https://github.com/EncryptionL/twico-ui/issues/141)
* **tokens:** raise solid warning/info and focus-ring contrast to WCAG floors ([240a8cf](https://github.com/EncryptionL/twico-ui/commit/240a8cfcf76f030810cbcfe6140fe9d2ae5be543)), closes [#176](https://github.com/EncryptionL/twico-ui/issues/176) [#178](https://github.com/EncryptionL/twico-ui/issues/178)


### Features

* **chart:** hidden data-table alternative + generic series-key typing ([dd789c6](https://github.com/EncryptionL/twico-ui/commit/dd789c6df1aac21e1313e541f56ebdb14a4920e4)), closes [#160](https://github.com/EncryptionL/twico-ui/issues/160) [#166](https://github.com/EncryptionL/twico-ui/issues/166) [#160](https://github.com/EncryptionL/twico-ui/issues/160) [#166](https://github.com/EncryptionL/twico-ui/issues/166)
* **data-display,typography:** Tag/Avatar a11y labels + Code block/copyable ([6e1bdf1](https://github.com/EncryptionL/twico-ui/commit/6e1bdf10516de0fbc945a95787b10a119e8bd65c)), closes [#161](https://github.com/EncryptionL/twico-ui/issues/161) [#162](https://github.com/EncryptionL/twico-ui/issues/162) [#163](https://github.com/EncryptionL/twico-ui/issues/163) [#161](https://github.com/EncryptionL/twico-ui/issues/161) [#162](https://github.com/EncryptionL/twico-ui/issues/162) [#163](https://github.com/EncryptionL/twico-ui/issues/163)
* **datatable,inputs:** generic Datatable<T>, exported filter operator types, Currency onChange docs ([54050d3](https://github.com/EncryptionL/twico-ui/commit/54050d3f292a9098080fa5c180ef1b7d43f8c6df)), closes [#165](https://github.com/EncryptionL/twico-ui/issues/165) [#174](https://github.com/EncryptionL/twico-ui/issues/174) [#172](https://github.com/EncryptionL/twico-ui/issues/172) [#165](https://github.com/EncryptionL/twico-ui/issues/165) [#172](https://github.com/EncryptionL/twico-ui/issues/172) [#174](https://github.com/EncryptionL/twico-ui/issues/174)
* dev-only deprecation warnings + removal targets for legacy props ([8fd691d](https://github.com/EncryptionL/twico-ui/commit/8fd691d617c1ca43a4ecf40be0825b53b8889411)), closes [#170](https://github.com/EncryptionL/twico-ui/issues/170)
* **hooks:** extract useFocusTrap + usePortal, refactor overlays onto them ([b6c4277](https://github.com/EncryptionL/twico-ui/commit/b6c427717e3d4bcaf26265e22c34ec4af83654f3)), closes [#177](https://github.com/EncryptionL/twico-ui/issues/177)
* **hooks:** SSR-safe useMediaQuery, controllable-state warning, null-safe ref types ([309e4f4](https://github.com/EncryptionL/twico-ui/commit/309e4f40fdc2c0d6f1ea101419e354bda88f7b7b)), closes [#175](https://github.com/EncryptionL/twico-ui/issues/175) [#179](https://github.com/EncryptionL/twico-ui/issues/179) [#173](https://github.com/EncryptionL/twico-ui/issues/173) [#173](https://github.com/EncryptionL/twico-ui/issues/173) [#175](https://github.com/EncryptionL/twico-ui/issues/175) [#179](https://github.com/EncryptionL/twico-ui/issues/179)
* **menu:** accessible popup name + href menu items (real anchors) ([d05143d](https://github.com/EncryptionL/twico-ui/commit/d05143d0a36543d24f89b96d25869f48533bbba0)), closes [#142](https://github.com/EncryptionL/twico-ui/issues/142) [#167](https://github.com/EncryptionL/twico-ui/issues/167) [#142](https://github.com/EncryptionL/twico-ui/issues/142) [#167](https://github.com/EncryptionL/twico-ui/issues/167)
* **sidebar:** add off-canvas overlay drawer mode with backdrop, focus trap and Escape-to-close ([c6007b0](https://github.com/EncryptionL/twico-ui/commit/c6007b086ce6bd4acb9027bde14bc1380f5cc6b7)), closes [#177](https://github.com/EncryptionL/twico-ui/issues/177) [#138](https://github.com/EncryptionL/twico-ui/issues/138)
* **tabs:** overflow scroll, disabled items, ReactNode counts ([02f7350](https://github.com/EncryptionL/twico-ui/commit/02f735008f6d08101b73669133a66322fd2903b7)), closes [#136](https://github.com/EncryptionL/twico-ui/issues/136) [#137](https://github.com/EncryptionL/twico-ui/issues/137) [#171](https://github.com/EncryptionL/twico-ui/issues/171) [#136](https://github.com/EncryptionL/twico-ui/issues/136) [#137](https://github.com/EncryptionL/twico-ui/issues/137) [#171](https://github.com/EncryptionL/twico-ui/issues/171)
* **types:** export shared tone unions, Option/OptionGroup, and widen polymorphic as ([87b2a58](https://github.com/EncryptionL/twico-ui/commit/87b2a5810bd59cd5d76ca5e994a6cbfa5d1848d3)), closes [#169](https://github.com/EncryptionL/twico-ui/issues/169) [#168](https://github.com/EncryptionL/twico-ui/issues/168) [#143](https://github.com/EncryptionL/twico-ui/issues/143) [#143](https://github.com/EncryptionL/twico-ui/issues/143) [#168](https://github.com/EncryptionL/twico-ui/issues/168) [#169](https://github.com/EncryptionL/twico-ui/issues/169)
* **typography,layout:** truncate/lineClamp, Text inherit, Heading sizes, Stack padding, responsive Grid ([40e2097](https://github.com/EncryptionL/twico-ui/commit/40e2097e4d74ef05dccec2125a146db7c91297a6)), closes [#144](https://github.com/EncryptionL/twico-ui/issues/144) [#152](https://github.com/EncryptionL/twico-ui/issues/152) [#150](https://github.com/EncryptionL/twico-ui/issues/150) [#145](https://github.com/EncryptionL/twico-ui/issues/145) [#149](https://github.com/EncryptionL/twico-ui/issues/149) [#144](https://github.com/EncryptionL/twico-ui/issues/144) [#145](https://github.com/EncryptionL/twico-ui/issues/145) [#149](https://github.com/EncryptionL/twico-ui/issues/149) [#150](https://github.com/EncryptionL/twico-ui/issues/150) [#152](https://github.com/EncryptionL/twico-ui/issues/152)

# [1.4.0](https://github.com/EncryptionL/twico-ui/compare/v1.3.2...v1.4.0) (2026-06-28)


### Bug Fixes

* **security:** resolve all CodeQL code-scanning alerts ([1c90991](https://github.com/EncryptionL/twico-ui/commit/1c909910d5bd34d24c715192e95e2b345d0c9feb))


### Features

* **datatable:** opt-in toolbar tools, comfortable default density, column count ([d989963](https://github.com/EncryptionL/twico-ui/commit/d989963be436154e599d748203d0484c04619490))

## [1.3.2](https://github.com/EncryptionL/twico-ui/compare/v1.3.1...v1.3.2) (2026-06-25)


### Bug Fixes

* **sidebar:** don't clip a wide brand mark in the collapsed rail ([6c019ac](https://github.com/EncryptionL/twico-ui/commit/6c019aceabba14ee1856ddbb88566096dd7f8d94))

## [1.3.1](https://github.com/EncryptionL/twico-ui/compare/v1.3.0...v1.3.1) (2026-06-25)


### Bug Fixes

* **sidebar:** smoother collapse/expand animation ([f92bbc8](https://github.com/EncryptionL/twico-ui/commit/f92bbc8ad818fef5e3bec030c26863df49d8bdda))

# [1.3.0](https://github.com/EncryptionL/twico-ui/compare/v1.2.0...v1.3.0) (2026-06-24)


### Features

* **icons:** add 31 brand icons to twico-ui/icons + Icons docs page ([348aff2](https://github.com/EncryptionL/twico-ui/commit/348aff22204188fb1bde06d53eb3913d91998d5d))
* **site:** add documentation version selector ([8669044](https://github.com/EncryptionL/twico-ui/commit/86690442b564fda427a90c4e7a60e894b64b8319))

# [1.2.0](https://github.com/EncryptionL/twico-ui/compare/v1.1.0...v1.2.0) (2026-06-24)


### Features

* **icons:** add twico-ui/icons — re-export the full Lucide set (optional peer) ([c76fa22](https://github.com/EncryptionL/twico-ui/commit/c76fa224bd1fe57daec80def3deac01b78f87f3c))

# [1.1.0](https://github.com/EncryptionL/twico-ui/compare/v1.0.2...v1.1.0) (2026-06-24)


### Features

* **layout:** add AppShell — full-height sidebar + topbar + content frame ([8db4fd9](https://github.com/EncryptionL/twico-ui/commit/8db4fd9df2ec9bafaf3c1b4b54be7e719920d9de))

## [1.0.2](https://github.com/EncryptionL/twico-ui/compare/v1.0.1...v1.0.2) (2026-06-24)


### Bug Fixes

* **examples:** full-height dashboard shell + bottom-placed topbar tooltips ([402703b](https://github.com/EncryptionL/twico-ui/commit/402703b7ea77b0fef90cbaa4f55193703c5cb785))
* **menu:** stack title and subtitle in the menu/avatar-menu header ([ae49019](https://github.com/EncryptionL/twico-ui/commit/ae49019c3a762108c169f9227d335cc1cfd30770))

## [1.0.1](https://github.com/EncryptionL/twico-ui/compare/v1.0.0...v1.0.1) (2026-06-24)


### Bug Fixes

* **examples:** render reports content in a Client Component ([e0d9c12](https://github.com/EncryptionL/twico-ui/commit/e0d9c12ca7d22efbbfeb58a253daa7dc5884b111))
* **ssr:** render scoped component styles into the SSR output (no FOUC) ([0fce412](https://github.com/EncryptionL/twico-ui/commit/0fce4125b59590f0570926e77b70dbe0cb69f1bf))

# [1.0.0](https://github.com/EncryptionL/twico-ui/compare/v0.1.0...v1.0.0) (2026-06-19)


* feat(api)!: unify the breaking API cleanups (Table, Button, Drawer, TreeView) ([862635d](https://github.com/EncryptionL/twico-ui/commit/862635d086a25b56844d3b9e8740a29e401f3df9))
* feat(iconbutton)!: tone × variant split to match Button (consistency) ([86728e3](https://github.com/EncryptionL/twico-ui/commit/86728e3c837b4c29ba32cfddaa68825d572d397d))


### Bug Fixes

* Box applies padding/margin props; CurrencyField styles work standalone ([00207aa](https://github.com/EncryptionL/twico-ui/commit/00207aa6097b9214c8371329c599b4c76e6fc25f))
* **button:** loading spinner no longer overlaps the label ([fc8c2b5](https://github.com/EncryptionL/twico-ui/commit/fc8c2b52403e2a7c8ba4d92e4806cdfe7176744e))
* **components:** low-priority tail QA items + commit interaction-sweep harness ([0402e1a](https://github.com/EncryptionL/twico-ui/commit/0402e1a11c3ba6c76cb6d8569272252bc79c2f9d))
* **components:** QA hardening pass — overlay clipping, a11y, RTL, edge cases ([2a6c761](https://github.com/EncryptionL/twico-ui/commit/2a6c7619d2a64f2d26073c4b057f326d2ffc73fd))
* **components:** QA Phase-2 — nav semantics, a11y, RTL, modal scroll-lock, edge cases ([3df77c9](https://github.com/EncryptionL/twico-ui/commit/3df77c93749d9ba05655f785357f3a012a0545f5))
* **components:** resolve pre-publish audit bugs across inputs, overlays, data-display & hooks ([c3a0ac6](https://github.com/EncryptionL/twico-ui/commit/c3a0ac6520e9421166eb93c110c67a583ffc09f2))
* **datatable:** close sibling overlays on menu open + widen filter value ([cffd1a0](https://github.com/EncryptionL/twico-ui/commit/cffd1a0d631a27ab15ac4fd4688b3e0435091190))
* **datatable:** give the Export split-button a tooltip ([fca24ea](https://github.com/EncryptionL/twico-ui/commit/fca24ea8995a63ee66c3374714ba233a4853350b))
* **datatable:** id-less row keying, pivot select clipping, invalid chevron path ([056b30b](https://github.com/EncryptionL/twico-ui/commit/056b30bf6442d2778e48a8b210320468d9d0c6b5))
* **datatable:** keep pinned editable cells sticky so columns stay aligned ([e84bfb9](https://github.com/EncryptionL/twico-ui/commit/e84bfb9ac774c4cecdf212b6a3dcc62ec4a388ff))
* **datatable:** keep the row-number column's ⋮ menu button inside the gutter ([344e033](https://github.com/EncryptionL/twico-ui/commit/344e0331e6add947d90a4f6d29b2ef4b89ab77a0))
* **datatable:** label the auto-added pin actions column "Actions" ([f21993c](https://github.com/EncryptionL/twico-ui/commit/f21993cc156ee5d34a3dc919a75fa28bb6a50dd4))
* **datatable:** never overflow a flex/grid container ([78d2882](https://github.com/EncryptionL/twico-ui/commit/78d2882e0a8008d2c4a89f982c5ba3822501579c))
* **datatable:** portal the filter / rows-per-page / cell-editor selects ([133612a](https://github.com/EncryptionL/twico-ui/commit/133612ab08c8e2929c855a923c6bdfd6679d36d9))
* **datatable:** responsive toolbar — collapse to icons on narrow grids ([1204883](https://github.com/EncryptionL/twico-ui/commit/12048832e9219dcb445fafa438ec4721a65489a4))
* **datatable:** rowPinning adds a row ⋮ menu when there's no actions column ([a3551cb](https://github.com/EncryptionL/twico-ui/commit/a3551cbff24d9e25cbdf2d0359e641aefcb030f1))
* **datatable:** RTL support — logical pinned offsets, pivot borders, edge shadows (deferred bucket 2/2) ([f2f1531](https://github.com/EncryptionL/twico-ui/commit/f2f1531bb1fd0f997cf488cd7e0e77fbed12c5e4))
* **datatable:** stop toolbar tooltips being clipped by the grid border ([cf072fb](https://github.com/EncryptionL/twico-ui/commit/cf072fbfcccfd8bfd3dc3d0a05b528f806c3b7d0))
* **datatable:** track floating popovers on scroll; close batch editor when empty ([5e4b4e5](https://github.com/EncryptionL/twico-ui/commit/5e4b4e5bdd3747ffad780eca9520fd9ae78ed6a7))
* dual-package exports so JS and TS resolve in ESM and CJS ([b120ede](https://github.com/EncryptionL/twico-ui/commit/b120ede083fce2289f7c17329960ab4de2381a06))
* inject component styles before paint to remove the FOUC ([d8ab230](https://github.com/EncryptionL/twico-ui/commit/d8ab230406f7a2ec3b00f5680827ff16aed282b7))
* **inputs:** anchor portaled picker popovers to their trigger (not far-left) ([d06e685](https://github.com/EncryptionL/twico-ui/commit/d06e685624314abda451d53b6f9d43e80d938970))
* **inputs:** portal all dropdown/popover overlays so they never clip ([5e00499](https://github.com/EncryptionL/twico-ui/commit/5e00499aa2b60dfa55a1a846227598d24464c019))
* keep loading indicators animating under reduced motion ([36b78a6](https://github.com/EncryptionL/twico-ui/commit/36b78a61a1119c84e5fb3f75b7563019859965c1))
* keep useColorScheme instances in sync across the app and tabs ([c6f0f93](https://github.com/EncryptionL/twico-ui/commit/c6f0f937495450da4139b3a69b55f9d1ceab1217))
* **motion:** keep loading spinners animating under prefers-reduced-motion ([c0f125c](https://github.com/EncryptionL/twico-ui/commit/c0f125ce801d961e1d7324b4d12cb4091066e61c))
* **navbar:** brand is no longer a hardcoded href="#" anchor ([35a67e8](https://github.com/EncryptionL/twico-ui/commit/35a67e88c38b1f1a610b8b0ab82f8df605b693a5))
* **overlay:** focus management + side-placement positioning (deferred bucket 1/2) ([bb662f7](https://github.com/EncryptionL/twico-ui/commit/bb662f7aa4472d170efe09196652cfbb25bc83ec))
* sanitize consumer href schemes in Breadcrumb/Navbar/Sidebar/List ([2a077a7](https://github.com/EncryptionL/twico-ui/commit/2a077a78d4821b80334a28d658ac821447e6b68b))
* security, a11y, customizability fixes across all components from full audit ([7e3b1d3](https://github.com/EncryptionL/twico-ui/commit/7e3b1d396597e0fc64d39bed0abdd096a5de4db0)), closes [#fff](https://github.com/EncryptionL/twico-ui/issues/fff)
* show a letter fallback for collapsed sidebar items without an icon ([07c6476](https://github.com/EncryptionL/twico-ui/commit/07c6476b9c04c14ac6b0c3ba96ac1d7e543ba0be))
* **site:** actually contain wide demos in every LiveExample (incl. variations) ([5af81ed](https://github.com/EncryptionL/twico-ui/commit/5af81ed23e69a3abe5d4c164ceaa66df57af70c8))
* **site:** center live-example previews ([fd1f2f3](https://github.com/EncryptionL/twico-ui/commit/fd1f2f3faf6f1cc8c337f6274d6ec7b6cca1127b))
* **site:** client-side navigation no longer needs a manual refresh ([12efa0f](https://github.com/EncryptionL/twico-ui/commit/12efa0f388c0b1900543a4d5fb38c99a68136338))
* **site:** contain wide demos + list lazy-loaded variations in the on-this-page TOC ([30dcdb1](https://github.com/EncryptionL/twico-ui/commit/30dcdb1f1808069b556fd82d4661e3115d03231f))
* **site:** correct stale '60 components' claims on the home page to 59 ([9bdd772](https://github.com/EncryptionL/twico-ui/commit/9bdd7721fd2a1925438cdcdc06a714afdbc7694f))
* **site:** dark-mode demo uses useColorScheme (smooth, in sync) ([9fc94e3](https://github.com/EncryptionL/twico-ui/commit/9fc94e3a60671b391e88cbf3047941c3f9f526d2))
* **site:** demo a spinner inside a Button ([f7ee784](https://github.com/EncryptionL/twico-ui/commit/f7ee7848c480366f8520e6adedaab3e495db7e34))
* **site:** give live-demo wrappers a definite width ([f5636a1](https://github.com/EncryptionL/twico-ui/commit/f5636a19ba61f7b932d4edb2a3a597515e05b8de))
* **site:** keep code blocks left-aligned in centered contexts ([52f70e9](https://github.com/EncryptionL/twico-ui/commit/52f70e91cfa65f813477f735f33cb40053e5e141))
* **site:** keep the code block's scrollbar dark in light mode ([fb16201](https://github.com/EncryptionL/twico-ui/commit/fb16201409217bad26548ed2c917bbb66b60c473)), closes [#0b1021](https://github.com/EncryptionL/twico-ui/issues/0b1021)
* **site:** make the JS/TS code toggle's active state obvious ([3355994](https://github.com/EncryptionL/twico-ui/commit/33559949a96bbaeb4e5eee607f11e4b1ceabe103))
* **site:** props table layout so descriptions aren't cut off ([e53225f](https://github.com/EncryptionL/twico-ui/commit/e53225f622c8a3e70ccef214bbb5e83c3b87ba75))
* **site:** restore spacing between elements in live example previews ([f42fa50](https://github.com/EncryptionL/twico-ui/commit/f42fa50fcbb9779cb048662acfcabca80809b629))
* **site:** smooth in-page scroll, TOC spacing, refined Prev/Next pager ([d25294e](https://github.com/EncryptionL/twico-ui/commit/d25294e514e85c587f13ccf5316115a6f58cac03))
* **site:** theme demo triggers, self-host avatar, dogfood library hooks ([2e9f5a3](https://github.com/EncryptionL/twico-ui/commit/2e9f5a34b4a1150bd621182924c57ec4cdbc1ab8))
* **tabs,table:** re-measure indicator on font load; sticky-header z-index ([1c213a5](https://github.com/EncryptionL/twico-ui/commit/1c213a5bc72e0a83d554fa852c56d6d86ed1974e))
* theme native UI in dark mode + re-theme instantly on toggle ([3144b60](https://github.com/EncryptionL/twico-ui/commit/3144b6004dd35f633d838420e31c01d65457e82f))
* Timeline rail connects the dots; Spinner inherits currentColor ([fbc0feb](https://github.com/EncryptionL/twico-ui/commit/fbc0febf8ba618fd06f4204267cc9772331b146c))


### Features

* add a hooks API ([2b24b28](https://github.com/EncryptionL/twico-ui/commit/2b24b287e0b73307b5873c20f6ab2a2a1754e7cd))
* add Box and Code primitives ([7e93331](https://github.com/EncryptionL/twico-ui/commit/7e93331ce70713f584d51123bfdc84d7c2313ad1))
* add layout & typography primitives (Stack, Grid, Container, Heading, Text) ([3b30372](https://github.com/EncryptionL/twico-ui/commit/3b303724fb83ae93f006ec554e6c52881040494e))
* additive component features (size/variant/orientation extensions + API aliases) ([0ce5185](https://github.com/EncryptionL/twico-ui/commit/0ce51856e7ff477e424a9a85a41784ade832f128))
* **card:** add fullHeight prop for equal-height grid cards ([e0eb511](https://github.com/EncryptionL/twico-ui/commit/e0eb5119d63d6bc7684c8560eeff188fb0ae6d63))
* **colors:** add twico-ui/colors export + Material-UI-style Color docs page ([ace538f](https://github.com/EncryptionL/twico-ui/commit/ace538f15dd077c6b168f1109f4f5026b2f23ac9))
* **colors:** complete emerald/amber/rose/sky to full 50–950 ramps ([9e9f534](https://github.com/EncryptionL/twico-ui/commit/9e9f5345513e56e89c201769095d203a87c10a0e))
* **components:** library-wide tone × variant axis (additive) ([2ae0f37](https://github.com/EncryptionL/twico-ui/commit/2ae0f379ff418e202e0a6b70ac09efaa30af32cc))
* **components:** uncontrolled support for Stepper/TreeView/Menu/Popover + typed anchor props ([dcef1e2](https://github.com/EncryptionL/twico-ui/commit/dcef1e215be34cf2c766e85bd736fe677ec7c15c))
* **datatable:** add a "Wrap text" toggle to the column menu ([940f542](https://github.com/EncryptionL/twico-ui/commit/940f5424f8388ca58bddea906369376ff8725f12))
* **datatable:** add an auto-numbering row column (rowNumbers) ([de7393b](https://github.com/EncryptionL/twico-ui/commit/de7393ba225e9177915f5afd97a11f915f7b1ca5))
* **datatable:** double-click a column's resize handle to auto-fit its width ([b488bdd](https://github.com/EncryptionL/twico-ui/commit/b488bddc317d24570b23be51c461e5d3284f58e4))
* **datatable:** export Excel as a real .xlsx (OOXML), not legacy .xls ([a748574](https://github.com/EncryptionL/twico-ui/commit/a748574f3314c6ea343679cbf724e72e986f9494))
* **datatable:** export only CSV and Excel (remove TSV and JSON) ([8f2fddb](https://github.com/EncryptionL/twico-ui/commit/8f2fddbafdbcb37f3c0ed3d96f6b5567aeb58bd1))
* **datatable:** export runDatatableQuery for server-mode backends ([7f2766d](https://github.com/EncryptionL/twico-ui/commit/7f2766da895b300ce901971da8a78188f0a47a86))
* **datatable:** keyboard column reorder via the header menu ([bd2ba65](https://github.com/EncryptionL/twico-ui/commit/bd2ba655624d52bc57166bb2b4611d1f3c5ad780))
* **datatable:** let the row-number column be shown/hidden from the Columns panel ([16da629](https://github.com/EncryptionL/twico-ui/commit/16da629d9f533059e5d68688725880ba83c488c7))
* **datatable:** opt-in row virtualization, keyboard row reorder, ARIA menus ([029c1a7](https://github.com/EncryptionL/twico-ui/commit/029c1a717a631583a4486325aa43e95de823392b))
* **datatable:** pin columns from the Columns panel (reach scrolled-off columns) ([43401d0](https://github.com/EncryptionL/twico-ui/commit/43401d033eef5a302b5c84e84fd38b372f7c6fc9))
* **datatable:** row-number column ⋮ menu; fix collapsed-groups empty state ([74aa8d4](https://github.com/EncryptionL/twico-ui/commit/74aa8d4d2f3e9b49ca695bfb486681c2d1b24b83))
* **datatable:** variable-height row virtualization (measure-and-cache) ([7941766](https://github.com/EncryptionL/twico-ui/commit/79417668058989b6d55a2b38ab968d5e087d54cf))
* **docs:** add documentation website (Vite + React -> GitHub Pages) ([9502a6c](https://github.com/EncryptionL/twico-ui/commit/9502a6c37fc14d7c1c69e3be1c5f4f63eab885e8))
* **drawer:** logical side="start"/"end" that mirror under RTL ([44cb098](https://github.com/EncryptionL/twico-ui/commit/44cb098e4b476b1b320c92a6eee476a90ad32dc6))
* **feedback:** useToast hook + ToastProvider for imperative toasts ([b9066b3](https://github.com/EncryptionL/twico-ui/commit/b9066b3404251e55879b789772956dc160bab418))
* **inputs:** Field wrapper + label/hint/error/required across the input family + DatePicker i18n ([f9ef945](https://github.com/EncryptionL/twico-ui/commit/f9ef945575fbcf5c2ce4f4798db8575ec20eba90))
* **overlays:** smooth open/close + portal to <body> ([e5b63b1](https://github.com/EncryptionL/twico-ui/commit/e5b63b161914972ebccb3262ec5b8832b1cb32c2))
* **props:** standardize the prop vocabulary across components ([8290d7f](https://github.com/EncryptionL/twico-ui/commit/8290d7ff954c14b215afbd58aa1f73e982905ca7))
* RTL readiness via CSS logical properties (+ mirrored nav chevrons) ([68130d1](https://github.com/EncryptionL/twico-ui/commit/68130d155b1355c7a3d19d26c7ecd74c3ce707b7))
* **site:** add Theme builder to the navbar; hide search on the landing page ([39c80d8](https://github.com/EncryptionL/twico-ui/commit/39c80d830e204b7753d08746cac4d0e34e02d0ff))
* **site:** concise component taglines + a Hooks reference page ([1ffd302](https://github.com/EncryptionL/twico-ui/commit/1ffd302ad2e4e8189c9c8d179c7fab4ceaf8b287))
* **site:** copyable anchor/deep links on component headings ([8183f04](https://github.com/EncryptionL/twico-ui/commit/8183f04ec7db11f4fc1fe0ac2454d1297724bcae))
* **site:** full-text search (Cmd/Ctrl+K) ([390a17e](https://github.com/EncryptionL/twico-ui/commit/390a17edec6edc4cc6db3fe9fde5b933d2ca6e56))
* **site:** height-clamp long code snippets so "Expand code" is meaningful ([a4a9f9f](https://github.com/EncryptionL/twico-ui/commit/a4a9f9f368a421d50c5274d4f4417c64d8da455c))
* **site:** index prop names in search so e.g. 'fullWidth' finds Button ([fd2bdc0](https://github.com/EncryptionL/twico-ui/commit/fd2bdc0bfcb113423586886946d8dd2ce1c98b41))
* **site:** JS / TS toggle for code blocks ([f9a5a1f](https://github.com/EncryptionL/twico-ui/commit/f9a5a1f71802fc0f9449966244c79298a34de506))
* **site:** live Variations section on every component page ([832b05b](https://github.com/EncryptionL/twico-ui/commit/832b05bc4aaaded35c4cb176ce2371cc92b7e7bb))
* **site:** per-block JS/TS toggle + expand/collapse code blocks ([b483690](https://github.com/EncryptionL/twico-ui/commit/b4836903ba421a3ec7bf2a9ecea19d08d62333ca))
* **site:** refine the home page layout ([7c6e224](https://github.com/EncryptionL/twico-ui/commit/7c6e22411f32bf25ea03d911c7c4c2c0aabee1ec))
* **site:** search indexes live Variations examples ([522896c](https://github.com/EncryptionL/twico-ui/commit/522896cde71eed28366477de410c7ae0328617ac))
* **site:** smooth page transitions on navigation ([f5c7b0d](https://github.com/EncryptionL/twico-ui/commit/f5c7b0d4d17f7b8da82377e5b91c556fa0e1cb29))
* **site:** Theme Builder + Playground pages ([e811966](https://github.com/EncryptionL/twico-ui/commit/e811966cf222703456c229d881c6363d21b91ab3))
* **toast:** auto-dismiss via duration + ToastViewport limit ([d8d8c6e](https://github.com/EncryptionL/twico-ui/commit/d8d8c6e11b5d352f08e33e8f215ae11ffea5172e))
* **tokens:** density scale, exit-duration token, dark elevation; automate stylesheet + exports ([98119b8](https://github.com/EncryptionL/twico-ui/commit/98119b89341ee0ace51a578625d9fb5bc66d103a))


### BREAKING CHANGES

* IconButton `variant="danger"` is removed — use `tone="danger"`
(pair with `variant="solid"` for the old solid-red look).

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
* Table `data`/`key`/`header`/`render` -> `rows`/`field`/`headerName`/
`renderCell` and TableSort.key -> TableSort.field; Button `variant="danger"` ->
`tone="danger"`; Drawer `size` -> `width`/`height`; TreeView `data` -> `items` and
`onSelect(node)` -> `onSelect(id, node)` (onSelectedIdChange removed).

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
