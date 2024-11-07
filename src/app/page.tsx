import { EmailLoginForm } from "@/components/email-login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blessed.fan | fund wallet"
};

export default function Home() {
  return (
    <EmailLoginForm />
  );
}
