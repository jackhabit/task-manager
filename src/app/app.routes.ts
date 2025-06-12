import { Routes } from '@angular/router';
import { TaskViewComponent } from './pages/task-view/task-view.component';
import { NewItemComponent } from './pages/new-item/new-item.component';

export const routes: Routes = [
    { path: '', component: TaskViewComponent },
    { path: 'new-item', component: NewItemComponent },
    // { path: '/lists/:id', component: TaskViewComponent },
];
