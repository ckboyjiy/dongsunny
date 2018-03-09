export interface SearchModel {
  query: string;
  display?: number;
  start?: number;
  sort?: 'ramdom' | 'comment';
}
