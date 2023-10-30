# Arweave StarterKit

Fast track your journey to building decentralized applications on Arweave with `create-arweave-app`. This CLI tool effortlessly sets up an entire application, harnessing the power of [NextJS](https://nextjs.org/) as the framework, [Shadcn UI](https://ui.shadcn.com/) for a sleek and aesthetic interface, and [ArweaveKit](https://arweavekit.com/?utm_source=Github&utm_medium=StarterKit+Repo&utm_campaign=Create-Arweave-App+StarterKit+Docs&utm_id=Create-Arweave-App+StarterKit+Docs) to seamlessly interact with the Arweave ecosystem.

## Getting Started

First, run the development server and choose your preferred configurations:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

**Landing Page:** A form that allows users to upload Atomic assets on Arweave, complete with various metadata configurations.

![Landing Page Form Preview](landing-preview.png)

**View Page:** A dedicated space to view the uploaded assets and engage with them through on-chain likes (known as stamps) and comments.

![View Page Preview](view-preview.png)

Start editing the page by modifying `app/page.tsx` or `pages/index.ts`, as per your NextJS config.

## Why is use a StarterKit?

Building DApps from scratch can be a daunting task. From setting up the environment to ensuring compatibility across different components, the process can be time-consuming. A scaffold provides a pre-configured foundation, enabling developers to focus on building unique features and functionalities rather than the underlying setup.

## Learn More

To learn more about [create-arweave-app](https://github.com/labscommunity/starterkit/blob/main/apps/cli/README.md), take a look at the following resources:

- [Documentation](https://github.com/labscommunity/starterkit/blob/main/apps/cli/README.md)

If you are not familiar with the different technologies used in this project, please refer to the respective docs.

- [Next.js](https://nextjs.org)
- [ArweaveKit](https://docs.arweavekit.com/arweavekit/introduction)
- [Arweave Wallet Kit](https://docs.arweavekit.com/wallets/wallet-kit)
- [Warp Contracts](https://docs.warp.cc/docs/sdk/overview)
- [Stamp Protocol](https://github.com/stamp-association/stamp/tree/main/packages/stampjs)
- [Shadcn UI](https://ui.shadcn.com/docs)

You can check out [create-arweave-app GitHub repository](https://github.com/labscommunity/starterkit) - your feedback and contributions are welcome!
