import { Injectable } from '@angular/core';
import {MultiFormat} from '../admin/axis';
import {CpuData} from '../admin/dateFormat';

import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class D3ChartService {

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

  XStart: number;
  XEnd: number;
  data: {[key: string]: any}[];

  scaleX: any;
  scaleY: any;
  zoomSvg: any;
  axisX: any;
  axisY: any;
  gX: any;
  gY: any;
  dataLine: any;


  svg: any;

  constructor() { }

  NewChart(d: any, XStart: number, XEnd: number) {
    this.data = d;
    this.XStart = XStart;
    this.XEnd = XEnd;
  }

  InitSVG() {
    // Define the width and height parameters.
    this.svgParams.width = 700;
    this.svgParams.height = 300;
    this.svgParams.offsetX = 45;
    this.svgParams.offsetY = 20;
    // diffWidth and diffHeight is the chart width and height respectively.
    this.svgParams.diffWidth =
      this.svgParams.width - this.svgParams.offsetX - 25;
    this.svgParams.diffHeight =
      this.svgParams.height - this.svgParams.offsetY - 10;

    // Get the max of the CpuPercentage and multiply 1.001 to keep some space from the bottom.
    this.svgParams.dataMax = d3.max(this.data, d => {
      return d.y;
    }) * 1.001;
    this.svgParams.dataMin = d3.min(this.data, d => {
      return d.y;
    }) / 1.001;

    // Set SVG
    this.svg = d3.select('svg')
      .attr('width', this.svgParams.width)
      .attr('height', this.svgParams.height);

    // Time scale function, return scale.
    this.scaleX = d3.scaleTime()
      .domain([new Date(this.XStart), new Date(this.XEnd)])
      .range([0, this.svgParams.diffWidth]);

    // Number scale function, return scale.
    this.scaleY = d3.scaleLinear()
      .domain([this.svgParams.dataMax, this.svgParams.dataMin]) // Reverse the data, let chart Y-axis show the value from bottom to top.
      .range([0 , this.svgParams.diffHeight])
      .clamp(true);

    // ClipPath to clip the chart, prevent the data overflow the extent.
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

    const zoomed = () => {
      this.gX.call(
        this.axisX.scale(d3.event.transform.rescaleX(this.scaleX))
      );

      const date = d3.event.transform.rescaleX(this.scaleX).domain();
      const res = this.data.filter(d => {
        return (d.x > date[0] && d.x < date[1]);
      });

      const maxmin = d3.extent(res, d => d.y).reverse();
      maxmin[0] *= 1.001;
      maxmin[1] /= 1.001;

      this.scaleY.domain(maxmin);

      this.gY.call(this.axisY.scale(this.scaleY));
      this.dataLine = d3.line()
        .x(d => d3.event.transform.rescaleX(this.scaleX)(d.x))
        .y(d => this.scaleY(d.y));

      const area = d3.area()
        .x(d => d3.event.transform.rescaleX(this.scaleX)(d.x))
        .y0(this.svgParams.diffHeight)
        .y1(d => this.scaleY(d.y));

      this.svg.select('.dataPath').attr('d', this.dataLine);
      this.svg.select('.dataArea').attr('d', area);
    };


    this.zoomSvg = d3.zoom()
      .scaleExtent([1, 20])
      .translateExtent([[0, 0],
        [this.svgParams.diffWidth, this.svgParams.diffHeight]])
      .extent([[0, 0],
        [this.svgParams.diffWidth, this.svgParams.diffHeight]])
      .on('zoom', zoomed);
    this.svg.call(this.zoomSvg);
  }



  DrawLine() {

    console.log(d3.extent(this.data, a => {
      return a.y;
    }));

    this.dataLine = d3.line()
      .x(d => this.scaleX(d.x))
      .y(d => this.scaleY(d.y));

    this.svg.append('path')
      .attr('class', 'dataPath')
      .attr('clip-path', 'url(#clip)')
      .datum(this.data)
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
      .x(d => this.scaleX(d.x))
      .y0(this.svgParams.diffHeight)
      .y1(d => this.scaleY(d.y));

    this.svg.append('path')
      .attr('clip-path', 'url(#clip)')
      .attr('class', 'dataArea')
      .datum(this.data)
      .attr('d', area)
      .attr('transform', 'translate('
        + this.svgParams.offsetX + ','
        + this.svgParams.offsetY + ')')
      .attr('fill', 'rgba(0,0,255,0.1)');
  }

}
