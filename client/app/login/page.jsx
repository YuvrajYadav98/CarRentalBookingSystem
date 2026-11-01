import AuthForm from "@/components/auth/AuthForm";
export const metadata = { title: "Log in", robots: { index: false } };
export default function Page() { return <AuthForm mode="login" />; }
