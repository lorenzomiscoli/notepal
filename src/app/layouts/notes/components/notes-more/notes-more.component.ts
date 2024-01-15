import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { Platform, ViewWillEnter, ViewWillLeave } from "@ionic/angular";
import { Subscription } from "rxjs";

import { NOTES_MORE_DEPS } from "./notes-more.dependencies";

@Component({
  templateUrl: "./notes-more.component.html",
  styleUrls: ["./notes-more.component.scss"],
  standalone: true,
  imports: [NOTES_MORE_DEPS]
})
export class NotesMoreComponent implements ViewWillEnter, ViewWillLeave {
  private backButtonSubscription!: Subscription;

  constructor(private router: Router, private platform: Platform) { }

  ionViewWillEnter(): void {
    this.handleBackButton();
  }

  ionViewWillLeave(): void {
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }

  private handleBackButton(): void {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigate(["/notes/list"]);
    });
  }

}
