import { FaHeart } from "react-icons/fa";
import { theme } from "../theme";
import { footerLinks, socialLinks, contactInfo } from "../utils/footerData";

export default function Footer() {
  return (
    <>
      {/* Main Footer */}
      <footer
        className="hidden md:block w-full py-8 px-4"
        style={{
          background: theme.colors.surface,
          borderTop: `1px solid ${theme.colors.secondary}40`,
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-12">
            {/* Brand Section */}
            <div className="col-span-1">
              <div
                className="flex items-center gap-3 mb-6 pb-6"
                style={{
                  borderBottom: `2px solid ${theme.colors.secondary}50`,
                  paddingBottom: theme.spacing.lg,
                }}
              >
                <div
                  className="p-3 rounded-xl"
                  style={{
                    background: `${theme.colors.secondary}30`,
                    boxShadow: `0 4px 12px ${theme.colors.secondary}20`,
                  }}
                >
                  <span
                    className="text-2xl font-bold block"
                    style={{
                      color: theme.colors.primary,
                      textShadow: `0 1px 2px ${theme.colors.secondary}30`,
                    }}
                  >
                    ArtStore
                  </span>
                </div>
              </div>
              <div
                className="text-sm leading-relaxed mb-6"
                style={{ color: `${theme.colors.primary}99` }}
              >
                Discover exceptional art curated for collectors and enthusiasts.
              </div>
            </div>

            {/* Link Sections */}
            <div className="grid grid-cols-1 gap-8">
              {footerLinks.map((section) => (
                <div key={section.title}>
                  <h3
                    className="font-semibold mb-6 pb-2"
                    style={{
                      color: theme.colors.primary,
                      fontSize: "1.05rem",
                      borderBottom: `2px solid ${theme.colors.secondary}40`,
                    }}
                  >
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="group flex items-center gap-2 p-2 rounded-lg transition-all duration-300 hover:scale-[1.02]"
                          style={{
                            color: `${theme.colors.primary}cc`,
                            fontSize: "0.95rem",
                          }}
                        >
                          <div
                            className="w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                            style={{ background: theme.colors.secondary }}
                          />
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Contact & Socials */}
            <div className="space-y-8">
              {/* Contact */}
              <div>
                <h3
                  className="font-semibold mb-6 pb-2"
                  style={{
                    color: theme.colors.primary,
                    fontSize: "1.05rem",
                    borderBottom: `2px solid ${theme.colors.secondary}40`,
                  }}
                >
                  Contact
                </h3>
                <div className="space-y-4 text-sm">
                  <div style={{ color: `${theme.colors.primary}dd` }}>
                    {contactInfo.email}
                  </div>
                  <div style={{ color: `${theme.colors.primary}dd` }}>
                    {contactInfo.phone}
                  </div>
                  <div style={{ color: `${theme.colors.primary}dd` }}>
                    {contactInfo.address}
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3
                  className="font-semibold mb-6 pb-2"
                  style={{
                    color: theme.colors.primary,
                    fontSize: "1.05rem",
                    borderBottom: `2px solid ${theme.colors.secondary}40`,
                  }}
                >
                  Follow Us
                </h3>
                <div className="flex gap-4">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        aria-label={social.label}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-3 rounded-xl hover:scale-110 transition-all duration-300"
                        style={{
                          background: `${theme.colors.accent}40`,
                          color: `${theme.colors.primary}dd`,
                        }}
                      >
                        <Icon />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright Bar */}
      <div
        className="hidden md:block w-full py-2 text-center"
        style={{
          background: `${theme.colors.primary}e8`,
          color: theme.colors.accent,
          fontSize: "0.875rem",
          fontWeight: 500,
          letterSpacing: "0.025em",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          © {new Date().getFullYear()} ArtStore. All rights reserved. <br />{" "}
          <div className="inline-flex items-center gap-1">
            Made with
            <span style={{ color: theme.colors.secondary }}>
              <FaHeart />
            </span>
            for art lovers.
          </div>
        </div>
      </div>
    </>
  );
}
