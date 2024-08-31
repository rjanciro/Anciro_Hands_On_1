import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ConstructorBasedService } from '../../services/constructor-based.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit {
  products: any[] = [];
  product: any = {};
  productForm: FormGroup;
  isModalOpen = false;
  selectedImage: string | null = null;
  limit: number = 10;
  sortBy: string = '';
  selectedProduct: any = null;

  constructor(private productService: ConstructorBasedService, private fb: FormBuilder) { 
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      category: ['', Validators.required],
      image: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getProducts();
  }

  openImageModal(product: any): void {
    this.selectedImage = product.image;
  }
  
  closeImageModal(): void {
    this.selectedImage = null;
  }

  getProducts(): void {
    this.productService.getProductsWithParams(this.limit).subscribe((data: any[]) => {
      this.products = this.sortProducts(data);
    });
  }

  getProduct(id: number): void {
    this.productService.getProduct(id).subscribe((data: any) => {
      this.product = data;
      this.productForm.patchValue(data);
    });
  }

  createProduct(): void {
    const newProduct = this.productForm.value;

    this.productService.createProduct(newProduct).subscribe((data: any) => {
      this.products.push(data);
      this.productForm.reset();
      this.closeModal();
    });
  }

  updateProduct(id: number): void {
    const updatedProduct = this.productForm.value;

    this.productService.updateProduct(id, updatedProduct).subscribe((data: any) => {
      const index = this.products.findIndex(product => product.id === id);
      this.products[index] = data;
      this.productForm.reset();
      this.closeModal();
    });
  }

  deleteProduct(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe(() => {
          this.products = this.products.filter(product => product.id !== id);
          Swal.fire(
            'Deleted!',
            'Your product has been deleted.',
            'success'
          );
        });
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const product = this.productForm.value;
      if (this.product.id) {
        this.productService.updateProduct(this.product.id, product).subscribe(updatedProduct => {
          const index = this.products.findIndex(p => p.id === updatedProduct.id);
          this.products[index] = updatedProduct;
          this.closeModal();
          Swal.fire('Updated!', 'Your product has been updated.', 'success');
        });
      } else {
        this.productService.createProduct(product).subscribe(newProduct => {
          this.products.push(newProduct);
          this.closeModal();
          Swal.fire('Added!', 'Your new product has been added.', 'success');
        });
      }
    }
  }

  editProduct(product: any): void {
    this.product = product;
    this.productForm.patchValue(product);
    this.openModal();
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onLimitChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.limit = parseInt(target.value, 10);
    this.getProducts();
  }

  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.sortBy = target.value;
    this.products = this.sortProducts([...this.products]);
  }

  sortProducts(products: any[]): any[] {
    if (!this.sortBy) return products;

    return products.sort((a, b) => {
      if (this.sortBy === 'price') {
        return a.price - b.price;
      } else if (this.sortBy === '-price') {
        return b.price - a.price;
      } else if (this.sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (this.sortBy === '-title') {
        return b.title.localeCompare(a.title);
      } else if (this.sortBy === 'category') {
        return a.category.localeCompare(b.category);
      } else if (this.sortBy === '-category') {
        return b.category.localeCompare(a.category);
      }
      return 0;
    });
  }

  viewProduct(product: any): void {
    this.selectedProduct = product;
  }

  closeViewModal(): void {
    this.selectedProduct = null;
  }
}
