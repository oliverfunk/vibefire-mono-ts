# How to run stuff

## Testing

To run hookdeck locally to test:

`hookdeck listen 8787 clerk-dev`

start handle.vibefire.app:

`bun run dev`

## Deploying

Make sure the correct keys/secretes have been set

Be logged into an account that can deploy

Run

```bash
bunx wrangler deploy
```

## Uploading secrete from the CLI

Run

```bash
bunx wrangler secret put <SECRET_NAME>
```

Follow the instructions.

- Or use the web UI

## Tailing logs
