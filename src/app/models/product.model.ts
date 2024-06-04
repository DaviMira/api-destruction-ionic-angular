export class Product {
  constructor(
    public consoleName: string,
    public id: string,
    public productName: string
  ) {}

  static fromJson(json: any): Product {
    return new Product(
      json['console-name'],
      json['id'],
      json['product-name']
    );
  }

  validate(): boolean {
    return this.consoleName !== '' && this.id !== '' && this.productName !== '';
  }
}
