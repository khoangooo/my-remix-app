import type { FeatureMovie, Movie, Paginate, Status } from "./types";

const baseURL = "https://phim.nguonc.com/api";

const fetchConfig = ({
  type = 'json',
  method = "GET"
}: {
  type?: 'json' | 'text' | 'blob' | 'formData' | 'arrayBuffer';
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
} = {
}) => {
  return {
    method,
    headers: { 'Content-Type': 'application/json', Accept: `application/${type}` },
  };
}

export const getFeatureMovies = async ({ page = 1 }: { page?: number }): Promise<{
  items: FeatureMovie[],
  paginate: Paginate,
  status: Status,
}> => {
  const response = await fetch(`${baseURL}/films/phim-moi-cap-nhat?page=${page}`, fetchConfig());
  return response.json();
}

export const getMovieDetail = async ({ slug = "" }: { slug?: string }): Promise<{
  movie: Movie,
  status: Status,
}> => {
  const response = await fetch(`${baseURL}/film/${slug}`, fetchConfig());
  return response.json();
}