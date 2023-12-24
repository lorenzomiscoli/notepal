import { Routes } from '@angular/router';

export const NOTES_ROUTES: Routes = [
  {
    path: "", loadComponent: () => import('./components/notes-tabs/notes-tabs.component').then(m => m.NotesTabsComponent),
    children: [
      {
        path: "", redirectTo: "list", pathMatch: "full"
      },
      {
        path: "list", loadComponent: () => import('./components/notes-list/notes-list.component').then(m => m.NotesListComponent)
      },
    ]
  },
  {
    path: "save", loadComponent: () => import('./components/notes-save/notes-save.component').then(m => m.NotesSaveComponent)
  },

];
