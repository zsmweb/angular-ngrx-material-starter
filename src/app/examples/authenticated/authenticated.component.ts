import { Component, OnInit } from '@angular/core';
import { NgxEchartsService } from 'ngx-echarts';
import { ditem, Note } from '../../core/models/note';
import { Observable, from } from 'rxjs';
import {Store} from '@ngrx/store';
import * as fromNotesStore from './store';
import * as notesActions from './store/actions/notes.actions';
import * as chartsActions from './store/actions/charts.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { take, map, debounceTime, filter, tap } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'anms-authenticated',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.scss']
})
export class AuthenticatedComponent implements OnInit {
  constructor(private router: Router,private nes: NgxEchartsService,private store: Store<fromNotesStore.State>,
  private routeInfo:ActivatedRoute,private matSnackBar:MatSnackBar) {}
  cpusrs$: Observable<ditem[]>;
  gpusrs$: Observable<ditem[]>;
  curDevice:string;
  allNotes:Note[];
  fpsAverage:Observable<number>;
  fpsVariance:Observable<number>;
  ngOnInit() {
    this.curDevice = this.routeInfo.snapshot.params['sn'];
    if(this.curDevice){
      this.routeInfo.snapshot.data['title'] = this.curDevice;
    }else{
      this.store.select(fromNotesStore.getCurDevices).pipe(
        take(1),
        map(tmp=>{
          if(tmp){
            this.store.dispatch(new notesActions.JoinRoom(tmp));
            this.router.navigate(['/examples/authenticated/'+tmp]);
            console.log('going3',tmp);
          }
        })
      ).subscribe();
    }
    this.cpusrs$ = this.store.select(fromNotesStore.getCpuEntitesArray).pipe(
      debounceTime(500),
      map(x=>x)
    );
    this.gpusrs$ = this.store.select(fromNotesStore.getGpuEntitesArray).pipe(
      debounceTime(500),
      map(x=>x)
    );
    this.store.select(fromNotesStore.getEntitiesArray).subscribe(notes=>{
      this.allNotes = notes;
    });
    this.store.select(fromNotesStore.getTimes).subscribe();
    
    this.setCpuUpdater();
    this.setGpuUpdater();
    this.setFpsUpdater();
    this.setTempUpdater();

    this.fpsAverage = this.store.select(fromNotesStore.getAverageFps).pipe(
      map(x=>{
        if(this.curDevice in x){
          return x[this.curDevice].average;
        }else{
          return 0;
        }
        
      })
    );
    this.fpsVariance = this.store.select(fromNotesStore.getAverageFps).pipe(
      map(x=>{
        if(this.curDevice in x){
          return x[this.curDevice].variance
        }else{
          return 0;
        }
      })
    );
  }
  updateCpuOptions:Observable<any> = null;
  updateGpuOptions:Observable<any> = null;
  updateTempOptions:Observable<any> = null;
  updateFpsOptions:Observable<any> = null;
  
  charts:any[] = [];
  onChartInit(chart){
    this.charts.push(chart);
    if(this.charts.length == 4){
      this.nes.connect(this.charts);
    }
  }

  onValueChange(element,event){
    let updatenote = this.allNotes.find((note)=>{
      if(note.body[0] == element.id)
        return true;
    })
    updatenote = Object.assign({},updatenote);
    updatenote.body = Object.values(element);
    this.store.dispatch(new notesActions.UpdateNote(updatenote));
  }

  UpdateValue(element:ditem,value:number,key:string){
    element[key] = value;
    return Object.assign({},element);
  }

  displayedColumns: string[] = ['id', 'min', 'max', 'timeout'];

  setCpuUpdater(){
    this.updateCpuOptions = this.store.select(fromNotesStore.getJsonEntites).pipe(
      filter(x=>{
        if(this.isZooming)
          return false;
        return true;
      }),
      map(jsons=>{
        let deviceJsons = jsons[this.curDevice];
        if(!deviceJsons||deviceJsons.length==0){
          console.error("Device JSON is null");
          return {};
        }
        //console.log(Date.now());
        let seriestmp= deviceJsons[0].cpus.map(c=>{
          let seriesData = deviceJsons.map(json=>json.cpus[c.idx].freq);
          return {
            name:"Cluster"+c.idx,
            type:'line',
            connectNulls:false,
            
            data:seriesData
          }
        })
        let legenddata = deviceJsons[0].cpus.map(c=>"Cluster"+c.idx);
        let timeline = deviceJsons.map(json=>{
          let tmp = new Date(json.time);
          return tmp.toLocaleTimeString().replace(/^\D*/,'')
        });
        //console.log(Date.now());
        return {
          title:{
            text: 'CPU频率图'
          },
          dataZoom:this.globalDataZoom,
          legend:{
            data:legenddata
          },
          xAxis : [
            {
              type : 'category',
              boundaryGap : false,
              data : timeline
            }
          ],
          series : seriestmp
        }
      })
    );
  }

