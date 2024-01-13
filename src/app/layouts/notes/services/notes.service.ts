import { Injectable } from "@angular/core";

import { DBSQLiteValues, capSQLiteChanges } from '@capacitor-community/sqlite';
import { Observable, Subject, from, map, tap } from 'rxjs';

import { Note } from '../interfaces/note.interface';
import { StorageService } from '../../../services/storage.service';

@Injectable()
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
      archived,
      category_id as categoryId
    FROM
      note
    WHERE
      archived = 0
  `)).pipe(map((value: DBSQLiteValues) => value.values as Note[]));
  }

  public getNotesByCategoryId(id: number): Observable<Note[]> {
    return from(this.storageService.db.query(`SELECT
    id,
    title,
    value,
    creation_date as creationDate,
    last_modified_date as lastModifiedDate,
    archived,
    category_id as categoryId
  FROM
    note
  WHERE
    archived = 0
    AND category_id = ?`, [id]))
      .pipe(map((value: DBSQLiteValues) => value.values as Note[]));
  }

  public getNoteById(id: number): Observable<Note | undefined> {
    return from(this.storageService.db.query(`SELECT
    id,
    title,
    value,
    creation_date as creationDate,
    last_modified_date as lastModifiedDate,
    archived,
    category_id as categoryId
  FROM
    note
  WHERE
    id = ?`, [id])).pipe(map((value: DBSQLiteValues) => {
      const notes = value.values as Note[];
      return notes && notes.length > 0 ? notes[0] as Note : undefined;
    }));
  }

  public addNote(note: Note): Observable<number> {
    const sql = `INSERT INTO note (title, value, creation_date, last_modified_date, archived, category_id) VALUES (?, ?, ?, ?, 0, ?);`;
    return from(this.storageService.db.run(sql, [note.title, note.value, note.creationDate, note.lastModifiedDate, note.categoryId], true))
      .pipe(tap(() => {
        this.notesUpdated$.next();
      }), map((value: capSQLiteChanges) => value.changes?.lastId as number));
  }

  public updateNote(id: number, note: Note): Observable<any> {
    const sql = `UPDATE note SET title = ? , value = ? , last_modified_date = ? WHERE id = ?;`;
    return from(this.storageService.db.run(sql, [note.title, note.value, note.lastModifiedDate, id], true)).pipe(tap(() => {
      this.notesUpdated$.next();
    }));
  }

  public delete(ids: number[]): Observable<any> {
    const sql = `DELETE FROM note WHERE id IN (${ids.join()});`;
    return from(this.storageService.db.run(sql, [], true)).pipe(tap(() => {
      this.notesUpdated$.next();
    }));
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

  public searchNotes(search: string): Observable<Note[]> {
    return from(this.storageService.db.query(`SELECT
    id,
    title,
    value,
    creation_date as creationDate,
    last_modified_date as lastModifiedDate,
    archived,
    category_id as categoryId
  FROM
    note
  WHERE
    archived = 0
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
      archived,
      category_id as categoryId
    FROM
      note
    WHERE
      archived = 0
      AND category_id = ?
      AND title LIKE '%${search}%'`, [categoryId]))
        .pipe(map((value: DBSQLiteValues) => value.values as Note[]));
    } else {
      return this.getNotesByCategoryId(categoryId);
    }
  }

  public countNotes(): Observable<{ totalNotes: number }> {
    return from(this.storageService.db.query(`SELECT COUNT(n.id) as totalNotes FROM note n WHERE n.archived = 0`))
      .pipe(map((value: DBSQLiteValues) => value.values![0] as { totalNotes: number }));
  }

  public getNotesCreationDates(): Observable<{ creationDate: string }[]> {
    return from(this.storageService.db.query(`SELECT DISTINCT DATE(creation_date) as creationDate FROM note WHERE archived = 0`))
      .pipe(map((value: DBSQLiteValues) => value.values as { creationDate: string }[]));
  }

  public getNotesByCreationDate(creationDate: string): Observable<Note[]> {
    return from(this.storageService.db.query(`SELECT
    id,
    title,
    value,
    creation_date as creationDate,
    last_modified_date as lastModifiedDate,
    archived,
    category_id as categoryId
  FROM
    note
  WHERE
    archived = 0
    AND DATE(creation_date) = ?`, [creationDate]))
      .pipe(map((value: DBSQLiteValues) => value.values as Note[]));
  }

}
