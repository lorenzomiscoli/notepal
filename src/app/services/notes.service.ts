import { Injectable } from "@angular/core";

import { DBSQLiteValues, capSQLiteChanges } from '@capacitor-community/sqlite';
import { Observable, Subject, from, map, tap } from 'rxjs';

import { StorageService } from './storage.service';
import { Note, NoteBackground } from '../interfaces/note.interface';

@Injectable({
  providedIn: "root"
})
export class NotesService {
  public notesUpdated$ = new Subject<void>();

  constructor(private storageService: StorageService) { }

  public getAllNotes(): Observable<Note[]> {
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

  public getNotesByCategoryId(id: number): Observable<Note[]> {
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
    AND category_id = ?`, [id]))
      .pipe(map((value: DBSQLiteValues) => value.values as Note[]));
  }

  public getNotesByBackground(background: string): Observable<Note[]> {
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

  public getNoteById(id: number): Observable<Note | undefined> {
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

  public insertEmpty(creationDate: string, categoryId: number | undefined): Observable<number> {
    const sql = `INSERT INTO note (creation_date, last_modified_date, archived, deleted, category_id) VALUES (?, ?, 0, 0, ?);`;
    return from(this.storageService.db.run(sql, [creationDate, creationDate, categoryId], true))
      .pipe(map((value: capSQLiteChanges) => value.changes?.lastId as number));
  }

  public update(id: number, note: Note): Observable<any> {
    const sql = `UPDATE note SET title = ? , value = ? , last_modified_date = ? WHERE id = ?;`;
    return from(this.storageService.db.run(sql, [note.title, note.value, note.lastModifiedDate, id], true)).pipe(tap(() => {
      this.notesUpdated$.next();
    }));
  }

  public deleteForever(ids: number[]): Observable<any> {
    const sql = `DELETE FROM note WHERE id IN (${ids.join()});`;
    return from(this.storageService.db.run(sql, [], true)).pipe(tap(() => {
      this.notesUpdated$.next();
    }));
  }

  public delete(ids: number[], deleted: boolean): Observable<any> {
    const value = deleted ? 1 : 0;
    const sql = `UPDATE note SET deleted = ? WHERE id IN (${ids.join()});`;
    return from(this.storageService.db.run(sql, [value], true)).pipe(tap(() => {
      this.notesUpdated$.next();
    }));
  }

  public deleteEmpty(id: number): Observable<any> {
    const sql = `DELETE FROM note WHERE id  = ?;`;
    return from(this.storageService.db.run(sql, [id], true));
  }

  public archiveNotes(ids: number[]): Observable<any> {
    const sql = `UPDATE note SET archived = 1 WHERE id IN (${ids.join()});`;
    return from(this.storageService.db.run(sql, [], true)).pipe(tap(() => {
      this.notesUpdated$.next();
    }));
  }

  public unarchiveNotes(ids: number[]): Observable<any> {
    const sql = `UPDATE note SET archived = 0 WHERE id IN (${ids.join()});`;
    return from(this.storageService.db.run(sql, [], true)).pipe(tap(() => {
      this.notesUpdated$.next();
    }));
  }

  public pinNotes(ids: number[]): Observable<any> {
    const sql = `UPDATE note SET pinned = 1 WHERE id IN (${ids.join()});`;
    return from(this.storageService.db.run(sql, [], true)).pipe(tap(() => {
      this.notesUpdated$.next();
    }));
  }

  public unpinNotes(ids: number[]): Observable<any> {
    const sql = `UPDATE note SET pinned = 0 WHERE id IN (${ids.join()});`;
    return from(this.storageService.db.run(sql, [], true)).pipe(tap(() => {
      this.notesUpdated$.next();
    }));
  }

  public changeNotesBackground(ids: number[], background: NoteBackground | undefined): Observable<any> {
    const sql = `UPDATE note SET background = ? WHERE id IN (${ids.join()});`;
    return from(this.storageService.db.run(sql, [background], true)).pipe(tap(() => {
      this.notesUpdated$.next();
    }));
  }

  public searchNotes(search: string): Observable<Note[]> {
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

  public searchNotesByCategoryId(categoryId: number, search: string): Observable<Note[]> {
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
      return this.getNotesByCategoryId(categoryId);
    }
  }

  public searchNotesByBackground(background: string, search: string): Observable<Note[]> {
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
      return this.getNotesByBackground(background);
    }
  }

  public countNotes(): Observable<{ totalNotes: number }> {
    return from(this.storageService.db.query(`SELECT COUNT(n.id) as totalNotes FROM note n WHERE n.archived = 0 AND deleted = 0`))
      .pipe(map((value: DBSQLiteValues) => value.values![0] as { totalNotes: number }));
  }

  public getNotesCreationDates(): Observable<{ creationDate: string }[]> {
    return from(this.storageService.db.query(`SELECT DISTINCT DATE(creation_date) as creationDate FROM note WHERE archived = 0 AND deleted = 0`))
      .pipe(map((value: DBSQLiteValues) => value.values as { creationDate: string }[]));
  }

  public getNotesByCreationDate(creationDate: string): Observable<Note[]> {
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

  public getArchivedNotes(): Observable<Note[]> {
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

  public getDeletedNotes(): Observable<Note[]> {
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

  public moveCategoryNotes(ids: number[], targetId: number): Observable<any> {
    const sql = `UPDATE note SET category_id = ? WHERE id IN (${ids.join()});`;
    return from(this.storageService.db.run(sql, [targetId], true)).pipe(tap(() => {
      this.notesUpdated$.next();
    }));
  }

}
