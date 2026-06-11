import React, { useState } from "react";
import { Textarea } from "twico-ui";

export default function TextareaDemo() {
  const [bio, setBio] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 360 }}>
      <Textarea
        label="Bio"
        required
        rows={4}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Tell us about yourself"
        hint="Max 280 characters"
      />
      <Textarea
        label="Feedback"
        rows={3}
        placeholder="What went wrong?"
        error="This field is required"
      />
    </div>
  );
}
