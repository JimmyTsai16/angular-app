import { Component, OnInit } from '@angular/core';

import * as d3 from 'd3';

import {SysInfoService} from '../../_service/sys-info.service';
import {CpuData, CpuInfo} from '../dateFormat';
import { MultiFormat } from '../axis';
import {D3ChartService} from '../../_service/d3-chart.service';

@Component({
  selector: 'app-server-info',
  templateUrl: './server-info.component.html',
  styleUrls: ['./server-info.component.css']
})
export class ServerInfoComponent implements OnInit {

  cpuData: CpuData = {
    data: [],
    start: 0,
    end: 0,
  };
  newData: any;

  constructor(
    private sysInfoService: SysInfoService,
    private d3ChartService: D3ChartService,
  ) { }


  ngOnInit() {
  }

  onDraw() {
    this.d3ChartService.NewChart(this.newData, this.cpuData.start, this.cpuData.end);
    this.d3ChartService.InitSVG();
    this.d3ChartService.InitAxis();
    this.d3ChartService.DrawLine();
  }

  onGet() {
    this.sysInfoService.GetCpuInfo().subscribe( res => {
      console.log(new Date(res[res.length - 2].CreatedAt).toLocaleTimeString());
      this.cpuData.data = res;
      for (const i in this.cpuData.data) {
        if (this.cpuData.data[i]) {
          this.cpuData.data[i].CreatedAt =
            Date.parse(this.cpuData.data[i].CreatedAt);
        }
      }
      this.cpuData.start = this.cpuData.data[0].CreatedAt;
      this.cpuData.end =
        this.cpuData.data[this.cpuData.data.length - 1].CreatedAt;
      console.log(this.cpuData);
      this.newData = this.cpuData.data.map(d => {
        return {x: d.CreatedAt, y: d.CpuPercentage};
      });
      console.log(this.newData);
    });
  }

}
