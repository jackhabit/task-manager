import { Component, signal, effect, computed } from '@angular/core';
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
  editingTaskIndex = signal<number | null>(null);
  editTaskText = signal('');
  priority = signal<'low' | 'medium' | 'high'>('low');
  priorityFilter = signal<'all' | 'low' | 'medium' | 'high'>('all');
  newTaskDeadline = signal('');
  today = new Date().toISOString().slice(0, 10);

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
    const deadline = this.newTaskDeadline().trim();
    if (idx === null || !text) return;
    this.lists.update(lists => {
      const newLists = [...lists];
      newLists[idx] = {
        ...newLists[idx],
        tasks: [
          ...newLists[idx].tasks,
          {
            id: Date.now() + Math.random(),
            todo: text,
            createdAt: new Date().toISOString(),
            completed: false,
            priority: this.priority(),
            deadline: deadline 
          }
        ]
      };
      return newLists;
    });
    this.newTaskText.set('');
    this.newTaskDeadline.set('');
    this.showAddTask.set(false);
    this.priority.set('low');
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

  startTaskEdit(index: number, currentText: string) {
    this.editingTaskIndex.set(index);
    this.editTaskText.set(currentText);
  }

  saveTaskEdit(index: number) {
    const idx = this.selectedListIndex();
    const newText = this.editTaskText().trim();
    if (idx === null || !newText) return;
    this.lists.update(lists => {
      const newLists = [...lists];
      const newTasks = [...newLists[idx].tasks];
      newTasks[index] = { ...newTasks[index], todo: newText };
      newLists[idx] = { ...newLists[idx], tasks: newTasks };
      return newLists;
    });
    this.editingTaskIndex.set(null);
    this.editTaskText.set('');
  }

  cancelTaskEdit() {
    this.editingTaskIndex.set(null);
    this.editTaskText.set('');
  }

  toggleTaskCompleted(taskIndex: number) {
    const idx = this.selectedListIndex();
    if (idx === null) return;
    this.lists.update(lists => {
      const newLists = [...lists];
      const newTasks = [...newLists[idx].tasks];
      newTasks[taskIndex] = {
        ...newTasks[taskIndex],
        completed: !newTasks[taskIndex].completed
      };
      newLists[idx] = { ...newLists[idx], tasks: newTasks };
      return newLists;
    });
  }

  filteredTasks = computed(() => {
    const idx = this.selectedListIndex();
    if (idx === null) return [];
    const tasks = this.lists()[idx]?.tasks || [];
    const filter = this.priorityFilter();
    if (filter === 'all') return tasks;
    return tasks.filter((task: any) => task.priority === filter);
  });

  allTasksComplete = computed(() => {
    const idx = this.selectedListIndex();
    if (idx === null) return false;
    const tasks = this.lists()[idx]?.tasks || [];
    return tasks.length > 0 && tasks.every((task: any) => task.completed);
  });

  trackByTask(index: number, task: any) {
    return task.id;
  }

  isTaskOverdue(task: any): boolean {
    if (!task.deadline || task.completed) return false;
    const today = new Date().toISOString().slice(0, 10);
    return task.deadline < today;
  }

  isListComplete(index: number): boolean {
    const list = this.lists()[index];
    if (!list || !list.tasks.length) return false;
    return list.tasks.every((task: any) => task.completed);
  }
}