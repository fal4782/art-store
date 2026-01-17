import { theme } from "../theme";
import { footerLinks, socialLinks, contactInfo } from "../utils/footerData";

export default function Footer() {
  return (
    <>
      {/* Main Footer - Desktop */}
      <footer
        className="hidden md:block w-full pt-12 pb-8 px-4"
        style={{
          background: `${theme.colors.surface}ff`,
          borderTop: `1px solid ${theme.colors.accent}cc`,
          backdropFilter: "blur(20px)",
          boxShadow: `0 -2px 20px ${theme.colors.primary}05`,
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div
                className="flex items-center gap-3 mb-6 pb-6"
                style={{
                  borderBottom: `2px solid ${theme.colors.accent}80`,
                  paddingBottom: theme.spacing.lg,
                }}
              >
                <div
                  className="p-3 rounded-xl"
                  style={{
                    background: `${theme.colors.accent}e0`,
                    boxShadow: `0 4px 12px ${theme.colors.primary}10`,
                  }}
                >
                  <span
                    className="text-2xl font-bold block"
                    style={{ color: theme.colors.primary }}
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
            <div className="lg:col-span-2 grid grid-cols-2 gap-8">
              {footerLinks.map((section) => (
                <div key={section.title}>
                  <h3
                    className="font-semibold mb-6 pb-2"
                    style={{
                      color: theme.colors.primary,
                      fontSize: "1.05rem",
                      borderBottom: `1px solid ${theme.colors.accent}60`,
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
                    borderBottom: `1px solid ${theme.colors.accent}60`,
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
                    borderBottom: `1px solid ${theme.colors.accent}60`,
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
                        <Icon size={20} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            className="w-full h-px my-12 mx-auto"
            style={{
              background: `linear-gradient(90deg, transparent, ${theme.colors.accent}cc, transparent)`,
              maxWidth: "400px",
            }}
          />
        </div>
      </footer>

      {/* Mobile Footer */}
      <footer className="md:hidden w-full py-8 px-6 bg-linear-to-t from-primary/95 to-primary/90">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div
            className="text-2xl font-bold mb-4"
            style={{ color: theme.colors.surface }}
          >
            ArtStore
          </div>
          <div
            className="text-sm px-4"
            style={{ color: `${theme.colors.surface}dd` }}
          >
            Crafted with ❤️ for art lovers worldwide
          </div>
          <div className="flex justify-center gap-6">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-3 rounded-full hover:scale-110 transition-all duration-300"
                  style={{
                    background: `${theme.colors.surface}40`,
                    color: theme.colors.surface,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
          <div
            className="text-xs pt-4 border-t"
            style={{
              color: `${theme.colors.surface}bb`,
              borderColor: `${theme.colors.surface}40`,
            }}
          >
            © {new Date().getFullYear()} ArtStore. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Copyright Bar - Desktop */}
      <div
        className="hidden md:block w-full py-4 text-center"
        style={{
          background: `${theme.colors.secondary}e8`,
          borderTop: `1px solid ${theme.colors.primary}40`,
          color: `${theme.colors.primary}cc`,
          fontSize: "0.875rem",
          fontWeight: 500,
          letterSpacing: "0.025em",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          © {new Date().getFullYear()} ArtStore. All rights reserved. | Made
          with <span style={{ color: theme.colors.error }}>♥</span> for artists.
        </div>
      </div>
    </>
  );
}
