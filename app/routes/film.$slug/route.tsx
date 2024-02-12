import { json } from "@remix-run/node";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  useLoaderData
} from "@remix-run/react";
import { getMovieDetail } from "~/api";
import invariant from "tiny-invariant";
import Image from "~/components/image";
import styles from "./styles.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const slug = url.pathname.split("/").pop();
  invariant(slug, "params.slug is required");

  const res = await getMovieDetail({ slug });
  invariant(res, `Movie not found: ${slug}`);
  return json({ data: res.status === "success" ? res.movie : null });

};

export default function Movie() {
  const { data } = useLoaderData<typeof loader>();

  return (
    <div className="main-movie">
      <h1 style={{ textAlign: 'center' }}>{data?.name}</h1>
      <div className="main-movie__poster-with-description">
        <Image src={data?.poster_url} alt={data?.name} width={500} />
        <p>{data?.description}</p>
      </div>
      {data?.episodes?.map((episode, i) => {
        return (
          <fieldset key={`episode-${++i}`}>
            <legend style={{ marginLeft: 20 }}>Season {++i}:</legend>
            {episode.items.map((item) => (
              <div key={item.slug}>
                <h3>{item.name}</h3>
                <a href={item.embed} target="_blank">Watch</a>
              </div>
            ))}
          </fieldset>
        )
      })}
    </div>
  )
}