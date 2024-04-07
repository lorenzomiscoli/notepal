import { Injectable } from "@angular/core";

import { DBSQLiteValues, capSQLiteChanges } from '@capacitor-community/sqlite';
import { Observable, Subject, from, map, tap } from 'rxjs';

import { StorageService } from './storage.service';
import { Note, NoteAction, NoteBackground, NoteChange, NoteEvent } from '../interfaces/note.interface';

@Injectable({
  providedIn: "root"
})
export class NotesService {
  public notesUpdated$ = new Subject<NoteChange>();
  public toastNotification$ = new Subject<NoteEvent>();

  constructor(private storageService: StorageService) { }

  public findAll(): Observable<Note[]> {
    return from(this.storageService.db.query(`SELECT
      id,
      title,
      value,
      creation_date as creationDate,
      last_modified_date as lastModifiedDate,
      pinned,
      background,
      category_id as categoryId
    FROM
      note
    WHERE
      archived = 0
    AND deleted = 0
  `)).pipe(map((value: DBSQLiteValues) => value.values as Note[]));
  }

  public findByCategoryId(categoryId: number): Observable<Note[]> {
    return from(this.storageService.db.query(`SELECT
    id,
    title,
    value,
    creation_date as creationDate,
    last_modified_date as lastModifiedDate,
    pinned,
    background,
    category_id as categoryId
  FROM
    note
  WHERE
    archived = 0
    AND category_id = ?`, [categoryId]))
      .pipe(map((value: DBSQLiteValues) => value.values as Note[]));
  }

  public findByBackground(background: string): Observable<Note[]> {
    let backgroundCheck = "background = ?";
    if (!background) {
      backgroundCheck = "background IS ?"
    }
    return from(this.storageService.db.query(`SELECT
    id,
    title,
    value,
    creation_date as creationDate,
    last_modified_date as lastModifiedDate,
    pinned,
    background,
    category_id as categoryId
  FROM
    note
  WHERE
    archived = 0
    AND ${backgroundCheck}`, [background]))
      .pipe(map((value: DBSQLiteValues) => value.values as Note[]));
  }

  public findById(id: number): Observable<Note | undefined> {
    return from(this.storageService.db.query(`SELECT
    id,
    title,
    value,
    creation_date as creationDate,
    last_modified_date as lastModifiedDate,
    pinned,
    background,
    category_id as categoryId
  FROM
    note
  WHERE
    id = ?`, [id])).pipe(map((value: DBSQLiteValues) => {
      const notes = value.values as Note[];
      return notes && notes.length > 0 ? notes[0] as Note : undefined;
    }));
  }

  public search(search: string): Observable<Note[]> {
    return from(this.storageService.db.query(`SELECT
    id,
    title,
    value,
    creation_date as creationDate,
    last_modified_date as lastModifiedDate,
    pinned,
    background,
    category_id as categoryId
  FROM
    note
  WHERE
    archived = 0
  AND deleted = 0
  AND title LIKE '%${search}%'`))
      .pipe(map((value: DBSQLiteValues) => value.values as Note[]));
  }

  public searchByCategoryId(categoryId: number, search: string): Observable<Note[]> {
    if (search) {
      return from(this.storageService.db.query(`SELECT
      id,
      title,
      value,
      creation_date as creationDate,
      last_modified_date as lastModifiedDate,
      pinned,
      background,
      category_id as categoryId
    FROM
      note
    WHERE
      archived = 0
      AND deleted = 0
      AND category_id = ?
      AND title LIKE '%${search}%'`, [categoryId]))
        .pipe(map((value: DBSQLiteValues) => value.values as Note[]));
    } else {
      return this.findByCategoryId(categoryId);
    }
  }

