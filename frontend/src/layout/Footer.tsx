import { FaHeart, FaPaintBrush } from "react-icons/fa";
import { theme } from "../theme";
import { footerLinks, socialLinks, contactInfo } from "../utils/footerData";

export default function Footer() {
  return (
    <>
      {/* Main Footer */}
      <footer
        className="hidden md:block w-full py-12 px-4"
        style={{
          background: theme.colors.surface,
          borderTop: `1px solid ${theme.colors.accent}`,
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-16">
            {/* Brand Section */}
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    background: `${theme.colors.accent}80`,
                  }}
                >
                  <FaPaintBrush
                    className="text-lg"
                    style={{ color: theme.colors.secondary }}
                  />
                </div>
                <span
                  className="text-xl font-bold"
                  style={{
                    color: theme.colors.primary,
                  }}
                >
                  ArtStore
                </span>
              </div>
              <p
                className="text-sm leading-relaxed mt-4"
                style={{ color: `${theme.colors.primary}aa` }}
              >
                Discover exceptional art curated for collectors and enthusiasts worldwide.
              </p>
            </div>

            {/* Link Sections */}
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h3
                  className="font-semibold mb-4 text-sm uppercase tracking-wider relative pb-2"
                  style={{
                    color: theme.colors.primary,
                  }}
                >
                  {section.title}
                  <div
                    className="absolute bottom-0 left-0 w-8 h-0.5 rounded-full"
                    style={{
                      background: theme.colors.secondary,
                    }}
                  />
                </h3>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm transition-colors duration-200 hover:translate-x-0.5 inline-block"
                        style={{
                          color: `${theme.colors.primary}99`,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = theme.colors.secondary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = `${theme.colors.primary}99`;
                        }}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact & Socials */}
            <div>
              <h3
                className="font-semibold mb-4 text-sm uppercase tracking-wider relative pb-2"
                style={{
                  color: theme.colors.primary,
                }}
              >
                Contact
                <div
                  className="absolute bottom-0 left-0 w-8 h-0.5 rounded-full"
                  style={{
                    background: theme.colors.secondary,
                  }}
                />
              </h3>
              <div className="space-y-2.5 text-sm mb-6">
                <div style={{ color: `${theme.colors.primary}99` }}>
                  {contactInfo.email}
                </div>
                <div style={{ color: `${theme.colors.primary}99` }}>
                  {contactInfo.phone}
                </div>
                <div style={{ color: `${theme.colors.primary}99` }}>
                  {contactInfo.address}
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-6">
                <h4
                  className="font-semibold mb-3 text-sm uppercase tracking-wider relative pb-2"
                  style={{
                    color: theme.colors.primary,
                  }}
                >
                  Follow
                  <div
                    className="absolute bottom-0 left-0 w-8 h-0.5 rounded-full"
                    style={{
                      background: theme.colors.secondary,
                    }}
                  />
                </h4>
                <div className="flex gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        aria-label={social.label}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-lg transition-all duration-200 hover:scale-110"
                        style={{
                          background: `${theme.colors.secondary}20`,
                          color: theme.colors.secondary,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = theme.colors.secondary;
                          e.currentTarget.style.color = theme.colors.surface;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = `${theme.colors.secondary}20`;
                          e.currentTarget.style.color = theme.colors.secondary;
                        }}
                      >
                        <Icon className="text-base" />
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
        className="hidden md:block w-full py-4 text-center"
        style={{
          background: theme.colors.primary,
          color: theme.colors.accent,
          fontSize: "0.875rem",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-6">
            <span>© {new Date().getFullYear()} ArtStore. All rights reserved.</span>
            <span className="text-xs" style={{ color: `${theme.colors.accent}cc` }}>•</span>
            <div className="inline-flex items-center gap-1.5">
              Made with
              <FaHeart className="text-xs" style={{ color: theme.colors.secondary }} />
              for art lovers
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
