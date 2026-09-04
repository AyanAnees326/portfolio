# Deployment and provider setup

The canonical production URL is `https://portfolio-tau-tan-99.vercel.app`. Deploy from the repository root with Vercel's Git integration or `vercel --prod`; the build command and SPA rewrites are already defined in `vercel.json`.

## Environment variables

Add values in **Vercel → Project → Settings → Environment Variables**. Apply provider credentials to Production and the preview origins you actively test. Never commit a populated `.env` file and never paste credentials into chat, issues, or screenshots.

### Contact form

1. Create a Web3Forms access key routed to `ayananees326@gmail.com`.
2. Add it as `VITE_WEB3FORMS_KEY` in Vercel.
3. Redeploy because `VITE_` values are injected at build time. Web3Forms keys are browser-visible identifiers; protect delivery with Web3Forms domain restrictions and spam controls.
4. Submit one synthetic enquiry after deployment and confirm the success state and inbox delivery. Also test a blocked request to verify the retry/email fallback copy.

### Databricks (tier 1)

1. Create a dedicated service principal for this portfolio assistant.
2. Grant it `CAN_QUERY` only on the chosen model-serving endpoint; do not grant workspace-wide access and do not use a personal PAT.
3. Add `DATABRICKS_HOST`, `DATABRICKS_ENDPOINT`, `DATABRICKS_CLIENT_ID`, and `DATABRICKS_CLIENT_SECRET` in Vercel.
4. The function exchanges those OAuth credentials server-side, caps replies at 400 tokens, and times out the provider call. No Databricks value may use a `VITE_` prefix.

### OpenRouter (tier 2)

1. Create a restricted OpenRouter key with a conservative credit limit.
2. Add it as `OPENROUTER_API_KEY` in Vercel.
3. The endpoint uses it only after Databricks fails and selects currently free models. If both providers fail, the browser returns a transparent scripted offline answer.

### Allowed origins

The canonical domain and local port 5173 are built in. Add any Vercel preview URLs that should call `/api/chat` to `CHAT_ALLOWED_ORIGINS` as a comma-separated list. Do not use `*`.

## Durable rate limiting

The function includes a best-effort per-instance limit, but serverless instances do not share memory. Before public launch, create a Vercel Firewall rate-limit rule for `POST /api/chat`:

- Identify by source IP.
- Start at 10 requests per minute with a one-minute block.
- Exclude verified internal monitoring only if needed.
- Monitor 429s and provider spend, then tighten rather than raising the model token cap.

Keep the endpoint's origin check, six-turn history limit, strict payload lengths, provider timeouts, and 400-token response cap even after the firewall rule is active.

## Launch verification

Run `npm ci`, `npm run check`, `npm audit --audit-level=high`, and `npm run test:e2e`. Then verify direct loading of `/garage` and both `/work/*` routes, the résumé response, social preview image, real Web3Forms delivery, Databricks responses, OpenRouter fallback, and scripted offline mode.
