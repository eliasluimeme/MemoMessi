import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-black/50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <div className="text-sm text-muted-foreground">
              © 2024 MemoMessi. All rights reserved.
            </div>
            <div className="text-xs text-muted-foreground">
              Developed with ❤️ by{' '}
              <a
                href="https://akryelias.me"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                akryelias.me
              </a>
            </div>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
