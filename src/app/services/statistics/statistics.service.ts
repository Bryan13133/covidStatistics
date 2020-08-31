import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  private apiUrl = 'http://api.coronastatistics.live';

  constructor(private http: HttpClient) { }

  getStatistics(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/countries`)
      .pipe(
        map(countries => {
          const stats = countries.reduce((acc: any, current: any) => {
            return {
              cases: acc.cases + current.cases,
              deaths: acc.deaths + current.deaths,
              recovered: acc.recovered + current.recovered,
              todayCases: acc.todayCases + current.todayCases,
              todayDeaths: acc.todayDeaths + current.todayDeaths,
              critical: acc.critical + current.critical,
              criticalPerMillion: acc.criticalPerMillion + current.criticalPerOneMillion
            }
          }, {
            cases: 0,
            deaths: 0,
            recovered: 0,
            todayCases: 0,
            todayDeaths: 0,
            critical: 0,
            criticalPerMillion: 0
          });

          const total = stats.deaths + stats.recovered;
          const activeCases = stats.cases - (stats.deaths + stats.recovered);

          return [
            {
              title: 'Infections',
              class: 'infections',
              rate: 0,
              totalCases: stats.cases,
              todayCases: stats.todayCases,
              textPostfix: 'Today'
            },
            {
              title: 'Deaths',
              class: 'deaths',
              rate: stats.deaths / total,
              totalCases: stats.deaths,
              todayCases: stats.todayDeaths,
              textPostfix: 'Today'
            },
            {
              title: 'Recoveries',
              class: 'recoveries',
              rate: stats.recovered / total,
              totalCases: stats.recovered,
              todayCases: activeCases,
              textPostfix: 'Remaining'
            },
            {
              title: 'Critical',
              class: 'critical',
              rate: stats.critical / activeCases,
              totalCases: stats.critical,
              todayCases: stats.criticalPerMillion,
              textPostfix: 'Per million'
            }
          ];
        })
      );
  }

  getCountryStatistics(country: string) {
    return this.http.get<any[]>(`${this.apiUrl}/countries/${country}`)
      .pipe(
        map((country: any) => {
          const total = country.deaths + country.recovered;
          const activeCases = country.cases - (country.deaths + country.recovered);

          return [
            {
              title: 'Infections',
              class: 'infections',
              rate: null,
              totalCases: country.cases,
              todayCases: country.todayCases,
              textPostfix: 'Today'
            },
            {
              title: 'Deaths',
              class: 'deaths',
              rate: country.deaths / total,
              totalCases: country.deaths,
              todayCases: country.todayDeaths,
              textPostfix: 'Today'
            },
            {
              title: 'Recoveries',
              class: 'recoveries',
              rate: country.recovered / total,
              totalCases: country.recovered,
              todayCases: activeCases,
              textPostfix: 'Remaining'
            },
            {
              title: 'Critical',
              class: 'critical',
              rate: country.critical / activeCases,
              totalCases: country.critical,
              todayCases: country.criticalPerOneMillion,
              textPostfix: 'Per million'
            }
          ];
        })
      );
  }

}
