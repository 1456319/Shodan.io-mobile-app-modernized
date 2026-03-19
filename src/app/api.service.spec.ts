import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { ToastController, IonicModule } from '@ionic/angular';
import { StorageService } from './storage.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, IonicModule.forRoot()],
      providers: [
        ApiService,
        { provide: ToastController, useValue: { create: () => Promise.resolve({ present: () => {} }) } },
        { provide: StorageService, useValue: { getAPIKey: () => Promise.resolve('test-key') } }
      ]
    });
    service = TestBed.get(ApiService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getHostDetails should resolve with data on success', (done) => {
    const mockData = { ip: '1.2.3.4', os: 'Linux' };
    service.getHostDetails('1.2.3.4').then(res => {
      expect(res).toEqual(mockData);
      done();
    });

    const req = httpMock.expectOne(req => req.url.includes('/shodan/host/1.2.3.4'));
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('getHostDetails should resolve with error on failure (baseline behavior)', (done) => {
    const mockError = { status: 404, statusText: 'Not Found' };
    service.getHostDetails('1.2.3.4').then(res => {
      expect(res.status).toBe(404);
      done();
    });

    const req = httpMock.expectOne(req => req.url.includes('/shodan/host/1.2.3.4'));
    req.flush('Error', mockError);
  });
});
