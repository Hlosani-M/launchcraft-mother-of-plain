import { createWhatsAppUrl, generalEnquiryMessage } from "@/lib/whatsapp";
import { ExternalButton, LinkButton } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export default function NotFound() {
  return (
    <div className="container-page py-20 text-center sm:py-28">
      <p className="font-display text-8xl leading-none font-extrabold text-brand sm:text-9xl">404</p>
      <h1 className="mt-4 text-4xl font-extrabold uppercase sm:text-6xl">Looks like this cut has moved.</h1>
      <p className="mx-auto mt-3 max-w-md text-lg text-muted">
        The page you&apos;re looking for isn&apos;t here. Head back to the shop or ask the team.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <LinkButton href="/shop" size="lg">
          Back to shop
        </LinkButton>
        <ExternalButton href={createWhatsAppUrl(generalEnquiryMessage())} variant="whatsapp" size="lg">
          <WhatsAppIcon /> Ask on WhatsApp
        </ExternalButton>
      </div>
    </div>
  );
}
