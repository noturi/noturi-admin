import 'ky';
import '@tanstack/react-table';

declare module 'ky' {
  interface Options {
    cache?: 'force-cache' | 'no-store';
    next?: NextFetchRequestConfig;
  }
}
