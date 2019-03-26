import { Component, OnInit } from '@angular/core';

import * as d3 from 'd3';
// const d3 = require('d3');

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
    offsetX: 35,
    offsetY: 20,
    diffWidth: 0,
    diffHeight: 0,
    padding: 20,
    rectGap: 20,
    rectWidth: 40,
    graphicHeight: 0,
    dataMin: 0,
    dataMax: 0,
  };

  cpuData: CpuData = {
    data: [],
    start: 0,
    end: 0,
  };

  scaleX: any;
  scaleY: any;
  zoomSvg: any;
  axisX: any;
  axisY: any;
  gX: any;
  gY: any;
  dataLine: any;


  svg: any;
  constructor(
    private sysInfoService: SysInfoService
  ) { }


  ngOnInit() {
    this.InitDragRect();
  }

  InitDragRect() {
    const drag = d3.drag()
      .on('start', () => {
        console.log(d3.event);
      })
      .on('drag', () => {
        rect.attr('x', +rect.attr('x') + d3.event.dx);
        rect.attr('y', +rect.attr('y') + d3.event.dy);
        // console.log(d3.event);
      })
      .on('end', () => {
        console.log(d3.event);
      });

    d3.select('#rect').append('g')
      // .attr('transform', 'translate(35,20)')
      .call(d3.axisTop(d3.scaleLinear()
        .range([0, 300]))
        .tickSize(-150, 0)
        .ticks(30))
      .attr('opacity', '0.3');

    d3.select('#rect').append('g')
      .call(d3.axisLeft(d3.scaleLinear()
        .range([0, 150]))
        .tickSize(-300, 0))
      .attr('opacity', '0.3');

    const zoomed = () => {
      // rect.attr('x', +rect.attr('x') + d3.event.transform);
      // rect.attr('y', +rect.attr('y') + d3.event.dy);
      rect.attr('transform', d3.event.transform);
      console.log(d3.event);
    };

    const zoom = d3.zoom()
      .on('zoom', zoomed)
      .on('start', zoomed);

    const rect = d3.select('#rect')
      .style('border', '#000 1px solid')
      .call (zoom)
      .append('rect')
      .attr('width', 50)
      .attr('height', 50)
      .attr('x', 200)
      .attr('y', 100)
      .style('background-color', 'black');
      // .call(drag);
  }

  InitSVG() {
    this.svgParams.width = 700;
    this.svgParams.height = 300;
    this.svgParams.offsetX = 45;
    this.svgParams.offsetY = 20;
    this.svgParams.diffWidth =
      this.svgParams.width - this.svgParams.offsetX - 25;
    this.svgParams.diffHeight =
      this.svgParams.height - this.svgParams.offsetY - 10;

    this.svgParams.dataMax = d3.max(this.cpuData.data, d => {
      return d.CpuPercentage;
    }) * 1.001;
    this.svgParams.dataMin = d3.min(this.cpuData.data, d => {
      return d.CpuPercentage;
    }) / 1.001;

    this.svg = d3.select('svg')
      .attr('width', this.svgParams.width)
      .attr('height', this.svgParams.height);
    this.scaleX = d3.scaleTime()
      .domain([new Date(this.cpuData.start), new Date(this.cpuData.end)])
      .range([0, this.svgParams.diffWidth]);

    this.scaleY = d3.scaleLinear()
      .domain([this.svgParams.dataMax, this.svgParams.dataMin]) // Reverse the data, let chart Y-axis show the value from bottom to top.
      .range([0 , this.svgParams.diffHeight])
      .clamp(true);

    // ClipPath
    this.svg.append('defs').append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', this.svgParams.diffWidth)
      .attr('height', this.svgParams.diffHeight);
  }

  InitAxis() {

    this.axisX = d3.axisTop(this.scaleX)
      .tickFormat(d => MultiFormat(d))
      .ticks(5);
    this.axisY = d3.axisLeft(this.scaleY).ticks(5);

    this.gX = this.svg.append('g')
      .attr('class', 'axis-X')
      .call(this.axisX)
      .attr('fill', 'none')
      .attr('stroke', '#000')
      .attr('stroke-width', '0.3')
      .attr('font-family', 'fantasy')
      .attr('transform', 'translate('
        + this.svgParams.offsetX + ','
        + this.svgParams.offsetY + ')');

    this.gY = this.svg.append('g')
      .attr('class', 'axis-Y')
      .call(this.axisY)
      .attr('fill', 'none')
      .attr('stroke', '#000')
      .attr('stroke-width', '0.3')
      .attr('font-family', 'fantasy')
      .attr('transform', 'translate('
        + this.svgParams.offsetX + ','
        + this.svgParams.offsetY + ')');

    const axisXGrid = d3.axisTop(this.scaleX)
      .tickFormat('')
      .tickSize(-this.svgParams.diffHeight, 0);

    const axisYGrid = d3.axisLeft(this.scaleY)
      .ticks(10)
      .tickFormat('')
      .tickSize(-this.svgParams.diffWidth, 0);

    // Y-axis Grid
    this.svg.append('g')
      .attr('class', 'axisGridX')
      .call(axisXGrid)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(0,0,0,.1)')
      .attr('opacity', '0.1')
      .attr('transform', 'translate('
        + this.svgParams.offsetX + ','
        + this.svgParams.offsetY + ')');

    // Y-axis Grid
    this.svg.append('g')
      .attr('class', 'axisGridY')
      .call(axisYGrid)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(0,0,0,.1)')
      .attr('opacity', '0.1')
      .attr('transform', 'translate('
        + this.svgParams.offsetX + ','
        + this.svgParams.offsetY + ')');
    // .atrr('transform', 'translate(35,'
    //   + (this.svgParams.width
    //     + this.svgParams.offsetY) + ')');
    const zoomed = () => {
      this.gX.call(
        this.axisX.scale(d3.event.transform.rescaleX(this.scaleX))
      );

      // this.gY.call(
      //   this.axisY.scale(d3.event.transform.rescaleY(this.scaleY))
      // );

      // console.log(d3.event);
      // console.log(d3.event.transform.rescaleX(this.scaleX).domain());
      // console.log(d3.event.transform.rescaleX(this.scaleX)(8));

      // console.log(d3.event.transform.rescaleX(this.scaleX));
      // console.log(this.cpuData.data.slice(
      //   d3.event.transform.rescaleX(this.scaleX).domain()[0]
      //   ,
      //   d3.event.transform.rescaleX(this.scaleX).domain()[1]
      // ));
      const date = d3.event.transform.rescaleX(this.scaleX).domain();
      const res = this.cpuData.data.filter(d => {
        return (d.CreatedAt > date[0] && d.CreatedAt < date[1]);
      });
      // console.log(res);
      const maxmin = d3.extent(res, d => d.CpuPercentage).reverse();
      maxmin[0] *= 1.001;
      maxmin[1] /= 1.001;

      // console.log(newData);
      this.scaleY.domain(maxmin);

      // console.log(d3.nest().entries(this.cpuData.data));

      this.gY.call(this.axisY.scale(this.scaleY));
      this.dataLine = d3.line()
        .x(d => d3.event.transform.rescaleX(this.scaleX)(d.CreatedAt))
        .y(d => this.scaleY(d.CpuPercentage));

      const area = d3.area()
        .x(d => d3.event.transform.rescaleX(this.scaleX)(d.CreatedAt))
        .y0(this.svgParams.diffHeight)
        .y1(d => this.scaleY(d.CpuPercentage));

      this.svg.select('.dataPath').attr('d', this.dataLine);
      this.svg.select('.dataArea').attr('d', area);
    };


    this.zoomSvg = d3.zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[0, 0],
        [this.svgParams.diffWidth, this.svgParams.diffHeight]])
      .extent([[0, 0],
        [this.svgParams.diffWidth, this.svgParams.diffHeight]])
      .on('zoom', zoomed);
    this.svg.call(this.zoomSvg);
  }



  DrawLine() {

    console.log(d3.extent(this.cpuData.data, a => {
      return a.CpuPercentage;
    }));


    // const line = d3.line()
    //   .x(d => d.x)
    //   .y(d => d.y

    this.dataLine = d3.line()
      .x(d => this.scaleX(d.CreatedAt))
      .y(d => this.scaleY(d.CpuPercentage));
    // const axisX = d3.axisTop(scaleX).tickFormat(d => {
    //   console.log(d);
    //   console.log(MultiFormat(d));
    //   return d.toLocaleString() === new Date(this.cpuData.start).toLocaleString()
    //     ? d.toLocaleString() : MultiFormat(d);
    // });
    // this.svg.append('axis')
    //   .attr('transform', 'translate(0,30)').call(axisY);

    // const sortedData = d3.nest()
    //   .sortValues((a, b) => a.CpuPercentage > b.CpuPercentage)
    //   .entries(this.cpuData.data);

    this.svg.append('path')
      .attr('class', 'dataPath')
      .attr('clip-path', 'url(#clip)')
      .datum(this.cpuData.data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('transform', 'translate('
        + this.svgParams.offsetX + ','
        + this.svgParams.offsetY + ')')
      .attr('d', this.dataLine);

    const area = d3.area()
      .x(d => this.scaleX(d.CreatedAt))
      .y0(this.svgParams.diffHeight)
      .y1(d => this.scaleY(d.CpuPercentage));

    this.svg.append('path')
      .attr('clip-path', 'url(#clip)')
      .attr('class', 'dataArea')
      .datum(this.cpuData.data)
      .attr('d', area)
      .attr('transform', 'translate('
        + this.svgParams.offsetX + ','
        + this.svgParams.offsetY + ')')
      .attr('fill', 'rgba(0,0,255,0.1)');
  }

  onDraw() {
    this.InitSVG();
    this.InitAxis();
    this.DrawLine();
  }

  onGet() {
    this.sysInfoService.GetCpuInfo().subscribe( res => {
      // console.log(res);
      // console.log(res[0].CreatedAt);
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
      // const sortedData = d3.nest()
      //   .sortValues((a, b) => a.CpuPercentage > b.CpuPercentage)
      //   .entries(this.cpuData.data);
      // console.log(sortedData);
    });
  }

}
