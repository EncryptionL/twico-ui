import React from "react";
import { CardGrid, Card, Heading, Text, Badge } from "twico-ui";

const PRODUCTS = [
  { id: 1, name: "Aurora Lamp", price: 89, category: "Lighting" },
  { id: 2, name: "Nimbus Chair", price: 240, category: "Seating" },
  { id: 3, name: "Vega Desk", price: 420, category: "Desks" },
  { id: 4, name: "Orion Shelf", price: 160, category: "Storage" },
  { id: 5, name: "Lyra Rug", price: 130, category: "Textiles" },
  { id: 6, name: "Cassia Sofa", price: 980, category: "Seating" },
  { id: 7, name: "Draco Stool", price: 70, category: "Seating" },
  { id: 8, name: "Mira Planter", price: 45, category: "Decor" },
  { id: 9, name: "Atlas Table", price: 540, category: "Desks" },
  { id: 10, name: "Halo Mirror", price: 210, category: "Decor" },
  { id: 11, name: "Fern Bench", price: 320, category: "Seating" },
  { id: 12, name: "Nova Cabinet", price: 610, category: "Storage" },
  { id: 13, name: "Comet Clock", price: 55, category: "Decor" },
  { id: 14, name: "Solis Sconce", price: 95, category: "Lighting" },
];

export default function CardGridDemo() {
  return (
    <CardGrid
      rows={PRODUCTS}
      rowKey="id"
      minChildWidth="15rem"
      pageSize={6}
      pageSizeOptions={[6, 12, 24]}
      searchable
      searchPlaceholder="Search products…"
      sortOptions={[
        { field: "name", label: "Name" },
        { field: "price", label: "Price", type: "number" },
      ]}
      renderCard={(p) => (
        <Card style={{ height: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Heading level={4} style={{ margin: 0 }}>{p.name}</Heading>
            <Badge variant="soft" size="sm" tone="neutral">{p.category}</Badge>
            <Text tone="muted" style={{ marginTop: 4 }}>${p.price}</Text>
          </div>
        </Card>
      )}
    />
  );
}
