// Business details come from env now; Phase 7 moves them to the Settings API.
// Defaults are the owner-provided details; override via .env.local. TODO: confirm full address and WhatsApp number.
const phone = process.env.NEXT_PUBLIC_PHONE || "+917610773501";
const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || "917610773501";

export const site = {
  name: process.env.NEXT_PUBLIC_COMPANY_NAME || "Sanwariyatourandtravels1",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  phone,
  telHref: `tel:${phone}`,
  whatsapp,
  email: process.env.NEXT_PUBLIC_EMAIL || "Sanwariyatourandtravels1@gmail.com",
  address: process.env.NEXT_PUBLIC_ADDRESS || "Indore, Madhya Pradesh",
  social: [], // add { label, href } entries when real profiles exist
};

export const waLink = (text = "Hello, I would like to book a cab.") =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Our Fleet", href: "/fleet" },
  { label: "Packages", href: "/packages" },
  { label: "Contact", href: "/contact" },
];

export const destinations = [
  { slug: "indore-to-ujjain-cab", name: "Indore to Ujjain", title: "Indore to Ujjain Cab", to: "Ujjain", km: 55, time: "1.5 hrs", blurb: "Ujjain is one of India's seven sacred cities, home to the Mahakaleshwar Jyotirlinga temple on the Shipra river." },
  { slug: "indore-to-omkareshwar-taxi", name: "Indore to Omkareshwar", title: "Indore to Omkareshwar Taxi", to: "Omkareshwar", km: 78, time: "2 hrs", blurb: "Omkareshwar is an island town on the Narmada river with the Omkareshwar Jyotirlinga temple." },
  { slug: "indore-to-maheshwar-cab", name: "Indore to Maheshwar", title: "Indore to Maheshwar Cab", to: "Maheshwar", km: 91, time: "2.5 hrs", blurb: "Maheshwar is a Narmada riverside town known for its ghats, Ahilya Fort and Maheshwari handloom sarees." },
  { slug: "indore-to-mandu-cab", name: "Indore to Mandu", title: "Indore to Mandu Cab", to: "Mandu", km: 95, time: "2.5 hrs", blurb: "Mandu is a historic hilltop fort town known for monuments such as Jahaz Mahal and Hindola Mahal." },
  { slug: "indore-to-bhopal-cab", name: "Indore to Bhopal", title: "Indore to Bhopal Cab", to: "Bhopal", km: 190, time: "3.5 hrs", blurb: "Bhopal is the capital of Madhya Pradesh, known for its lakes and museums." },
  { slug: "indore-to-patalpani-cab", name: "Indore to Patalpani", title: "Indore to Patalpani Cab", to: "Patalpani", km: 35, time: "1 hr", blurb: "Patalpani is a waterfall near Mhow, a popular monsoon day trip from Indore." },
];

export const serviceLinks = [
  { label: "Airport Taxi", href: "/airport-taxi" },
  { label: "Local Taxi", href: "/local-taxi" },
  { label: "Outstation Taxi", href: "/outstation-taxi" },
  { label: "Corporate Travel", href: "/corporate-travel" },
  { label: "Wedding Transportation", href: "/wedding-transportation" },
];
