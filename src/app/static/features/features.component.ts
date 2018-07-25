import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

import { environment as env } from '@env/environment';
import { ROUTE_ANIMATIONS_ELEMENTS } from '@app/core';
import { NgxEchartsService } from 'ngx-echarts';
import { Subject } from 'rxjs';
import * as variance from 'compute-variance';
import * as average from 'average-array';
@Component({
  selector: 'anms-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  versions = env.versions;

  constructor(private cdr: ChangeDetectorRef,private nes: NgxEchartsService){}

  @ViewChild("container") container:ElementRef;

  jsonSubj = new Subject<any>();
  jsonObserable = this.jsonSubj.asObservable();

  fpsOptions: any;
  fpsUpdateOptions: any;
  // private fpsData: any[];
  private fpsDataArray: any[] = [];
  fpsSubj = new Subject<any>();

  cpusOptions: any;
  cpusUpdateOptions: any;
  // private cpusData: any[][];
  private cpusDataArray: any[] = [];
  cpusSubj = new Subject<any>();

  tempOptions: any;
  tempUpdateOptions: any;
  // private tempData: any[][];
  private tempDataArray: any[] = [];
  tempSubj = new Subject<any>();

  gpuOptions: any;
  gpuUpdateOptions: any;
  // private gpuData: any[];
  private gpuDataArray: any[] = [];
  gpuSubj = new Subject<any>();

  fpsShow:any[] = [];

  ngOnInit() {
    // initialize chart options:
    this.fpsOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      xAxis: {
        type: 'value',
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%']
      },
      dataZoom: [
        {
            show: true,
            realtime: true,
            start: 0,
            end: 100
        },
        {
            type: 'inside',
            realtime: true,
            start: 0,
            end: 100
        }
    ],
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
      series: [{
        name: 'Fps',
        type: 'line',
        showSymbol: false,
        connectNulls:false,
        hoverAnimation: false,
        data: []
      }]
    };

    this.fpsSubj.asObservable().subscribe((x)=>{
      if(x)
        this.fpsDataArray.push(x);
      let idx = 0;
      var legend = [];
      let data = this.fpsDataArray.map(d=>{
        idx++;
        legend.push(idx+'_Fps');
        let fpsarr = d.map((xd)=>{
          let xx=parseFloat(xd.value[1]);
          return xx?xx:0;
        });
        this.fpsShow[idx-1].average = average(fpsarr).toFixed(2)
        this.fpsShow[idx-1].variance = variance(fpsarr).toFixed(2);
        return {
          name: idx+'_Fps',
          type: 'line',
          showSymbol: false,
          connectNulls:false,
          hoverAnimation: false,
          data: d
        }
      });
      this.fpsUpdateOptions = {
        legend: {
          data: legend,
          align: 'left'
        },
        series: [...data]
      };
      this.cdr.detectChanges();
      console.log(this.fpsShow);
    });

    // this.cpusData = [];
    // this.cpusData[0] = [];
    // this.cpusData[1] = [];
    // this.cpusData[2] = [];
    this.cpusOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      xAxis: {
        type: 'value',
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%']
      },
      dataZoom: [
        {
            show: true,
            realtime: true,
            start: 0,
            end: 100
        },
        {
            type: 'inside',
            realtime: true,
            start: 0,
            end: 100
        }
    ],
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
      series: [{
        name: 'cluster0',
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        data: []
      },{
        name: 'cluster1',
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        data: []
      },{
        name: 'cluster2',
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        data: []
      }]
    };
    this.cpusSubj.asObservable().subscribe((obj)=>{
      let {x,y,z} = obj;
      if(obj)
        this.cpusDataArray.push({x,y,z});
      let idx = 0;
      let legendall = [];
      let data = [];
      this.cpusDataArray.map(({x,y,z})=>{
        idx++;
        var legend =  [idx+'_cluster0', idx+'_cluster1'];
        if(z.length>0){
          legend.push(idx+'_cluster2')
        }
        legendall = legendall.concat(legend);
        data.push({
          name: idx+'_cluster0',
          type: 'line',
          showSymbol: false,
          hoverAnimation: false,
          data: x
        });
        data.push({
          name: idx+'_cluster1',
          type: 'line',
          showSymbol: false,
          hoverAnimation: false,
          data: y
        });
        if(z.length>0){
          data.push({
            name: idx+'_cluster2',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: z
          });
        }
      });
      this.cpusUpdateOptions = {
        legend: {
          data: legendall,
          align: 'left'
        },
        series: [...data]
      };
      this.cdr.detectChanges();
    });

    // this.tempData = [];
    // this.tempData[0] = [];
    // this.tempData[1] = [];
    this.tempOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      xAxis: {
        type: 'value',
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%']
      },
      dataZoom: [
        {
            show: true,
            realtime: true,
            start: 0,
            end: 100
        },
        {
            type: 'inside',
            realtime: true,
            start: 0,
            end: 100
        }
    ],
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
      series: [{
        name: 'cputemp',
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        data: []
      },{
        name: 'pcbtemp',
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        data: []
      }]
    };
    this.tempSubj.asObservable().subscribe((obj)=>{
      let {x,y} = obj;
      if(obj)
        this.tempDataArray.push({x,y});
      let idx = 0;
      let legendall = [];
      let data = [];
      this.tempDataArray.map(({x,y})=>{
        idx++;
        var legend =  [idx+'_cputemp', idx+'_pcbtemp'];
        legendall = legendall.concat(legend);
        data.push({
          name: idx+'_cputemp',
          type: 'line',
          showSymbol: false,
          hoverAnimation: false,
          data: x
        });
        data.push({
          name: idx+'_pcbtemp',
          type: 'line',
          showSymbol: false,
          hoverAnimation: false,
          data: y
        });
      });
      this.tempUpdateOptions = {
        legend: {
          data: legendall,
          align: 'left'
        },
        series: [...data]
      };
      this.cdr.detectChanges();
    });

    // generate some random testing data:
    // this.gpuData = [];

    // initialize chart options:
    this.gpuOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      xAxis: {
        type: 'value',
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%']
      },
      dataZoom: [
        {
            show: true,
            realtime: true,
            start: 0,
            end: 100
        },
        {
            type: 'inside',
            realtime: true,
            start: 0,
            end: 100
        }
    ],
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
      series: [{
        name: 'GPU',
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        data: []
      }]
    };
    this.gpuSubj.asObservable().subscribe((x)=>{
      if(x)
        this.gpuDataArray.push(x);
      let idx = 0;
      var legend = [];
      let data = this.gpuDataArray.map(d=>{
        idx++;
        legend.push(idx+'_GPU');
        return {
          name: idx+'_GPU',
          type: 'line',
          showSymbol: false,
          connectNulls:false,
          hoverAnimation: false,
          data: d
        }
      });
      this.gpuUpdateOptions = {
        legend: {
          data: legend,
          align: 'left'
        },
        series: [...data]
      };
      this.cdr.detectChanges();
    });
  }

  openLink(link: string) {
    window.open(link, '_blank');
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

  cutData(e, tmp) {
    tmp = tmp.slice(e.dataIndex);
    console.log(tmp);
    tmp = tmp.map(d => {
      const index = parseInt( d.name, 10 ) - e.dataIndex;
      return {
        name: index,
        value: [index, d.value[1]]
      };
    });
    console.log(tmp);
    return tmp;
  }

  onChartClick(e){
    console.log(e)
    // this.fpsDataArray[e.seriesIndex] = this.fpsDataArray[e.seriesIndex].slice(e.dataIndex);
    // console.log(this.fpsDataArray[e.seriesIndex]);
    // this.fpsDataArray[e.seriesIndex] = this.fpsDataArray[e.seriesIndex].map(d => {
    //   const index = parseInt( d.name, 10 ) - e.dataIndex;
    //   return {
    //     name: index,
    //     value: [index, d.value[1]]
    //   };
    // });
    // console.log(this.fpsDataArray[e.seriesIndex]);
    this.fpsDataArray[e.seriesIndex] = this.cutData(e, this.fpsDataArray[e.seriesIndex]);
    this.cpusDataArray[e.seriesIndex].x = this.cutData(e, this.cpusDataArray[e.seriesIndex].x);
    this.cpusDataArray[e.seriesIndex].y = this.cutData(e, this.cpusDataArray[e.seriesIndex].y);
    this.cpusDataArray[e.seriesIndex].z = this.cutData(e, this.cpusDataArray[e.seriesIndex].z);
    this.tempDataArray[e.seriesIndex].x = this.cutData(e, this.tempDataArray[e.seriesIndex].x);
    this.tempDataArray[e.seriesIndex].y = this.cutData(e, this.tempDataArray[e.seriesIndex].y);
    this.gpuDataArray[e.seriesIndex] = this.cutData(e, this.gpuDataArray[e.seriesIndex]);
    this.fpsSubj.next(0);
    this.cpusSubj.next(0);
    this.tempSubj.next(0);
    this.gpuSubj.next(0);
  }

  show(json:string){
    let tmp = json.split('_');
    return tmp[0].substr(0,3)+":"+new Date(parseInt(tmp[1])).toLocaleString();
  }

  parseJsonToCharts = json=>{
    if(!json||json.length==0){
      return false;
    }
    var tmpfpsData = [];
    var tmpcpusData = [];
    tmpcpusData[0] = [];
    tmpcpusData[1] = [];
    tmpcpusData[2] = [];
    var tmptempData = [];
    tmptempData[0] = [];
    tmptempData[1] = [];
    var tmpgpuData = [];

    let startTime = new Date(json[0].time).getTime();
    json.forEach(z => {
      let index = ((new Date(z.time).getTime()-startTime)/1000).toFixed(0);
      tmpfpsData.push({
        name:index,
        value:[index,z.fps]
      });

      tmpcpusData[0].push({
        name:index,
        value:[index,z.cpus[0].freq]
      });
      if(z.cpus.length>1){
        tmpcpusData[1].push({
          name:index,
          value:[index,z.cpus[1].freq]
        });
      }
      if(z.cpus.length>2){
        tmpcpusData[2].push({
          name:index,
          value:[index,z.cpus[2].freq]
        });
      }

      tmptempData[0].push({
        name:index,
        value:[index,z.cputemp]
      });
      tmptempData[1].push({
        name:index,
        value:[index,z.pcbtemp]
      });

      tmpgpuData.push({
        name:index,
        value:[index,z.gpufreq]
      });
    });
    this.fpsSubj.next(tmpfpsData);
    this.cpusSubj.next({x:tmpcpusData[0],y:tmpcpusData[1],z:tmpcpusData[2]});
    this.tempSubj.next({x:tmptempData[0],y:tmptempData[1]});
    this.gpuSubj.next(tmpgpuData);
    return true;
  }
  droping:string;
  dropped(e){
    console.log(e);
    if(this.droping){
      alert("正在忙，请稍候再重新拖入！");
      return;
    }
    this.droping = e.files[0].relativePath;
    let index = this.fpsShow.length;
    this.fpsShow.push({id:index+1,desc:this.droping});
    
    var fr = new FileReader();
    fr.onloadend = (d)=>{
      let finame = this.droping;
      this.droping = null;
      let ret = this.parseJsonToCharts(JSON.parse((d.target as any).result));
      if(ret){
        console.log(d)
        
      }else{
        this.fpsShow.pop();
      }
    }
    // loop through files
    for (var i = 0; i < e.files.length; i++) {
      // get item
      e.files[i].fileEntry.file(f=>{
        fr.readAsText(f);
      });
    }
  }
  fileOver(e){

  }
  fileLeave(e){

  }
  show_list(fps){
    let d = fps.desc.substr(0,fps.desc.length-5).split('_');
    if(d.length<2){
      return fps.id+" - "+fps.desc + " - 平均:" + fps.average +" - 方差:"+fps.variance;
    }
    return fps.id+" - "+d[0]+" - "+new Date(parseInt(d[1])).toLocaleString() + " - 平均:" + fps.average +" - 方差:"+fps.variance;
  }
}