  setGpuUpdater(){
    this.updateGpuOptions = this.store.select(fromNotesStore.getJsonEntites).pipe(
      filter(x=>{
        if(this.isZooming)
          return false;
        return true;
      }),
      map(jsons=>{
        let deviceJsons = jsons[this.curDevice];
        if(!deviceJsons||deviceJsons.length==0){
          console.error("Device JSON is null");
          return {};
        }
        //console.log(Date.now());

        let seriesData = deviceJsons.map(json=>json.gpufreq);
        let seriestmp = {
          name:"GPU",
          type:'line',
          connectNulls:false,
          
          data:seriesData
        }

        let legenddata = ["GPU"];
        let timeline = deviceJsons.map(json=>{
          let tmp = new Date(json.time);
          return tmp.toLocaleTimeString().replace(/^\D*/,'')
        });
        //console.log(Date.now());
        return {
          title:{
            text: 'GPU频率图'
          },
          dataZoom:this.globalDataZoom,
          legend:{
            data:legenddata
          },
          xAxis : [
            {
              type : 'category',
              boundaryGap : false,
              data : timeline
            }
          ],
          series : [seriestmp]
        }
      })
    );
  }

  setFpsUpdater(){
    this.updateFpsOptions = this.store.select(fromNotesStore.getJsonEntites).pipe(
      filter(x=>{
        if(this.isZooming)
          return false;
        return true;
      }),
      map(jsons=>{
        let deviceJsons = jsons[this.curDevice];
        if(!deviceJsons||deviceJsons.length==0){
          console.error("Device JSON is null");
          return {};
        }
        //console.log(Date.now());

        this.globalDataZoom[0].start = 100*(deviceJsons.length-100)/deviceJsons.length;
        if(deviceJsons.length>=3600){
          this.saveTheData();
          this.refresh();
        }

        let seriesData = deviceJsons.map(json=>json.fps);
        let seriestmp = {
          name:"FPS",
          type:'line',
          
          connectNulls:false,
          data:seriesData
        }

        let legenddata = ["FPS"];
        let timeline = deviceJsons.map(json=>{
          let tmp = new Date(json.time);
          return tmp.toLocaleTimeString().replace(/^\D*/,'')
        });
        //console.log(Date.now());
        return {
          title:{
            text: 'FPS实时图'
          },
          dataZoom:this.globalDataZoom,
          legend:{
            data:legenddata
          },
          xAxis : [
            {
              type : 'category',
              boundaryGap : false,
              data : timeline
            }
          ],
          series : [seriestmp]
        }
      })
    );
  }

  setTempUpdater(){
    this.updateTempOptions = this.store.select(fromNotesStore.getJsonEntites).pipe(
      filter(x=>{
        if(this.isZooming)
          return false;
        return true;
      }),
      map(jsons=>{
        let deviceJsons = jsons[this.curDevice];
        if(!deviceJsons||deviceJsons.length==0){
          console.error("Device JSON is null");
          return {};
        }
        //console.log(Date.now());
        let names = ["CPUTEMP","PCBTEMP"];
        let seriestmp= names.map(c=>{
          let seriesData = deviceJsons.map(json=>json[c.toLowerCase()]);
          return {
            name:c,
            type:'line',
            connectNulls:false,
            
            data:seriesData
          }
        })
        let legenddata = names;
        let timeline = deviceJsons.map(json=>{
          let tmp = new Date(json.time);
          return tmp.toLocaleTimeString().replace(/^\D*/,'')
        });
        //console.log(Date.now());
        return {
          title:{
            text: 'CPU/PCB温度图'
          },
          dataZoom:this.globalDataZoom,
          legend:{
            data:legenddata
          },
          xAxis : [
            {
              type : 'category',
              boundaryGap : false,
              data : timeline
            }
          ],
          series : seriestmp
        }
      })
    );
  }
  globalDataZoom = [{
    type:'inside',
    show : true,
    realtime: true,
    start : 0,
    end : 100
  },{
    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
    handleSize: '80%',
    handleStyle: {
      color: '#fff',
      shadowBlur: 3,
      shadowColor: 'rgba(0, 0, 0, 0.6)',
      shadowOffsetX: 2,
      shadowOffsetY: 2
    }
  }]
  chartOption = {
    title: {
      text: ''
    },
    tooltip : {
      trigger: 'axis'
    },
    legend: {
      data:[]
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    xAxis : [
      {
        type : 'category',
        boundaryGap : false,
        data : []
      }
    ],
    yAxis : [
      {
        type : 'value'
      }
    ],
    series : [
      
    ],
    dataZoom : this.globalDataZoom
  }

  isZooming = false;
  onChartDataZoom(){
    this.isZooming = true;
  }

  saveTheData(){
    this.store.select(fromNotesStore.getJsonEntites).pipe(
      take(1),
      map(jsons=>{
        let deviceJsons = jsons[this.curDevice];
        if(!deviceJsons||deviceJsons.length==0){
          console.error("Device JSON is null");
          this.matSnackBar.open("文件保存失败！", "ok", {
            duration: 2000,
          });
          return;
        }
        var blob = new Blob([JSON.stringify(deviceJsons,null,2)],{type: 'application/json'});
        saveAs(blob,this.curDevice+"_"+deviceJsons[0].time+".json");
        this.matSnackBar.open("文件保存成功！", "ok", {
          duration: 2000,
        });
      })
    ).subscribe();
  }
  refresh(){
    console.log('refresh');
    this.store.dispatch(new chartsActions.ClearAll(this.curDevice));
    this.matSnackBar.open("重新开始记录!", "ok", {
      duration: 2000,
    });

  }
}
