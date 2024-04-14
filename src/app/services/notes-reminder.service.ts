import { Injectable } from "@angular/core";

import { DBSQLiteValues, capSQLiteChanges } from "@capacitor-community/sqlite";
import { Observable, map, switchMap, tap } from "rxjs";
import { from } from "rxjs/internal/observable/from";

import { Note, NoteAction, NoteReminder } from "../interfaces/note.interface";
import { addNotification, cancelNotification } from "../utils/reminder-utils";
import { NotesService } from "./notes.service";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: "root"
})
export class NotesReminderService {

  constructor(private storageService: StorageService, private notesService: NotesService) { }

  public findByNoteId(noteId: number): Observable<NoteReminder | undefined> {
    return from(this.storageService.db.query(`SELECT
    id,
    date,
    repeat,
    every,
    note_id as noteId
  FROM
    note_reminder
  WHERE
    noteId = ?`, [noteId]))
      .pipe(map((value: DBSQLiteValues) => value.values ? value.values[0] as NoteReminder : undefined));
  }

  public insert(noteReminder: Omit<NoteReminder, 'id'>): Observable<any> {
    const sql = `INSERT INTO note_reminder (date, repeat, every, note_id) VALUES (?, ?, ?, ?);`;
    return from(this.storageService.db.run(sql, [noteReminder.date, noteReminder.repeat, noteReminder.every, noteReminder.noteId], true))
      .pipe(map((value: capSQLiteChanges) => value.changes?.lastId as number), tap((id) => {
        this.notesService.notesUpdated$.next({
          ids: [id],
          action: NoteAction.UPDATE,
          changes: {
            reminderId: id,
            reminderDate: noteReminder.date
          }
        });
      }), switchMap(() => this.notesService.findById(noteReminder.noteId)), switchMap((note) => addNotification(note as Note)));
  }

  public update(noteReminder: NoteReminder): Observable<any> {
    const sql = `UPDATE note_reminder SET date = ?, repeat = ?, every = ? WHERE note_id = ? AND id = ?`;
    return from(this.storageService.db.run(sql, [noteReminder.date, noteReminder.repeat, noteReminder.every, noteReminder.noteId, noteReminder.id], true))
      .pipe(map((value: capSQLiteChanges) => value.changes?.lastId as number), tap(() => {
        this.notesService.notesUpdated$.next({
          ids: [noteReminder.id],
          action: NoteAction.UPDATE,
          changes: {
            reminderId: noteReminder.id,
            reminderDate: noteReminder.date
          }
        });
      }), switchMap(() => cancelNotification(noteReminder.noteId)),
        switchMap(() => this.notesService.findById(noteReminder.noteId)), switchMap((note) => addNotification(note as Note)));
  }

  public delete(id: number, noteId: number): Observable<any> {
    const sql = `DELETE FROM note_reminder WHERE id = ?;`;
    return from(this.storageService.db.run(sql, [id], true))
      .pipe(tap(() => {
        this.notesService.notesUpdated$.next({
          ids: [id],
          action: NoteAction.UPDATE,
          changes: {
            reminderId: undefined,
            reminderDate: undefined
          }
        });
      }), switchMap(() => cancelNotification(noteId)));
  }

}
