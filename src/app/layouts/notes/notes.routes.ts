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
      {
        path: "search", loadComponent: () => import('./components/notes-search/notes-search.component').then(m => m.NotesSearchComponent)
      },
      {
        path: "calendar", loadComponent: () => import('./components/notes-calendar/notes-calendar.component').then(m => m.NotesCalendarComponent)
      },
      {
        path: "more", loadComponent: () => import('./components/notes-more/notes-more.component').then(m => m.NotesMoreComponent)
      }
    ]
  },
  {
    path: "save", loadComponent: () => import('./components/notes-save/notes-save.component').then(m => m.NotesSaveComponent)
  },
  {
    path: "categories", loadComponent: () => import('./components/notes-categories/notes-categories.component').then(m => m.NotesCategories)
  },
  {
    path: "archive", loadComponent: () => import('./components/notes-archive/notes-archive.component').then(m => m.NotesArchiveComponent)
  },
  {
    path: "trash", loadComponent: () => import('./components/notes-trash/notes-trash.component').then(m => m.NotesTrashComponent)
  },
  {
    path: "reminders", loadComponent: () => import('./components/notes-reminder/notes-reminder.component').then(m => m.NotesReminderComponent)
  }
];
