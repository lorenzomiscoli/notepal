import { Injectable } from "@angular/core";

import { DBSQLiteValues } from '@capacitor-community/sqlite';
import { BehaviorSubject, Observable, from, map, } from 'rxjs';

import { NoteCategory } from '../interfaces/note.interface';
import { StorageService } from '../../../services/storage.service';

@Injectable()
export class NotesCategoryService {
  public selectedCategory$ = new BehaviorSubject<number | undefined>(undefined);

  constructor(private storageService: StorageService) { }

  public getAllNotesCategories(): Observable<NoteCategory[]> {
    return from(this.storageService.db.query(`SELECT nc2.id, nc2.name, temp.notesCount
    FROM note_category nc2
    LEFT JOIN
    (SELECT nc.id, COUNT(n.id) AS notesCount
    FROM note_category nc
    LEFT JOIN note n ON nc.id = n.category_id
    GROUP BY nc.id)
    temp ON temp.id = nc2.id`))
      .pipe(map((value: DBSQLiteValues) => value.values as NoteCategory[]));
  }

}
