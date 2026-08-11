# Project brief — Restaurant Ordering & Reservation Platform

> **For a future Claude session.** This is a specification, not an implementation.
> Build it as its own repository, separate from the portfolio site.

## Why this project exists

It is the portfolio's flagship "this is what you can hire me to build" artifact.
Restaurant ordering is the single highest-volume request in freelance SMB markets,
so a prospective client can look at this and see their own business rather than a
generic demo.

It must therefore be **convincingly complete**, not a prototype. A half-built
booking screen actively hurts; a working ordering flow with real payment plumbing
closes work.

## What it is

A platform for a single independent restaurant, covering three distinct users:

| User | Surface | Needs |
|---|---|---|
| Diner | Public site | Browse menu, order for pickup/delivery, book a table |
| Kitchen | Order board | See incoming orders live, advance them through states |
| Owner | Admin | Edit menu and pricing, see takings, manage bookings |

## Scope

**Diner**
- Menu browsing with categories, dietary tags, item modifiers (size, extras)
- Cart with running total, tax and tip
- Stripe Checkout for payment
- Table reservation with real availability — party size, date, time slot, covers cap
- Order confirmation page plus emailed receipt
- Order status tracking by link (no account required — accounts kill SMB conversion)

**Kitchen order board**
- Live queue, newest first, with an audible cue on arrival
- Order states: received → preparing → ready → collected
- Realtime across devices (Supabase realtime or polling; do not hand-roll sockets)
- Designed for a tablet in a hot, busy room: large touch targets, high contrast

**Owner admin**
- Menu CRUD including availability toggles and 86-ing an item
- Opening hours, holiday closures, covers per slot
- Reservation list with search
- Daily/weekly takings summary with a simple chart

## Stack

- React + TypeScript + Tailwind (Vite or Next.js — Next preferred for SEO on the public menu)
- Supabase: Postgres, auth for staff only, realtime for the order board, storage for dish photos
- Stripe Checkout — hosted, so no card data ever touches the app
- Resend or Postmark for transactional email
- Deploy on Vercel

## Data model sketch

```
restaurants   id, name, slug, hours_json, covers_per_slot
menu_items    id, restaurant_id, category, name, description, price_cents,
              dietary_tags[], photo_url, available
modifiers     id, menu_item_id, name, price_delta_cents, group, required
orders        id, restaurant_id, status, customer_name, phone, email,
              type(pickup|delivery), total_cents, stripe_session_id, created_at
order_items   id, order_id, menu_item_id, qty, modifiers_json, line_total_cents
reservations  id, restaurant_id, name, phone, email, party_size, slot_at, status
```

## Things that will go wrong — handle them explicitly

- **Double-booking.** Two diners taking the last table simultaneously. Enforce the
  covers cap in a database transaction, not in application code.
- **Payment succeeded, order not created.** Never create the order on the client's
  success redirect. Use a Stripe webhook as the source of truth and make it idempotent.
- **Price drift.** Never trust prices from the client. Recompute the whole total
  server-side from the database before creating the Stripe session.
- **86'd items mid-order.** Re-validate availability at checkout, not just at add-to-cart.
- **Timezones.** Store UTC, render in the restaurant's timezone. Reservation bugs
  are almost always timezone bugs.

## Definition of done

- A diner can order and pay end to end with a Stripe test card, and the order
  appears on the kitchen board within two seconds
- A diner can book a table and the slot is no longer offered to anyone else
- The owner can 86 an item and it disappears from the public menu immediately
- Lighthouse ≥ 90 on the public menu page
- Seeded demo data so the site is explorable without any setup
- README with a two-command local start

## Portfolio integration

Add to `src/content/projects.ts` on the portfolio, change `status` from `planned`
to `shipped`, and write the `study` blocks. Capture screenshots for the Work
section's hover previews — that section is designed around real imagery.
