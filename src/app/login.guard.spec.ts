import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { LoginGuard } from './login.guard';

describe('LoginGuard', () => {
  let guard: LoginGuard;
  let storageSpy: jasmine.SpyObj<Storage>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const sSpy = jasmine.createSpyObj('Storage', ['get']);
    const rSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        LoginGuard,
        { provide: Storage, useValue: sSpy },
        { provide: Router, useValue: rSpy }
      ]
    });

    guard = TestBed.get(LoginGuard);
    storageSpy = TestBed.get(Storage);
    routerSpy = TestBed.get(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true if apiKey is present', async () => {
    storageSpy.get.and.returnValue(Promise.resolve('test-api-key'));
    const result = await guard.canActivate(null, null);
    expect(result).toBe(true);
  });

  it('should return false and navigate to /ask-apikey if apiKey is missing', async () => {
    storageSpy.get.and.returnValue(Promise.resolve(undefined));
    const result = await guard.canActivate(null, null);
    expect(result).toBe(false);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/ask-apikey');
  });

  it('should return false and navigate to /ask-apikey if apiKey is null', async () => {
    storageSpy.get.and.returnValue(Promise.resolve(null));
    const result = await guard.canActivate(null, null);
    expect(result).toBe(false);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/ask-apikey');
  });

  it('should return false and navigate to /ask-apikey if apiKey is an empty string', async () => {
    storageSpy.get.and.returnValue(Promise.resolve(''));
    const result = await guard.canActivate(null, null);
    expect(result).toBe(false);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/ask-apikey');
  });
});
