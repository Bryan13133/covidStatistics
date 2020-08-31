import { Subscription } from 'rxjs';
import { Component, OnInit, HostBinding, OnDestroy, Input } from '@angular/core';
import { StatisticsService } from '@pk-services/statistics/statistics.service';

@Component({
  selector: 'pk-stats-cards',
  templateUrl: './stats-cards.component.html',
  styleUrls: ['./stats-cards.component.sass']
})
export class StatsCardsComponent implements OnInit, OnDestroy {
  @HostBinding() class = 'row mt-3';
  stats: any[];
  sub: Subscription = new Subscription();
  @Input('country') country: string;

  constructor(private statsService: StatisticsService) { }

  ngOnInit(): void {
    this.onDataLoad();
  }

  onDataLoad() {
    if (this.country) {
      this.sub.add(
        this.statsService.getCountryStatistics(this.country).subscribe((stats) => {
          this.stats = stats;
        })
      );
    } else {
      this.sub.add(this.statsService.getStatistics().subscribe((stats) => {
        this.stats = stats;
        console.log('dev', stats);
      }));
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
