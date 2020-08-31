import { Component, OnInit, NgZone } from '@angular/core';
import { MainService } from '@pk-services/main/main.service';
import { CountryService } from '@pk-services/country/country.service';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import * as Fuse from 'fuse.js';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'pk-default-page',
  templateUrl: './default-page.component.html',
  styleUrls: ['./default-page.component.sass'],
})
export class DefaultPageComponent implements OnInit {

  countries:any=[];
  timeLine: any;
  caseData = [];
  sortType = "todayCases";
  filterPost = '';
  radarChart: am4charts.RadarChart;
  mapChart: am4maps.MapChart;
  lineChart: am4charts.XYChart;
  pieChart: am4charts.PieChart;
  totalCritical:any;
  activeCases:any;
  totalDeaths:any;
  totalCases:any;
  finishedCases:any;
  totalRecoveries:any;
  todayDeaths:any;
  todayCases:any;
  casesPer1M:any;
  countryCodes: any = {};
  loading: boolean = true;
  loadingMap: boolean = true;
  loadingCountries: boolean = true;
  fuse: any;
  

  constructor(
    private mainService: MainService,
    private countryService: CountryService,
    private zone: NgZone,
  ) { }
  
 async ngOnInit() {
    this.countryCodes = this.countryService.countryCodes;
    this.zone.runOutsideAngular(async () =>{
      combineLatest(
        this.mainService.getAll(this.sortType),
        this.mainService.getGlobalTimelineData(),
      ).subscribe(([data,dataTime])=>{
        this.loadingMap = false;
        this.countries = data;
        this.totalCases = this.orderData('cases');
        this.totalDeaths = this.orderData('deaths');
        this.totalRecoveries = this.orderData('recovered');
        this.totalCritical = this.orderData('critical');
        this.todayCases = this.orderData("todayCases");
        this.todayDeaths = this.orderData("todayDeaths");
        this.activeCases = this.orderData('active');
        this.casesPer1M = this.orderData("casesPerOneMillion");
        this.finishedCases = this.totalDeaths + this.totalRecoveries;
        this.fuse =  new  Fuse(this.countries, {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        minMatchCharLength: 1,
        keys: [
          "country"
          ]
        });
        this.timeLine = dataTime;
        this.createLineChart(false);
        this.createRadarChart();
        this.createPieChart();
        this.loadingCountries = false;
        this.loading = false;
      });
    });
  }

orderData(type, array = this.countries) {
    var total = 0
    for (var i = 0, _len = array.length; i < _len; i++) {
      total += array[i][type]
    }
    return total
  }
sortCountries(key) {
    this.loadingCountries = true;
    this.sortType = key;
    this.loadSorted();
}
loadSorted(){
  this.mainService.getAll(this.sortType).subscribe((data: {}) => {
    this.countries = data;
    this.loadingCountries = false;
  });
}
 createRadarChart() {
  let chart = am4core.create("radarChart", am4charts.RadarChart);
  chart.data = [{
    "category": "Critical",
    "value": this.totalCritical / this.activeCases * 100,
    "full": 100
  }, {
    "category": "Deaths",
    "value": this.totalDeaths / this.finishedCases * 100,
    "full": 100
  }, {
    "category": "Recovered",
    "value": this.totalRecoveries / this.finishedCases * 100,
    "full": 100
  }, {
    "category": "Active",
    "value": 100-(this.totalCritical / this.activeCases * 100),
    "full": 100
  }];

  chart.startAngle = -90;
  chart.endAngle = 180;
  chart.innerRadius = am4core.percent(20);
  chart.numberFormatter.numberFormat = "#.#'%'";

  let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis<am4charts.AxisRendererRadial>());
  categoryAxis.dataFields.category = "category";
  categoryAxis.renderer.grid.template.location = 0;
  categoryAxis.renderer.grid.template.strokeOpacity = 0;
  categoryAxis.renderer.labels.template.horizontalCenter = "right";
  categoryAxis.renderer.labels.template.adapter.add("fill", function (fill, target) {
    if(target.dataItem.index==0){
      return am4core.color("#f9c851");
    }
    if(target.dataItem.index==1){
      return am4core.color("#ff5b5b");
    }
    if(target.dataItem.index==2){
      return am4core.color("#10c469");
    }
    return am4core.color("#21AFDD");
  });
  categoryAxis.renderer.minGridDistance = 10;

