import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private http: HttpClient) {}

  getTodo(): Observable<any> {
    return this.http.get('https://dummyjson.com/todos').pipe(
      catchError(error => {
        console.error('Error fetching todos:', error);
        return throwError(() => error);
      })
    );
  }
}
