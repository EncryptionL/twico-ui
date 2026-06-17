# Per-component QA notes

One file per component, from a deep, runtime-aware review of all 61 components
(positioning/clipping, focus & keyboard, edge inputs, RTL, SSR, reduced-motion, API).
Each file lists **Open issues** (checkboxes) and **Verified OK** behaviors.

**Workflow:** notes are written first (this directory), then fixed component-by-component;
fixed items get checked off (`- [x]`) and the file's `Status` flips to `clean`. Items marked
`[deferred]` are accepted larger efforts (e.g. full Datatable RTL).

> Already-fixed-before-this-pass items (overlay portal/anchoring, the earlier a11y/RTL batch,
> tone × variant) are intentionally **not** relisted here — these notes are the *remaining* work.

## Index

**Buttons & actions:** [Button](./Button.md) · [IconButton](./IconButton.md)
**Layout:** [Box](./Box.md) · [Container](./Container.md) · [Grid](./Grid.md) · [Stack](./Stack.md) · [Divider](./Divider.md)
**Typography:** [Heading](./Heading.md) · [Text](./Text.md) · [Code](./Code.md)
**Inputs:** [Input](./Input.md) · [Textarea](./Textarea.md) · [Field](./Field.md) · [Select](./Select.md) · [Combobox](./Combobox.md) · [MultiSelect](./MultiSelect.md) · [Checkbox](./Checkbox.md) · [Radio](./Radio.md) · [Switch](./Switch.md) · [Slider](./Slider.md) · [Rating](./Rating.md) · [Currency](./Currency.md) · [CurrencyField](./CurrencyField.md) · [DatePicker](./DatePicker.md) · [DateRangePicker](./DateRangePicker.md) · [ColorPicker](./ColorPicker.md) · [FileUpload](./FileUpload.md)
**Data display:** [Card](./Card.md) · [Avatar](./Avatar.md) · [AvatarMenu](./AvatarMenu.md) · [Badge](./Badge.md) · [Tag](./Tag.md) · [Stat](./Stat.md) · [List](./List.md) · [Timeline](./Timeline.md) · [Chart](./Chart.md) · [Table](./Table.md) · [Pagination](./Pagination.md) · [Datatable](./Datatable.md) · [Kanban](./Kanban.md) · [Carousel](./Carousel.md)
**Navigation:** [Tabs](./Tabs.md) · [Accordion](./Accordion.md) · [Breadcrumb](./Breadcrumb.md) · [Stepper](./Stepper.md) · [Navbar](./Navbar.md) · [Sidebar](./Sidebar.md) · [TreeView](./TreeView.md)
**Overlay:** [Tooltip](./Tooltip.md) · [Popover](./Popover.md) · [Menu](./Menu.md) · [Dialog](./Dialog.md) · [Drawer](./Drawer.md) · [CommandPalette](./CommandPalette.md)
**Feedback:** [Alert](./Alert.md) · [Spinner](./Spinner.md) · [Progress](./Progress.md) · [Skeleton](./Skeleton.md) · [Toast](./Toast.md) · [ToastProvider](./ToastProvider.md) · [EmptyState](./EmptyState.md)
