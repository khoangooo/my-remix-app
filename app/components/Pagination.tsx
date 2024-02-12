import { useSearchParams } from '@remix-run/react';
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

export default function PaginatedItems({
  pageCount,
  pageRangeDisplayed
}: {
  pageCount: number,
  pageRangeDisplayed: number
}) {
  const [searchParams, setSearchParams] = useSearchParams();

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
      pageRangeDisplayed={pageRangeDisplayed}
      pageCount={pageCount}
      previousLabel="< previous"
      renderOnZeroPageCount={null}
      activeClassName="active"
      containerClassName='pagination'
    />
  );
}