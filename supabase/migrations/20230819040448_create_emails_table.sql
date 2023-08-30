create table emails (
  id bigint primary key generated always as identity,
  to_emails text[], -- An array of text
  from_email text,
  subject text,
  created_at timestamptz default now(),
  body text,
  attachments text[], -- An array of text
  cc_emails text[], -- An array of text
  bcc_emails text[] -- An array of text
);