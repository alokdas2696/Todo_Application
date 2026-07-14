import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Todo } from "../../shared/models/todo.model";

@Injectable({
  providedIn: "root"
})
export class TodoService {
  private http = inject(HttpClient);
  private apiUrl = "http://localhost:3000/api/todos";

  getTodos(
    filters: {
      page?: number;
      limit?: number;
      status?: string;
      priority?: string;
      search?: string;
      sortBy?: string;
      order?: string;
    } = {}
  ): Observable<any> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        params = params.set(key, val.toString());
      }
    });

    return this.http.get<any>(this.apiUrl, { params });
  }

  getTodoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createTodo(todo: Partial<Todo>): Observable<any> {
    return this.http.post<any>(this.apiUrl, todo);
  }

  updateTodo(id: number, todo: Partial<Todo>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, todo);
  }

  deleteTodo(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  updateTodoStatus(id: number, status: "Pending" | "Completed"): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/status`, { status });
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }
}
