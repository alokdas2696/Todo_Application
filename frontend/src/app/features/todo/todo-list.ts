import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule, FormControl } from "@angular/forms";
import { TodoService } from "../../core/services/todo.service";
import { Todo } from "../../shared/models/todo.model";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "app-todo-list",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: "./todo-list.html",
  styleUrls: ["./todo-list.scss"]
})
export class TodoListComponent implements OnInit, OnDestroy {
  private todoService = inject(TodoService);
  private snackBar = inject(MatSnackBar);

  todos: Todo[] = [];
  isLoading = false;

  // Search & Filters controls
  searchControl = new FormControl("");
  statusFilter = new FormControl("");
  priorityFilter = new FormControl("");
  sortBy = new FormControl("createdAt");
  sortOrder = "DESC"; // "ASC" | "DESC"

  // Pagination states
  total = 0;
  pageSize = 10;
  currentPage = 1;

  private searchSub!: Subscription;
  today = new Date();

  ngOnInit() {
    this.loadTodos();
    this.setupSearchDebounce();
  }

  ngOnDestroy() {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
    }
  }

  setupSearchDebounce() {
    this.searchSub = this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage = 1;
        this.loadTodos();
      });
  }

  isOverdue(dueDate: string | undefined): boolean {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const localToday = new Date();
    due.setHours(0, 0, 0, 0);
    localToday.setHours(0, 0, 0, 0);
    return due.getTime() < localToday.getTime();
  }

  loadTodos() {
    this.isLoading = true;
    const filters = {
      page: this.currentPage,
      limit: this.pageSize,
      search: this.searchControl.value || "",
      status: this.statusFilter.value || "",
      priority: this.priorityFilter.value || "",
      sortBy: this.sortBy.value || "createdAt",
      order: this.sortOrder
    };

    this.todoService.getTodos(filters).subscribe({
      next: (res) => {
        if (res.success) {
          this.todos = res.data.todos;
          this.total = res.data.total;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open("Error loading tasks.", "Close", { duration: 3000 });
      }
    });
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadTodos();
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === "ASC" ? "DESC" : "ASC";
    this.loadTodos();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadTodos();
  }

  toggleStatus(todo: Todo) {
    const newStatus = todo.status === "Completed" ? "Pending" : "Completed";
    this.todoService.updateTodoStatus(todo.id, newStatus).subscribe({
      next: (res) => {
        if (res.success) {
          todo.status = newStatus;
          this.snackBar.open(`Task marked as ${newStatus.toLowerCase()}.`, "Close", { duration: 2000 });
        }
      },
      error: () => {
        this.snackBar.open("Failed to update status.", "Close", { duration: 3000 });
      }
    });
  }

  deleteTodo(id: number) {
    if (confirm("Are you sure you want to delete this task?")) {
      this.todoService.deleteTodo(id).subscribe({
        next: (res) => {
          if (res.success) {
            this.snackBar.open("Task deleted successfully.", "Close", { duration: 2500 });
            this.loadTodos();
          }
        },
        error: () => {
          this.snackBar.open("Failed to delete task.", "Close", { duration: 3000 });
        }
      });
    }
  }
}
