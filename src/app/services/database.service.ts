import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private dbInstance!: SQLiteObject;

  constructor(private sqlite: SQLite) {}

  async initializeDatabase(): Promise<void> {
    try {
      const db = await this.sqlite.create({
        name: 'productss.db',
        location: 'default'
      });
      this.dbInstance = db;
      await db.executeSql(`CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        consoleName TEXT,
        productName TEXT,
        timestamp INTEGER
      )`, []);
    } catch (error) {
      console.error('Error initializing database', error);
    }
  }

  async addProduct(product: Product): Promise<void> {
    try {
      const timestamp = Date.now();
      await this.dbInstance.executeSql('INSERT OR REPLACE INTO products (id, consoleName, productName, timestamp) VALUES (?, ?, ?, ?)', 
        [product.id, product.consoleName, product.productName, timestamp]
      );
    } catch (error) {
      console.error('Error adding product', error);
    }
  }

  async getProducts(): Promise<Product[]> {
    try {
      const res = await this.dbInstance.executeSql('SELECT * FROM products ORDER BY timestamp DESC', []);
      let products: Product[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        products.push(new Product(res.rows.item(i).consoleName, res.rows.item(i).id, res.rows.item(i).productName));
      }
      return products;
    } catch (error) {
      console.error('Error fetching products', error);
      return [];
    }
  }
}
