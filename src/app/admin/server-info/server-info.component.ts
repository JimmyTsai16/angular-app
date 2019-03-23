import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import {SysInfoService} from '../../_service/sys-info.service';
import {CpuData, CpuInfo} from '../dateFormat';
import { MultiFormat } from '../axis';

@Component({
  selector: 'app-server-info',
  templateUrl: './server-info.component.html',
  styleUrls: ['./server-info.component.css']
})
export class ServerInfoComponent implements OnInit {
  data = [
    {x: 10, y: 10},
    {x: 50, y: 100},
    {x: 60, y: 50},
    {x: 100, y: 30}
  ];
  svgParams = {
    width: 0,
    height: 0,
    padding: 20,
    rectGap: 20,
    rectWidth: 40,
    maxValue: 200,
    graphicHeight: 0,
  };

  cpuData: CpuData = {
    data: [],
    start: 0,
    end: 0,
  };

  svg: any;
  constructor(
    private sysInfoService: SysInfoService
  ) { }


  ngOnInit() {
    this.svg = d3.select('svg')
      .attr('width', 700)
      .attr('height', 400);
  }

  onDraw() {
    // const line = d3.line()
    //   .x(d => d.x)
    //   .y(d => d.y

    const ScaleX = d3.scaleTime()
      .domain([new Date(this.cpuData.start), new Date(this.cpuData.end)])
      .range([0, 600]);

    const ScaleY = d3.scaleLinear()
      .domain([8, 8.05])
      .range([0 , 300])
      .clamp(true);

    const line = d3.line()
      .x(d => ScaleX(d.CreatedAt))
      .y(d => ScaleY(d.CpuPercentage));
    const axisY = d3.axisLeft(ScaleY).ticks(5);
    const axisX = d3.axisTop(ScaleX).tickFormat(d => MultiFormat(d));
    // const axisX = d3.axisTop(ScaleX).tickFormat(d => {
    //   console.log(d);
    //   console.log(MultiFormat(d));
    //   return d.toLocaleString() === new Date(this.cpuData.start).toLocaleString()
    //     ? d.toLocaleString() : MultiFormat(d);
    // });
    // this.svg.append('axis')
    //   .attr('transform', 'translate(0,30)').call(axisY);

    this.svg.append('path')
      .datum(this.cpuData.data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('transform', 'translate(35,20)')
      .attr('d', line);

    this.svg.append('g')
      .call(axisY)
      .attr('transform', 'translate(35,20)');

    this.svg.append('g')
      .call(axisX)
      .attr('transform', 'translate(35,20)');
  }

  onGet() {
    this.sysInfoService.GetCpuInfo().subscribe( res => {
      // console.log(res);
      console.log(res[0].CreatedAt);
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
    });
  }

}
