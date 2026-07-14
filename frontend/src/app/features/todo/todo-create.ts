import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
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
  selector: "app-todo-create",
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
  templateUrl: "./todo-create.html",
  styleUrls: ["./todo-create.scss"]
})
export class TodoCreateComponent {
  private fb = inject(FormBuilder);
  private todoService = inject(TodoService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  todoForm: FormGroup = this.fb.group({
    title: ["", [Validators.required]],
    description: [""],
    priority: ["Medium", [Validators.required]],
    status: ["Pending", [Validators.required]],
    dueDate: [null]
  });

  isLoading = false;

  onSubmit() {
    if (this.todoForm.invalid) return;

    this.isLoading = true;
    const todoData = { ...this.todoForm.value };

    if (todoData.dueDate) {
      todoData.dueDate = new Date(todoData.dueDate).toISOString();
    }

    this.todoService.createTodo(todoData).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.snackBar.open("Task created successfully.", "Close", { duration: 3000 });
          this.router.navigate(["/todos"]);
        }
      },
      error: (err) => {
        this.isLoading = false;
        const msg = err.error?.message || "Failed to create task.";
        this.snackBar.open(msg, "Close", { duration: 3000 });
      }
    });
  }
}
