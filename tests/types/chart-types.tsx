// Compile-only guard for #166: Chart is generic over its series keys, so data rows
// are type-checked. Typechecked by `npm run typecheck` (tests/types is in include).
import { Chart } from "../../src";

// valid: the series key matches the data field
const ok = <Chart series={["sales"]} data={[{ label: "Mon", sales: 1 }]} />;

// @ts-expect-error — data is missing the required "sales" field
const missing = <Chart series={["sales"]} data={[{ label: "Mon", revenue: 1 }]} />;

// @ts-expect-error — "sales" must be a number, not a string
const wrongType = <Chart series={["sales"]} data={[{ label: "Mon", sales: "1200" }]} />;

// default (no series) still works with the "value" key
const dflt = <Chart data={[{ label: "Mon", value: 5 }]} />;

void [ok, missing, wrongType, dflt];
