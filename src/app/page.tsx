import { EmailLoginForm } from "@/components/email-login-form";
import { Metadata } from "next";
import { getTicketDetails } from "@/actions";

export const metadata: Metadata = {
  title: "Blessed.fan | fund wallet"
};

export default async function Home() {
  const ticketDetails = await getTicketDetails();

  return (
    <EmailLoginForm ticketDetails={ticketDetails} />
  );
}
