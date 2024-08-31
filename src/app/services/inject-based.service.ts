import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InjectBasedService {
  private http = inject(HttpClient);

  // Methods will be added here
}
