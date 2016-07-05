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
    }).sortValues(null)
    (that.data);
    //generate arc elements
    var arcs = svg.selectAll(".arc")
        .data(arcData)
        .enter()
        .append("g")
        .attr("class", "arc");
    //define arc function
    var arc = d3.arc()
        .outerRadius(200)
        .innerRadius(75); //TODO
    //draw the arcs
    arcPaths=arcs.append("path")
          .attr("d", arc)
          .attr("fill", function(d,i){
            return that.colors[i];
          });

     setInterval(function() {
       arcPaths.transition()
           .duration(750)
           .call(arcTween, Math.random() * τ);
     }, 1500);
}

function createChart(){
    var chart = new PieChart({
        chartW:500,
        chartH:500,
        data:  [{
                name:"A1",
                value: 10
            },{
                name:"A2",
                value:20
            },{
                name:"A3",
                value:30
            },{
                name:"A4",
                value:10
            },{
                name:"A5",
                value:20
            },{
                name:"A6",
                value:50
            },{
                name:"A7",
                value:20
            },{
                name:"A8",
                value:40
            },{
                name:"A9",
                value:10
            }
        ],
        parentEle : $("#thePieChart")[0],
        colors:["#69B242","#42B285", "#4296B2 ", "#4262B2", "#6542B2", "#B2427E", "#B24247", "#B27A42", "#8FB242"]
    });
    chart.drawPie();
}
