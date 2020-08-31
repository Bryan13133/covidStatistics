import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'pk-toggle-swtich',
  templateUrl: './toggle-swtich.component.html',
  styleUrls: ['./toggle-swtich.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleSwtichComponent {
  @Input() isChecked: boolean;
  @Output() toggleTheme: EventEmitter<boolean> = new EventEmitter<boolean>();

  switchTheme(e: any) {
    this.toggleTheme.emit(e.target.checked);
  }
}
