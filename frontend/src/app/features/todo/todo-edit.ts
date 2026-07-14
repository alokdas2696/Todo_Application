import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Router, ActivatedRoute, RouterModule } from "@angular/router";
import { TodoService } from "../../core/services/todo.service";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule, provideNativeDateAdapter } from "@angular/material/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-todo-edit",
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  templateUrl: "./todo-edit.html",
  styleUrls: ["./todo-edit.scss"]
})
export class TodoEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private todoService = inject(TodoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  todoForm: FormGroup = this.fb.group({
    title: ["", [Validators.required]],
    description: [""],
    priority: ["Medium", [Validators.required]],
    status: ["Pending", [Validators.required]],
    dueDate: [null]
  });

  todoId!: number;
  isLoading = true;
  isSaving = false;

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get("id");
    if (idParam) {
      this.todoId = parseInt(idParam, 10);
      this.loadTodoDetails();
    } else {
      this.snackBar.open("Invalid task ID.", "Close", { duration: 3000 });
      this.router.navigate(["/todos"]);
    }
  }

  loadTodoDetails() {
    this.isLoading = true;
    this.todoService.getTodoById(this.todoId).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data.todo) {
          const todo = res.data.todo;
          this.todoForm.patchValue({
            title: todo.title,
            description: todo.description,
            priority: todo.priority,
            status: todo.status,
            dueDate: todo.dueDate ? new Date(todo.dueDate) : null
          });
        }
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open("Failed to load task details.", "Close", { duration: 3000 });
        this.router.navigate(["/todos"]);
      }
    });
  }

  onSubmit() {
    if (this.todoForm.invalid) return;

    this.isSaving = true;
    const todoData = { ...this.todoForm.value };

    if (todoData.dueDate) {
      todoData.dueDate = new Date(todoData.dueDate).toISOString();
    }

    this.todoService.updateTodo(this.todoId, todoData).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.success) {
          this.snackBar.open("Task updated successfully.", "Close", { duration: 3000 });
          this.router.navigate(["/todos"]);
        }
      },
      error: (err) => {
        this.isSaving = false;
        const msg = err.error?.message || "Failed to update task.";
        this.snackBar.open(msg, "Close", { duration: 3000 });
      }
    });
  }
}
