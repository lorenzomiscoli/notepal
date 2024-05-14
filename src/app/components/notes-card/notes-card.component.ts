import { Component, Input } from "@angular/core";

import { Note } from "../../interfaces/note.interface";
import { NOTES_CARD_DEPS } from "./notes-card.dependencies";

@Component({
  selector: "app-notes-card",
  templateUrl: "./notes-card.component.html",
  styleUrls: ["./notes-card.component.scss"],
  standalone: true,
  imports: [NOTES_CARD_DEPS]
})
export class NotesCardComponent {
  @Input({ required: true }) note!: Note;
}
