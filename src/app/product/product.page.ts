import { ChangeDetectorRef, Component, OnInit, NgZone } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ApiResponse } from '../models/api-response.model';
import { DatabaseService } from '../services/database.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Product } from '../models/product.model';

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
  displayTitle: string = '';

  constructor(
    private apiService: ApiService,
    private dbService: DatabaseService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.dbService.initializeDatabase();

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
    this.searchSubject.next(query);
  }

  onSearchClick(): void {
    this.ngZone.run(() => {
      this.fetchProducts(this.searchQuery);
    });
  }

  fetchProducts(query: string): void {
    if (query.trim()) {
      this.setLoading(true);
      this.cdr.detectChanges();

      this.apiService.getProductData(query).toPromise()
        .then(response => {
          if (response?.validate()) {
            this.apiResponse = response;
            this.displayTitle = 'Resultados';
            this.saveProducts(response.products);
            this.setLoading(false);
            this.cdr.detectChanges();
          } else {
            console.error('Invalid response data');
            this.setLoading(false);
            this.cdr.detectChanges();
          }
        })
        .catch(error => {
          this.setLoading(false);
          this.cdr.detectChanges();
          console.error('Error fetching data', error);
        });
    }
  }

  private saveProducts(products: Product[]): void {
    products.forEach(product => {
      console.log("saveProducts.product: ", product);
      this.dbService.addProduct(product).catch(error => {
        console.error('Error saving product', error);
      });
    });
  }

  onViewHistoryClick(): void {
    this.dbService.getProducts().then(products => {
      this.apiResponse = new ApiResponse('success', products);
      this.displayTitle = 'Histórico';
      this.cdr.detectChanges();
    }).catch(error => {
      console.error('Error fetching history', error);
    });
  }

  clearProducts(): void {
    this.apiResponse = null;
    this.displayTitle = '';
    this.cdr.detectChanges();
  }

  private setLoading(state: boolean): void {
    this.loading = state;
    this.cdr.detectChanges();
  }
}
