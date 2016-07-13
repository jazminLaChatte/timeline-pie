var PieChart = function(config){
    config = config || {};
    //init private vars and methods
    this.chartW=400;
    this.chartH=400;
    this.isTimeline=false;
    this.calculateArcData = function(data) {
      return d3.pie()
        .sortValues(null)
        (data);
    };
    //set config vars
    $.extend(this,config);
    //TODO error check if data exists and this.data.values

    //set chart radii if not set by user
    var minDimension = Math.min(this.chartW, this.chartH);
    if(!this.outerR){
      this.outerR = minDimension/2;
    }
    if(!this.innerR){
      this.innerR = minDimension/6;
    }
    if(this.isTimeline){
      //create scale for outerR
      var totals = this.data.values.map(function(val){
        return val.total;
      });
      this.outerRScale = d3.scaleLinear() //TODO
        .domain([Math.min(...totals), Math.max(...totals)]) //calculate min and max totals
        .range([this.outerR*0.8 , this.outerR]);
    }
};

PieChart.prototype.drawTimelinePie = function(){
  var that=this;
  if(!this.data || !this.data.values || this.data.values.length==0){
    alert("No data defined for timeline piechart. Nothing to plot.");
    return;
  }
  //create base svg
  d3.select(that.parentEle).html("");
  this.svg = d3.select(that.parentEle)
      .append("svg")
      .attr("width", that.chartW)
      .attr("height", that.chartH);
  this.svg.piechart = this.svg.append("g")   //g for the pie chart
      .attr("transform", "translate("+that.chartW/2+","+that.chartH/2+")")
      .attr("class", "pie-chart")
  this.svg.timeline = this.svg.append("g")   //g for the timeline
      .attr("transform", "translate("+that.chartW/2+","+that.chartH/2+")")
      .attr("class", "timeline");
  //draw initial pie chart
  //that.drawChart(this.data.values[0].values);
  that.drawChart(this.data.values[0], true);
  var lastTotal;
  this.data.values.forEach(function(obj, i){
    if(i==0) return;
    setTimeout(function(){
      that.drawChart(obj, false);
    }, i*1500);
  });
};

PieChart.prototype.drawChart = function(obj, isFirst) {
  isFirst = isFirst==undefined?true:isFirst;
  var pieValues=obj.values || [];
  if(pieValues.length==0){
    alert("No data defined for first piechart. Nothing to plot.");
    return;
  }
    var that=this;
    var arcData = that.calculateArcData(pieValues); //calculate arc data
    var arc = d3.arc()  //define arc function
        .innerRadius(that.innerR);
    if(isFirst){//if first plot in timeseries
      that.outerR = that.outerRScale(obj.total);
      arc.outerRadius(that.outerR);
      var arcs = this.svg.piechart
          .selectAll(".arc") //bind data
          .data(arcData);
      var newArcs = arcs.enter()
          .append("g")
          .attr("class", "arc");
      arcPaths=newArcs //plot arcs
          .append("path")
          .attr("fill", function(d,i){
            return that.colors[i];
          });
      arcs.exit().remove();  //define exit
    }
    var tweenAngle = function(transition, newArcData, newOuterRadius, isFirst){//tweening function
      transition.attrTween("d", function(d){ //create attrTween on path's "d" attribute
        var interpolateStart = d3.interpolate(isFirst?0:d.startAngle, newArcData[d.index].startAngle);
        var interpolateEnd = d3.interpolate(isFirst?0:d.endAngle, newArcData[d.index].endAngle);
        var interpolateRadius = d3.interpolate(that.outerR, newOuterRadius);
        return function(t){
          arc.outerRadius(interpolateRadius(t));
          d.startAngle=interpolateStart(t);
          d.endAngle=interpolateEnd(t);
          return arc(d);
        };
      });
    };
    var count=0;
    this.svg.piechart
      .selectAll(".arc") .selectAll("path")  //transition to new angles smoothly
      .transition()
      .duration(1000)
      .call(tweenAngle, arcData, that.outerRScale(obj.total),  isFirst)
      .on("start",function(){
        count++;
      }).on("end", function(){ //callback to check if all transitions done.
        count--;
        if(!count){
          that.outerR = that.outerRScale(obj.total); //update outerR if all done
        }
      });
};

function createChart(){
    var chart = new PieChart({
        chartW:500,
        chartH:500,
        data:  {
          categories:["A", "B", "C", "D", "E"],
          values: [{
            total: 180,
            values:[20,30,50,20,60]
          },{
            total: 75,
            values:[10,20,30,10,5]
          },
          {
            total: 100,
            values:[1,20,30,40,9]
          }
        ]},
        parentEle : $("#thePieChart")[0],
        colors:["#69B242","#42B285", "#4296B2 ", "#4262B2", "#6542B2", "#B2427E", "#B24247", "#B27A42", "#8FB242"],
        isTimeline: true
    });
    chart.drawTimelinePie();
};
