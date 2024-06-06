import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class EditorService {
  public newEditorContent$ = new Subject<Node>();
  public lastSelection$ = new BehaviorSubject<Range | null>(null);
}
