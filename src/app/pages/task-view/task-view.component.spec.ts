import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskViewComponent } from './task-view.component';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms';

describe('TaskViewComponent', () => {
  let component: TaskViewComponent;
  let fixture: ComponentFixture<TaskViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskViewComponent, FormsModule],
      providers: [
        provideRouter([]) 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new task to the selected list', () => {
    component.lists.set([{ title: 'Test', tasks: [] }]);
    component.selectedListIndex.set(0);
    component.newTaskText.set('My Task');
    component.addTaskToSelectedList();
    expect(component.lists()[0].tasks.length).toBe(1);
    expect(component.lists()[0].tasks[0].todo).toBe('My Task');
  });

  it('should mark a task as completed', () => {
    component.lists.set([{ title: 'Test', tasks: [{ id: 1, todo: 'A', createdAt: '', completed: false, priority: 'low' }] }]);
    component.selectedListIndex.set(0);
    component.toggleTaskCompleted(0);
    expect(component.lists()[0].tasks[0].completed).toBeTrue();
  });
});
