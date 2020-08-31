import { Injectable, Inject } from '@angular/core';
import { ThemeMode } from './../../enums/theme.enum';
import { LocalStorageService } from '@pk-services/localStorage/local-storage.service';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkThemeActive = new BehaviorSubject<boolean>(false);

  constructor(
    private localStorageService: LocalStorageService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  getActiveTheme(): Observable<boolean> {
    return this.isDarkThemeActive.asObservable();
  }

  setInitialTheme() {
    const currentTheme = this.localStorageService.getItem();
    if (currentTheme === ThemeMode.DARK) {
      this.setDarkTheme();
    } else {
      this.setLightTheme();
    }
  }

  switchTheme(currentValue: boolean) {
    if (currentValue) {
      this.setDarkTheme();
    } else {
      this.setLightTheme();
    }
  }

  setLightTheme() {
    this.localStorageService.setItem(ThemeMode.LIGHT);
    this.document.body.classList.remove(ThemeMode.DARK);
    this.document.body.classList.add(ThemeMode.LIGHT);
    this.isDarkThemeActive.next(false);
  }

  setDarkTheme() {
    this.localStorageService.setItem(ThemeMode.DARK);
    this.document.body.classList.remove(ThemeMode.LIGHT);
    this.document.body.classList.add(ThemeMode.DARK);
    this.isDarkThemeActive.next(true);
  }
}
