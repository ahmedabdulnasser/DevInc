import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState, useEffect } from "react";

export function PostPagination({ handlers, noPages, pageNo }) {
  const { handlePagePrev, handlePageNext, handlePageChange } = handlers;
  const [startIndex, setStartIndex] = useState(0);
  const batchSize = 5;

  const pages = [];
  let current = startIndex;
  for (let i = 0; i < batchSize; i++) {
    if (current >= noPages) break;
    pages.push(current);
    current++;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={pageNo === 1}
            className="cursor-pointer"
            onClick={() => {
              if (pageNo === startIndex + 1) {
                const newStart = Math.max(0, startIndex - (batchSize - 1));
                setStartIndex(newStart);
              }
              handlePagePrev();
            }}
          />
        </PaginationItem>

        {pages.map((i) => (
          <PaginationItem key={i} className="cursor-pointer">
            <PaginationLink
              onClick={() => {
                const clickedPage = i + 1;
                // Update page first
                handlePageChange(clickedPage);
                // Then adjust batch window if needed
                if (i === pages[pages.length - 1]) {
                  setStartIndex(i);
                }
              }}
              isActive={pageNo === i + 1}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            disabled={pageNo === noPages}
            className="cursor-pointer"
            onClick={() => {
              if (pageNo === startIndex + batchSize) {
                setStartIndex(pageNo - 1);
              }
              handlePageNext();
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
