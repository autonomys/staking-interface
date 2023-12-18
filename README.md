# Staking Interface Web App

[![Netlify Status](https://api.netlify.com/api/v1/badges/607da4e9-0ed7-40a7-b1c6-b105e4280cd1/deploy-status)](https://app.netlify.com/sites/stakinginterface/deploys)

This is a next.js web app that is used to interact with the Subspace Chain to stake and unstake tSSC.

## Live Web App

- [Staking Interface](https://staking.subspace.tools/)
- [Staking Interface (DevNet)](https://devnet-staking-interface.netlify.app/)

## Getting Started

First, install dependencies:

```bash
yarn
```

Second, rename `.env.example` to `.env` and fill in the values as follows:

| Variables                  | Description                             |
| -------------------------- | --------------------------------------- |
| `NEXT_PUBLIC_PROVIDER_URL` | RPC Url of the Subspace Consensus chain |
| `NEXT_PUBLIC_DOMAIN_ID`    | Domain Id of the EVM (Nova) Network     |

Finally, run the development server:

```bash
yarn dev
```

## One click deployment to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/subspace/staking-interface/)
