import React from "react";
import { Box, Text } from "twico-ui";

const variations = [
  {
    title: "Backgrounds",
    description: "Surface tokens give layered, theme-aware fills.",
    code: `<Box p={4} bg="surface" border radius="lg">
  <Text>Surface</Text>
</Box>
<Box p={4} bg="surface-raised" radius="lg">
  <Text>Raised</Text>
</Box>
<Box p={4} bg="surface-sunken" radius="lg">
  <Text>Sunken</Text>
</Box>`,
    render: () => (
      <>
        <Box p={4} bg="surface" border radius="lg">
          <Text>Surface</Text>
        </Box>
        <Box p={4} bg="surface-raised" radius="lg">
          <Text>Raised</Text>
        </Box>
        <Box p={4} bg="surface-sunken" radius="lg">
          <Text>Sunken</Text>
        </Box>
      </>
    ),
  },
  {
    title: "Radius",
    description: "Round corners with any radius token suffix.",
    code: `<Box p={4} bg="surface" border radius="sm">
  <Text>sm</Text>
</Box>
<Box p={4} bg="surface" border radius="lg">
  <Text>lg</Text>
</Box>
<Box p={4} bg="surface" border radius="2xl">
  <Text>2xl</Text>
</Box>`,
    render: () => (
      <>
        <Box p={4} bg="surface" border radius="sm">
          <Text>sm</Text>
        </Box>
        <Box p={4} bg="surface" border radius="lg">
          <Text>lg</Text>
        </Box>
        <Box p={4} bg="surface" border radius="2xl">
          <Text>2xl</Text>
        </Box>
      </>
    ),
  },
  {
    title: "Shadow",
    description: "Lift a box off the page with a shadow token.",
    code: `<Box p={4} bg="surface" radius="lg" shadow="sm">
  <Text>sm</Text>
</Box>
<Box p={4} bg="surface" radius="lg" shadow="md">
  <Text>md</Text>
</Box>
<Box p={4} bg="surface" radius="lg" shadow="lg">
  <Text>lg</Text>
</Box>`,
    render: () => (
      <>
        <Box p={4} bg="surface" radius="lg" shadow="sm">
          <Text>sm</Text>
        </Box>
        <Box p={4} bg="surface" radius="lg" shadow="md">
          <Text>md</Text>
        </Box>
        <Box p={4} bg="surface" radius="lg" shadow="lg">
          <Text>lg</Text>
        </Box>
      </>
    ),
  },
  {
    title: "Padding & margin",
    description: "Per-side spacing props take a spacing step or any CSS length.",
    code: `<Box px={6} py={3} bg="surface" border radius="lg">
  <Text>px=6 py=3</Text>
</Box>
<Box p={2} mt={4} bg="surface-sunken" radius="lg">
  <Text>p=2 mt=4</Text>
</Box>`,
    render: () => (
      <>
        <Box px={6} py={3} bg="surface" border radius="lg">
          <Text>px=6 py=3</Text>
        </Box>
        <Box p={2} mt={4} bg="surface-sunken" radius="lg">
          <Text>p=2 mt=4</Text>
        </Box>
      </>
    ),
  },
  {
    title: "Custom tag",
    description: "Render any element with the `as` prop while keeping token styling.",
    code: `<Box as="section" p={5} bg="surface" border radius="xl" shadow="sm">
  <Text>I am a &lt;section&gt;</Text>
</Box>`,
    render: () => (
      <Box as="section" p={5} bg="surface" border radius="xl" shadow="sm">
        <Text>I am a &lt;section&gt;</Text>
      </Box>
    ),
  },
];

export default variations;
