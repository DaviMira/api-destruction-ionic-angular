import { ChangeDetectorRef, Component, OnInit, NgZone } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ApiResponse } from '../models/api-response.model';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  apiResponse: ApiResponse | null = null;
  searchQuery: string = '';
  private searchSubject: Subject<string> = new Subject();
  loading: boolean = false;

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(2000),
      distinctUntilChanged()
    ).subscribe(query => {
      this.ngZone.run(() => {
        this.fetchProducts(query);
      });
    });
  }

  onSearchChange(event: any): void {
    const query = event.target?.value || '';
    console.log('onSearchChange.loading.before: ', this.loading);
    console.log('onSearchChange.loading.after: ', this.loading);
    this.searchSubject.next(query);
  }

  onSearchClick(): void {
    console.log('onSearchClick.loading.before: ', this.loading);
    this.ngZone.run(() => {
      this.fetchProducts(this.searchQuery);
    });
    console.log('onSearchClick.loading.after: ', this.loading);
  }

  fetchProducts(query: string): void {
    if (query.trim()) {
      console.log('fetchProducts.loading.before: ', this.loading);
      this.setLoading(true);
      this.cdr.detectChanges();
      console.log('fetchProducts.loading.after: ', this.loading);
      this.apiService.getProductData(query).toPromise()
        .then(response => {
          if (response?.validate()) {
            this.apiResponse = response;
            this.setLoading(false);
            this.cdr.detectChanges();
          } else {
            console.error('Invalid response data');
          }
        })
        .catch(error => {
          this.setLoading(false);
          this.cdr.detectChanges();
          console.error('Error fetching data', error);
        });
    }
  }

  private setLoading(state: boolean): void {
    this.loading = state;
    this.cdr.detectChanges();
  }
}
