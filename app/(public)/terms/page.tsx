export default function TermsPage() {
  return (
    <div className="container mx-auto">
      <div className="space-y-8 py-10">
        <h1 className="text-4xl font-bold">Terms of Service</h1>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By accessing and using this website, you accept and agree to be bound by the terms and
            provision of this agreement.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Use License</h2>
          <p className="text-muted-foreground">
            Permission is granted to temporarily download one copy of the materials (information or
            software) on our website for personal, non-commercial transitory viewing only.
          </p>
          <ul className="ml-4 list-inside list-disc space-y-2 text-muted-foreground">
            <li>This is the license, not a transfer of title</li>
            <li>You may not modify or copy the materials</li>
            <li>You may not use the materials for any commercial purpose</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. Disclaimer</h2>
          <p className="text-muted-foreground">
            The materials on our website are provided on an &apos;as is&apos; basis. We make no
            warranties, expressed or implied, and hereby disclaim and negate all other warranties
            including, without limitation, implied warranties or conditions of merchantability,
            fitness for a particular purpose, or non-infringement of intellectual property or other
            violation of rights.
          </p>
        </section>
      </div>
    </div>
  );
}
