// Central site configuration - nav, external destinations, and the
// brand-forward "Choose Your Lineup" collections. Product/collection data
// will later come from the apphub PIM public API; this is the static shell.

export const EXTERNAL = {
  // The DTC store + contest live on the toys site, not this corporate site.
  toysStore: "https://partyanimaltoys.com",
  enterToWin: "https://partyanimaltoys.com",
};

// Social profiles shown in the footer.
// NOTE: URLs are best-guess placeholders - confirm/replace with the real handles.
export const SOCIALS: { label: string; href: string; icon: SocialIcon }[] = [
  { label: "Instagram", href: "https://www.instagram.com/partyanimal.inc/", icon: "instagram" },
  { label: "TikTok", href: "https://www.tiktok.com/@the.partyanimal", icon: "tiktok" },
  { label: "YouTube", href: "https://www.youtube.com/@PartyAnimalToys", icon: "youtube" },
  { label: "X", href: "https://x.com/Partyanimal_inc", icon: "x" },
  { label: "Reddit", href: "https://www.reddit.com/user/PartyAnimalInc", icon: "reddit" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/the-party-animal", icon: "linkedin" },
  {
    label: "Amazon",
    href: "https://www.amazon.com/stores/PartyAnimalInc/page/6A6BA724-BD28-4888-868B-B57287C3DFCB",
    icon: "amazon",
  },
];

export type SocialIcon =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "x"
  | "reddit"
  | "linkedin"
  | "amazon";

export type NavItem = {
  label: string;
  href: string;
  // top-level items with children render a dropdown
  children?: { label: string; href: string }[];
};

// Canonical nav from Figma "Desktop - 2"
export const NAV: NavItem[] = [
  {
    label: "Our Products",
    href: "/products",
    children: [
      { label: "TeenyMates", href: "/teenymates" },
      { label: "SqueezyMates", href: "/squeezymates" },
      { label: "Jumbo Squeezy", href: "/jumbo-squeezy" },
      { label: "Team Gear", href: "/team-gear" },
      { label: "All Products", href: "/products" },
    ],
  },
  { label: "About Us", href: "/about" },
  { label: "Licenses & Partners", href: "/licenses" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "/contact" },
];

export type Lineup = {
  key: string;
  name: string;
  href: string;
  banner: string; // full clickable banner (from stacks.psd)
  alt: string;
};

// The four brand-forward collections featured on the home page.
export const LINEUP: Lineup[] = [
  {
    key: "teenymates",
    name: "TeenyMates",
    href: "/teenymates",
    banner: "/lineup/banner-teenymates.png",
    alt: "TeenyMates collectible mini sports figures. Collect them all.",
  },
  {
    key: "squeezymates",
    name: "SqueezyMates",
    href: "/squeezymates",
    banner: "/lineup/banner-squeezymates.png",
    alt: "SqueezyMates squeezable sports figures. Squeeze into action.",
  },
  {
    key: "jumbosqueezy",
    name: "Jumbo Squeezy",
    href: "/jumbo-squeezy",
    banner: "/lineup/banner-jumbosqueezy.png",
    alt: "Jumbo Squeezy big squeezable helmeted figures. Go big and squeezy.",
  },
  {
    key: "teamgear",
    name: "Team Gear",
    href: "/team-gear",
    banner: "/lineup/banner-teamgear.png",
    alt: "Team Gear flags, bottles, signs and more. Rep your team.",
  },
];
