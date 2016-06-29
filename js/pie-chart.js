var PieChart = function(rawData){
    this.prepData(rawData);
};

PieChart.prototype.prepData = function(rawData){
    this.data=[];
    rawData=rawData || [];
    var that=this;
    rawData.forEach(function(d, i){
        var obj={
            year:d[0],
            total:d[1],
            age_u15:d[2],
            age_15to19:d[3],
            age_20to24:d[4],
            age_25to29:d[5],
            age_30to34:d[6],
            age_35to39:d[7],
            age_40to44:d[8],
            age_45u:d[9],
            age_unknown:d[10]
        };
        that.data.push(obj);
    });
}