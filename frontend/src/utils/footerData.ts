import { FaPinterest } from "react-icons/fa";
import { FiInstagram } from "react-icons/fi";

export const footerLinks = [
  {
    title: "Links",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Shipping & Returns", href: "/shipping" },
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

// TODO: sample profile links; replace with the store's real accounts.
export const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/artstore.studio",
    icon: FiInstagram,
  },
  {
    label: "Pinterest",
    href: "https://pinterest.com/artstorestudio",
    icon: FaPinterest,
  },
];

// TODO: sample contact details; replace before launch. Also shown on the
// Contact, Shipping & Returns, Terms and Privacy pages.
export const contactInfo = {
  email: "support@artstore.com",
  phone: "+91-12345-67890",
  address: "123 Art Lane, Jalandhar, Punjab, India",
};
