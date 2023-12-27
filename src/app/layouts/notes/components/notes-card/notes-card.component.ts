import { Component, Input } from "@angular/core";
import { NOTES_CARD_DEPS } from "./noets-card.dependencies";
import { Note } from "../../interfaces/note.interface";

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
