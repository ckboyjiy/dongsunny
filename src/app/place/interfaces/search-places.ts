import {Place} from './place';

export interface SearchPlaces {
  query?: string;
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: Place[];
}
