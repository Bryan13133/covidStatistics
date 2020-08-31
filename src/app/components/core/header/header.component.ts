import { Component, OnInit, OnDestroy } from '@angular/core';
import { ThemeService } from '@pk-services/theme/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'pk-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit, OnDestroy {
  sub: Subscription;
  isDarkThemeActive;

  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
    this.themeService.getActiveTheme().subscribe(data => {
      this.isDarkThemeActive = data;
    });
  }

  onToggleTheme(e: boolean) {
    this.themeService.switchTheme(e);
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}
