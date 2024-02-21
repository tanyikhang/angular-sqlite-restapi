import { Routes } from '@angular/router';
import { NoteDetailsComponent } from './note-details/note-details.component';

export const routes: Routes = [
  { path: 'note/:id', component: NoteDetailsComponent }
];