  public searchByBackground(background: string, search: string): Observable<Note[]> {
    let backgroundCheck = "background = ?";
    if (search) {
      if (!background) {
        backgroundCheck = "background IS ?"
      }
      return from(this.storageService.db.query(`SELECT
      id,
      title,
      value,
      creation_date as creationDate,
      last_modified_date as lastModifiedDate,
      pinned,
      background,
      category_id as categoryId
    FROM
      note
    WHERE
      archived = 0
      AND deleted = 0
      AND ${backgroundCheck}
      AND title LIKE '%${search}%'`, [background]))
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
    id,
    title,
    value,
    creation_date as creationDate,
    last_modified_date as lastModifiedDate,
    pinned,
    background,
    category_id as categoryId
  FROM
    note
  WHERE
    archived = 0
    AND deleted = 0
    AND DATE(creation_date) = ?`, [creationDate]))
      .pipe(map((value: DBSQLiteValues) => value.values as Note[]));
  }

  public findArchived(): Observable<Note[]> {
    return from(this.storageService.db.query(`SELECT
      id,
      title,
      value,
      creation_date as creationDate,
      last_modified_date as lastModifiedDate,
      pinned,
      background,
      category_id as categoryId
    FROM
      note
    WHERE
      archived = 1
      AND deleted = 0
  `)).pipe(map((value: DBSQLiteValues) => value.values as Note[]));
  }

  public findDeleted(): Observable<Note[]> {
    return from(this.storageService.db.query(`SELECT
      id,
      title,
      value,
      creation_date as creationDate,
      last_modified_date as lastModifiedDate,
      pinned,
      background,
      category_id as categoryId
    FROM
      note
    WHERE
      deleted = 1
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
    const lastModifiedDate = new Date().toISOString();
    const sql = `UPDATE note SET background = ? , last_modified_date = ? WHERE id IN (${ids.join()});`;
    return from(this.storageService.db.run(sql, [background, lastModifiedDate], true)).pipe(tap(() => {
      this.notesUpdated$.next({
        ids: ids,
        action: NoteAction.UPDATE,
        changes: {
          background: background,
          lastModifiedDate: lastModifiedDate
        }
      });
    }));
  }

  public updateCategory(ids: number[], categoryId: number): Observable<any> {
    const lastModifiedDate = new Date().toISOString();
    const sql = `UPDATE note SET category_id = ? , last_modified_date = ? WHERE id IN (${ids.join()});`;
    return from(this.storageService.db.run(sql, [categoryId, lastModifiedDate], true)).pipe(tap(() => {
      this.notesUpdated$.next({
        ids: ids,
        action: NoteAction.UPDATE,
        changes: {
          categoryId: categoryId,
          lastModifiedDate: lastModifiedDate
        }
      });
    }));
  }

  public pin(ids: number[], pinned: boolean): Observable<any> {
    const lastModifiedDate = new Date().toISOString();
    const value = pinned ? 1 : 0;
    const sql = `UPDATE note SET pinned = ? , last_modified_date = ? WHERE id IN (${ids.join()});`;
    return from(this.storageService.db.run(sql, [value, lastModifiedDate], true)).pipe(tap(() => {
      this.notesUpdated$.next({
        ids: ids,
        action: NoteAction.UPDATE,
        changes: {
          pinned: pinned,
          lastModifiedDate: lastModifiedDate
        }
      });
    }));
  }

  public archive(ids: number[], archived: boolean): Observable<any> {
    const lastModifiedDate = new Date().toISOString();
    const value = archived ? 1 : 0;
    const sql = `UPDATE note SET archived = ? , last_modified_date = ? WHERE id IN (${ids.join()});`;
    return from(this.storageService.db.run(sql, [value, lastModifiedDate], true)).pipe(tap(() => {
      this.notesUpdated$.next({ ids: ids, action: NoteAction.ARCHIVE });
    }));
  }

  public delete(ids: number[], deleted: boolean): Observable<any> {
    const lastModifiedDate = new Date().toISOString();
    const value = deleted ? 1 : 0;
    const sql = `UPDATE note SET deleted = ? , last_modified_date = ? WHERE id IN (${ids.join()});`;
    return from(this.storageService.db.run(sql, [value, lastModifiedDate], true)).pipe(tap(() => {
      this.notesUpdated$.next({ ids: ids, action: NoteAction.DELETE });
    }));
  }

  public deleteForever(ids: number[]): Observable<any> {
    const sql = `DELETE FROM note WHERE id IN (${ids.join()});`;
    return from(this.storageService.db.run(sql, [], true)).pipe(tap(() => {
      this.notesUpdated$.next({ ids: ids, action: NoteAction.DELETE_FOREVER });
    }));
  }

}
