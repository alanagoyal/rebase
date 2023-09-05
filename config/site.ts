export type SiteConfig = typeof siteConfig;

require("dotenv").config();

export const siteConfig = {
  name: "Re:base",
  description: "The open-source email platform",
  authorName: "Alana Goyal",
  url: process.env.SITE_URL!,
  ogImage: `${process.env.SITE_URL}/opengraph-image`,
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Mail",
      href: "/members",
    },
  ],
  secondaryNav: [
    {
      title: "Members",
      href: "/members",
    },
    {
      title: "Mailbox",
      href: "/mailbox",
    },
  ],
  links: {
    twitter: "https://twitter.com/alanaagoyal",
    github: "https://github.com/alanagoyal",
  },
};
