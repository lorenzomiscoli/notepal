import { Routes } from '@angular/router';

import { NOTES_ROUTES } from './layouts/notes/notes.routes';

export const routes: Routes = [
  {
    path: "", pathMatch: 'full', redirectTo: "notes"
  },
  {
    path: "notes",
    loadComponent: () => import('./layouts/notes/notes.component').then(m => m.NotesComponent),
    children: NOTES_ROUTES
  }
];
