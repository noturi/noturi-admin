import 'ky';
import '@tanstack/react-table';

declare module 'ky' {
  interface Options {
    cache?: RequestCache | 'force-cache' | 'no-store';
    next?: NextFetchRequestConfig;
  }
}

interface NextFetchRequestConfig {
  revalidate?: number | false;
  tags?: string[];
}
