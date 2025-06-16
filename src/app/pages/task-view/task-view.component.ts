import { Component, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Task, TaskList } from '../../models/task';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { TasksService } from '../../core/services/tasks.service';

@Component({
  standalone: true,
  selector: 'app-task-view',
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss'
})
export class TaskViewComponent {
  // Signals for state management
  lists = signal<TaskList[]>([]);
  selectedListIndex = signal<number | null>(null);
  showAddTask = signal(false);
  newTaskText = signal('');
  editingTaskIndex = signal<number | null>(null);
  editTaskText = signal('');
  priority = signal<'low' | 'medium' | 'high'>('low');
  priorityFilter = signal<'all' | 'low' | 'medium' | 'high'>('all');
  newTaskDeadline = signal('');
  today = new Date().toISOString().slice(0, 10);
  searchText = signal('');

  form = new FormGroup({
    date: new FormControl('')
  });

  constructor(private router: Router, private tasksService: TasksService) {
    // Load lists from localStorage or use default
    const saved = localStorage.getItem('lists');
    this.lists.set(saved ? JSON.parse(saved) as TaskList[] : [{ title: 'List #1', tasks: [] }]);

    // Check if a new list was created and passed via navigation state
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { newListTitle?: string };
    if (typeof state?.newListTitle === 'string' && state.newListTitle.trim() !== '') {
      this.lists.update(lists => [
        ...lists,
        { title: state.newListTitle!, tasks: [] }
      ]);
    }

    // Effect to save lists to localStorage whenever they change
    effect(() => {
      localStorage.setItem('lists', JSON.stringify(this.lists()));
    });
  }

  // Select a list by its index
  selectList(index: number) {
    this.selectedListIndex.set(index);
  }

  // Add a new task to the selected list
  addTaskToSelectedList() {
    const idx = this.selectedListIndex();
    const text = this.newTaskText().trim();
    const deadline = this.form.value.date?.trim() || '';
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
            deadline: deadline || undefined
          }
        ]
      };
      return newLists;
    });
    this.newTaskText.set('');
    this.form.reset(); 
    this.showAddTask.set(false);
    this.priority.set('low');
  }

  // Remove a list by its index
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

  // Remove a task from the selected list by its index
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

  // Start editing a task by its index and current text
  startTaskEdit(index: number, currentText: string) {
    this.editingTaskIndex.set(index);
    this.editTaskText.set(currentText);
  }

  // Save the edited task text
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

  // Cancel editing a task
  cancelTaskEdit() {
    this.editingTaskIndex.set(null);
    this.editTaskText.set('');
  }

  // Toggle the completed state of a task
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

  // signal: returns filtered tasks based on priority
  filteredTasks = computed(() => {
    const idx = this.selectedListIndex();
    if (idx === null) return [];
    const tasks = this.lists()[idx]?.tasks || [];
    const filter = this.priorityFilter();
    if (filter === 'all') return tasks;
    return tasks.filter((task) => task.priority === filter);
  });

  searchedTasks = computed(() => {
    const tasks = this.filteredTasks();
    const search = this.searchText().toLowerCase();
    if (!search) return tasks;
    return tasks.filter(task => task.todo.toLowerCase().includes(search));
  });

  // signal: true if all tasks in the selected list are completed
  allTasksComplete = computed(() => {
    const idx = this.selectedListIndex();
    if (idx === null) return false;
    const tasks = this.lists()[idx]?.tasks || [];
    return tasks.length > 0 && tasks.every((task) => task.completed);
  });

  // TrackBy function for ngFor to optimize rendering
  trackByTask(index: number, task: Task) {
    return task.id;
  }

  // Returns true if the task is overdue (deadline before today and not completed)
  isTaskOverdue(task: Task): boolean {
    if (!task.deadline || task.completed) return false;
    const today = new Date().toISOString().slice(0, 10);
    return task.deadline < today;
  }

  // Returns true if all tasks in the list at the given index are completed
  isListComplete(index: number): boolean {
    const list = this.lists()[index];
    if (!list || !list.tasks.length) return false;
    return list.tasks.every((task) => task.completed);
  }
// fetch to add a random task from an external API
  addRandomTaskFromApi() {
    this.tasksService.getTodo().subscribe({
      next: (data) => {
        const idx = this.selectedListIndex();
        if (idx === null) return;
        this.lists.update(lists => {
          const newLists = [...lists];
          newLists[idx] = {
            ...newLists[idx],
            tasks: [
              ...newLists[idx].tasks,
              {
                id: Date.now() + Math.random(),
                todo: data.todo || 'Random Task',
                createdAt: new Date().toISOString(),
                completed: false,
                priority: 'low',
                deadline: undefined
              }
            ]
          };
          return newLists;
        });
      },
      error: () => {
        alert('Failed to fetch random task.');
      }
    });
  }
}