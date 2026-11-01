import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { theme } from "../theme";
import { contactInfo } from "../utils/footerData";

// Static pages linked from the footer. Shipping, returns and contact details
// here must match how the store actually operates.

const LAST_UPDATED = "1 November 2026";

function InfoLayout({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-20">
      <h1
        className="text-4xl md:text-5xl font-black tracking-tight mb-4"
        style={{ color: theme.colors.primary }}
      >
        {title}
      </h1>
      {intro && (
        <p
          className="text-lg mb-10 leading-relaxed"
          style={{ color: `${theme.colors.primary}cc` }}
        >
          {intro}
        </p>
      )}
      <div
        className="space-y-8 leading-relaxed"
        style={{ color: `${theme.colors.primary}dd` }}
      >
        {children}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2
        className="text-xl font-black"
        style={{ color: theme.colors.primary }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc pl-5 space-y-2">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function Updated() {
  return (
    <p className="text-sm" style={{ color: `${theme.colors.primary}99` }}>
      Last updated: {LAST_UPDATED}
    </p>
  );
}

const linkStyle = { color: theme.colors.secondaryDark };

const EmailLink = () => (
  <a
    href={`mailto:${contactInfo.email}`}
    className="font-bold underline"
    style={linkStyle}
  >
    {contactInfo.email}
  </a>
);

export function AboutPage() {
  return (
    <InfoLayout
      title="About"
      intro="ArtStore is a small studio selling original, handmade work: paintings, drawings and crochet pieces, each made by hand."
    >
      <Section title="What we make">
        <p>
          Every piece in the shop is made in our studio, mostly as one-off
          originals. Some items are made to order, which means we start making
          yours once you've placed the order.
        </p>
      </Section>
      <Section title="Why buy here">
        <List
          items={[
            "Original work, not mass-produced prints.",
            "Packed carefully by hand and shipped across India for free.",
            "Prices include tax, with secure payment through Razorpay.",
          ]}
        />
      </Section>
      <p>
        Have a question or want something custom?{" "}
        <Link to="/contact" className="font-bold underline" style={linkStyle}>
          Get in touch
        </Link>
        .
      </p>
    </InfoLayout>
  );
}

export function ContactPage() {
  const rows = [
    {
      icon: FiMail,
      label: "Email",
      value: <EmailLink />,
    },
    {
      icon: FiPhone,
      label: "Phone",
      value: (
        <a
          href={`tel:${contactInfo.phone.replace(/[^+\d]/g, "")}`}
          className="font-bold"
          style={linkStyle}
        >
          {contactInfo.phone}
        </a>
      ),
    },
    { icon: FiMapPin, label: "Studio", value: contactInfo.address },
  ];

  return (
    <InfoLayout
      title="Contact"
      intro="For questions about an artwork, an order, or a custom piece, reach out and we'll reply within 1-2 working days."
    >
      <div className="space-y-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-start gap-4 p-5 rounded-2xl border"
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: `${theme.colors.primary}10`,
            }}
          >
            <row.icon
              className="text-xl mt-0.5 shrink-0"
              style={{ color: theme.colors.secondaryDark }}
            />
            <div>
              <p className="text-sm font-bold">{row.label}</p>
              <p>{row.value}</p>
            </div>
          </div>
        ))}
      </div>
      <p>
        About an existing order? Include your order number (shown in{" "}
        <Link
          to="/profile/orders"
          className="font-bold underline"
          style={linkStyle}
        >
          My Orders
        </Link>
        ) so we can help faster.
      </p>
    </InfoLayout>
  );
}

export function FaqPage() {
  const faqs = [
    {
      q: "Where do you ship?",
      a: "Within India only, for now. Shipping is free.",
    },
    {
      q: "How long does delivery take?",
      a: "Orders are dispatched within 2-3 working days and usually arrive 5-7 working days after that. Made-to-order pieces take longer, since we make them after you order.",
    },
    {
      q: "How do I track my order?",
      a: "Once your order ships, its tracking number appears on the order's page under My Orders.",
    },
    {
      q: "Can I return an item?",
      a: "Because each piece is handmade and often one of a kind, we don't accept returns for change of mind. If something arrives damaged, tell us within 48 hours and we'll replace or refund it. See Shipping & Returns for details.",
    },
    {
      q: "Can I cancel my order?",
      a: "Yes, until it has been shipped. Contact us with your order number and we'll cancel it and refund you in full.",
    },
    {
      q: "Are taxes included in the price?",
      a: "Yes. The price you see is the price you pay.",
    },
    {
      q: "How do I pay?",
      a: "Payments are handled securely by Razorpay: UPI, cards, net banking and wallets. We never see or store your card details.",
    },
    {
      q: "Do you take custom orders?",
      a: "Often, yes. Get in touch through the Contact page with what you have in mind.",
    },
  ];

  return (
    <InfoLayout title="FAQ" intro="Answers to the questions we get most.">
      {faqs.map((f) => (
        <Section key={f.q} title={f.q}>
          <p>{f.a}</p>
        </Section>
      ))}
    </InfoLayout>
  );
}

