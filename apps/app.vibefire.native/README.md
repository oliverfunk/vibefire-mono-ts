# Vibefire mobile app

## Development Client build

```bash
eas build --profile development --platform all
```

Or for the simulator

```bash
eas build --profile development-simulator --platform all
```

## Preview build

This lets you create a full, standalone app that can be installed
via a url

```bash
eas build --profile preview --platform all
```

## Production build

This lets you create a full, standalone app that can be installed
via a url

```bash
eas build --profile production --platform all
```

## To re-sign a build

This lets you sign a build for another device

```bash
eas build:resign
```

## To submit to an app store

```bash
eas submit -p android --profile internal
eas submit -p ios --profile internal

# OR

eas submit -p android --profile production
eas submit -p ios --profile production
```
