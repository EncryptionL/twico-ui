import React, { useState } from "react";
import { Pagination } from "twico-ui";

export default function PaginationDemo() {
  const [page, setPage] = useState(1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
      <div>Page {page} of 12</div>
      <Pagination
        page={page}
        total={12}
        onChange={setPage}
        siblings={1}
        boundaries={1}
        size="md"
        showJumper
        jumperLabel="Go to"
      />
    </div>
  );
}
