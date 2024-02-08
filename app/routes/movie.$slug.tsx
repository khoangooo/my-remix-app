import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import {
  useLoaderData
} from "@remix-run/react";
import { getMovieDetail } from "~/api";
import invariant from "tiny-invariant";

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
    <div>
      <h1>{data?.name}</h1>
      <p>{data?.description}</p>
      {data?.episodes?.map((episode, i) => {
        return (
          <fieldset key={`episode-${++i}`}>
            <legend>Season {i++}:</legend>
            {episode.items.map((item) => {
              return (
                <div key={item.slug}>
                  <h3>{item.name}</h3>
                  <a href={item.embed} target="_blank">Watch</a>
                </div>
              )
            })}
          </fieldset>
        )
      })}
    </div>
  )
}