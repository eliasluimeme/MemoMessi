import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PaginationProps {
  //   selectedRows: number;
  //   totalRows: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function UsersTablePagination({
  //   selectedRows,
  //   totalRows,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="flex flex-col gap-6 px-2 py-4">
      {/* <div className="text-sm text-muted-foreground">
        {selectedRows} of {totalRows} row(s) selected
      </div> */}

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between sm:justify-start sm:gap-4">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="h-10 w-[100px] sm:h-8 sm:w-[70px]">
                <SelectValue placeholder={pageSize.toString()} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="text-sm font-medium sm:ml-4">
            Page {currentPage} of {totalPages}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:flex sm:gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-full sm:h-8 sm:w-8"
            disabled={isFirstPage}
            onClick={() => onPageChange(1)}
          >
            <ChevronFirst className="h-5 w-5 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-full sm:h-8 sm:w-8"
            disabled={isFirstPage}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeft className="h-5 w-5 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-full sm:h-8 sm:w-8"
            disabled={isLastPage}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRight className="h-5 w-5 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-full sm:h-8 sm:w-8"
            disabled={isLastPage}
            onClick={() => onPageChange(totalPages)}
          >
            <ChevronLast className="h-5 w-5 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
