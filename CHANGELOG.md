# Changelog

All notable changes to Twico UI are documented here (newest first). This file is generated automatically on each release by [semantic-release](https://semantic-release.gitbook.io/) from [Conventional Commits](https://www.conventionalcommits.org/) — do not edit it by hand. The same notes appear on each [GitHub Release](https://github.com/EncryptionL/twico-ui/releases).

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
