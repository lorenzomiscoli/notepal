import { Component, Input } from "@angular/core";

import { NOTES_CARD_DEPS } from "./notes-card.dependencies";
import { Note } from "../../layouts/notes/interfaces/note.interface";

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
