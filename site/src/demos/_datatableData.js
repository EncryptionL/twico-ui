// Shared, DETERMINISTIC dataset for the Datatable demos.
// Everything is derived from the row index `i` — no Math.random / Date.now —
// so the render-check and visual-regression snapshots stay stable.

const ROLES = ["Admin", "Editor", "Viewer"];
const DEPARTMENTS = ["Engineering", "Design", "Sales", "Marketing", "Support", "Finance"];
const STATUSES = ["active", "invited", "suspended"];
const COUNTRIES = ["US", "GB", "DE", "ID", "JP", "BR", "CA", "AU"];

const FIRST = [
  "Ava", "Liam", "Noah", "Mia", "Eli", "Zoe", "Owen", "Nora",
  "Leo", "Ivy", "Max", "Ella", "Finn", "Ruby", "Cole", "Lena",
];
const LAST = [
  "Stone", "Reed", "Park", "Cruz", "Voss", "Hale", "Frey", "Lund",
  "Mora", "Kane", "Webb", "Diaz", "Yang", "Roth", "Vance", "Lowe",
];

/**
 * Build a deterministic array of `n` people. Every field is a pure function of
 * the index `i`, so the same `n` always yields byte-identical data.
 * @param {number} [n=48]
 */
export function makePeople(n = 48) {
  const people = [];
  for (let i = 0; i < n; i++) {
    const first = FIRST[i % FIRST.length];
    const last = LAST[(i * 7 + 3) % LAST.length];
    const name = `${first} ${last}`;
    const handle = `${first}.${last}`.toLowerCase();
    const role = ROLES[i % ROLES.length];
    const department = DEPARTMENTS[i % DEPARTMENTS.length];
    const status = STATUSES[(i * 5 + 1) % STATUSES.length];
    const country = COUNTRIES[i % COUNTRIES.length];

    const seats = ((i * 3 + 1) % 40) + 1;            // 1..40
    const mrr = 40 + ((i * 37) % 471);               // 40..510
    const salary = 60000 + ((i * 4300) % 90001);     // 60k..150k
    const score = 41 + ((i * 13) % 59);              // 41..99

    // startDate: deterministic spread across a few years, "YYYY-MM-DD".
    const year = 2021 + (i % 4);                     // 2021..2024
    const month = ((i * 5) % 12) + 1;                // 1..12
    const day = ((i * 7) % 28) + 1;                  // 1..28
    const startDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    people.push({
      id: i + 1,
      name,
      email: `${handle}@twico.io`,
      role,
      department,
      status,
      country,
      seats,
      mrr,
      salary,
      score,
      startDate,
    });
  }
  return people;
}

/** Format a number as a US-dollar string. */
export const usd = (n) => "$" + Number(n).toLocaleString("en-US");

/** Map a status value to a Badge tone. */
export const STATUS_TONE = { active: "success", invited: "info", suspended: "danger" };
