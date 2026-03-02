import Link from 'next/link';

export function Nav() {
  return (
    <nav className="bg-secondary p-4">
      <ul className="flex space-x-4">
        <li>
          <Link href="/dashboard" className="text-primary-foreground hover:text-primary">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/admin" className="text-primary-foreground hover:text-primary">
            Admin
          </Link>
        </li>
      </ul>
    </nav>
  );
}
