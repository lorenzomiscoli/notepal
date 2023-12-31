import { Injectable } from "@angular/core";

import { DBSQLiteValues, capSQLiteChanges } from '@capacitor-community/sqlite';
import { BehaviorSubject, Observable, from, map } from 'rxjs';

import { NoteCategory } from '../interfaces/note.interface';
import { StorageService } from '../../../services/storage.service';

@Injectable()
export class NotesCategoryService {
  public selectedCategory$ = new BehaviorSubject<number | undefined>(undefined);

  constructor(private storageService: StorageService) { }

  // Find the categories along with the number of associated notes
  public getAllNotesCategories(): Observable<NoteCategory[]> {
    return from(this.storageService.db.query(`SELECT nc.id, nc.name, ncCount.notesCount
    FROM note_category nc
    LEFT JOIN
    (SELECT nc.id, COUNT(n.id) AS notesCount
    FROM note_category nc
    LEFT JOIN note n ON nc.id = n.category_id
    GROUP BY nc.id)
    ncCount ON ncCount.id = nc.id`))
      .pipe(map((value: DBSQLiteValues) => value.values as NoteCategory[]));
  }

  public existsCategoryByName(name: string): Observable<boolean> {
    return from(this.storageService.db.query(`SELECT COUNT(1) as isPresent FROM note_category WHERE name = ?`, [name]))
      .pipe(map((value: DBSQLiteValues) => Boolean(value.values![0].isPresent)));
  }

  public existsCategoryByIdNotAndName(id: number, name: string): Observable<boolean> {
    return from(this.storageService.db.query(`SELECT COUNT(1) as isPresent FROM note_category WHERE id <> ? AND name = ?`, [id, name]))
      .pipe(map((value: DBSQLiteValues) => Boolean(value.values![0].isPresent)));
  }

  public addNoteCategory(name: string): Observable<number> {
    const sql = `INSERT INTO note_category (name) VALUES (?);`;
    return from(this.storageService.db.run(sql, [name], true)).pipe(map((value: capSQLiteChanges) => value.changes?.lastId as number));
  }

  public updateNoteCategory(id: number, name: string): Observable<void> {
    const sql = "UPDATE note_category SET name = ? WHERE id = ?;";
    return from(this.storageService.db.run(sql, [name, id], true)).pipe(map(() => undefined));
  }

  public deleteCategories(ids: number[]): Observable<void> {
    const sql = "DELETE FROM note_category WHERE id IN (" + ids.join() + ");";
    return from(this.storageService.db.run(sql, [], true)).pipe(map(() => undefined));
  }

}
