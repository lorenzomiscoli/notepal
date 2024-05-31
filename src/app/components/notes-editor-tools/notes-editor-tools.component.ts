import { Component, EventEmitter, Output } from "@angular/core";

import { NOTES_EDITOR_TOOLS_DEPS } from "./notes-editor-tools.dependencies";

@Component({
  selector: "app-notes-editor-tools",
  templateUrl: "./notes-editor-tools.component.html",
  styleUrls: ["./notes-editor-tools.component.scss"],
  standalone: true,
  imports: [NOTES_EDITOR_TOOLS_DEPS]
})
export class NotesEditorToolsComponent {
  @Output() public newContent = new EventEmitter<Node>();

  public generateCheckBox(): void {
    let content = document.createElement("div");
    content.textContent = "Example";
    this.newContent.next(content);
  }

}
