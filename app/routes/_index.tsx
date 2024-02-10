import { Form, Link } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import {
  useLoaderData
} from "@remix-run/react";
import { getFeatureMovies, searchMovies } from "~/api";
import Image from "~/components/Image";
import PaginatedItems from "~/components/Pagination";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const page = Number(new URL(request.url).searchParams.get('page')) || 1;
  const keyword = new URL(request.url).searchParams.get('keyword') || "";
  let res;
  if (keyword) {
    res = await searchMovies({ keyword, page });
  } else {
    res = await getFeatureMovies({ page });
  }
  return json({
    data: res.status === "success" ? res.items : [],
    paginate: res.status === "success" ? res.paginate : null
  });
};

export default function Main() {
  const { data = [], paginate = null } = useLoaderData<typeof loader>();
  const totalPage = paginate?.total_page || 1;
  const itemsPerPage = paginate?.items_per_page || 10;

  return (
    <div className="main-search">
      <div className="main-search__inner">
        <div className="main-search__forms">
          <Form id="search-form" role="search" method="GET" action="/">
            <input
              id="keyword"
              aria-label="Search films"
              placeholder="Search"
              type="search"
              name="keyword"
            />
            <button type="submit">Search</button>
          </Form>
        </div>
        <ul className="main-search__list">
          {data.map((item) => (
            <li className="main-search__item" key={item.slug}>
              <div className="main-search__image">
                <Image src={item.thumb_url} alt={item.name} width={250} height={400} />
              </div>
              <div className="main-search__text">
                <h2 className="main-search__title">{item.name}</h2>
                <div className="main-search__cta">
                  <Link to={`/movie/${item.slug}`}>
                    Detail
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {totalPage > 1 && (
          <nav className="main-search__paginate">
            <PaginatedItems pageCount={totalPage} pageRangeDisplayed={itemsPerPage} />
          </nav>
        )}
      </div>
    </div>
  )
}