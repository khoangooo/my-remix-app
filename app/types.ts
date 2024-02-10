export type Status = 'success' | 'error' | 'warning' | 'info';

export type Paginate = {
  current_page?: number;
  total_page?: number;
  total_items?: number;
  items_per_page?: number;
}

export type Category = {
  [key: string]: {
    group: {
      id: string;
      name: string;
    };
  };
}

export type Episode = {
  server_name: string;
  items: {
    name: string;
    slug: string;
    m3u8: string;
    embed: string;
  }[]
}

export type Movie = {
  id: string;
  name: string;
  slug: string;
  original_name: string;
  thumb_url: string;
  poster_url: string;
  created: string;
  modified: string;
  description: string | null;
  total_episodes: number;
  current_episode: string;
  time: string | null;
  quality: string;
  language: string;
  director: string | null;
  casts: string[] | null;
  category: Category;
  episodes: Episode[];
}

export type FeatureMovie = Pick<Movie, 'name' | 'slug' | 'original_name' | 'thumb_url' | 'poster_url' | 'modified'>;