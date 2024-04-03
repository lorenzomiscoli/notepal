import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { NoteEvent } from '../interfaces/note.interface';

@Injectable({
  providedIn: "root"
})
export class NotesNotificationService {
  public toastNotification$ = new Subject<NoteEvent>();

}