export function ShippingReturnsPage() {
  return (
    <InfoLayout
      title="Shipping & Returns"
      intro="How we ship your order, and what happens if something goes wrong."
    >
      <Section title="Shipping">
        <List
          items={[
            "We ship within India only.",
            "Shipping is free on all orders.",
            "Orders are dispatched within 2-3 working days and usually delivered within 5-7 working days after dispatch.",
            "Made-to-order pieces are made after you order, so they take longer to dispatch.",
            "Once your order ships, its tracking number appears on the order's page under My Orders.",
          ]}
        />
      </Section>
      <Section title="Returns">
        <p>
          Each piece is handmade and often one of a kind, so we don't accept
          returns or exchanges for change of mind.
        </p>
      </Section>
      <Section title="Damaged items">
        <List
          items={[
            "If your item arrives damaged, contact us within 48 hours of delivery.",
            "Include your order number and clear photos of the damaged item and its packaging.",
            "Once confirmed, we'll send a replacement where possible, or a full refund.",
          ]}
        />
      </Section>
      <Section title="Cancellations">
        <p>
          You can cancel an order any time before it ships, for a full refund.
          Once an order has shipped it can no longer be cancelled.
        </p>
      </Section>
      <Section title="Refunds">
        <p>
          Approved refunds go back to your original payment method through
          Razorpay, usually within 5-7 working days.
        </p>
      </Section>
      <p>
        To report a problem, email <EmailLink />.
      </p>
      <Updated />
    </InfoLayout>
  );
}

export function TermsPage() {
  return (
    <InfoLayout
      title="Terms of Use"
      intro="By using this website and placing an order, you agree to these terms."
    >
      <Section title="Orders">
        <List
          items={[
            "An order is confirmed once payment is completed.",
            "We may cancel an order, with a full refund, if an item turns out to be unavailable or was listed at an obviously wrong price.",
            "Colours may look slightly different on screen than in person, and handmade pieces can vary slightly from their photos.",
          ]}
        />
      </Section>
      <Section title="Prices and payment">
        <p>
          All prices are in Indian Rupees and include applicable taxes. Payments
          are processed by Razorpay. Discount codes are subject to their stated
          conditions and can't be combined unless stated.
        </p>
      </Section>
      <Section title="Shipping, returns and refunds">
        <p>
          These are covered in our{" "}
          <Link
            to="/shipping"
            className="font-bold underline"
            style={linkStyle}
          >
            Shipping & Returns
          </Link>{" "}
          policy.
        </p>
      </Section>
      <Section title="Artwork and content">
        <p>
          All artwork, photos and text on this site belong to ArtStore. Buying a
          piece gives you the physical item; it does not transfer copyright or
          the right to reproduce the artwork.
        </p>
      </Section>
      <Section title="Your account">
        <p>
          You're responsible for keeping your login details safe and for
          activity on your account.
        </p>
      </Section>
      <Section title="Governing law">
        <p>These terms are governed by the laws of India.</p>
      </Section>
      <p>
        Questions about these terms? Email <EmailLink />.
      </p>
      <Updated />
    </InfoLayout>
  );
}

export function PrivacyPage() {
  return (
    <InfoLayout
      title="Privacy Policy"
      intro="What information we collect, why, and what we do with it."
    >
      <Section title="What we collect">
        <List
          items={[
            "Account details: your name, email address and password (stored encrypted).",
            "Shipping addresses and phone numbers you add.",
            "Your orders, cart and wishlist.",
          ]}
        />
      </Section>
      <Section title="Payments">
        <p>
          Payments are processed by Razorpay. We never see or store your card,
          UPI or bank details; we only receive confirmation that a payment
          succeeded.
        </p>
      </Section>
      <Section title="How we use it">
        <List
          items={[
            "To process, ship and support your orders.",
            "To keep you signed in and remember your cart and wishlist.",
            "To reply when you contact us.",
          ]}
        />
        <p>
          We don't sell your information, and we only share it where needed to
          fulfil your order (for example, your address with the courier).
        </p>
      </Section>
      <Section title="Cookies and storage">
        <p>
          We store a login token in your browser to keep you signed in. We don't
          use advertising or tracking cookies.
        </p>
      </Section>
      <Section title="Your choices">
        <p>
          You can update your details from your profile at any time. To delete
          your account and data, email <EmailLink />.
        </p>
      </Section>
      <Updated />
    </InfoLayout>
  );
}
