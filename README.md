This is a [Next.js](https://nextjs.org/) project bootstrapped with
[`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

It was built for the [Nylas AI and Communications Challenge](https://dev.to/challenges/nylas). The app offers a
simplified email inbox with some LLM powered features.

## Getting Started

### Environment Variables

First, create a `.env` file with the following environment variables:
- `NYLAS_CLIENT_ID`
- `NYLAS_API_KEY`
- `NYLAS_API_URI`
- `NYLAS_TEST_GRANT`
- `NYLAS_REDIRECT_URI`
- `OPENAI_API_KEY`

### Starting the App

Next, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

This app was built with NextJS, Bulma, TanStack Query, Nylas, and OpenAI. To learn more about these technologies, take a
look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [OpenAI developer platform](https://platform.openai.com/docs/overview)
- [Nylas developers](https://developer.nylas.com)
- [Bulma CSS framework](https://bulma.io)
- [TanStack Query docs](https://tanstack.com/query/latest/docs/framework/react/overview)
