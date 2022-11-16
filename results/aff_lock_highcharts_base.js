Highcharts.setOptions({
    chart: {
        style: {
            "fontFamily": "\"Lucida Grande\",\"Lucida Sans Unicode\", Verdana, Arial, Helvetica, sans-serif",
            "fontSize":"12px"
        }
    },
});
Highcharts.removeEvent(Highcharts.Chart, 'beforeShowResetZoom');

function customRound(xmin, y, xmax) {
    if (y!==undefined) {
        var tick_interval_base = (10**Math.floor(Math.log10(y)))
        var tick_multiplier = Math.round(10*y/tick_interval_base)/10
        var out = Math.round(xmin/(tick_interval_base*tick_multiplier))*tick_interval_base*tick_multiplier
        return out
    }
    else {
        var tick_intervals = [1, 2.5, 5]
        if (xmax>=60){
            tick_intervals = [1, 1.5, 3]
        }

        var tick_interval_base = 10**Math.floor(Math.log10(xmin))

        var increment = tick_interval_base
        var tmp_min = 10000000
        var tmp_val = 0
        for (let i = 0; i < tick_intervals.length; i++) {
            tmp_val = Math.abs(tick_interval_base*tick_intervals[i]-xmin)
            if (tmp_val <= tmp_min)
            {
                tmp_min = tmp_val
                increment = tick_interval_base*tick_intervals[i]
            }
        }
      return increment
  }
}

Highcharts.stockChart('container', {
    chart: {
        type: 'scatter',
        zoomType: 'x',
        marginLeft: 160,
        marginRight: 150,
        backgroundColor: '#272b2c',
    },

    
    credits: {
        enabled: false,
        text: 'Created with HighCharts and WarcraftLogs',
        href: null,
        style: {
            cursor: 'arrow'
        }
    },
    
    exporting: {
        filename: data_input["exportFileName"],
        allowHTML: true,
        //fallbackToExportServer: true, 
        chartOptions: {
            chart: {
                width: document.getElementById('container').clientWidth,
                height: document.getElementById('container').clientHeight
            },
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true
                },
            },
        },
    },
    
    navigator: {
        enabled: true,
        liveRedraw: true,
        margin: 0,
        series: {
            type: 'scatter',
            lineWidth: 0,
            marker: {
                enabled: false,
            }
        },
        
        xAxis: {
            tickWidth: 1,
            lineWidth: 1,
            gridLineWidth: 1,
            type: 'linear',
            labels: {
                formatter: function() {
                    var total_seconds = Math.ceil(this.value)
                    var min = Math.floor(total_seconds/60)
                    var seconds = total_seconds%60
                    var zero = ""
                    if (seconds < 10) {
                        zero = "0"
                    }
                    return min + ":" + zero + seconds
                },
            },
        }
    },
    
    
    
    
    
    
    
    rangeSelector: {
        enabled: false,
    },
    title: {
        enabled: false,
        margin: 0,
        verticalAlign: "top",
        style: {
            fontSize: 12,
            textTransform: null,
        },
        text: data_input['subtitle'],
    },

    xAxis: {

        crosshair: {
            snap:false,
            dashStyle: 'dash',
            label: {
                enabled: true,
                formatter: function(value) {
                    var mm = Math.floor(value/60)
                    var ss = (value)%60
                    ss = Math.round(ss*1000)/1000
                    return (mm > 0 ? mm + "m " : "") + ss + "s"
                }
            }
        },
        tickPositioner: function () {
            var positions = [],
                tick = this.min,
                x = (this.max - this.min)/5;

            var increment = customRound(x, undefined, this.max-this.min)
            tick = customRound(this.min,increment)
            
            if (this.dataMax !== null && this.dataMin !== null) {
                for (tick; tick - increment <= this.max; tick += increment) {
                    positions.push(tick);
                }
            }
            return positions;
        },

        min: -0.5,
        max: data_input['fightDuration']+0.5,
        ordinal: false,
        
        tickWidth: 1,
        allowDecimals: true,
        title: {
            enabled: true,
            text: 'Time'
        },
        gridLineWidth: 1,
        startOnTick: false,
        endOnTick: false,
        showLastLabel: true,

        labels: {
            formatter: function() {
                var mm = Math.floor(this.value/60)
                var ss = (this.value)%60
                ss = Math.round(ss*10000)/10000
                return (mm > 0 ? mm + "m " : "") + ss + "s"
            }
        },
        plotLines: [].concat(data_input["xPlotLines"])
    },
    yAxis: {
        reversed: true,
        title: {
            text: ' ',
            x: -50,
        },

        labels: {
            enabled: false,
        },
        opposite: false,
        minorGridLineWidth: 0,
        gridLineWidth: 0,

        plotBands: [].concat(data_input["plotBands"]),
        tickPositioner: function(min, max) {
            var tickPosCor = [0,240]
            return tickPosCor;
          },
        min: 0,
        max: 250,
        ordinal: false,
        startOnTick: null,
        endOnTick: null,
        tickAmount: null,
        plotLines: [].concat(data_input["yPlotLines"])
    },
    legend: {
        enabled: true,
        borderWidth: 1
    },
    
    tooltip: {
        split: false,
        useHTML: true,
        formatter: function(tooltip) {
            if (this.point != undefined) {
                if(this.point.tooltipHide != undefined) {
                    return false
                }
            }
            return tooltip.defaultFormatter.call(this, tooltip);
        }
    },
    
    plotOptions: {
        series: {
            stickyTracking: false,
            animation: false,
        },
        
        scatter: {
            stickyTracking: false,
            tooltip: {
                followPointer: false,
                headerFormat: '<table><tr><th colspan="2"><span style="color:{series.color}">\u25CF</span> {series.name}</th></tr>',
                footerFormat: '</table>',
                pointFormatter: function() {
                    if (this.txt != undefined)
                    {
                        return this.txt
                    }
                },
                useHTML: true,
            },
            animation: false,
        },

        area: {
            stickyTracking: false,
            tooltip: {
                headerFormat: '<table><tr><th colspan="2"><span style="color:{series.color}">\u25CF</span> {series.name}</th></tr>',
                footerFormat: '</table>',
                pointFormatter: function() {
                    if (this.txt != undefined)
                    {
                        return this.txt
                    }
                },
                useHTML: true,
            },
            lineWidth: 1,
            lineColor: "#000000",
            animation: false,
        },

        polygon: {
            stickyTracking: false,
            enableMouseTracking: true,
            tooltip: {
                followPointer: false,

                headerFormat: '<table><tr><th colspan="2"><span style="color:{series.color}">\u25CF</span> {series.name}</th></tr>',
                footerFormat: '</table>',

                pointFormatter: function() {
                    if (this.txt != undefined)
                    {
                        return this.txt
                    }
                },
                useHTML: true,
            },
            lineWidth: 1,
            lineColor: "#000000",
            animation: false,
        },
    },
    series: [].concat(data_input['graphData'],)
});
