export interface TimelineData {
  country:string
  timeline:{
    [index:number]:{
      cases:number;
      date:string;
      deaths:number;
      recovered:number;
    }
  }

}
