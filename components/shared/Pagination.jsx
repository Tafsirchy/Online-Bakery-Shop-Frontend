'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  itemsPerPage,
  totalItems 
}) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5;
    
    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + showMax - 1);
      
      if (end === totalPages) {
        start = Math.max(1, end - showMax + 1);
      }
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 border-t border-border-light/50">
      <div className="text-sm text-muted font-medium italic">
        Showing <span className="font-bold text-brown">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
        <span className="font-bold text-brown">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
        <span className="font-bold text-brown">{totalItems}</span> entries
      </div>
      
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-xl border-border-light hover:bg-brown/5 text-brown transition-all"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-xl border-border-light hover:bg-brown/5 text-brown transition-all"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {getPageNumbers().map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            size="icon"
            className={`h-9 w-9 rounded-xl transition-all ${
              currentPage === page 
                ? 'bg-brown hover:bg-[#5a3828] text-white shadow-md' 
                : 'border-border-light hover:bg-brown/5 text-brown'
            }`}
            onClick={() => onPageChange(page)}
          >
            <span className="text-xs font-black">{page}</span>
          </Button>
        ))}
        
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-xl border-border-light hover:bg-brown/5 text-brown transition-all"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-xl border-border-light hover:bg-brown/5 text-brown transition-all"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
