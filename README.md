[Rebase](https://re-base.vercel.app) is an open-source email platform purpose-built for sending investor updates. As a founder, I send monthly update emails to my investors to share what I've been up to using a product called [Cabal](https://getcabal.com). I’m a huge fan of their product, so I wanted to try to build my own from scratch.

Please note that the product is only designed for verified domains. If you want to use it, you'll need to register a domain and verify it with [Resend](https://resend.com) (see below).

## Getting Started

1. Clone the repository `git clone https://github.com/alanagoyal/rebase`
2. Use `cd` to change into the app's directory
3. Run `npm install` to install dependencies
4. Rename `.env.example` to `.env` and update the API keys. Rename `.env.local.example` to `.env.local` and do the same.

## Supabase

This project uses [Supabase](https://supabase.com) to store users, members, and groups. Follow [these instructions](https://supabase.com/docs/guides/getting-started/local-development) to apply the migration and get started with your own project.

## Resend

This project uses [Resend](https://resend.com) to send the emails. You can sign up for a free account, register a domain, and paste the API key into `.env` to start sending emails.

## Deploy

Deploy using [Vercel](https://vercel.com).
