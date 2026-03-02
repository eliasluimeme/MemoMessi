export default function PrivacyPage() {
  return (
    <div className="container mx-auto">
      <div className="space-y-8 py-10">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Information We Collect</h2>
          <p className="text-muted-foreground">
            We collect information that you provide directly to us, including when you create an
            account, make a purchase, or contact us for support. This may include:
          </p>
          <ul className="ml-4 list-inside list-disc space-y-2 text-muted-foreground">
            <li>Name and contact information</li>
            <li>Payment information</li>
            <li>Device and usage information</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
          <p className="text-muted-foreground">
            We use the information we collect to provide, maintain, and improve our services, to
            develop new ones, and to protect our company and our users.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Data Retention</h2>
          <p className="text-muted-foreground">
            We retain personal information we collect from you where we have an ongoing legitimate
            business need to do so (for example, to provide you with a service you have requested or
            to comply with applicable legal requirements).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Your Rights</h2>
          <p className="text-muted-foreground">
            You have the right to access, update, or delete your information at any time. You can
            also object to processing of your personal information, ask us to restrict processing of
            your personal information or request portability.
          </p>
        </section>
      </div>
    </div>
  );
}
