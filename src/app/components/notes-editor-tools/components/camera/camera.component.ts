import { Component } from "@angular/core";

import { Camera, CameraResultType, CameraSource, Photo } from "@capacitor/camera";
import { TranslateService } from '@ngx-translate/core';
import { from, of, switchMap } from 'rxjs';

import { NotificationEvent } from '../../../../../app/interfaces/note.interface';
import { EditorService } from '../../../../services/editor.service';
import { NotesService } from './../../../../services/notes.service';
import { CAMERA_DEPS } from "./camera.dependencies";

@Component({
  selector: "app-camera",
  templateUrl: "./camera.component.html",
  styleUrls: ["./camera.component.scss"],
  standalone: true,
  imports: [CAMERA_DEPS]
})
export class CameraComponent {

  constructor(private editorService: EditorService,
    private noteService: NotesService,
    private traslateService: TranslateService) { }

  public openCamera(): void {
    this.editorService.lastSelection$.next(window.getSelection()!.getRangeAt(0));
    from(Camera.getPhoto({
      quality: 75,
      allowEditing: false,
      source: CameraSource.Camera,
      resultType: CameraResultType.Uri
    })).subscribe(image => this.renderImage(image));
  }

  public openGallery(): void {
    this.editorService.lastSelection$.next(window.getSelection()!.getRangeAt(0));
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
    let sel = window.getSelection();
    let range = this.editorService.lastSelection$.value;
    sel?.addRange(range!);
    let container = document.createElement("div");
    let imageNode = document.createElement("img");
    imageNode.src = image.webPath as string;
    imageNode.classList.add('img-editor');
    container.appendChild(imageNode);
    this.editorService.newEditorContent$.next(container);
  }

}
