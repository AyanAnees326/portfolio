# Project brief — Ride Companion (React Native)

> **For a future Claude session.** This is a specification, not an implementation.
> Build it as its own repository, separate from the portfolio site.

## Why this project exists

Two jobs at once:

1. **Prove mobile capability.** The portfolio claims React Native. A claim with no
   artifact behind it is the weakest thing on a portfolio, and technical
   interviewers check.
2. **Be authentically the developer's.** This is a motorcyclist's app built by a
   motorcyclist. That is a better story than another to-do list, and the About
   section on the portfolio already sets it up.

**The critical design constraint:** it must do things a web app fundamentally
cannot. Background GPS, offline maps, local notifications, sensor access. If this
could have been a website, it fails its purpose.

## What it is

A companion app for motorcyclists covering three things riders actually do.

**1. Ride recording**
- Start/stop a ride; track route via GPS with background location
- Live stats: distance, duration, moving average, max speed, elevation
- Route drawn on a map, replayable afterwards
- Works with no signal — everything local-first, sync later

**2. Garage & maintenance**
- Multiple bikes, each with make/model/year/photo and current odometer
- Service log: oil, chain, tyres, brakes, valve clearance — date, mileage, cost, notes
- Interval reminders based on mileage *or* time, whichever comes first
- Running cost per bike and cost per mile

**3. Group rides**
- Create a ride: meeting point, time, planned route
- Share via link; others RSVP
- Day-of: see other riders' positions on the map while the ride is active

## Stack

- Expo (managed workflow) + TypeScript — bare RN is not worth the pain here
- `expo-location` with background permissions
- `react-native-maps`, or Mapbox if offline tiles are needed
- SQLite via `expo-sqlite` or WatermelonDB — **local-first is non-negotiable**,
  riders lose signal constantly
- Supabase for sync and group rides only, never as the primary store
- `expo-notifications` for maintenance reminders
- EAS Build for store submission

## Things that will go wrong — handle them explicitly

- **Background location is the whole project.** iOS and Android both fight you.
  Get `Always` permission with a clear rationale screen, handle revocation
  mid-ride, and test with the screen locked. Budget serious time here.
- **Battery drain.** A ride tracker that eats 40% per hour gets deleted. Tune the
  accuracy/interval trade-off; do not poll at highest accuracy continuously.
- **GPS drift while stationary.** Traffic lights will accumulate phantom distance.
  Apply a speed threshold before accruing.
- **Sync conflicts.** Two devices editing the same bike offline. Last-write-wins
  per field is fine — just decide deliberately rather than discovering it.
- **Store review.** Background location requires justification to Apple. Write it
  before submitting, and record a demo video.

## Definition of done

- Record a real 30+ minute ride with the screen locked; route and stats are correct
- Airplane mode: log maintenance, view past rides, start a new ride — all work
- A maintenance reminder fires on schedule
- Two devices see each other on a shared group ride
- Runs on both a physical iPhone and a physical Android device
- Battery use under ~10% per hour of tracking

## Portfolio integration

Add to `src/content/projects.ts`, flip `status` to `shipped`, write the `study`
blocks. Record a screen capture of a ride in progress — the Work section's hover
previews take images, and a moving map is the most compelling frame this project has.
