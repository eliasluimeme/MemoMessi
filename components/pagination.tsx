import { ChevronLeft, ChevronRight, Link } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const Pagination = ({ currentPage, totalPages }: PaginationProps) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <Button variant="outline" size="icon" disabled={currentPage === 1} asChild>
        <Link href={`/dashboard?page=${currentPage - 1}`}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button key={page} variant={currentPage === page ? 'default' : 'outline'} asChild>
          <Link href={`/dashboard?page=${page}`}>{page}</Link>
        </Button>
      ))}
      <Button variant="outline" size="icon" disabled={currentPage === totalPages} asChild>
        <Link href={`/dashboard?page=${currentPage + 1}`}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
};

export default Pagination;
