import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {SearchModel} from './interfaces/search';
import { map } from 'rxjs/operators';
import { empty } from 'rxjs/observable/empty';
import {SearchPlaces} from './interfaces/search-places';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class PlaceService {

  constructor(private http: HttpClient) { }

  search(searchModel: SearchModel): Observable<SearchPlaces> {
    const url = new URL('http://localhost:3000/place/search');
    if (searchModel.query) {
      url.searchParams.append('query', searchModel.query);
    } else {
      return empty();
    }
    if (searchModel.display) {
      url.searchParams.append('display', searchModel.display.toLocaleString());
    }
    if (searchModel.start) {
      url.searchParams.append('start', searchModel.start.toLocaleString());
    }
    if (searchModel.sort) {
      url.searchParams.append('sort', searchModel.sort);
    }

    return this.http.jsonp(url.href, 'callback').pipe(
      map(data => {
        const result: SearchPlaces = JSON.parse(decodeURIComponent(data.toLocaleString()));
        result.query = searchModel.query;
        return result;
      })
    );
  }
}
