import { Injectable } from "@angular/core";

import { DBSQLiteValues, capSQLiteChanges } from '@capacitor-community/sqlite';
import { Observable, Subject, from, map, of, switchMap, tap } from 'rxjs';

import { StorageService } from './storage.service';
import { Note, NoteAction, NoteBackground, NoteChange, NoteEvent } from '../interfaces/note.interface';
import { addNotification, cancelNotification } from "../utils/reminder-utils";

@Injectable({
  providedIn: "root"
})
export class NotesService {
  public notesUpdated$ = new Subject<NoteChange>();
  public toastNotification$ = new Subject<NoteEvent>();

  constructor(private storageService: StorageService) { }

  public findAll(): Observable<Note[]> {
    return from(this.storageService.db.query(`SELECT
    n.id,
    n.title,
    n.value,
    n.creation_date as creationDate,
    n.last_modified_date as lastModifiedDate,
    n.pinned,
    n.background,
    n.category_id as categoryId,
    nr.id as reminderId,
    nr.date as reminderDate,
    nr.every as reminderEvery
  FROM
    note n
  LEFT JOIN note_reminder nr ON n.id = nr.note_id
  WHERE
    n.archived = 0
  AND n.deleted = 0
  `)).pipe(map((value: DBSQLiteValues) => value.values as Note[]));
  }

  public findByCategoryId(categoryId: number): Observable<Note[]> {
    return from(this.storageService.db.query(`SELECT
    n.id,
    n.title,
    n.value,
    n.creation_date as creationDate,
    n.last_modified_date as lastModifiedDate,
    n.pinned,
    n.background,
    n.category_id as categoryId,
    nr.id as reminderId,
    nr.date as reminderDate,
    nr.every as reminderEvery
  FROM
    note n
  LEFT JOIN note_reminder nr ON n.id = nr.note_id
  WHERE
    n.archived = 0
  AND n.category_id = ?`, [categoryId]))
      .pipe(map((value: DBSQLiteValues) => value.values as Note[]));
  }

  public findByBackground(background: string): Observable<Note[]> {
    let backgroundCheck = "n.background = ?";
    if (!background) {
      backgroundCheck = "n.background IS ?"
    }
    return from(this.storageService.db.query(`SELECT
    n.id,
    n.title,
    n.value,
    n.creation_date as creationDate,
    n.last_modified_date as lastModifiedDate,
    n.pinned,
    n.background,
    n.category_id as categoryId,
    nr.id as reminderId,
    nr.date as reminderDate,
    nr.every as reminderEvery
  FROM
    note n
  LEFT JOIN note_reminder nr ON n.id = nr.note_id
  WHERE
    n.archived = 0
  AND ${backgroundCheck}`, [background]))
      .pipe(map((value: DBSQLiteValues) => value.values as Note[]));
  }

  public findById(id: number): Observable<Note | undefined> {
    return from(this.storageService.db.query(`SELECT
    n.id,
    n.title,
    n.value,
    n.creation_date as creationDate,
    n.last_modified_date as lastModifiedDate,
    n.pinned,
    n.background,
    n.category_id as categoryId,
    nr.id as reminderId,
    nr.date as reminderDate,
    nr.every as reminderEvery
  FROM
    note n
  LEFT JOIN note_reminder nr ON n.id = nr.note_id
  WHERE
    n.id = ?`, [id])).pipe(map((value: DBSQLiteValues) => {
      const notes = value.values as Note[];
      return notes && notes.length > 0 ? notes[0] as Note : undefined;
    }));
  }

  public search(search: string): Observable<Note[]> {
    return from(this.storageService.db.query(`SELECT
    n.id,
    n.title,
    n.value,
    n.creation_date as creationDate,
    n.last_modified_date as lastModifiedDate,
    n.pinned,
    n.background,
    n.category_id as categoryId,
    nr.id as reminderId,
    nr.date as reminderDate,
    nr.every as reminderEvery
  FROM
    note n
  LEFT JOIN note_reminder nr ON n.id = nr.note_id
  WHERE
    n.archived = 0
  AND n.deleted = 0
  AND n.title LIKE '%${search}%'`))
      .pipe(map((value: DBSQLiteValues) => value.values as Note[]));
  }

  public searchByCategoryId(categoryId: number, search: string): Observable<Note[]> {
    if (search) {
      return from(this.storageService.db.query(`SELECT
      n.id,
      n.title,
      n.value,
      n.creation_date as creationDate,
      n.last_modified_date as lastModifiedDate,
      n.pinned,
      n.background,
      n.category_id as categoryId,
      nr.id as reminderId,
    nr.date as reminderDate,
    nr.every as reminderEvery
    FROM
      note n
    LEFT JOIN note_reminder nr ON n.id = nr.note_id
    WHERE
      n.archived = 0
    AND n.deleted = 0
    AND n.category_id = ?
    AND n.title LIKE '%${search}%'`, [categoryId]))
        .pipe(map((value: DBSQLiteValues) => value.values as Note[]));
    } else {
      return this.findByCategoryId(categoryId);
    }
  }

