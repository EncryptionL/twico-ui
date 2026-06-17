# QA notes — Timeline

- **Group:** data-display
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

(none)

## Verified OK

- **Rail + line connection:** Rail is 32px wide, dot is centered (32×32px). Line extends from top of dot (32px) through the spacing (space-6 + 8px) into next dot, ensuring visual connection without gaps.
- **Dot tones (primary/info/success/warning/danger):** Each sets background + border to the tone color, with matching foreground text color. Neutral dots remain surface/border-strong.
- **Icon inside dot:** Icon is aria-hidden (visual decoration), centered in the 32px dot.
- **Title + time layout:** Flex row with space-between; time is nowrap + muted color (right-aligned).
- **Description styling:** Below title, muted color, leading-snug (readable).
- **Last item:** Line hidden via display: none on :last-child .twc-timeline__line.
- **Item spacing:** Bottom padding (space-6 = 24px) between items maintains rhythm.
- **Accessibility:** Title is semantic text. Icon is aria-hidden="true". Time is auxiliary info. List structure <ul> → <li>.
- **RTL:** No physical positioning; safe.
