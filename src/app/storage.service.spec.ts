import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  let storageSpy: jasmine.SpyObj<Storage>;
  let toastSpy: jasmine.SpyObj<ToastController>;

  beforeEach(() => {
    const spyStorage = jasmine.createSpyObj('Storage', ['get', 'set', 'clear', 'remove']);
    const spyToast = jasmine.createSpyObj('ToastController', ['create']);

    TestBed.configureTestingModule({
      providers: [
        StorageService,
        { provide: Storage, useValue: spyStorage },
        { provide: ToastController, useValue: spyToast }
      ]
    });

    service = TestBed.get(StorageService);
    storageSpy = TestBed.get(Storage) as jasmine.SpyObj<Storage>;
    toastSpy = TestBed.get(ToastController) as jasmine.SpyObj<ToastController>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDarkTheme', () => {
    it('should return false and set dark theme to false if storage value is undefined', async () => {
      storageSpy.get.and.returnValue(Promise.resolve(undefined));
      storageSpy.set.and.returnValue(Promise.resolve());

      const result = await service.getDarkTheme();

      expect(result).toBe(false);
      expect(storageSpy.get).toHaveBeenCalledWith(service.IS_DARK_THEME);
      expect(storageSpy.set).toHaveBeenCalledWith(service.IS_DARK_THEME, false);
    });

    it('should return true if storage value is true', async () => {
      storageSpy.get.and.returnValue(Promise.resolve(true));

      const result = await service.getDarkTheme();

      expect(result).toBe(true);
      expect(storageSpy.get).toHaveBeenCalledWith(service.IS_DARK_THEME);
      expect(storageSpy.set).not.toHaveBeenCalled();
    });

    it('should return false if storage value is false', async () => {
      storageSpy.get.and.returnValue(Promise.resolve(false));

      const result = await service.getDarkTheme();

      expect(result).toBe(false);
      expect(storageSpy.get).toHaveBeenCalledWith(service.IS_DARK_THEME);
      expect(storageSpy.set).not.toHaveBeenCalled();
    });
  });

  describe('isDarkTheme', () => {
    it('should return true if getDarkTheme returns true', async () => {
      spyOn(service, 'getDarkTheme').and.returnValue(Promise.resolve(true));

      const result = await service.isDarkTheme();

      expect(result).toBe(true);
    });

    it('should return false if getDarkTheme returns false', async () => {
      spyOn(service, 'getDarkTheme').and.returnValue(Promise.resolve(false));

      const result = await service.isDarkTheme();

      expect(result).toBe(false);
    });
  });
});
