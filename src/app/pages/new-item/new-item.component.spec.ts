import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewItemComponent } from './new-item.component';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms';

describe('NewItemComponent', () => {
  let component: NewItemComponent;
  let fixture: ComponentFixture<NewItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewItemComponent, FormsModule],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(NewItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not navigate if title is empty', () => {
    spyOn(component['router'], 'navigate');
    component.title = '';
    component.createList();
    expect(component['router'].navigate).not.toHaveBeenCalled();
  });
});
