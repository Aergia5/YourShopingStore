import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin, Phone, Send, ShoppingBag } from "lucide-react";

const sections = [
  {
    title: "Shop",
    links: [
      { text: "All Products", path: "/products" },
      { text: "Fresh Picks", path: "/products?category=Fruits" },
      { text: "Home Essentials", path: "/products?category=Groceries" },
      { text: "Tech Finds", path: "/products?category=Electronics" },
    ],
  },
  {
    title: "Account",
    links: [
      { text: "My Orders", path: "/orders" },
      { text: "Profile", path: "/profile" },
      { text: "Cart", path: "/cart" },
      { text: "Admin", path: "/admin/login" },
    ],
  },
];

const socialLinks = [
  { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
  { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
  { href: "https://twitter.com", icon: Send, label: "X" },
];

const Footer = () => {
  return (
    <footer className="relative mt-16 overflow-hidden px-4 pb-8 pt-14 sm:px-6">
      <div className="section-shell glass-panel rounded-[36px] border border-white/70 px-6 py-10 sm:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr]">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
                <ShoppingBag size={20} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-teal-700">
                  Designed for everyday delight
                </p>
                <h2 className="text-3xl text-slate-900">YourShopingStore</h2>
              </div>
            </div>
            <p className="max-w-md text-sm leading-7 text-slate-600 sm:text-base">
              A calmer, cleaner shopping experience for daily essentials, fresh finds, and modern lifestyle picks. Browse faster, discover more clearly, and check out with confidence.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:-translate-y-0.5 hover:border-teal-300 hover:text-teal-700"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-lg text-slate-900">{section.title}</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                {section.links.map((link) => (
                  <li key={link.text}>
                    <Link className="transition hover:text-teal-700" to={link.path}>
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="mb-4 text-lg text-slate-900">Visit or Contact</h3>
            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 text-teal-700" size={18} />
                <span>Kathmandu, Nepal</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 text-teal-700" size={18} />
                <span>+977 9876543210</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 text-teal-700" size={18} />
                <span>contact@shoppingstore.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} YourShopingStore. Built for smoother browsing and better buying.</p>
          <p>Fast discovery. Clear pricing. Comfortable checkout.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