  let valueAxis = chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
  valueAxis.renderer.grid.template.strokeOpacity = 0;
  valueAxis.min = 0;
  valueAxis.max = 100;
  valueAxis.strictMinMax = true;
  valueAxis.renderer.labels.template.fill = am4core.color("#adb5bd");

  let series1 = chart.series.push(new am4charts.RadarColumnSeries());
  series1.dataFields.valueX = "full";
  series1.dataFields.categoryY = "category";
  series1.clustered = false;
  series1.columns.template.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
  series1.columns.template.fillOpacity = 0.08;
  series1.columns.template["cornerRadiusTopLeft"] = 20;
  series1.columns.template.strokeWidth = 0;
  series1.columns.template.radarColumn.cornerRadius = 20;

  let series2 = chart.series.push(new am4charts.RadarColumnSeries());
  series2.dataFields.valueX = "value";
  series2.dataFields.categoryY = "category";
  series2.clustered = false;
  series2.columns.template.strokeWidth = 0;
  series2.columns.template.tooltipText = "{category}: [bold]{value}[/]";
  series2.columns.template.radarColumn.cornerRadius = 20;

  series2.columns.template.adapter.add("fill", function (fill, target) {
    if(target.dataItem.index==0){
      return am4core.color("#f9c851");
    }
    if(target.dataItem.index==1){
      return am4core.color("#ff5b5b");
    }
    if(target.dataItem.index==2){
      return am4core.color("#10c469");
    }
    return am4core.color("#21AFDD");
  });

