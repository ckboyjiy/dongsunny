import { Component, OnInit } from '@angular/core';
import { PlaceService } from '../place.service';
import {Place} from '../interfaces/place';
import {SearchPlaces} from '../interfaces/search-places';
import {Subject} from 'rxjs/Subject';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

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
  constructor(private placeService: PlaceService) {}

  /**
   * 컴포넌트 초기화 작업
   * 지역을 검색할 단어를 변경할 때마다 지역목록을 가져오기
   */
  ngOnInit() {
    this.searchText.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(text => this.searchPlaces(text));
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
          if (this.previewText === data.query) {
            this.appendPlace(this.places, data);
          } else {
            this.overwritePlaces(this.places, data);
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
    if (this.places.length > 0 && this.places.length <= this.total) {
      return true;
    } else {
      return false;
    }
  }

  clickPlace(place: Place, event: Event) {
    console.log('EVENT', event);
  }
}
