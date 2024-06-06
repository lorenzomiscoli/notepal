import { Component, OnDestroy } from "@angular/core";

import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Subject, from, map, switchMap } from 'rxjs';

import { EditorService } from '../../../../services/editor.service';
import { CAMERA_DEPS } from "./camera.dependencies";

@Component({
  selector: "app-camera",
  templateUrl: "./camera.component.html",
  styleUrls: ["./camera.component.scss"],
  standalone: true,
  imports: [CAMERA_DEPS]
})
export class CameraComponent implements OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private editorService: EditorService) { }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public openCamera(): void {
    this.editorService.lastSelection$.next(window.getSelection()!.getRangeAt(0));
    from(Camera.getPhoto({
      quality: 75,
      allowEditing: false,
      source: CameraSource.Camera,
      resultType: CameraResultType.Uri
    })).pipe(switchMap((image) => this.getImgInfo(image.webPath as string))).subscribe(image => {
      var sel = window.getSelection();
      var range = this.editorService.lastSelection$.value;
      sel?.addRange(range!);
      let imageNode = document.createElement("img");
      imageNode.src = image.webPath;
      imageNode.classList.add('img-editor');
    //  imageNode.width = image.width;
    // imageNode.height = image.height;
      this.editorService.newEditorContent$.next(imageNode);
    });
  }

  public getImgInfo(url: string) {
    var element = document.createElement("img");
    element.src = url;
    return from(element.decode()).pipe(map(() => {
      return { webPath: url, width: element.width, height: element.height };
    }))
  }
}
