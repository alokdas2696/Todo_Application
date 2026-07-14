import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../core/services/auth.service";
import { User } from "../../shared/models/user.model";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: "./profile.html",
  styleUrls: ["./profile.scss"]
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  user: User | null = null;
  isLoading = true;

  ngOnInit() {
    this.authService.getProfile().subscribe({
      next: (res) => {
        if (res.success) {
          this.user = res.data.user;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.authService.currentUser$.subscribe((currentUser) => {
          this.user = currentUser;
        });
        this.snackBar.open("Unable to sync profile from server. Showing cached details.", "Close", { duration: 3000 });
      }
    });
  }

  get initials(): string {
    if (!this.user?.name) return "U";
    return this.user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }
}
