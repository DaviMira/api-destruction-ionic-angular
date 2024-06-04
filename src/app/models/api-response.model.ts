import { Product } from './product.model';

export class ApiResponse {
  constructor(
    public status: string,
    public products: Product[]
  ) {}

  static fromJson(json: any): ApiResponse {
    const products = json.products.map((product: any) => Product.fromJson(product));
    return new ApiResponse(json.status, products);
  }

  validate(): boolean {
    return this.status === 'success' && this.products.every(product => product.validate());
  }
}
