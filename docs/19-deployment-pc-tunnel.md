# 19 — Deployment runbook: PC-hosted game server via Cloudflare Tunnel (free trial)

**Decision (Gábor, 2026-10-25):** before paying for an always-on server, the authoritative
game server runs on Gábor's **PC**, published to the internet through a **Cloudflare Tunnel**
(free plan). The laptop stays out of the loop — friends reach the game from anywhere, from
`https://` share-links, whether or not the laptop is on. Later (beta growth) the exact same
server moves to a ~€5/mo VPS; only the tunnel gets replaced (by Caddy TLS). See docs/17 § next steps.

## Architecture

```
friends' browsers
   │  https://lastorbit.<domain>/   ← the built web client (static, PC port 4173)
   │  wss://play.<domain>/          ← the authoritative Colyseus server (PC port 2567)
   ▼
Cloudflare edge (free plan, TLS terminates here — no certificates to manage)
   ▼
cloudflared connector (tiny service on the PC, auto-starts with the PC)
   ▼  http://localhost:4173   http://localhost:2567
```

One-time cost: moving the domain's DNS to Cloudflare (free). Monthly cost: **0 €**.
Load is a non-issue (turn-based, 2–5 players/room; one Node process hosts many rooms).

## Part A — what must NOT break: email / existing website on the domain ⚠️

Cloudflare Tunnel hostnames only work for a domain whose **DNS zone lives on Cloudflare**.
Adding the domain to Cloudflare therefore changes its nameservers.

- If the domain (Bluehost) hosts **email** or a **website** you still use:
  1. In Bluehost cPanel → **Zone Editor**: export / screenshot **every DNS record**
     (especially MX and TXT/SPF — that's the mail).
  2. Recreate all of them in Cloudflare (DNS → Records) **exactly** (same names, values,
     types; leave the orange-cloud proxy OFF for MX-related records — they can't be proxied anyway).
  3. Only then change the nameservers at the registrar to the two Cloudflare assigns
     (Cloudflare shows them during "Add a site"). Registration stays at Bluehost — only
     DNS hosting moves. Mail keeps working if the records were copied faithfully.
- If the domain is unused for mail/site: just add it, nothing to copy.
- Zero-risk alternative for a same-evening test: `cloudflared tunnel --url http://localhost:2567`
  prints a random `*.trycloudflare.com` URL — works instantly, no account, **but the URL changes
  on every restart**, so it's for testing only, not sharing.

## Part B — one-time setup on the PC (Windows/macOS/Linux, ~30 min)

1. **Node 20+ and git** (nodejs.org, git-scm.com).
2. **Get the code:** `git clone https://github.com/gabortardos/last-orbit-game-glm-style.git`
   (needs the latest commit pushed), or copy the project folder from the laptop.
3. **Install + build:** in the project root —
   ```bash
   npm ci
   npm run build        # builds the web client (apps/hotseat → dist/)
   ```
4. **Cloudflare account** (free): dash.cloudflare.com → Add site → the domain → Free plan
   → follow Part A for records/nameservers.
5. **Create the tunnel (dashboard GUI, no CLI):** Cloudflare Zero Trust (one-click from the
   dashboard) → **Networks → Tunnels → Create a tunnel → Cloudflared** → name it
   `last-orbit-pc` → download and run the connector installer for the PC's OS.
   It installs as a **service**: starts with the PC, reconnects on its own.
6. **Public hostnames** on the tunnel (two entries):
   - `play.<domain>` → Service **HTTP** → `localhost:2567` (game server; WebSockets just work)
   - `lastorbit.<domain>` → Service **HTTP** → `localhost:4173` (web client)
7. **Keep the PC awake:** disable sleep (Windows: Settings → Power; the tunnel and Node
   survive reboots only if the two servers below auto-start — see Part C).

## Part C — every time the PC runs (make it automatic)

Two processes on the PC; both only need to be running when a match is on:

```bash
npm run server                          # game server  → :2567  (tsx src/main.ts)
npm run preview -w apps/hotseat -- --host  # web client   → :4173  (serves the built dist/)
```

Optional auto-start (survives reboots, restarts on crash): `npm i -g pm2` then
`pm2 start npm --name lo-server -- run server` and `pm2 start npm --name lo-web -- run preview -w apps/hotseat -- --host`, `pm2 save`, `pm2 startup`.
(If either process is down, friends see the friendly "Can't reach the server" message —
nothing silent.)

## Part D — sharing the game (one-click links)

The client accepts `?server=` in its URL and remembers it in the browser:

```
https://lastorbit.<domain>/?server=wss%3A%2F%2Fplay.<domain>
```

Friends open that link → 🌐 Online → Host/Join — the Server field is already filled in.
Once visited, the address persists (localStorage), so later they can just open the site.
Implementation: `initialEndpointFrom()` in `apps/hotseat/src/online/net.ts` (tested).

## Part E — who does what next session

- **Gábor (needs his hands on the PC):** Parts A–B; decisions: which domain, whether its
  mail must survive; push access for the repo (`git push` from the laptop).
- **Aide:** walk through Part A/B live; verify end-to-end (phone on mobile data joining a
  match on the PC); then optionally wire a `VITE_SERVER_URL` build default so the Server
  field can disappear entirely later.
- **Later (beta growth):** move Part C's two processes to a Hetzner/DigitalOcean/Fly box
  (~€5/mo), replace the tunnel with Caddy automatic TLS, keep the same share-links.
