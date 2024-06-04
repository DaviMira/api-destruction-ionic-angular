import { Component, OnInit } from '@angular/core';
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

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(2000),
      distinctUntilChanged()
    ).subscribe(query => {
      this.fetchProducts(query);
    });
  }

  onSearchChange(event: any): void {
    const query = event.target?.value || '';
    this.searchSubject.next(query);
  }

  onSearchClick(): void {
    this.fetchProducts(this.searchQuery);
  }

  fetchProducts(query: string): void {
    if (query.trim()) {
      this.apiService.getProductData(query).subscribe(
        response => {
          if (response.validate()) {
            this.apiResponse = response;
          } else {
            console.error('Invalid response data');
          }
        },
        error => {
          console.error('Error fetching data', error);
        }
      );
    }
  }
}
