import { Routes } from '@angular/router';

export const NOTES_ROUTES: Routes = [
  {
    path: "", loadComponent: () => import('./components/notes-list/notes-list.component').then(m => m.NotesListComponent)
  },
  {
    path: "add", loadComponent: () => import('./components/notes-add/notes-add.component').then(m => m.NotesAddComponent)
  }
];
