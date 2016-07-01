var PieChart = function(config){
    config = config || {};
    $.extend(this,config);
};

PieChart.prototype.drawPie = function() {
    var that=this;
    //svg
    var svg = d3.select(that.parentEle)
        .append("svg")
        .attr("width", that.chartW)
        .attr("height", that.chartH)
        .append("g")
        .attr("transform", "translate("+that.chartW/2+","+that.chartH/2+")");
    //calculate arc data
    var arcData = d3.pie()
    .value(function(d){
        return d.value
    })(that.data);
    //generate arc elements
    var arcs = svg.selectAll(".arc")
        .data(arcData)
        .enter()
        .append("g")
        .attr("class", "arc");
    //define arc function
    var arc = d3.arc()
        .outerRadius(200)
        .innerRadius(100); //TODO
    //draw the arcs
    arcs.append("path")
          .attr("d", arc)
          .attr("fill", function(d,i){
            return that.colors[i];
          });
}

function createChart(){
    var chart = new PieChart({
        chartW:500,
        chartH:500,
        data:  [
            {
                name:"A1",
                value: 10
            },
            {
                name:"A2",
                value:20
            },
            {
                name:"A3",
                value:30
            },
            {
                name:"A4",
                value:40
            }
        ],
        parentEle : $("#thePieChart")[0],
        colors:["#00ffff", "#00ff00", "#ff00ff", "#ffff00"]
    });
    chart.drawPie();
}
