import { Form, Link } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import {
  useLoaderData
} from "@remix-run/react";
import { getFeatureMovies, getMovieDetail } from "~/api";
import Image from "~/components/Image";
import PaginatedItems from "~/components/Pagination";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const page = Number(new URL(request.url).searchParams.get('page')) || 1;
  const res = await getFeatureMovies({ page });
  return json({ data: res.status === "success" ? res.items : [], paginate: res.paginate, page });
};

function setSearchParamsString(
  searchParams: URLSearchParams,
  changes: Record<string, string | number | undefined>,
) {
  const newSearchParams = new URLSearchParams(searchParams)
  for (const [key, value] of Object.entries(changes)) {
    if (value === undefined) {
      newSearchParams.delete(key)
      continue
    }
    newSearchParams.set(key, String(value))
  }
  // Print string manually to avoid over-encoding the URL
  // Browsers are ok with $ nowadays
  // optional: return newSearchParams.toString()
  return Array.from(newSearchParams.entries())
    .map(([key, value]) =>
      value ? `${key}=${encodeURIComponent(value)}` : key,
    )
    .join("&")
}

export default function Main() {
  const { data, paginate } = useLoaderData<typeof loader>();
  const pages = Array.from({ length: paginate.total_page }).map((_, i) => ++i)

  return (
    <div className="main-search">
      <div className="main-search__inner">
        <div className="main-search__forms">
          <Form id="search-form" role="search">
            <input
              id="slug"
              aria-label="Search films"
              placeholder="Search"
              type="search"
              name="slug"
            />
          </Form>
          <Form method="get">
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
        <nav className="main-search__paginate">
          <PaginatedItems items={pages} />
        </nav>
      </div>
    </div>
  )
}