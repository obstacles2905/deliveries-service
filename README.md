# Chimplie assignment task

## Description

A Node.js service which fetches and calculates averages of Kavall delivery times. Clients
specify between which dates they want to look at.

## Endpoints

### Deliveries

1. GET /deliveryAverages - calculate the total number of deliveries and the average delivery time, by store, for the given period

## Environment
Required environment variables
```bash
NODE_ENV

DELIVERIES_API_URL

APPLICATION_PORT
```

You can change them in the .env file

## How to run

1. Install dependencies with:

```bash
yarn install
```

2. Start an application

```bash
yarn watch-ts
```

After performing those operations a server will start. A default port is 8080.

## Tests
1. Launch tests

```bash
yarn test
```