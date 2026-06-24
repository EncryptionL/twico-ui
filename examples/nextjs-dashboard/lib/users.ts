import type { User } from "./types";

// ---------------------------------------------------------------------------
// Mock user store.
//
// DEMO ONLY — passwords are stored in plaintext and the "database" is an
// in-memory array. In a real app this would be a database with hashed
// passwords (argon2/bcrypt). The point of this example is the auth + RBAC
// *flow*, not credential storage.
// ---------------------------------------------------------------------------

interface UserRecord extends User {
  password: string;
}

const RECORDS: UserRecord[] = [
  {
    id: "u_admin",
    name: "Ada Lovelace",
    email: "admin@twico.dev",
    password: "demo1234",
    role: "admin",
    title: "Platform Owner",
    department: "Engineering",
    status: "active",
    joinedAt: "2024-01-09",
  },
  {
    id: "u_manager",
    name: "Max Mendez",
    email: "manager@twico.dev",
    password: "demo1234",
    role: "manager",
    title: "Team Lead",
    department: "Design",
    status: "active",
    joinedAt: "2024-03-21",
  },
  {
    id: "u_member",
    name: "Mia Chen",
    email: "member@twico.dev",
    password: "demo1234",
    role: "member",
    title: "Product Engineer",
    department: "Engineering",
    status: "active",
    joinedAt: "2024-06-02",
  },
  {
    id: "u_4",
    name: "Liam Novak",
    email: "liam@twico.dev",
    password: "demo1234",
    role: "member",
    title: "Designer",
    department: "Design",
    status: "active",
    joinedAt: "2024-07-15",
  },
  {
    id: "u_5",
    name: "Zoe Park",
    email: "zoe@twico.dev",
    password: "demo1234",
    role: "manager",
    title: "Sales Lead",
    department: "Sales",
    status: "active",
    joinedAt: "2024-08-30",
  },
  {
    id: "u_6",
    name: "Owen Reed",
    email: "owen@twico.dev",
    password: "demo1234",
    role: "member",
    title: "Support Specialist",
    department: "Support",
    status: "invited",
    joinedAt: "2025-01-12",
  },
  {
    id: "u_7",
    name: "Nora Frey",
    email: "nora@twico.dev",
    password: "demo1234",
    role: "member",
    title: "Marketing Associate",
    department: "Marketing",
    status: "suspended",
    joinedAt: "2025-02-25",
  },
  {
    id: "u_8",
    name: "Eli Stone",
    email: "eli@twico.dev",
    password: "demo1234",
    role: "member",
    title: "Finance Analyst",
    department: "Finance",
    status: "active",
    joinedAt: "2025-04-08",
  },
];

const strip = ({ password: _password, ...user }: UserRecord): User => user;

/** All users, without passwords — for the Users admin table. */
export function listUsers(): User[] {
  return RECORDS.map(strip);
}

export function findUserByEmail(email: string): User | undefined {
  const record = RECORDS.find((u) => u.email.toLowerCase() === email.toLowerCase());
  return record ? strip(record) : undefined;
}

export function findUserById(id: string): User | undefined {
  const record = RECORDS.find((u) => u.id === id);
  return record ? strip(record) : undefined;
}

/** Returns the (password-stripped) user when credentials match, else null. */
export function verifyCredentials(email: string, password: string): User | null {
  const record = RECORDS.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!record || record.password !== password) return null;
  return strip(record);
}
