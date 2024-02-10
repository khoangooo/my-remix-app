import * as cheerio from 'cheerio';
import type { FeatureMovie, Movie, Paginate, Status } from "./types";

const baseURL = "https://phim.nguonc.com";

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
  const response = await fetch(`${baseURL}/api/films/phim-moi-cap-nhat?page=${page}`, fetchConfig());
  return response.json();
}

export const getMovieDetail = async ({ slug = "" }: { slug?: string }): Promise<{
  movie?: Movie,
  status: Status,
}> => {
  try {
    const response = await fetch(`${baseURL}/api/film/${slug}`, fetchConfig());
    return response.json();
  } catch (error) {
    return {
      status: "error",
    }
  }
}

const parseCrawledMovies = (htmlText: string): { data: FeatureMovie[], paginate: Paginate } => {
  const $ = cheerio.load(htmlText);
  const data: FeatureMovie[] = [];
  const targetElm = $('table');
  if (!targetElm) return {
    data: [],
    paginate: {
      current_page: 1,
      total_page: 0,
      total_items: data.length,
      items_per_page: data.length,
    }
  };

  const rows = $(targetElm).find('tbody tr');
  const pagesElm = $('.pagination .page-item');
  const currentPage = $('.pagination .page-item.active');
  const totalPages = $(pagesElm).eq(pagesElm.length === 1 ? 0 : pagesElm.length - 2)?.text();

  rows.each((i, row) => {
    const cells = $(row).find('td');
    const item = {
      thumb_url: $(cells).eq(0)?.find('img')?.attr('data-src') as string,
      poster_url: $(cells).eq(0)?.find('a')?.attr('data-src') as string,
      name: $(cells).eq(0)?.find('h3')?.text() as string,
      original_name: $(cells)?.eq(0).find('h4')?.text() as string,
      slug: $(cells).eq(0)?.find('a')?.attr('href')?.split('/')?.pop() as string,
      modified: cells.eq(cells.length - 1)?.text() as string,
    };
    data.push(item);
  })

  return {
    data,
    paginate: {
      current_page: Number(currentPage.text()) || 1,
      total_page: Number(totalPages),
      total_items: 0,
      items_per_page: data.length,
    }
  }
}

export const searchMovies = async ({ keyword = "", page = 1 }: { keyword?: string, page?: number }): Promise<{
  items?: FeatureMovie[],
  paginate?: Paginate,
  status: Status,
}> => {
  let searchParams = "";
  if (keyword) {
    searchParams = `keyword=${keyword}`;
  }
  if (page) {
    searchParams += `&page=${page}`;
  }
  try {
    const response = await fetch(`${baseURL}/tim-kiem?${searchParams}`);
    const htmlText = await response.text();
    const resJson = parseCrawledMovies(htmlText);
    return {
      items: resJson.data,
      paginate: resJson.paginate,
      status: "success",
    }
  } catch (error) {
    return {
      status: "error",
    }
  }
}