  chart.cursor = new am4charts.RadarCursor();
  chart.cursor.fill = am4core.color("#282e38");
  chart.tooltip.label.fill = am4core.color("#282e38");
  this.radarChart = chart;
 
}

 loadMap(option) {
  this.loadingMap = true;
  if (this.mapChart) {
    this.mapChart.dispose();
  }
  let color = "#21AFDD";
  if (option == "recovered") {
    color = "#10c469";
  } else if (option == "critical") {
    color = "#f9c851";
  } else if (option == "deaths") {
    color = "#ff5b5b";
  }
  let mapData = [];
  this.fuse.list.forEach(element => {
    if(element[option]!=0){
      mapData.push({
        id: this.countryCodes[element.country],
        name: element.country,
        value: element[option],
        color: am4core.color(color)
      });
    }
  });

  let chartMap = am4core.create("worldChart", am4maps.MapChart);
  chartMap.geodata = am4geodata_worldLow;
  chartMap.projection = new am4maps.projections.Miller();
  let polygonSeries = chartMap.series.push(new am4maps.MapPolygonSeries());
  polygonSeries.exclude = ["AQ"];
  polygonSeries.useGeodata = true;
  polygonSeries.nonScalingStroke = true;
  polygonSeries.strokeWidth = 0.5;
  polygonSeries.calculateVisualCenter = true;
  let imageSeries = chartMap.series.push(new am4maps.MapImageSeries());
  imageSeries.data = mapData;
  imageSeries.dataFields.value = "value";
  let imageTemplate = imageSeries.mapImages.template;
  imageTemplate.nonScaling = true
  let circle = imageTemplate.createChild(am4core.Circle);
  circle.fillOpacity = 0.7;
  circle.propertyFields.fill = "color";
  circle.tooltipText = "{name}: [bold]{value}[/]";
  chartMap.events.on("ready",()=>{
    this.loadingMap = false;
  })
  imageSeries.heatRules.push({
    "target": circle,
    "property": "radius",
    "min": 4,
    "max": 30,
    "dataField": "value"
  })
  imageTemplate.adapter.add("latitude", function (latitude, target) {
    let polygon = polygonSeries.getPolygonById(target.dataItem.dataContext["id"]);
    if (polygon) {
      return polygon.visualLatitude;
    }
    return latitude;
  })

  imageTemplate.adapter.add("longitude", function (longitude, target) {
    let polygon = polygonSeries.getPolygonById(target.dataItem.dataContext["id"]);
    if (polygon) {
      return polygon.visualLongitude;
    }
    return longitude;
  })
  let polygonTemplate = polygonSeries.mapPolygons.template;
  polygonTemplate.tooltipText = "{name}";
  polygonTemplate.fill = am4core.color("#282d37");
  polygonTemplate.stroke = am4core.color("#313a46")
  this.mapChart = chartMap;

}
 createLineChart(chartType) {
  this.caseData = [];
  if (this.lineChart) {
    this.lineChart.dispose();
  }
  Object.keys(this.timeLine).forEach(key => {
    this.caseData.push({
      date: new Date(key),
      cases: this.timeLine[key].cases,
      recoveries: this.timeLine[key].recovered,
      deaths: this.timeLine[key].deaths
    });
  });
  this.caseData.push({
    date: new Date().getTime(),
    cases: this.totalCases,
    recoveries: this.totalRecoveries,
    deaths: this.totalDeaths
  });

  let chart = am4core.create("lineChart", am4charts.XYChart);
  chart.numberFormatter.numberFormat = "#a";
  chart.numberFormatter.bigNumberPrefixes = [
    { "number": 1e+3, "suffix": "K" },
    { "number": 1e+6, "suffix": "M" },
    { "number": 1e+9, "suffix": "B" }
  ];
  let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.minGridDistance = 50;
  let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.logarithmic = chartType;
  valueAxis.renderer.labels.template.fill = am4core.color("#adb5bd");
  dateAxis.renderer.labels.template.fill = am4core.color("#adb5bd");
  chart = this.createSeriesLine(chart, "#21AFDD", "cases");
  chart = this.createSeriesLine(chart, "#10c469", "recoveries");
  chart = this.createSeriesLine(chart, "#ff5b5b", "deaths");
  chart.data = this.caseData;
  chart.legend = new am4charts.Legend();
  chart.legend.labels.template.fill = am4core.color("#adb5bd");
  chart.cursor = new am4charts.XYCursor();
  this.lineChart = chart;
}
 createSeriesLine(chart, color, type) {
  let name = type.charAt(0).toUpperCase() + type.slice(1);
  let series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueY = type;
  series.fill = am4core.color(color);
  series.dataFields.dateX = "date";
  series.strokeWidth = 2;
  series.minBulletDistance = 10;
  series.tooltipText = "{valueY} " + name;
  series.tooltip.pointerOrientation = "vertical";
  series.tooltip.background.cornerRadius = 20;
  series.tooltip.background.fillOpacity = 0.5;
  series.stroke = am4core.color(color);
  series.legendSettings.labelText = name;
  series.tooltip.autoTextColor = false;
  series.tooltip.label.fill = am4core.color("#282e38");
  return chart
}
 createPieChart() {
  let tempData = this.fuse.list.slice();
  this.sortData(tempData, "cases");
  tempData = tempData.reverse();
  let chart = am4core.create("pieChart", am4charts.PieChart);
  chart.data = tempData.slice(0, 10);
  let otherCases = tempData.slice(10, tempData.length);
  chart.data.push({
    country: 'Other',
    cases: this.orderData("cases", otherCases)
  });
  let pieSeries = chart.series.push(new am4charts.PieSeries());
  pieSeries.dataFields.value = "cases";
  pieSeries.dataFields.category = "country";
  pieSeries.labels.template.disabled = true;
  pieSeries.ticks.template.disabled = true;
  pieSeries.slices.template.stroke = am4core.color("#313a46");
  pieSeries.slices.template.strokeWidth = 1;
  pieSeries.slices.template.strokeOpacity = 1;
  this.pieChart = chart;
  this.loadMap("cases");
}
 sortData(data, sortBy) {
  try {
    const sortPro = sortBy;
    data.sort((a, b) => {
      if (a[sortPro] < b[sortPro]) {
        return -1;
      } else if (a[sortPro] > b[sortPro]) {
        return 1;
      }
      return 0;
    })
  } catch (e) {
    console.error("ERROR while sorting", e);
    return data;
  }
  return data
}
ngOnDestroy() {
  this.zone.runOutsideAngular(() => {
    if (this.pieChart) {
      this.pieChart.dispose();
    }
    if (this.mapChart) {
      this.mapChart.dispose();
    }
    if (this.lineChart) {
      this.lineChart.dispose();
    }
    if(this.radarChart){
      this.radarChart.dispose();
    }
  });
}

}
