// Compile-only fixture for #55 — the polymorphic primitives infer their props and
// ref type from `as`. `@ts-expect-error` lines assert that invalid combos are rejected.
import * as React from "react";
import { Box, Stack, Grid, Container, Text, Heading } from "../../src/index";

export function polymorphicFixture() {
  const anchorRef = React.useRef<HTMLAnchorElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const divRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Default element: div props + own style props. */}
      <Box p={4} bg="surface" ref={divRef} onClick={() => {}} />

      {/* as="a" contributes anchor attributes and an HTMLAnchorElement ref. */}
      <Box as="a" href="/docs" target="_blank" rel="noreferrer" ref={anchorRef} p={2} />

      {/* as="button" contributes button-only attributes (type/disabled) and its ref. */}
      <Stack as="button" type="submit" disabled ref={buttonRef} gap={2} direction="row" />

      {/* Own props still apply through any element. */}
      <Grid as="section" columns={3} minChildWidth={200} />
      <Container as="main" size="lg" padded />
      <Text as="label" htmlFor="field" size="sm" tone="muted" />
      <Heading as="h1" level={1} size="4xl" />

      {/* as={Component} accepts that component's props. */}
      <Text as={CustomLink} to="/home" size="lg" />

      {/* Own props are enforced on the default element too: */}
      {/* @ts-expect-error — href is not valid on the default div element */}
      <Box href="/nope" />
      {/* @ts-expect-error — size is Text's token union; a number is not assignable */}
      <Text size={5} />

      {/* Element-specific attributes are enforced once `as` narrows the element: */}
      {/* @ts-expect-error — `disabled` is a button attribute, not valid on an anchor */}
      <Box as="a" disabled />
      {/* @ts-expect-error — an anchor ref cannot receive an HTMLButtonElement ref */}
      <Box as="a" ref={buttonRef} />
      {/* @ts-expect-error — `to` is required by CustomLink */}
      <Box as={CustomLink} />
    </>
  );
}

function CustomLink(props: { to: string; children?: React.ReactNode; size?: string }) {
  return <a href={props.to}>{props.children}</a>;
}
