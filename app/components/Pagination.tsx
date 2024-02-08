import { Link, useSearchParams } from '@remix-run/react';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

type PaginateClickEvent = {
  index: number | null;
  selected: number;
  nextSelectedPage: number | undefined;
  event: object;
  isPrevious: boolean;
  isNext: boolean;
  isBreak: boolean;
  isActive: boolean;
}

export default function PaginatedItems({ items }: { items: number[] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const itemsPerPage = 10;
  const pageCount = Math.ceil(items.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event: PaginateClickEvent) => {
    setSearchParams(prev => {
      prev.set("page", (event.selected + 1).toString());
      return prev;
    });
  };

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel="next >"
      onPageChange={handlePageClick}
      pageRangeDisplayed={10}
      pageCount={pageCount}
      previousLabel="< previous"
      renderOnZeroPageCount={null}
    />
  );
}