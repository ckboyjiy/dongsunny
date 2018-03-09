import { Component, OnInit } from '@angular/core';
import { PlaceService } from '../place.service';
import {Place} from '../interfaces/place';
import {SearchPlaces} from '../interfaces/search-places';
import {Subject} from 'rxjs/Subject';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {PlaceDialogComponent} from '../place-dialog/place-dialog.component';
import { empty } from 'rxjs/observable/empty';
import {SearchPlacesWithMap} from '../interfaces/search-places-with-map';
declare var naver: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  private places: Place[] = [];
  private searchText: Subject<string> = new Subject<string>();
  private previewText: string;
  private startNum = 1;
  private displayNum = 10;
  private total = 0;
  constructor(private placeService: PlaceService, private dialog: MatDialog) {}

  /**
   * 컴포넌트 초기화 작업
   * 지역을 검색할 단어를 변경할 때마다 지역목록을 가져오기
   */
  ngOnInit() {
    this.searchText.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(text => {
      this.searchPlaces(text);
    });
  }

  /**
   * 검색어를 입력할 때마다 구독할 수 있도록 추가 작업
   * @param text
   */
  enterText(text) {
    this.startNum = 1;
    this.searchText.next(text);
  }

  /**
   * 목록 하단의 더보기를 클릭하여 다음 지역목록을 가져오기
   */
  nextPlaces() {
    this.startNum += this.displayNum;
    this.searchPlaces(this.previewText);
  }

  /**
   * 전달받은 검색어로 지역 검색 후 화면 갱신하기
   * @param {string} text
   */
  searchPlaces(text: string) {
    if (!text) {
      this.places = [];
    } else {
      const sub = this.placeService.search({query: text, display: this.displayNum, start: this.startNum})
        .subscribe((data: SearchPlaces) => {
          console.log(data);
          // 검색된 결과가 없는 경우 지도 API에서 주소 검색을 한다.
          if (data.items.length > 0) {
            if (this.previewText === data.query) {
              this.appendPlace(this.places, data);
            } else {
              this.overwritePlaces(this.places, data);
            }
          } else {
            this.searchPlacesWithMapAPI(text);
          }

          this.previewText = data.query;
          this.displayNum = data.display;
          this.startNum = data.start;
          this.total = data.total;
          console.log(this.places);
          sub.unsubscribe();
        });
    }
  }

  /**
   * 전달받은 목록으로 지역목록을 덮어쓰기
   * @param {Place[]} target
   * @param {SearchPlaces} data
   */
  overwritePlaces(target: Place[], data: SearchPlaces) {
    this.places = data.items;
  }

  /**
   * 기존 지역목록에 전달받은 목록을 추가하기
   * @param {Place[]} target
   * @param {SearchPlaces} data
   */
  appendPlace(target: Place[], data: SearchPlaces) {
    data.items.reduce((pre, cur) => {
      pre.push(cur);
      return pre;
    }, this.places);
  }

  /**
   * 현재 더보기 버튼 사용 가능 여부
   * 1. 목록이 없을 땐 숨김
   * 2. places 갯수가 total보다 작은 경우 보임
   * @returns {boolean}
   */
  isAvailableNext(): boolean {
    if (this.places.length > 0 && this.places.length < this.total) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 선택한 지역(장소)를 화면에 표시한다.
   * @param {Place} place
   */
  clickPlace(place: Place) {
    const dialogRef = this.dialog.open(PlaceDialogComponent, {
      data: {
        place: place
      },
      minWidth: '60%',
      maxWidth: '90%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('RESULT', result);
    });
  }

  /**
   * 지도 API를 통해 주소를 검색 후 검색과 동일한 타입으로 가공하여 반환한다.
   * @param {string} text
   */
  searchPlacesWithMapAPI(text: string) {
    naver.maps.Service.geocode({
      address: text,
      coordType: 'tm128'
    }, (status: any, response: SearchPlacesWithMap) => {
      // 검색에 실패하면 빈 Observable 객체를 반환
      if (status !== naver.maps.Service.Status.OK) {
        console.log('Something wrong!');
        return empty();
      } else {
        const result = response.result, // 검색 결과의 컨테이너
          items = result.items; // 검색 결과의 배열
        console.log('response', response);
        const searchPlaces = {
          query: result.userquery,
          start: 1,
          total: result.total,
          items: result.items.map(data => {
            // 검색 결과와 동일한 형태로 가공한다.
            const searchResult = {
               title: data.address
            } as Place;
            if (data.isRoadAddress) {
              searchResult.roadAddress = data.address;
            } else {
              searchResult.address = data.address;
            }
            searchResult.mapx = data.point.x;
            searchResult.mapy = data.point.y;
            /*const aaa = naver.maps.TransCoord.fromLatLngToTM128({
              x: data.point.x,
              y: data.point.y
            });
            searchResult.mapx = aaa.x;
            searchResult.mapy = aaa.y;
            console.log('aaa', aaa);
            console.log('bbb', naver.maps.TransCoord.fromTM128ToLatLng(aaa));*/
            console.log(searchResult);
            return searchResult;
          })
        } as SearchPlaces;
        this.places = searchPlaces.items;
      }
    });
  }
}
