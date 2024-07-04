export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'BlockCharge',
  description: 'A Blockchain based EV Charging App.',
  navItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Map',
      href: '/map',
    },
  ],
  navMenuItems: [
    {
      label: 'Profile',
      href: '/profile',
    },
    {
      label: 'Filters',
      href: '/filters',
    },
    {
      label: 'Trips',
      href: '/trips',
    },
    {
      label: 'Bookmarks',
      href: '/bookmarks',
    },
    {
      label: 'Settings',
      href: '/settings',
    },
    {
      label: 'Help & Feedback',
      href: '/help-feedback',
    },
    {
      label: 'Signup',
      href: '/signup',
    },
  ],
  links: {
    github: 'https://github.com/shivesh-anand',
    twitter: 'https://twitter.com/getnextui',
    docs: 'https://nextui.org',
    discord: 'https://discord.gg/9b6yyZKmH4',
    sponsor: 'https://github.com/shivesh-anand',
  },
};
