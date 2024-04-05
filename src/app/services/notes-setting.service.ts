import { Injectable } from "@angular/core";

import { DBSQLiteValues, capSQLiteChanges } from '@capacitor-community/sqlite';
import { Observable, from, map, } from 'rxjs';

import { NoteSetting, SortDirection, SortMode, ViewMode } from '../interfaces/note.interface';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: "root"
})
export class NotesSettingService {

  constructor(private storageService: StorageService) { }

  public findFirst(): Observable<NoteSetting> {
    return from(this.storageService.db.query(`SELECT
    id,
    view_mode as viewMode,
    sort_mode as sortMode,
    sort_direction as sortDirection
  FROM
    note_setting
  WHERE
    id = 1
  `)).pipe(map((value: DBSQLiteValues) => {
      const settings = value.values as NoteSetting[];
      return settings[0];
    }));
  }

  public updateViewMode(viewMode: ViewMode): Observable<number> {
    const sql = `UPDATE note_setting SET view_mode = ? WHERE id = 1;`;
    return from(this.storageService.db.run(sql, [viewMode], true)).pipe(
      map((value: capSQLiteChanges) => value.changes?.lastId as number));
  }

  public updateSort(sortMode: SortMode, sortDirection: SortDirection): Observable<number> {
    const sql = `UPDATE note_setting SET sort_mode = ?, sort_direction = ? WHERE id = 1;`;
    return from(this.storageService.db.run(sql, [sortMode, sortDirection], true)).pipe(
      map((value: capSQLiteChanges) => value.changes?.lastId as number));
  }

}
