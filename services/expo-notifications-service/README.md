# Expo Notification Service

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"title":"Notfi Title", "body": "Notfi Body", "toEventLinkId": "edecec82d"}' \
  http://127.0.0.1:8080/send/user/user_2ZD8UpF0NxOoT6BJ08vX5DRvbLZ
```

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"title":"Notfi Title", "body": "Notfi Body", "toEventLinkId": "edecec82d"}' \
  https://us-central1-vibefire-prod-x.cloudfunctions.net/expo-notifications-service/send/user/user_2ZMC8dTLfkmaxZuqVmu59ALHtrN
```
