import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Todo } from '../../models/task';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private http: HttpClient) {}

  getTodo(): Observable<Todo> {
    return this.http.get<Todo>('https://dummyjson.com/todos/random').pipe(
      catchError(error => {
        console.error('Error fetching todos:', error);
        return throwError(() => new Error('Error fetching todos: ' + (error?.message || error)));
      })
    );
  }
}
