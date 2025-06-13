# Task Manager

A simple Angular task manager app with support for multiple lists, priorities, deadlines, completion tracking, and more.

---

## 🚀 How to Install and Start the Project

1. **Clone the repository**

   ```sh
   git clone <your-repo-url>
   cd task-manager
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Start the development server**

   ```sh
   npm start
   ```

   or

   ```sh
   ng serve
   ```

4. **Open in your browser**
   ```
   http://localhost:4200
   ```

---

## 📋 Description of Implemented Functions

- **Multiple Lists:**  
  Create, select, and delete task lists. Each list is independent.

- **Add/Edit/Remove Tasks:**  
  Add tasks to a selected list, edit their text, or remove them.

- **Task Completion:**  
  Mark tasks as completed with a checkbox. Completed tasks are visually styled.

- **Priority:**  
  Assign a priority (low, medium, high) to each task. Filter tasks by priority.

- **Deadlines:**  
  Set a deadline for each task. Overdue tasks are highlighted.

- **Edit Tasks:**  
  Inline editing of task descriptions.

- **Persistent Storage:**  
  All lists and tasks are saved in your browser's localStorage.

- **Responsive UI:**  
  Clean, modern interface using Bulma and custom SCSS.

---

## 🛠️ Technical Documentation

### Main Technologies

- **Angular 17+** (standalone components, signals)
- **TypeScript**
- **Bulma CSS Framework**
- **LocalStorage** for persistence

### Main Files and Structure

- `src/app/pages/task-view/task-view.component.ts`  
  Main logic for managing lists and tasks. Uses Angular signals for state.

- `src/app/pages/task-view/task-view.component.html`  
  UI for lists, tasks, add/edit forms, and filters.

- `src/app/models/task.ts`  
  TypeScript interfaces for `Task` and `TaskList`.

- `src/app/pages/new-item/new-item.component.ts`  
  UI and logic for creating new lists.

- `src/app/core/services/tasks.service.ts`  
  (Unused, can be removed) Example of an HTTP service.

### Key Signals and Methods

- `lists: signal<TaskList[]>`  
  All task lists.

- `selectedListIndex: signal<number | null>`  
  Index of the currently selected list.

- `filteredTasks: computed<Task[]>`  
  Tasks filtered by priority.

- `allTasksComplete: computed<boolean>`  
  True if all tasks in the selected list are completed.

- `addTaskToSelectedList()`  
  Adds a new task to the selected list.

- `removeList(index: number)`  
  Removes a list.

- `removeTaskFromSelectedList(taskIndex: number)`  
  Removes a task from the selected list.

- `toggleTaskCompleted(taskIndex: number)`  
  Toggles a task's completed state.

- `isTaskOverdue(task: Task): boolean`  
  Returns true if the task's deadline is before today and not completed.

- `isListComplete(index: number): boolean`  
  Returns true if all tasks in a list are completed.

### Styling

- Uses Bulma for base styles.
- Custom SCSS for sidebar, task cards, priorities, overdue highlighting, and responsive layout.

---

**Enjoy managing your tasks!**
