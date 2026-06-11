import React, { useState } from "react";
import { Combobox } from "twico-ui";

const options = [
  { group: "Asia", options: [
    { value: "id", label: "Indonesia", description: "Jakarta" },
    { value: "jp", label: "Japan", description: "Tokyo" },
  ]},
  { group: "Europe", options: [
    { value: "de", label: "Germany", description: "Berlin" },
    { value: "fr", label: "France", description: "Paris" },
  ]},
];

export default function ComboboxDemo() {
  const [country, setCountry] = useState(null);
  return (
    <div style={{ maxWidth: 320 }}>
      <Combobox
        label="Country"
        placeholder="Search a country"
        hint="Type to filter the list"
        clearable
        value={country}
        onChange={setCountry}
        options={options}
      />
    </div>
  );
}