  public searchByBackground(background: string, search: string): Observable<Note[]> {
    let backgroundCheck = "n.background = ?";
    if (search) {
      if (!background) {
        backgroundCheck = "n.background IS ?"
      }
      return from(this.storageService.db.query(`SELECT
      n.id,
      n.title,
      n.value,
      n.creation_date as creationDate,
      n.last_modified_date as lastModifiedDate,
      n.pinned,
      n.background,
      n.category_id as categoryId,
      nr.id as reminderId,
      nr.date as reminderDate,
      nr.every as reminderEvery
    FROM
      note n
    LEFT JOIN note_reminder nr ON n.id = nr.note_id
    WHERE
      n.archived = 0
      AND m.deleted = 0
      AND ${backgroundCheck}
      AND n.title LIKE '%${search}%'`, [background]))
        .pipe(map((value: DBSQLiteValues) => value.values as Note[]));
    } else {
      return this.findByBackground(background);
    }
  }

  public count(): Observable<{ totalNotes: number }> {
    return from(this.storageService.db.query(`SELECT COUNT(n.id) as totalNotes FROM note n WHERE n.archived = 0 AND deleted = 0`))
      .pipe(map((value: DBSQLiteValues) => value.values![0] as { totalNotes: number }));
  }

  public findCreationDates(): Observable<{ creationDate: string }[]> {
    return from(this.storageService.db.query(`SELECT DISTINCT DATE(creation_date) as creationDate FROM note WHERE archived = 0 AND deleted = 0`))
      .pipe(map((value: DBSQLiteValues) => value.values as { creationDate: string }[]));
  }

  public findByCreationDate(creationDate: string): Observable<Note[]> {
    return from(this.storageService.db.query(`SELECT
    n.id,
    n.title,
    n.value,
    n.creation_date as creationDate,
    n.last_modified_date as lastModifiedDate,
    n.pinned,
    n.background,
    n.category_id as categoryId,
    nr.id as reminderId,
    nr.date as reminderDate,
    nr.every as reminderEvery
  FROM
    note n
  LEFT JOIN note_reminder nr ON n.id = nr.note_id
  WHERE
    n.archived = 0
    AND n.deleted = 0
    AND DATE(n.creation_date) = ?`, [creationDate]))
      .pipe(map((value: DBSQLiteValues) => value.values as Note[]));
  }

  public findArchived(): Observable<Note[]> {
    return from(this.storageService.db.query(`SELECT
    n.id,
    n.title,
    n.value,
    n.creation_date as creationDate,
    n.last_modified_date as lastModifiedDate,
    n.pinned,
    n.background,
    n.category_id as categoryId,
    nr.id as reminderId,
    nr.date as reminderDate,
    nr.every as reminderEvery
  FROM
    note n
  LEFT JOIN note_reminder nr ON n.id = nr.note_id
    WHERE
      n.archived = 1
      AND n.deleted = 0
  `)).pipe(map((value: DBSQLiteValues) => value.values as Note[]));
  }

  public findDeleted(): Observable<Note[]> {
    return from(this.storageService.db.query(`SELECT
    n.id,
    n.title,
    n.value,
    n.creation_date as creationDate,
    n.last_modified_date as lastModifiedDate,
    n.pinned,
    n.background,
    n.category_id as categoryId,
    nr.id as reminderId,
    nr.date as reminderDate,
    nr.every as reminderEvery
  FROM
    note n
  LEFT JOIN note_reminder nr ON n.id = nr.note_id
    WHERE
      n.deleted = 1
  `)).pipe(map((value: DBSQLiteValues) => value.values as Note[]));
  }

  public findByIds(ids: number[]): Observable<Note[]> {
    return from(this.storageService.db.query(`SELECT
    n.id,
    n.title,
    n.value,
    n.creation_date as creationDate,
    n.last_modified_date as lastModifiedDate,
    n.pinned,
    n.background,
    n.category_id as categoryId,
    nr.id as reminderId,
    nr.date as reminderDate,
    nr.every as reminderEvery
  FROM
    note n
  LEFT JOIN note_reminder nr ON n.id = nr.note_id
  WHERE
    n.id IN (${ids.toString()})`)).pipe(map((value: DBSQLiteValues) => value.values as Note[]));
  }

