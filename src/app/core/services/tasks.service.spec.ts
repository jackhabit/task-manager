import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TasksService]
    });
    service = TestBed.inject(TasksService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch a random todo from API', (done) => {
    const mockResponse = {
      id: 1,
      todo: 'Test random todo',
      completed: false,
      userId: 1
    };
    service.getTodo().subscribe(data => {
      expect(data).toEqual(mockResponse);
      done();
    });
    const req = httpMock.expectOne('https://dummyjson.com/todos/random');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});

