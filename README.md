# Cab Platform (Phases 1-9)
## Run
1. server: cd server && cp .env.example .env (set MONGO_URI, JWT_SECRET) && npm install
   npm run seed:admin   # first admin from ADMIN_* env vars
   npm run seed:demo    # optional DEMO vehicles/packages (flagged isDemo; remove with: npm run seed:demo -- --remove)
   npm run dev
2. client: cd client && cp .env.local.example .env.local && npm install && npm run dev
## API (Phase 4)
Public: GET /api/vehicles, /api/vehicles/:idOrSlug, /api/packages, /api/packages/:idOrSlug, GET /api/reviews (approved), POST /api/enquiries, GET /api/settings/public
Customer: POST /api/reviews
Admin (role=admin): POST/PUT/DELETE vehicles & packages; /api/drivers CRUD; GET ?all=true on lists; PATCH /api/reviews/:id/approve; DELETE /api/reviews/:id; GET/PATCH /api/enquiries; GET/PUT /api/settings
Next: bookings + fare estimate (Phase 5), payments (Phase 8).

## Phase 5: bookings + fare
POST /api/bookings/estimate (public) | POST /api/bookings (guest or customer) | GET /api/bookings/track?ref=&mobile= (guest)
GET /api/bookings, GET /api/bookings/:idOrRef (owner/admin) | PATCH /api/bookings/:id/status (admin; customer may cancel) | PUT, DELETE (admin)
Statuses flow: pending -> confirmed -> driver_assigned (needs driver) -> in_progress -> completed; cancel allowed before in_progress.
Fare rules come from Settings.pricing (edit via PUT /api/settings as admin) and Vehicle.pricePerKm. Unset rules are 0/neutral.
Optional: GOOGLE_MAPS_API_KEY for distances beyond the built-in popular routes. Tests: cd server && npm test

## Phase 6: customer dashboard
Client: /dashboard (profile), /dashboard/bookings, /dashboard/bookings/:ref (status, fare, cancel, invoice, review), /dashboard/payments, /dashboard/support
API: GET /api/payments/history, GET /api/bookings/:idOrRef/invoice (PDF, completed trips only). Reviews now require a completed booking of your own (one per trip).

## Phase 7: admin dashboard (/admin, role=admin)
Overview, Bookings (search, filter, status flow, assign driver, edit, delete), Vehicles, Drivers, Packages, Customers (+history), Pricing (per-km + fare rules), Offers (coupons), Reviews (approve/delete), Enquiries, Settings.
API: GET /api/admin/stats|customers|customers/:id/bookings|notifications, PATCH /api/admin/notifications/read, /api/coupons CRUD, POST /api/uploads (Cloudinary; set CLOUDINARY_* in server .env).
Create a booking for a customer: Admin > Create booking (opens the booking form; admin-made bookings are not attached to the admin account).

## Phase 8: payments, maps, notifications (all optional; configure in server/.env)
- Razorpay: RAZORPAY_KEY_ID/SECRET (TEST keys first). API: GET /api/payments/config, POST /create-order, POST /verify, POST /webhook (set RAZORPAY_WEBHOOK_SECRET + event payment.captured in the Razorpay dashboard; URL https://<your-api>/api/payments/webhook).
- Google Maps: GOOGLE_MAPS_API_KEY (enable Places API (New) + Routes API; restrict the key by server IP). Used for GET /api/maps/autocomplete and distances beyond the built-in popular routes.
- Email: SMTP_* + MAIL_FROM + ADMIN_NOTIFY_EMAIL. Sends on new booking, status change (logged-in customers) and payment received.
- Advance payment: Admin > Pricing > Advance payment (%). 0 = only full payment.
- WhatsApp: click-to-chat links (booking confirmation, admin bookings table). No Business API.

## Phase 9: SEO, security, performance
- Client is on Next 16 / React 19 (clears all `npm audit` findings). Middleware is now `proxy.js`.
- SEO: /sitemap.xml, /robots.txt (blocks admin, dashboard, api, login, tracking), 6 route pages (/routes/indore-to-ujjain-cab ...), FAQ/LocalBusiness/Breadcrumb/Service schema, canonical + unique titles. Set NEXT_PUBLIC_SITE_URL to the real domain BEFORE building, or sitemap/canonicals point at localhost.
- New pages: /faq, /gallery (photos from Admin > Settings), /testimonials, /offers (coupons with "Show on Offers page"), /privacy-policy, /terms-and-conditions (drafts: have them reviewed).
- Security: Origin check on all writes (CLIENT_ORIGIN may list several origins, comma-separated), query-param hardening, security headers, CSP in Report-Only mode (enforce after testing a Razorpay payment).
- Perf: vehicles fetched once on the server for the homepage, public API responses cached 60s, extra DB indexes, optimizePackageImports.
- Deploy order: deploy the API first, then the client, so the first static pages are built with live data.
