function prepareBarGraph(data, value) {


    am4core.ready(function () {

        var input = document.getElementById("myInput");

        input.addEventListener("keyup", function (event) {
            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {
                // Cancel the default action, if needed
                event.preventDefault();
                // Trigger the button element with a click
                document.getElementById("goButton").click();
            }
        });
        document.getElementById('myInput').value = value;
        var titleDiv = document.getElementById('titleId');
        titleDiv.textContent = "BarGraph plots for different attributes";
        var div = document.getElementById('dirTreeheader');
        div.style.height = '50px';
        if (data[0].slice.trim() == '') {
            div.textContent = data[0].heading;
        } else {
            div.textContent = data[0].heading + ' for Slice- ' + data[0].slice;
        }
        div.textContent.fontsize('20');

        // var div = document.getElementById('indexEle');
        // div.textContent = "Index-" + value;
// Themes begin
        am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
        var chart = am4core.create("dirtreebody", am4charts.XYChart3D);
        chart.paddingBottom = 30;
        chart.angle = 35;

// Add data
        chart.data = data;

// Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "Attribute";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 20;
        categoryAxis.renderer.inside = true;
        categoryAxis.renderer.grid.template.disabled = true;

        let labelTemplate = categoryAxis.renderer.labels.template;
        labelTemplate.rotation = -90;
        labelTemplate.horizontalCenter = "left";
        labelTemplate.verticalCenter = "middle";
        labelTemplate.dy = 10; // moves it a bit down;
        labelTemplate.inside = false; // this is done to avoid settings which are not suitable when label is rotated

        // var label = chart.chartContainer.createChild(am4core.Label);
        // label.text = data[0].heading;
        // label.align = "right";

        let title = chart.titles.create();
        title.text = data[0].heading;
        title.fontSize = 25;
        title.marginBottom = 30;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.grid.template.disabled = true;
        valueAxis.extraMin = 0.3;
        valueAxis.extraMax = 0.2;

// Create series
        var series = chart.series.push(new am4charts.ConeSeries());
        series.dataFields.valueY = "value";
        series.dataFields.categoryX = "Attribute";

        var columnTemplate = series.columns.template;
        columnTemplate.tooltipText = "{Attribute}: {value}";
        columnTemplate.adapter.add("fill", function (fill, target) {
            return chart.colors.getIndex(target.dataItem.index);
        })

        columnTemplate.adapter.add("stroke", function (stroke, target) {
            return chart.colors.getIndex(target.dataItem.index);
        })

    }); // end am4core.ready()

}

function callHistogram(action) {

    var value = 0;
    if (null != document.getElementById('myInput')) {
        value = document.getElementById('myInput').value;
    }
    value = parseInt(value);
    if (action == 'previous') {
        value = value - 1;
    } else if (action == 'next') {
        value = value + 1;
    }
    if (value < 0) {
        value = 0;
    }
    index = value;
    $.ajax({
        url: '/get_hist_data/' + index,
        data: index,
        type: 'POST',
        success: function (response) {
            drawHistogram(response, value);
        },
        error: function (error) {
            console.log(error);
        }
    });

}

function drawHistogram(data, value) {

    am4core.ready(function () {

// Themes begin
        am4core.useTheme(am4themes_animated);
// Themes end
        var titleDiv = document.getElementById('titleId');
        titleDiv.textContent = "Histogram plots for different attributes";
        document.getElementById('myInput').value = value;
        var div = document.getElementById('dirTreeheader');
        div.style.height = '50px';
        if (data[0].slice.trim() == '') {
            div.textContent = data[0].heading;
        } else {
            div.textContent = data[0].heading + ' for Slice- ' + data[0].slice;
        }
        div.textContent.fontsize('20');

// Create chart instance
        var chart = am4core.create("dirtreebody", am4charts.RadarChart);
        chart.scrollbarX = new am4core.Scrollbar();

        chart.data = data;
        chart.radius = am4core.percent(100);
        chart.innerRadius = am4core.percent(50);

// Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "category";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.tooltip.disabled = true;
        categoryAxis.renderer.minHeight = 110;
        categoryAxis.renderer.grid.template.disabled = true;
//categoryAxis.renderer.labels.template.disabled = true;
        let labelTemplate = categoryAxis.renderer.labels.template;
        labelTemplate.radius = am4core.percent(-75);
        labelTemplate.location = 0.5;
        labelTemplate.relativeRotation = 90;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.grid.template.disabled = true;
        valueAxis.renderer.labels.template.disabled = true;
        valueAxis.tooltip.disabled = true;

// Create series
        var series = chart.series.push(new am4charts.RadarColumnSeries());
        series.sequencedInterpolation = true;
        series.dataFields.valueY = "value";
        series.dataFields.categoryX = "category";
        series.columns.template.strokeWidth = 0;
        series.tooltipText = "{category} --> {valueY}";
        series.columns.template.radarColumn.cornerRadius = 10;
        series.columns.template.radarColumn.innerCornerRadius = 0;

        series.tooltip.pointerOrientation = "vertical";

// on hover, make corner radiuses bigger
        let hoverState = series.columns.template.radarColumn.states.create("hover");
        hoverState.properties.cornerRadius = 0;
        hoverState.properties.fillOpacity = 1;


        series.columns.template.adapter.add("fill", function (fill, target) {
            return chart.colors.getIndex(target.dataItem.index);
        })

// Cursor
        chart.cursor = new am4charts.RadarCursor();
        chart.cursor.innerRadius = am4core.percent(50);
        chart.cursor.lineY.disabled = true;

    }); // end am4core.ready()

}


function callMap(action) {
    var value = 0;
    if (null != document.getElementById('myInput')) {
        value = document.getElementById('myInput').value;
    }
    value = parseInt(value);
    if (action == 'previous') {
        value = value - 1;
    } else if (action == 'next') {
        value = value + 1;
    }
    if (value < 0) {
        value = 0;
    }
    index = value;
    $.ajax({
        url: '/get_map_data/' + index,
        data: index,
        type: 'POST',
        success: function (response) {
            prepareBarGraph(response, value)
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function callSelMap(action) {
    if (document.getElementById('histogramRadio').checked) {
        callHistogram(action);
    } else {
        callMap(action);
    }

}

callMap('');