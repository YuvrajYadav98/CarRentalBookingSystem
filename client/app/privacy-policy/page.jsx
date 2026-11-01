import LegalPage from "@/components/LegalPage";
import { site } from "@/lib/siteConfig";

export const metadata = { title: "Privacy Policy", description: `How ${site.name} collects and uses your information.`, alternates: { canonical: "/privacy-policy" } };

export default function Page() {
  return <LegalPage title="Privacy Policy" sections={[
    ["Information we collect", ["When you book a cab or contact us we collect your name, mobile number, trip details (pickup, drop, date, time, passengers) and any message you send. If you create an account we also collect your email address and a password, which we store only in hashed form."]],
    ["Payments", ["Online payments are processed by Razorpay. We do not see or store your card, UPI or bank details. We keep the payment reference, amount and status so we can match payments to bookings and issue invoices."]],
    ["How we use it", ["We use your information to confirm and carry out your trip, share trip details with the assigned driver, send booking and payment updates, provide support, and keep business records. We do not sell your personal information."]],
    ["Third-party services", ["We use Razorpay for payments, an email provider to send booking emails, and Google Maps services to suggest places and work out distances (the text you type in location fields is sent to Google for this). These providers handle data under their own policies."]],
    ["Cookies", ["We use a session cookie to keep you logged in. It is needed for your account to work."]],
    ["Keeping your data", ["We keep booking and payment records for as long as needed to run the service and meet legal and accounting requirements."]],
    ["Your choices", [`You can update your name and mobile number from your account. To ask us to correct or delete your information, contact us at ${site.email} or ${site.phone}.`]],
    ["Changes to this policy", ["We may update this policy from time to time. The date at the top shows when it was last changed."]],
  ]} />;
}
