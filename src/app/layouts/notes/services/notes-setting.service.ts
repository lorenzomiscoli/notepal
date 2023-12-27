import { Injectable } from "@angular/core";

import { DBSQLiteValues, capSQLiteChanges } from '@capacitor-community/sqlite';
import { Observable, ReplaySubject, from, map, tap, } from 'rxjs';

import { NoteSetting, SortMode, ViewMode } from '../interfaces/note.interface';
import { StorageService } from '../../../services/storage.service';

@Injectable()
export class NotesSettingService {
  public notesSettingsUpdated$ = new ReplaySubject<void>(1);

  constructor(private storageService: StorageService) {
    this.notesSettingsUpdated$.next();
  }

  public getNoteSetting(): Observable<NoteSetting> {
    return from(this.storageService.db.query("SELECT id, view_mode as viewMode, sort_mode as sortMode FROM note_setting WHERE id = 1"))
      .pipe(map((value: DBSQLiteValues) => {
        const settings = value.values as NoteSetting[];
        return settings[0];
      }));
  }

  public addNoteSetting(viewMode: ViewMode, sortMode: SortMode): Observable<number> {
    const sql = `UPDATE note_setting SET view_mode = ? , sort_mode = ? WHERE id = 1;`;
    return from(this.storageService.db.run(sql, [viewMode, sortMode], true)).pipe(tap(() => this.notesSettingsUpdated$.next()),
      map((value: capSQLiteChanges) => value.changes?.lastId as number));
  }

}
