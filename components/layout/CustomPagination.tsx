"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";

interface Props {
  resPerPage: number;
  filteredRoomsCount: number;
}

const CustomPagination = ({ resPerPage, filteredRoomsCount }: Props) => {
     console.log("rees",resPerPage)
    console.log("fiilter",filteredRoomsCount)
    
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(filteredRoomsCount / resPerPage);

  // Get current page and clamp between 1 and totalPages
  let currentPage = Number(searchParams.get("page"));
  if (isNaN(currentPage) || currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const handlePageChange = (pageNumber: number) => {
    if (typeof window !== "undefined") {
      const validPage = Math.max(1, Math.min(totalPages, pageNumber));
      const params = new URLSearchParams(window.location.search);
      params.set("page", validPage.toString());
      router.push(`${window.location.pathname}?${params.toString()}`);
    }
  };

  if (resPerPage >= filteredRoomsCount) return null;

  // Generate page numbers dynamically (with "..." if needed)
  const pages: (number | "...")[] = [];
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (startPage > 1) pages.push(1);
  if (startPage > 2) pages.push("...");

  for (let i = startPage; i <= endPage; i++) pages.push(i);

  if (endPage < totalPages - 1) pages.push("...");
  if (endPage < totalPages) pages.push(totalPages);

  return (
    <div className="flex flex-wrap gap-2 justify-center mt-5">
      {/* First */}
      <Button
        size="sm"
        disabled={currentPage === 1}
        className="bg-white text-red-600 border border-gray-300 hover:bg-red-500 hover:text-white"
        onClick={() => handlePageChange(1)}
      >
        First
      </Button>

      {/* Prev */}
      <Button
        size="sm"
        disabled={currentPage === 1}
        className="bg-white text-red-600 border border-gray-300 hover:bg-red-500 hover:text-white"
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Prev
      </Button>

      {/* Page numbers */}
      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={idx}
            className="px-3 py-1 text-gray-400 cursor-default select-none"
          >
            ...
          </span>
        ) : (
          <Button
            key={page}
            size="sm"
            className={`${
              page === currentPage
                ? "bg-red-600 text-white border border-red-600"
                : "bg-white text-red-600 border border-gray-300 hover:bg-red-500 hover:text-white"
            }`}
            onClick={() => handlePageChange(page as number)}
          >
            {page}
          </Button>
        )
      )}

      {/* Next */}
      <Button
        size="sm"
        disabled={currentPage === totalPages}
        className="bg-white text-red-600 border border-gray-300 hover:bg-red-500 hover:text-white"
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
      </Button>

      {/* Last */}
      <Button
        size="sm"
        disabled={currentPage === totalPages}
        className="bg-white text-red-600 border border-gray-300 hover:bg-red-500 hover:text-white"
        onClick={() => handlePageChange(totalPages)}
      >
        Last
      </Button>
    </div>
  );
};

export default CustomPagination;
