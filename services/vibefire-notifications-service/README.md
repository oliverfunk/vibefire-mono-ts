
# VibeFire Notifications Service

## local

Run test:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"title":"Notfi Title", "body": "Notfi Body"}' \
  http://localhost:8787/send/user/<user_aid>
```

Check receipt:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"title":"Notfi Title", "body": "Notfi Body"}' \
  http://localhost:8787/check/<reciept_id>
```

## deployed

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Vibefire-Notifications-Auth-Token: ***REMOVED***" \
  -d '{"title":"big remote", "body": "hello"}' \
  https://webhooks.vibefire.app/eMFLssyIDapK/send/user/user_2s7OHOnEPV9JrIst823Iz1yESLg
```