  public findReminders(): Observable<Note[]> {
    return from(this.storageService.db.query(`SELECT
    n.id,
    n.title,
    n.value,
    n.creation_date as creationDate,
    n.last_modified_date as lastModifiedDate,
    n.pinned,
    n.background,
    n.category_id as categoryId,
    nr.id as reminderId,
    nr.date as reminderDate,
    nr.every as reminderEvery
  FROM
    note n
  INNER JOIN note_reminder nr ON n.id = nr.note_id
    WHERE
      n.deleted = 0
    AND n.archived = 0
  `)).pipe(map((value: DBSQLiteValues) => value.values as Note[]));
  }

  public insert(creationDate: string, categoryId: number | undefined): Observable<number> {
    const lastModifiedDate = new Date().toISOString();
    const sql = `INSERT INTO note (creation_date, last_modified_date, archived, deleted, category_id) VALUES (?, ?, 0, 0, ?);`;
    return from(this.storageService.db.run(sql, [creationDate, lastModifiedDate, categoryId], true))
      .pipe(map((value: capSQLiteChanges) => value.changes?.lastId as number), tap((id) => {
        this.notesUpdated$.next({
          ids: [id],
          action: NoteAction.INSERT,
          changes: {
            id: id,
            creationDate: creationDate,
            lastModifiedDate: lastModifiedDate,
            categoryId: categoryId
          }
        });
      }));
  }

  public update(id: number, title: string, value: string): Observable<any> {
    const lastModifiedDate = new Date().toISOString();
    const sql = `UPDATE note SET title = ? , value = ? , last_modified_date = ? WHERE id = ?;`;
    return from(this.storageService.db.run(sql, [title, value, lastModifiedDate, id], true)).pipe(tap(() => {
      this.notesUpdated$.next({
        ids: [id],
        action: NoteAction.UPDATE,
        changes: {
          title: title,
          value: value,
          lastModifiedDate: lastModifiedDate
        }
      });
    }));
  }

  public updateBackground(ids: number[], background: NoteBackground | undefined): Observable<any> {
    const sql = `UPDATE note SET background = ? WHERE id IN (${ids.join()});`;
    return from(this.storageService.db.run(sql, [background], true)).pipe(tap(() => {
      this.notesUpdated$.next({
        ids: ids,
        action: NoteAction.UPDATE,
        changes: { background: background }
      });
    }));
  }

  public updateCategory(ids: number[], categoryId: number): Observable<any> {
    const sql = `UPDATE note SET category_id = ? WHERE id IN (${ids.join()});`;
    return from(this.storageService.db.run(sql, [categoryId], true)).pipe(tap(() => {
      this.notesUpdated$.next({
        ids: ids,
        action: NoteAction.UPDATE,
        changes: { categoryId: categoryId }
      });
    }));
  }

  public pin(ids: number[], pinned: boolean): Observable<any> {
    const value = pinned ? 1 : 0;
    const sql = `UPDATE note SET pinned = ? WHERE id IN (${ids.join()});`;
    return from(this.storageService.db.run(sql, [value], true)).pipe(tap(() => {
      this.notesUpdated$.next({
        ids: ids,
        action: NoteAction.UPDATE,
        changes: { pinned: pinned }
      });
    }));
  }

  public archive(ids: number[], archived: boolean): Observable<any> {
    const value = archived ? 1 : 0;
    const sql = `UPDATE note SET archived = ? WHERE id IN (${ids.join()});`;
    return from(this.storageService.db.run(sql, [value], true)).pipe(tap(() => {
      this.notesUpdated$.next({ ids: ids, action: NoteAction.ARCHIVE });
    }), switchMap(() => this.updateNotifications(ids, value)));
  }

  public delete(ids: number[], deleted: boolean): Observable<any> {
    const value = deleted ? 1 : 0;
    const sql = `UPDATE note SET deleted = ? WHERE id IN (${ids.join()});`;
    return from(this.storageService.db.run(sql, [value], true)).pipe(tap(() => {
      this.notesUpdated$.next({ ids: ids, action: NoteAction.DELETE });
    }), switchMap(() => this.updateNotifications(ids, value)));
  }

  public deleteForever(ids: number[]): Observable<any> {
    const sql = `DELETE FROM note WHERE id IN (${ids.join()});`;
    return from(this.storageService.db.run(sql, [], true)).pipe(tap(() => {
      this.notesUpdated$.next({ ids: ids, action: NoteAction.DELETE_FOREVER });
    }), switchMap(() => cancelNotification(ids)));
  }

  private updateNotifications(ids: number[], available: number): Observable<any> {
    if (available > 0) {
      return of(undefined).pipe(switchMap(() => cancelNotification(ids)));
    } else {
      return of(undefined).pipe(switchMap(() => this.findByIds(ids)), switchMap((notes) => addNotification(notes)));
    }
  }

}
