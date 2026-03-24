export interface NavLink {
  id: any;
  href: string;
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: "#home", label: "Home", id: "home" },
  { href: "#our-story", label: "Our Story", id: "our-story" },
  { href: "#products", label: "products", id: "products" },
  { href: "#newsletter", label: "newsletter", id: "newsletter" },
  { href: "#contact", label: "Contact", id: "contact" },
];