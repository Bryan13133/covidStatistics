import { Subscription } from 'rxjs';
import { Component, OnInit, HostBinding, OnDestroy } from '@angular/core';
import { StatisticsService } from '@pk-services/statistics/statistics.service';
import { Statistics } from '@pk-models/statistics.model';

@Component({
  selector: 'pk-global-stats-cards',
  templateUrl: './global-stats-cards.component.html',
  styleUrls: ['./global-stats-cards.component.sass']
})
export class GlobalStatsCardsComponent implements OnInit, OnDestroy {
  @HostBinding() class = 'row mt-3';
  stats: any;
  sub: Subscription = new Subscription();
  loading: boolean = true;

  constructor(private statsService: StatisticsService) { }

 async ngOnInit() {
  this.loading = true;
    this.onDataLoad();
  }

  onDataLoad() {
    
    this.sub.add(this.statsService.getStatistics().subscribe((stats) => {
      this.stats = stats;
      this.loading = false;
    }));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
