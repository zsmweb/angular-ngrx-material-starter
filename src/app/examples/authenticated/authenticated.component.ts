import { Component, OnInit } from '@angular/core';
import { NgxEchartsService } from 'ngx-echarts';
import { ditem, Note } from '../../core/models/note';
import { Observable } from 'rxjs';
import {Store} from '@ngrx/store';
import * as fromNotesStore from './store';
import * as notesActions from './store/actions/notes.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { take, map } from 'rxjs/operators';

@Component({
  selector: 'anms-authenticated',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.scss']
})
export class AuthenticatedComponent implements OnInit {
  constructor(private router: Router,private nes: NgxEchartsService,private store: Store<fromNotesStore.State>,
  private routeInfo:ActivatedRoute) {}
  cpusrs$: Observable<ditem[]>;
  gpusrs$: Observable<ditem[]>;
  
  allNotes:Note[];
  ngOnInit() {
    let sn = this.routeInfo.snapshot.params['sn'];
    if(sn){
      this.routeInfo.snapshot.data['title'] = sn;
    }else{
      this.store.select(fromNotesStore.getCurDevices).pipe(
        take(1),
        map(tmp=>{
          if(tmp){
            this.store.dispatch(new notesActions.JoinRoom(tmp));
            this.router.navigate(['/examples/authenticated/'+tmp]);
            console.log('going3'+tmp)
          }
        })
      ).subscribe();
    }
    this.cpusrs$ = this.store.select(fromNotesStore.getCpuEntitesArray);
    this.gpusrs$ = this.store.select(fromNotesStore.getGpuEntitesArray);
    this.store.select(fromNotesStore.getEntitiesArray).subscribe(notes=>{
      this.allNotes = notes;
    });
    this.store.select(fromNotesStore.getTimes).subscribe();
    
  }

  chartOption = {
    title: {
      text: '堆叠区域图'
    },
    tooltip : {
      trigger: 'axis'
    },
    legend: {
      data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis : [
      {
        type : 'category',
        boundaryGap : false,
        data : ['周一','周二','周三','周四','周五','周六','周日']
      }
    ],
    yAxis : [
      {
        type : 'value'
      }
    ],
    series : [
      {
        name:'邮件营销',
        type:'line',
        stack: '总量',
        areaStyle: {normal: {}},
        data:[120, 132, 101, 134, 90, 230, 210]
      },
      {
        name:'联盟广告',
        type:'line',
        stack: '总量',
        areaStyle: {normal: {}},
        data:[220, 182, 191, 234, 290, 330, 310]
      },
      {
        name:'视频广告',
        type:'line',
        stack: '总量',
        areaStyle: {normal: {}},
        data:[150, 232, 201, 154, 190, 330, 410]
      },
      {
        name:'直接访问',
        type:'line',
        stack: '总量',
        areaStyle: {normal: {}},
        data:[320, 332, 301, 334, 390, 330, 320]
      },
      {
        name:'搜索引擎',
        type:'line',
        stack: '总量',
        label: {
          normal: {
            show: true,
            position: 'top'
          }
        },
        areaStyle: {normal: {}},
        data:[820, 932, 901, 934, 1290, 1330, 1320]
      }
    ]
  }
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
}
