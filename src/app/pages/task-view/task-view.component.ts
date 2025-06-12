import { Component, signal, effect } from '@angular/core';
import { TasksService } from '../../core/services/tasks.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-task-view',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss'
})
export class TaskViewComponent {
  lists = signal<{ title: string, tasks: any[] }[]>([]);
  selectedListIndex = signal<number | null>(null);
  showAddTask = signal(false);
  newTaskText = signal('');

  constructor(private tasksService: TasksService, private router: Router) {
    // Load lists from localStorage or use default
    const saved = localStorage.getItem('lists');
    this.lists.set(saved ? JSON.parse(saved) : [{ title: 'List #1', tasks: [] }]);

    // Check if a new list was created and passed via navigation state
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { newListTitle?: string };
if (typeof state?.newListTitle === 'string' && state.newListTitle.trim() !== '') {
  this.lists.update(lists => [
    ...lists,
    { title: state.newListTitle!, tasks: [] }
  ]);
}

    // Effect to save lists on change
    effect(() => {
      localStorage.setItem('lists', JSON.stringify(this.lists()));
    });
  }

  selectList(index: number) {
    this.selectedListIndex.set(index);
  }

  addTaskToSelectedList() {
    const idx = this.selectedListIndex();
    const text = this.newTaskText().trim();
    if (idx === null || !text) return;
    this.lists.update(lists => {
      const newLists = [...lists];
      newLists[idx] = {
        ...newLists[idx],
        tasks: [...newLists[idx].tasks, { id: Date.now() + Math.random(), todo: text }]
      };
      return newLists;
    });
    this.newTaskText.set('');
    this.showAddTask.set(false);
  }

  removeList(index: number) {
    this.lists.update(lists => {
      const newLists = [...lists];
      newLists.splice(index, 1);
      return newLists;
    });
    const selected = this.selectedListIndex();
    if (selected === index) {
      this.selectedListIndex.set(null);
    } else if (selected !== null && selected > index) {
      this.selectedListIndex.set(selected - 1);
    }
  }

  removeTaskFromSelectedList(taskIndex: number) {
    const idx = this.selectedListIndex();
    if (idx === null) return;
    this.lists.update(lists => {
      const newLists = [...lists];
      const newTasks = [...newLists[idx].tasks];
      newTasks.splice(taskIndex, 1);
      newLists[idx] = { ...newLists[idx], tasks: newTasks };
      return newLists;
    });
  }

  trackByTask(index: number, task: any) {
    return task.id;
  }
}