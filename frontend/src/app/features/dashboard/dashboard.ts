import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { TodoService } from "../../core/services/todo.service";
import { AuthService } from "../../core/services/auth.service";
import { TodoStats, Todo } from "../../shared/models/todo.model";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatListModule } from "@angular/material/list";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatListModule
  ],
  templateUrl: "./dashboard.html",
  styleUrls: ["./dashboard.scss"]
})
export class DashboardComponent implements OnInit {
  private todoService = inject(TodoService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  stats: TodoStats = {
    total: 0,
    completed: 0,
    pending: 0,
    highPriority: 0
  };

  recentTodos: Todo[] = [];
  isLoading = true;
  userName = "";

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.userName = user?.name || "User";
    });
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    this.todoService.getStats().subscribe({
      next: (res) => {
        if (res.success && res.data.stats) {
          this.stats = res.data.stats;
        }

        this.todoService.getTodos({ page: 1, limit: 5, status: "Pending", sortBy: "dueDate", order: "ASC" }).subscribe({
          next: (todoRes) => {
            if (todoRes.success) {
              this.recentTodos = todoRes.data.todos;
            }
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open("Failed to load dashboard metrics.", "Close", { duration: 3000 });
      }
    });
  }

  get completionPercentage(): number {
    if (this.stats.total === 0) return 0;
    return Math.round((this.stats.completed / this.stats.total) * 100);
  }
}
