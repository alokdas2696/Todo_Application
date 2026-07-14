import { Routes } from "@angular/router";
import { authGuard, nonAuthGuard } from "./core/guards/auth.guard";
import { LoginComponent } from "./features/auth/login/login";
import { RegisterComponent } from "./features/auth/register/register";
import { DashboardComponent } from "./features/dashboard/dashboard";
import { TodoListComponent } from "./features/todo/todo-list";
import { TodoCreateComponent } from "./features/todo/todo-create";
import { TodoEditComponent } from "./features/todo/todo-edit";
import { TodoDetailComponent } from "./features/todo/todo-detail";
import { ProfileComponent } from "./features/profile/profile";
import { NotFoundComponent } from "./features/not-found/not-found";
import { MainLayoutComponent } from "./layouts/main-layout";

export const routes: Routes = [
  // Unauthenticated/Authentication Routes
  {
    path: "auth",
    canActivate: [nonAuthGuard],
    children: [
      { path: "", redirectTo: "login", pathMatch: "full" },
      { path: "login", component: LoginComponent },
      { path: "register", component: RegisterComponent }
    ]
  },

  // Authenticated/Protected Application Routes
  {
    path: "",
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      { path: "dashboard", component: DashboardComponent },
      { path: "todos", component: TodoListComponent },
      { path: "todos/create", component: TodoCreateComponent },
      { path: "todos/edit/:id", component: TodoEditComponent },
      { path: "todos/:id", component: TodoDetailComponent },
      { path: "profile", component: ProfileComponent }
    ]
  },

  // Page Not Found (404) Route
  { path: "**", component: NotFoundComponent }
];
