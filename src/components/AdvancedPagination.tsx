'use client';

import React from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from '@/components/ui/pagination';

interface AdvancedPaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    maxVisiblePages?: number;
}

export default function AdvancedPagination({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    maxVisiblePages = 7,
}: AdvancedPaginationProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Don't show pagination if there's only one page or no items
    if (totalPages <= 1) {
        return null;
    }

    // Calculate which pages to show
    const getVisiblePages = () => {
        const pages: (number | 'ellipsis')[] = [];
        
        if (totalPages <= maxVisiblePages) {
            // Show all pages if total pages is less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);
            
            // Calculate start and end of middle section
            let start = Math.max(2, currentPage - 2);
            let end = Math.min(totalPages - 1, currentPage + 2);
            
            // Adjust if we're near the beginning
            if (currentPage <= 3) {
                start = 2;
                end = Math.min(maxVisiblePages - 1, totalPages - 1);
            }
            
            // Adjust if we're near the end
            if (currentPage >= totalPages - 2) {
                start = Math.max(2, totalPages - maxVisiblePages + 2);
                end = totalPages - 1;
            }
            
            // Add ellipsis before start if needed
            if (start > 2) {
                pages.push('ellipsis');
            }
            
            // Add middle pages
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            // Add ellipsis after end if needed
            if (end < totalPages - 1) {
                pages.push('ellipsis');
            }
            
            // Always show last page if not already included
            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    const visiblePages = getVisiblePages();

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageClick = (page: number) => {
        if (page !== currentPage && page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <Pagination>
            <PaginationContent>
                {/* Previous Button */}
                <PaginationItem>
                    <PaginationPrevious
                        onClick={handlePrevious}
                        className={`cursor-pointer ${
                            currentPage === 1 
                                ? 'pointer-events-none opacity-50' 
                                : 'hover:bg-gray-100'
                        }`}
                    >
                        <span className="hidden sm:block">Trước</span>
                    </PaginationPrevious>
                </PaginationItem>

                {/* Page Numbers */}
                {visiblePages.map((page, index) => (
                    <PaginationItem key={index}>
                        {page === 'ellipsis' ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                onClick={() => handlePageClick(page)}
                                isActive={page === currentPage}
                                className={`cursor-pointer ${
                                    page === currentPage
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-gray-100'
                                }`}
                            >
                                {page}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                {/* Next Button */}
                <PaginationItem>
                    <PaginationNext
                        onClick={handleNext}
                        className={`cursor-pointer ${
                            currentPage === totalPages 
                                ? 'pointer-events-none opacity-50' 
                                : 'hover:bg-gray-100'
                        }`}
                    >
                        <span className="hidden sm:block">Sau</span>
                    </PaginationNext>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}