import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setItem(value: string) {
    localStorage.setItem('theme', value);
  }

  getItem() {
    const theme = localStorage.getItem('theme');
    return theme;
  }
}
