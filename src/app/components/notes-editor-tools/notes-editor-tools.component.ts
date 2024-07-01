import { Component } from "@angular/core";

import { EditorService } from "../../../app/services/editor.service";
import { NOTES_EDITOR_TOOLS_DEPS } from "./notes-editor-tools.dependencies";

@Component({
  selector: "app-notes-editor-tools",
  templateUrl: "./notes-editor-tools.component.html",
  styles:[`.toolbar{justify-content: center;}`],
  standalone: true,
  imports: [NOTES_EDITOR_TOOLS_DEPS]
})
export class NotesEditorToolsComponent {

  constructor(private editorService: EditorService) { }

  public generateCheckBox(): void {
    let container = document.createElement("div");
    let content = document.createElement("input");
    content.setAttribute("type", "checkbox");
    content.classList.add('checkbox-editor');
    content.setAttribute("onclick", `
      if (this.getAttribute("checked")) {
        this.removeAttribute("checked");
      }else{
        this.setAttribute("checked","true");
      }
    `);
    container.appendChild(content);
    this.editorService.newEditorContent$.next(container);
  }

  // Method used to keep focus on the editor while selecting one of its components
  public keepFocus(event: any) {
    event.preventDefault();
  }

}
