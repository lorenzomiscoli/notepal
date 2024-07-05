import { Component, Input } from "@angular/core";

import { Camera, CameraResultType, CameraSource, Photo } from "@capacitor/camera";
import { TranslateService } from '@ngx-translate/core';
import { Editor, Toolbar } from "ngx-editor";
import { from, of, switchMap } from 'rxjs';

import { NotificationEvent } from "../../../app/interfaces/note.interface";
import { NotesService } from "../../../app/services/notes.service";
import { NOTES_EDITOR_TOOLS_DEPS } from "./notes-editor-tools.dependencies";

@Component({
  selector: "app-notes-editor-tools",
  templateUrl: "./notes-editor-tools.component.html",
  styleUrl: "./notes-editor-tools.component.scss",
  standalone: true,
  imports: [NOTES_EDITOR_TOOLS_DEPS]
})
export class NotesEditorToolsComponent {
  toolbar: Toolbar = [['bold', 'italic',], ['underline', 'strike'], ['text_color', 'background_color']];
  @Input({ required: true }) public editor!: Editor;

  constructor(private noteService: NotesService,
    private traslateService: TranslateService) { }

  // Method used to keep focus on the editor while selecting one of its components
  public keepFocus(event: any) {
    event.preventDefault();
  }

  public openCamera(): void {
    from(Camera.getPhoto({
      quality: 75,
      allowEditing: false,
      source: CameraSource.Camera,
      resultType: CameraResultType.Uri
    })).subscribe(image => this.renderImage(image));
  }

  public openGallery(): void {
    from(Camera.requestPermissions({ permissions: ["photos"] })).pipe(switchMap((status) => {
      if (status.photos === 'denied' || status.photos === 'prompt-with-rationale') {
        this.noteService.toastNotification$.next({
          ids: [],
          event: NotificationEvent.ANY,
          message: this.traslateService.instant("allowGallery")
        });
        return of(undefined);
      } else {
        return from(Camera.getPhoto({
          quality: 75,
          allowEditing: false,
          source: CameraSource.Photos,
          resultType: CameraResultType.Uri
        }));
      }
    })).subscribe(image => {
      if (image)
        this.renderImage(image);
    });
  }

  private renderImage(image: Photo): void {
    this.editor.commands.insertImage(image.webPath as string).scrollIntoView().focus().exec();
    this.editor.commands.insertNewLine().exec();
  }

}
