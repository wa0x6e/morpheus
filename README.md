# Morpheus

Morpheus is the snapshot's service responsible for hibernating spaces.

## Project Setup

### Requirements

node "^18.0.0"

### Dependencies

Install the dependencies

```bash
yarn
```

_This project does not require a database, nor any form of storage_


### Configuration

Copy `.env.example`, rename it to `.env` and fill the required values.

### Compiles and hot-reloads for development

```bash
yarn dev
```

## Usage

Each space will be checked, and marked for hibernation, based on a set of rules.

### Rules

- `INACTIVE` : spaces that never had any activities, and are older than 2 months
- `STALE`: spaces that have not been active in the last 6 months
- `MISCONFIGURED`: space that have a wrong setup and no activity in the last 2 months

#### Wrong setup is defined as:
-  ticket strategy without validation
-  using testnet on [snapshot.org](http://snapshot.org)
-  don’t have proposal validation / authors only

This service will run a cron job (every 6 hours), to check and mark spaces for hibernation.

Additionally, a few `/api` endpoints are available:

### Preview the list of spaces that will be marked for hibernation

Return a list of spaces, which will be marked for hibernation, categorized by rule.

Send a `POST` request to `/api/preview`

```bash
curl -X POST localhost:3005/api/preview
```

Will return for following JSON object

```json
{
  "count":14852,
  "spaces": {
    "MISCONFIGURED": [
      {         
        "id":"colony3.eth",
        "proposalsCount":0,
        "created_at":1681274586,
        "network":"97",
        "hibernating":false,
        "strategies":[{"name":"ticket"}],
        "voteValidation":{"name":"any"}
      },
      ...spaces
    ],
    "INACTIVE": [...spaces],
    "STALE": [...spaces],
  }
}
```

This list if for read only, and this endpoint does not trigger any write action.

### Reactivate a space

Reactivate a space, which has been marked as hibernating due to misconfiguration.

Send a `POST` request to `/api/reactivate`, with the space ID in the body

```bash
curl -X POST localhost:3005/api/reactivate \
-H "Content-Type: application/json" \
-d '{"id": "[SPACE-ID]"}'
```

This endpoint will return the following JSON response:

```json
{ "result": true }
```

`result` will be:
- `true` if the space has been reactivated
- `false` otherwise (because the space is still misconfigured)

### Check if a space can be marked for hibernation

Check if the given space can be marked for hibernation.

Send a `POST` request to `/api/check`, with the space ID in the body

```bash
curl -X POST localhost:3005/api/check \
-H "Content-Type: application/json" \
-d '{"id": "[SPACE-ID]"}'
```

This endpoint is used by the front-end, to retrieve the reason why a space is marked as hibernating.

This endpoint will return the following JSON response:

```json
{"hibernate":true,"reason":"MISCONFIGURED"}
```

## Linting, typecheck

```bash
yarn lint
yarn typecheck
```

## Build for production

```bash
yarn build
yarn start
```

## License

[MIT](LICENCE)
