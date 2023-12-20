import { Injectable } from "@angular/core";

import { DBSQLiteValues, capSQLiteChanges } from '@capacitor-community/sqlite';
import { Observable, ReplaySubject, from, map, tap } from 'rxjs';

import { Note } from '../interfaces/note.interface';
import { StorageService } from '../../../services/storage.service';

@Injectable()
export class NotesService {
  public notesUpdated$ = new ReplaySubject<void>(1);

  constructor(private storageService: StorageService) {
    this.notesUpdated$.next();
  }

  public getAllNotes(): Observable<Note[]> {
    return from(this.storageService.db.query("SELECT * FROM note WHERE archived = 0")).pipe(map((value: DBSQLiteValues) => value.values as Note[]));
  }

  public getNoteById(id: number): Observable<Note | undefined> {
    return from(this.storageService.db.query("SELECT * FROM note WHERE id = ?", [id])).pipe(map((value: DBSQLiteValues) => {
      const notes = value.values as Note[];
      return notes && notes.length > 0 ? notes[0] as Note : undefined;
    }));
  }

  public addNote(note: Note): Observable<number> {
    const sql = `INSERT INTO note (title, value, date, archived) VALUES (?, ?, ?, 0);`;
    return from(this.storageService.db.run(sql, [note.title, note.value, note.date], true)).pipe(tap(() => {
      this.notesUpdated$.next();
    }), map((value: capSQLiteChanges) => value.changes?.lastId as number));
  }

  public updateNote(id: number, note: Note): Observable<any> {
    const sql = "UPDATE note SET title = ? , value = ? , date = ? WHERE id = ?;";
    return from(this.storageService.db.run(sql, [note.title, note.value, note.date, id], true)).pipe(tap(() => {
      this.notesUpdated$.next();
    }));
  }

  public delete(ids: number[]): Observable<any> {
    const sql = "DELETE FROM note WHERE id IN (" + ids.join() + ");";
    return from(this.storageService.db.run(sql, [], true)).pipe(tap(() => {
      this.notesUpdated$.next();
    }));
  }

  public archiveNotes(ids: number[]): Observable<any> {
    const sql = "UPDATE note SET archived = 1 WHERE id IN (" + ids.join() + ");";
    return from(this.storageService.db.run(sql, [], true)).pipe(tap(() => {
      this.notesUpdated$.next();
    }));
  }

}
