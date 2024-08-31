import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConstructorBasedService {
  private apiUrl = 'https://fakestoreapi.com/products';

  constructor(private http: HttpClient) { }

  // Get all products
  getProducts(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Get a single product by id
  getProduct(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Create a new product
  createProduct(product: any): Observable<any> {
    return this.http.post(this.apiUrl, product);
  }

  // Update an existing product
  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product);
  }

  // Delete a product
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getProductsWithParams(limit?: number): Observable<any> {
    let params = new HttpParams();
    if (limit) {
      params = params.append('limit', limit.toString());
    }
    return this.http.get(this.apiUrl, { params });
  }
}
