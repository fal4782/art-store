import { FaPinterest } from "react-icons/fa";
import { FiInstagram, FiTwitter } from "react-icons/fi";

export const footerLinks = [
  {
    title: "Links",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: FiInstagram,
  },
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: FiTwitter,
  },
  {
    label: "Pinterest",
    href: "https://pinterest.com",
    icon: FaPinterest,
  },
];

export const contactInfo = {
  email: "support@artstore.com",
  phone: "+91-12345-67890",
  address: "123 Art Lane, Jalandhar, Punjab, India",
};
