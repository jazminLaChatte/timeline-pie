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
      .attr("height", that.chartH)
      .append("g")
      .attr("transform", "translate("+that.chartW/2+","+that.chartH/2+")");
  //draw initial pie chart
  //that.drawChart(this.data.values[0].values);
  var isFirst=true;
  this.data.values.forEach(function(obj, i){
    setTimeout(function(){
      that.drawChart(obj, isFirst);
      isFirst = false;
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
    //calculate arc data
    var arcData = that.calculateArcData(pieValues);
    //define arc function
    var arc = d3.arc()
        .outerRadius(that.outerRScale(obj.total))
        .innerRadius(that.innerR);
    //generate arc elements
    var arcSelect = this.svg.selectAll(".arc");
    if(isFirst || arcSelect.length==0){
      var arcs = arcSelect
          .data(arcData);
      var newArcs = arcs.enter()
          .append("g")
          .attr("class", "arc");
      //if first plot in timeseries, plot arcs immediately
      arcPaths=newArcs
          .append("path")
          .attr("d", arc)
          .attr("fill", function(d,i){
            return that.colors[i];
          });
      //define exit
      arcs.exit().remove();
    }else{
      //tweening function
      var tweenAngle = function(transition, newArcData){
        transition.attrTween("d", function(d){ //create attrTween on path's "d" attribute
          var interpolateStart = d3.interpolate(d.startAngle, newArcData[d.index].startAngle);
          var interpolateEnd = d3.interpolate(d.endAngle, newArcData[d.index].endAngle);
          return function(t){
            d.startAngle=interpolateStart(t);
            d.endAngle=interpolateEnd(t);
            return arc(d);
          };
        });
      };
      //transition to new angles smoothly
      arcSelect.selectAll("path")
        .transition()
        .duration(1000)
        .call(tweenAngle, arcData);
    }
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
