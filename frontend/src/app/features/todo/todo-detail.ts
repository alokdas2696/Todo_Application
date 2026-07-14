import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, ActivatedRoute, RouterModule } from "@angular/router";
import { TodoService } from "../../core/services/todo.service";
import { Todo } from "../../shared/models/todo.model";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-todo-detail",
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: "./todo-detail.html",
  styleUrls: ["./todo-detail.scss"]
})
export class TodoDetailComponent implements OnInit {
  private todoService = inject(TodoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  todo: Todo | null = null;
  isLoading = true;

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get("id");
    if (idParam) {
      this.loadTodoDetails(parseInt(idParam, 10));
    } else {
      this.snackBar.open("Invalid task ID.", "Close", { duration: 3000 });
      this.router.navigate(["/todos"]);
    }
  }

  loadTodoDetails(id: number) {
    this.isLoading = true;
    this.todoService.getTodoById(id).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.todo = res.data.todo;
        }
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open("Failed to load task details.", "Close", { duration: 3000 });
        this.router.navigate(["/todos"]);
      }
    });
  }

  toggleStatus() {
    if (!this.todo) return;
    const newStatus = this.todo.status === "Completed" ? "Pending" : "Completed";
    this.todoService.updateTodoStatus(this.todo.id, newStatus).subscribe({
      next: (res) => {
        if (res.success && this.todo) {
          this.todo.status = newStatus;
          this.snackBar.open(`Task marked as ${newStatus.toLowerCase()}.`, "Close", { duration: 2000 });
        }
      },
      error: () => {
        this.snackBar.open("Failed to update status.", "Close", { duration: 3000 });
      }
    });
  }

  deleteTodo() {
    if (!this.todo) return;
    if (confirm("Are you sure you want to delete this task?")) {
      this.todoService.deleteTodo(this.todo.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.snackBar.open("Task deleted successfully.", "Close", { duration: 2500 });
            this.router.navigate(["/todos"]);
          }
        },
        error: () => {
          this.snackBar.open("Failed to delete task.", "Close", { duration: 3000 });
        }
      });
    }
  }
}
