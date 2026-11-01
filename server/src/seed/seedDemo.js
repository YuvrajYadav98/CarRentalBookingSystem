// Loads clearly-marked DEMO vehicles and packages. Safe to re-run (upserts by slug).
// Usage: npm run seed:demo        (add)   |   npm run seed:demo -- --remove   (delete demo docs only)
// Prices come from a public reference listing and are NOT verified quotations: edit them in the admin dashboard.
require("../config/env");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Vehicle = require("../models/Vehicle");
const Package = require("../models/Package");
const Settings = require("../models/Settings");
const { slugify } = require("../utils/slug");
const catalog = require("./demo-catalog.json");

// Approximate distances/times for routes we know; other fields are left empty rather than invented.
const known = { "indore-to-ujjain": [55, "~1.5 hrs"], "indore-to-omkareshwar": [78, "~2 hrs"], "indore-to-maheshwar": [91, "~2.5 hrs"], "indore-to-mandu": [95, "~2.5 hrs"], "indore-to-bhopal": [190, "~3.5 hrs"], "indore-to-patalpani": [35, "~1 hr"] };

(async () => {
  await connectDB();
  if (process.argv.includes("--remove")) {
    const a = await Vehicle.deleteMany({ isDemo: true }); const b = await Package.deleteMany({ isDemo: true });
    console.log(`Removed ${a.deletedCount} demo vehicles, ${b.deletedCount} demo packages.`);
  } else {
    for (const v of catalog.vehicles) {
      await Vehicle.updateOne({ slug: slugify(v.name) }, { $setOnInsert: { ...v, slug: slugify(v.name), ac: true, available: true, isDemo: true } }, { upsert: true });
    }
    for (const p of catalog.packages) {
      const slug = slugify(p.name), k = known[slug];
      await Package.updateOne({ slug }, { $setOnInsert: { ...p, slug, description: `${p.name} taxi package.`, ...(k && { distance: k[0], travelTime: k[1] }), isDemo: true } }, { upsert: true });
    }
    const st = await Settings.get();
    if (!st.company?.name) { // owner-provided details; address and WhatsApp still to be confirmed
      st.company = { name: "Sanwariyatourandtravels", phone: "+919755002719", whatsapp: "919755002719", email: "Sanwariyatourandtravels1@gmail.com", address: "Vijay Nagar,Indore, Madhya Pradesh" };
      await st.save();
    }
    console.log(`Seeded ${catalog.vehicles.length} vehicles and ${catalog.packages.length} packages (demo).`);
  }
  await mongoose.disconnect();
})().catch((e) => { console.error(e.message); process.exit(1); });
