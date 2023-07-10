# About

In most projects, I use the same basic setup, so I created this template to save myself some time. It includes: Supabase, Next.js, TypeScript, `shadcn/ui`, and a few other things I like to include in my projects like a simple landing page, OG image, footer, etc.

## Getting Started

1. Clone the repository `git clone https://github.com/alanagoyal/project-template`
2. Use `cd` to change into the app's directory
3. Run `npm install` to install dependencies

Rename `.env.example` to `.env` and update the `SITE_URL`.

You can also edit the `name`, `description`, `authorName`, and `links` in `config/site.ts`.

## Database

Create a new [Supabase project](https://app.supabase.com/), enter your project details, and wait for the database to launch. Rename `.env.local.example` to `.env.local` and update the values for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your Supabase project's [API settings](https://app.supabase.com/project/_/settings/api).

## Auth

This template uses [Supabase's Next.js Starter](https://supabase.com/docs/guides/auth/auth-helpers/nextjs) and configures Supabase Auth to use cookies. You can find examples for creating a Supabase client in `/app/_examples`. I usually like to use Google OAuth, since I think it's the best end user experience, so this template is configured with that out-of-the-box. To set up Google OAuth, you'll also have to complete a few steps in the Google Cloud Console and Supabase Dashboard:

1. Obtain OAuth credentials for your Google Cloud project in the Credentials page of the console. When creating a new credential, choose Web application. In Authorized redirect URIs enter `https://<project-id>.supabase.co/auth/v1/callback`. This URL will be seen by your users, and you can customize it by configuring custom domains.
2. Configure the OAuth Consent Screen. This information is shown to the user when giving consent to your app. Within Authorized domains make sure you add your Supabase project's domain `<project-id>.supabase.co`.
3. Add the client ID and secret from step 1 in the Google provider on the Supabase Dashboard.

Full instructions can be found [here](https://supabase.com/docs/guides/auth/social-login/auth-google).

You will also want to set up a table for profiles and a trigger to automatically add new users to the table. Paste the following in your Supabase SQL editor and run it:

```
-- Create table for user profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  email text unique,
  full_name text
  );

-- This trigger automatically creates a new profile when a new user signs up via Supabase Auth
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

You can update the profiles table to include any other information you want to store about your users and extend the Account component accordingly.

## UI

This template uses [shadcn's next-template](https://github.com/shadcn/ui/tree/main/templates/next-template), which includes Radix UI Primitives, Tailwind CSS, Lucide icons, and dark mode with `next-themes`. Any time you need to install a new component, you can simply run `npx shadcn-ui@latest add <component-name>`.

## Other

A few other things I like to include in my projects:

1. OG Image - modify in `app/opengraph-image.tsx`
2. Favicon - modify in `public/favicon.ico`
3. Links - modify in `config/site.ts`
4. Main Nav - modify in `config/site.ts`
5. User Nav - modify in `components/user-nav.tsx`

## Deploy

Deploy using [Vercel](https://vercel.com).
