import React, { useState } from "react";
import { Input } from "twico-ui";

export default function InputDemo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const valid = email === "" || email.includes("@");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 360 }}>
      <Input
        label="Email"
        type="email"
        placeholder="you@twico.dev"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={valid ? undefined : "Enter a valid email address"}
        hint="We'll never share your email."
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input label="Amount" size="sm" rightIcon={<span>USD</span>} placeholder="0.00" />
    </div>
  );
}
