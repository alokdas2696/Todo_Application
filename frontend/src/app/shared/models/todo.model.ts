export interface Todo {
  id: number;
  title: string;
  description?: string;
  status: "Pending" | "Completed";
  priority: "Low" | "Medium" | "High";
  dueDate?: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  highPriority: number;
}

export interface TodoListResponse {
  total: number;
  todos: Todo[];
  totalPages: number;
  currentPage: number;
}
