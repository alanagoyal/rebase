export type SiteConfig = typeof siteConfig;

require("dotenv").config();

export const siteConfig = {
  name: "Project Name",
  description: "Project description",
  authorName: "Author Name",
  url: process.env.SITE_URL!,
  ogImage: `${process.env.SITE_URL}/opengraph-image`,
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
  ],
  links: {
    twitter: "https://twitter.com/alanaagoyal",
    github: "https://github.com/alanagoyal",
  },
};
