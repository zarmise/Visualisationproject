
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

var mainContainer = am4core.create("chartdiv", am4core.Container);
mainContainer.width = am4core.percent(100);
mainContainer.height = am4core.percent(100);
mainContainer.layout = "horizontal";

var irData =  [
  {'Age': '0-4', 'Male':3649800, 'Female':3443204},
  {'Age': '5-9', 'Male': 3286030, 'Female': 3125247},
  {'Age': '10-14', 'Male': 2911423, 'Female': 2776961},
  {'Age': '15-19', 'Male': 2785688, 'Female': 2673309},
  {'Age': '20-24', 'Male': 3236975, 'Female': 3155904},
  {'Age': '25-29', 'Male': 4143445, 'Female': 4057688},
  {'Age': '30-34','Male': 4340448, 'Female': 4260465},
  {'Age': '35-39', 'Male': 3572403, 'Female': 3465195},
  {'Age': '40-44', 'Male': 2813890, 'Female': 2704417},
  {'Age': '45-49', 'Male': 2454427, 'Female': 2378696},
  {'Age': '50-54', 'Male': 1975574, 'Female': 1950397},
  {'Age': '55-59', 'Male': 1669934, 'Female': 1680659},
  {'Age': '60-64', 'Male': 1252663, 'Female': 1289910},
  {'Age': '65-69', 'Male': 808910, 'Female': 902554},
  {'Age': '70-74', 'Male': 571112, 'Female': 606513},
  {'Age': '75-79', 'Male': 451419, 'Female': 434973},
  {'Age': '80-84', 'Male': 343231, 'Female': 303502},
  {'Age': '85-89', 'Male': 161448, 'Female': 151036},
  {'Age': '90-94', 'Male': 57716, 'Female':53859},
  {'Age': '95-99', 'Male': 8730, 'Female':9947},
  {'Age': '+100', 'Male': 3176, 'Female': 3392},
];
//creating charts: 
var maleChart = mainContainer.createChild(am4charts.XYChart);
maleChart.paddingRight = 0;
maleChart.data = JSON.parse(JSON.stringify(irData));


// Create axes
var maleCategoryAxis = maleChart.yAxes.push(new am4charts.CategoryAxis());
maleCategoryAxis.dataFields.category = "Age";
maleCategoryAxis.renderer.grid.template.location = 0;
//maleCategoryAxis.renderer.inversed = true;
maleCategoryAxis.renderer.minGridDistance = 15;

var maleValueAxis = maleChart.xAxes.push(new am4charts.ValueAxis());
maleValueAxis.renderer.inversed = true;
maleValueAxis.min = 0;
maleValueAxis.max = 10;
maleValueAxis.strictMinMax = true;

maleValueAxis.numberFormatter = new am4core.NumberFormatter();
maleValueAxis.numberFormatter.numberFormat = "#.#'%'";

// Create series
var maleSeries = maleChart.series.push(new am4charts.ColumnSeries());
maleSeries.dataFields.valueX = "Male";
maleSeries.dataFields.valueXShow = "percent";
maleSeries.calculatePercent = true;
maleSeries.dataFields.categoryY = "Age";
maleSeries.interpolationDuration = 1000;
maleSeries.columns.template.tooltipText = "Males, Age{categoryY}: {valueX} ({valueX.percent.formatNumber('#.0')}%)";
maleSeries.sequencedInterpolation = true;


var femaleChart = mainContainer.createChild(am4charts.XYChart);
femaleChart.paddingLeft = 0;
femaleChart.data = JSON.parse(JSON.stringify(irData));

// Create axes
var femaleCategoryAxis = femaleChart.yAxes.push(new am4charts.CategoryAxis());
femaleCategoryAxis.renderer.opposite = true;
femaleCategoryAxis.dataFields.category = "Age";
femaleCategoryAxis.renderer.grid.template.location = 0;
femaleCategoryAxis.renderer.minGridDistance = 15;

var femaleValueAxis = femaleChart.xAxes.push(new am4charts.ValueAxis());
femaleValueAxis.min = 0;
femaleValueAxis.max = 10;
femaleValueAxis.strictMinMax = true;
femaleValueAxis.numberFormatter = new am4core.NumberFormatter();
femaleValueAxis.numberFormatter.numberFormat = "#.#'%'";
femaleValueAxis.renderer.minLabelPosition = 0.01;

// Create series
var femaleSeries = femaleChart.series.push(new am4charts.ColumnSeries());
femaleSeries.dataFields.valueX = "Female";
femaleSeries.dataFields.valueXShow = "percent";
femaleSeries.calculatePercent = true;
femaleSeries.fill = femaleChart.colors.getIndex(1);
femaleSeries.stroke = femaleSeries.fill;
femaleSeries.sequencedInterpolation = true;
femaleSeries.columns.template.tooltipText = "Females, Age{categoryY}: {valueX} ({valueX.percent.formatNumber('#.0')}%)";
femaleSeries.dataFields.categoryY = "Age";
femaleSeries.interpolationDuration = 1000;

var mapChart = mainContainer.createChild(am4maps.MapChart);
mapChart.projection = new am4maps.projections.Mercator();
mapChart.geodata = am4geodata_iranLow;
mapChart.zoomControl = new am4maps.ZoomControl();
mapChart.zIndex = -1;

var polygonSeries = mapChart.series.push(new am4maps.MapPolygonSeries())
polygonSeries.useGeodata = true;

var homeButton = new am4core.Button();
homeButton.events.on("hit", function() {
  mapChart.goHome();
});

homeButton.icon = new am4core.Sprite();
homeButton.padding(7, 5, 7, 5);
homeButton.width = 30;
homeButton.icon.path = "M16,8 L14,10 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
homeButton.marginBottom = 3;
homeButton.parent = mapChart.zoomControl;
homeButton.insertBefore(mapChart.zoomControl.plusButton);


var selectedStateId = "IR";
var selectedPolygon;
var selectedStateName;

var polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.togglable = true;

var hoverState = polygonTemplate.states.create("hover");
polygonTemplate.tooltipText = "{name}";
hoverState.properties.fill = mapChart.colors.getIndex(0);

var activeState = polygonTemplate.states.create("active");
activeState.properties.fill = mapChart.colors.getIndex(1);

polygonTemplate.events.on("hit", function(event) {
  var id = event.target.dataItem.dataContext.id;
  var stateId = id.split("-")[1];
  showState(stateId, event.target.dataItem.dataContext.name, event.selectedPolygon);
})

mapChart.seriesContainer.background.events.on("over", function(event) {
  showState(selectedStateId, selectedStateName, selectedPolygon);
});

function showState(id, stateName, polygon) {
  if (selectedStateId != id) {

    var newData = stateData[id];
    if (!newData) {
      return
    }

     if (selectedPolygon) {
      selectedPolygon.isActive = false;
    }

    for (var i = 0; i < femaleChart.data.length - 1; i++) { 
       if (!newData[i]) {
        continue
      }
    femaleChart.data[i].Female = newData[i].Female;
    maleChart.data[i].Male = newData[i].Male;
    }

    femaleChart.invalidateRawData();
    maleChart.invalidateRawData();

    selectedStateName = stateName;
    selectedStateId = id;
    selectedPolygon = polygon;

     label.text = stateName + " population pyramid";
    label.hide(0);
    label.show();
  }
}
  
var label = mainContainer.createChild(am4core.Label);
label.isMeasured = false;
label.x = am4core.percent(80);
label.horizontalCenter = "middle";
label.y = 50;
label.showOnInit = true;
label.text = "IRAN Population pyramid";
label.hiddenState.properties.dy = -100;
var stateData = {
  
  "02":[
    {
      "Age": "0-4",
      "Male": 158366,
      "Female": 148241
    },
    {
      "Age": "5-9",
      "Male": 143847,
      "Female": 135944
    },
    {
      "Age": "10-14",
      "Male": 129380,
      "Female": 121978

    },
    {
      "Age": "14-19",
      "Male": 123645,
      "Female": 117668
    },
    {
      "Age": "20-24",
      "Male": 144638,
      "Female": 139190
    },
    {
      "Age": "25-29",
      "Male":169054,
      "Female":162108
    },
    {
      "Age": "30-34",
      "Male":160087,
      "Female":155835
    },
    {
      "Age": "35-39",
      "Male":140576,
      "Female":136423
    },
    {
      "Age": "40-44",
      "Male": 108550,
      "Female": 105443
    },
    {
      "Age": "45-49",
      "Male": 101193,
      "Female":96504
    },
    {
      "Age": "50-54",
      "Male": 79698,
      "Female": 77920
    },
    {
      "Age": "55-59",
      "Male": 64276,
      "Female": 65071
    },
    {
      "Age": "60-64",
      "Male": 46038,
      "Female": 49334
    },
    {
      "Age": "65-69",
      "Male": 30232,
      "Female": 34300
    },
    {
      "Age": "70-74",
      "Male": 20406,
      "Female": 23142
    },
    {
      "Age": "75-79",
      "Male": 16283,
      "Female": 16923
    },
    {
      "Age": "80-84",
      "Male": 12577,
      "Female": 12206
    },
    {
      "Age": "85-89",
      "Male": 6159,
      "Female": 5838
    },
    {
      "Age": "90-94",
      "Male": 2453,
      "Female": 2214
    },
   {
      "Age": "95-99",
      "Male": 433,
      "Female": 418
    },
   {
      "Age": "=<100",
      "Male": 428,
      "Female": 200
    }
  ],
  "03":[
    {
      "Age": "0-4",
      "Male": 56614,
      "Female": 52000
    },
    {
      "Age": "5-9",
      "Male": 52592,
      "Female": 48550
    },
    {
      "Age": "10-14",
      "Male": 46553,
      "Female": 43928
    },
    {
      "Age": "15-19",
      "Male": 44954,
      "Female": 42837
    },
    {
      "Age": "20-24",
      "Male": 56695,
      "Female": 52023
    },
    {
      "Age": "25-29",
      "Male":68838,
      "Female": 62665
    },
    {
      "Age": "30-34",
      "Male": 65259,
      "Female": 63053
    },
    {
      "Age": "35-39",
      "Male":56476,
      "Female":54959
    },
    {
      "Age": "40-44",
      "Male": 45776,
      "Female": 44116
    },
    {
      "Age": "45-49",
      "Male": 42259,
      "Female":38425
    },
    {
      "Age": "50-54",
      "Male": 30920,
      "Female": 30645
    },
    {
      "Age": "55-59",
      "Male": 25159,
      "Female": 26077
    },
    {
      "Age": "60-64",
      "Male": 17283,
      "Female": 20244
    },
    {
      "Age": "65-69",
      "Male": 13085,
      "Female": 14445
    },
    {
      "Age": "70-74",
      "Male": 10194,
      "Female": 10437
    },
    {
      "Age": "75-79",
      "Male": 7578,
      "Female": 7166
    },
    {
      "Age": "80-84",
      "Male": 5911,
      "Female": 5080
    },
    {
      "Age": "85-89",
      "Male": 3167,
      "Female": 2652
    },
    {
      "Age": "90-94",
      "Male": 864,
      "Female": 732
    },
   {
      "Age": "95-99",
      "Male": 65,
      "Female": 96
    },
   {
      "Age": "=<100",
      "Male": 13,
      "Female": 35
    }
  ],
  
  "16":[
    {
      "Age": "0-4",
      "Male": 72968,
      "Female": 69039
    },
    {
      "Age": "5-9",
      "Male": 64966,
      "Female": 62465
    },
    {
      "Age": "10-14",
      "Male": 57991,
      "Female":55660
    },
    {
      "Age": "15-19",
      "Male": 53288,
      "Female": 52509
    },
    {
      "Age": "20-24",
      "Male": 71704,
      "Female": 69564
    },
    {
      "Age": "25-29",
      "Male":90338,
      "Female": 87855
    },
    {
      "Age": "30-34",
      "Male": 85288,
      "Female": 82510
    },
    {
      "Age": "35-39",
      "Male":71053,
      "Female":65360
    },
    {
      "Age": "40-44",
      "Male": 57047,
      "Female": 55119
    },
    {
      "Age": "45-49",
      "Male": 48740,
      "Female":47875
    },
    {
      "Age": "50-54",
      "Male": 34857,
      "Female": 35924
    },
    {
      "Age": "55-59",
      "Male": 30464,
      "Female": 31282
    },
    {
      "Age": "60-64",
      "Male": 26166,
      "Female": 25801
    },
    {
      "Age": "65-69",
      "Male": 15661,
      "Female": 18802
    },
    {
      "Age": "70-74",
      "Male": 10673,
      "Female": 11404
    },
    {
      "Age": "75-79",
      "Male": 8928,
      "Female": 8467
    },
    {
      "Age": "80-84",
      "Male": 6601,
      "Female": 6149
    },
    {
      "Age": "85-89",
      "Male": 3275,
      "Female": 2885
    },
    {
      "Age": "90-94",
      "Male": 1389,
      "Female": 957
    },
   {
      "Age": "95-99",
      "Male": 516,
      "Female": 335
    },
   {
      "Age": "=<100",
      "Male": 863,
      "Female": 273
    }
  ],
  "17": [
    {
      "Age": "0-4",
      "Male": 79740,
      "Female": 72831
    },
    {
      "Age": "5-9",
      "Male": 73649,
      "Female": 68204
    },
    {
      "Age": "10-14",
      "Male": 67684,
      "Female": 63593
    },
    {
      "Age": "15-19",
      "Male": 67840,
      "Female": 61742
    },
    {
      "Age": "20-24",
      "Male": 86825,
      "Female": 81015
    },
    {
      "Age": "25-29",
      "Male": 107584,
      "Female": 104032
    },
    {
      "Age": "30-34",
      "Male": 105134,
      "Female": 104624
    },
    {
      "Age": "35-39",
      "Male": 80527,
      "Female": 81305
    },
    {
      "Age": "40-44",
      "Male": 67969,
      "Female": 67681
    },
    {
      "Age": "45-49",
      "Male": 62604,
      "Female": 63165
    },
    {
      "Age": "50-54",
      "Male": 49639,
      "Female": 51251
    },
    {
      "Age": "55-59",
      "Male": 43488,
      "Female": 44607
    },
    {
      "Age": "60-64",
      "Male": 32966,
      "Female": 34939
    },
    {
      "Age": "65-69",
      "Male": 21188,
      "Female": 26713
    },
    {
      "Age": "70-74",
      "Male": 12963,
      "Female": 15299
    },
    {
      "Age": "75-79",
      "Male": 11667,
      "Female": 10465
    },
    {
      "Age": "80-84",
      "Male": 9451,
      "Female": 7819
    },
    {
      "Age": "85-89",
      "Male": 5078,
      "Female": 3694
    },
    {
      "Age": "90-94",
      "Male": 1684,
      "Female": 1192
    },
    {
      "Age": "95-99",
      "Male": 267,
      "Female": 182
    },
  {
      "Age": "=<100",
      "Male": 68,
      "Female": 66
    }
  ],
  "05": [
    {
      "Age": "0-4",
      "Male": 25315,
      "Female": 23719
    },
    {
      "Age": "5-9",
      "Male": 22965,
      "Female": 21785
    },
    {
      "Age": "10-14",
      "Male": 20945,
      "Female": 19847
    },
    {
      "Age": "15-19",
      "Male": 19467,
      "Female": 17858
    },
    {
      "Age": "20-24",
      "Male": 26813,
      "Female": 25077
    },
    {
      "Age": "25-29",
      "Male": 34731,
      "Female": 33871
    },
    {
      "Age": "30-34",
      "Male": 33190,
      "Female": 32849
    },
    {
      "Age": "35-39",
      "Male": 25568,
      "Female": 25509
    },
    { "Age": "40-44",
      "Male": 20703,
      "Female": 20114},
    
    {"Age": "45-49",
      "Male": 17847,
      "Female": 17739},
    
    {"Age": "50-54",
      "Male": 11477,
      "Female": 11905},
    
    {"Age": "55-59",
      "Male": 10962,
      "Female": 10542},
    
    {"Age": "60-64",
      "Male": 8481,
      "Female":8335},
    
    {"Age": "65-69",
      "Male": 5776,
      "Female": 6928},
    
    {"Age": "70-74",
      "Male": 3096,
      "Female": 3388},
    
    {"Age": "75-79",
      "Male": 3151,
      "Female": 2439},
    
    {"Age": "80-84",
      "Male": 2477,
      "Female": 1727},
    
    {"Age": "85-89",
      "Male": 1736,
      "Female": 969},
    
    {"Age": "90-94",
      "Male": 405,
      "Female": 248},
    
    {"Age": "95-99",
      "Male": 64,
      "Female": 71},
  
    {"Age": "=<100",
      "Male": 30,
      "Female": 39}
  ],
  
  "20": [
    
    {"Age": "0-4",
      "Male": 84792,
      "Female": 77527},
    
    {"Age": "5-9",
      "Male": 73612,
      "Female": 69193},
    
    {"Age": "10-14",
      "Male": 65438,
      "Female": 62423},
    
    {"Age": "15-19",
      "Male": 62062,
      "Female": 59209},
    
    {"Age": "20-24",
      "Male": 80497,
      "Female": 74516},
    
    {"Age": "25-29",
      "Male": 96065,
      "Female": 91684
    },
    {
      "Age": "30-34",
      "Male": 91140,
      "Female": 89700
    },
    {
      "Age": "35-39",
      "Male": 76468,
      "Female": 76598
    },
    { "Age": "40-44",
      "Male": 62137,
      "Female": 61783},
    
    {"Age": "45-49",
      "Male": 51218,
      "Female": 51669},
    
    {"Age": "50-54",
      "Male": 37813,
      "Female": 38311},
    
    {"Age": "55-59",
      "Male": 35920,
      "Female": 35403},
    
    {"Age": "60-64",
      "Male": 24322,
      "Female":28036},
    
    {"Age": "65-69",
      "Male": 14743,
      "Female": 19866},
    
    {"Age": "70-74",
      "Male": 10734,
      "Female": 11774},
    
    {"Age": "75-79",
      "Male": 11254,
      "Female": 9681},
    
    {"Age": "80-84",
      "Male": 8766,
      "Female": 6167},
    
    {"Age": "85-89",
      "Male": 4311,
      "Female": 2985},
    
    {"Age": "90-94",
      "Male": 1329,
      "Female": 955},
    
    {"Age": "95-99",
      "Male": 210,
      "Female": 206},
  
    {"Age": "=<100",
      "Male": 58,
      "Female": 74}
  ],
  
  "24": [  
    {"Age": "0-4",
      "Male": 76092,
      "Female": 70794},
    
    {"Age": "5-9",
      "Male": 67151,
      "Female": 62825},
    
    {"Age": "10-14",
      "Male": 59490,
      "Female": 56472},
    
    {"Age": "15-19",
      "Male": 57124,
      "Female": 55269},
    
    {"Age": "20-24",
      "Male": 71031,
      "Female": 68460},
    
    {"Age": "25-29",
      "Male": 91122,
      "Female": 87339},
    
    {"Age": "30-34",
      "Male": 91462,
      "Female": 89085
    },
    {
      "Age": "35-39",
      "Male": 75723,
      "Female": 72851},
    
    { "Age": "40-44",
      "Male": 63966,
      "Female": 61823},
    
    {"Age": "45-49",
      "Male": 54061,
      "Female": 53454},
    
    {"Age": "50-54",
      "Male": 46225,
      "Female": 42717},
    
    {"Age": "55-59",
      "Male": 37598,
      "Female": 38351},
    
    {"Age": "60-64",
      "Male": 29530,
      "Female":31668},
    
    {"Age": "65-69",
      "Male": 17929,
      "Female": 23174},
    
    {"Age": "70-74",
      "Male": 13867,
      "Female": 16466},
    
    {"Age": "75-79",
      "Male": 12800,
      "Female": 12938},
    
    {"Age": "80-84",
      "Male": 9585,
      "Female": 8172},
    
    {"Age": "85-89",
      "Male": 3723,
      "Female": 4198},
    
    {"Age": "90-94",
      "Male": 1512,
      "Female": 1510},
    
    {"Age": "95-99",
      "Male": 274,
      "Female": 290},
  
    {"Age": "=<100",
      "Male": 53,
      "Female": 60}
  ],
  "11": [  
    {"Age": "0-4",
      "Male": 49799,
      "Female": 46856},
    
    {"Age": "5-9",
      "Male": 42901,
      "Female": 40955},
    
    {"Age": "10-14",
      "Male": 37113,
      "Female": 35300},
    
    {"Age": "15-19",
      "Male": 34942,
      "Female": 34066},
    
    {"Age": "20-24",
      "Male": 44509,
      "Female": 43324},
    
    {"Age": "25-29",
      "Male": 57150,
      "Female": 55080},
    
    {"Age": "30-34",
      "Male": 55468,
      "Female": 53412
    },
    {
      "Age": "35-39",
      "Male": 47947,
      "Female": 45789},
    
    { "Age": "40-44",
      "Male": 39225,
      "Female": 37812},
    
    {"Age": "45-49",
      "Male": 31077,
      "Female": 30756},
    
    {"Age": "50-54",
      "Male": 24285,
      "Female": 23644},
    
    {"Age": "55-59",
      "Male": 21142,
      "Female": 21458},
    
    {"Age": "60-64",
      "Male": 15565,
      "Female":17272},
    
    {"Age": "65-69",
      "Male": 9598,
      "Female": 12787},
    
    {"Age": "70-74",
      "Male": 8253,
      "Female": 9311},
    
    {"Age": "75-79",
      "Male": 7009,
      "Female": 6855},
    
    {"Age": "80-84",
      "Male": 5434,
      "Female": 4632},
    
    {"Age": "85-89",
      "Male": 2391,
      "Female": 2244},
    
    {"Age": "90-94",
      "Male": 940,
      "Female": 908},
    
    {"Age": "95-99",
      "Male": 90,
      "Female": 104},
  
    {"Age": "=<100",
      "Male": 11,
      "Female": 47}
  ],
  "22": [  
    {"Age": "0-4",
      "Male": 58244,
      "Female": 54535},
    
    {"Age": "5-9",
      "Male": 53084,
      "Female": 50517},
    
    {"Age": "10-14",
      "Male": 48689,
      "Female": 46828},
    
    {"Age": "15-19",
      "Male": 47140,
      "Female": 45323},
    
    {"Age": "20-24",
      "Male": 56570,
      "Female": 54032},
    
    {"Age": "25-29",
      "Male": 73092,
      "Female": 70218},
    
    {"Age": "30-34",
      "Male": 77273,
      "Female": 74035
    },
    {
      "Age": "35-39",
      "Male": 64785,
      "Female": 62380},
    
    { "Age": "40-44",
      "Male": 54726,
      "Female": 51555},
    
    {"Age": "45-49",
      "Male": 46613,
      "Female": 44712},
    
    {"Age": "50-54",
      "Male": 39737,
      "Female": 36653},
    
    {"Age": "55-59",
      "Male": 31425,
      "Female": 31614},
    
    {"Age": "60-64",
      "Male": 22770,
      "Female":24841},
    
    {"Age": "65-69",
      "Male": 14511,
      "Female": 17853},
    
    {"Age": "70-74",
      "Male": 11897,
      "Female": 14208},
    
    {"Age": "75-79",
      "Male": 10713,
      "Female": 11105},
    
    {"Age": "80-84",
      "Male": 8636,
      "Female": 7892},
    
    {"Age": "85-89",
      "Male": 3879,
      "Female": 3679},
    
    {"Age": "90-94",
      "Male": 1615,
      "Female": 1403},
    
    {"Age": "95-99",
      "Male": 307,
      "Female": 287},
  
    {"Age": "=<100",
      "Male": 45,
      "Female": 54}
  ],
  
  "28": [  
    {"Age": "0-4",
      "Male": 56197,
      "Female":52849},
    
    {"Age": "5-9",
      "Male": 50540,
      "Female": 47644},
    
    {"Age": "10-14",
      "Male": 46364,
      "Female": 43465},
    
    {"Age": "15-19",
      "Male": 40654,
      "Female": 39777},
    
    {"Age": "20-24",
      "Male": 50227,
      "Female": 50260},
    
    {"Age": "25-29",
      "Male": 68810,
      "Female": 66114},
    
    {"Age": "30-34",
      "Male": 73305,
      "Female": 69097},
    
    {"Age": "35-39",
      "Male": 60709,
      "Female": 55407},
    
    { "Age": "40-44",
      "Male": 50775,
      "Female": 46176},
    
    {"Age": "45-49",
      "Male": 40029,
      "Female": 38233},
    
    {"Age": "50-54",
      "Male": 31945,
      "Female": 30606},
    
    {"Age": "55-59",
      "Male": 25321,
      "Female": 25578},
    
    {"Age": "60-64",
      "Male": 17921,
      "Female":18973},
    
    {"Age": "65-69",
      "Male": 12024,
      "Female": 13841},
    
    {"Age": "70-74",
      "Male": 9704,
      "Female": 10259},
    
    {"Age": "75-79",
      "Male": 6824,
      "Female": 6796},
    
    {"Age": "80-84",
      "Male": 5732,
      "Female": 4930},
    
    {"Age": "85-89",
      "Male": 2362,
      "Female": 2331},
    
    {"Age": "90-94",
      "Male": 894,
      "Female": 736},
    
    {"Age": "95-99",
      "Male": 147,
      "Female": 146},
  
    {"Age": "=<100",
      "Male": 15,
      "Female": 44}
  ],
  "32": [  
    {"Age": "0-4",
      "Male": 106034,
      "Female":100959},
    
    {"Age": "5-9",
      "Male": 100302,
      "Female": 94653},
    
    {"Age": "10-14",
      "Male": 91688,
      "Female": 86318},
    
    {"Age": "15-19",
      "Male": 84049,
      "Female": 82618},
    
    {"Age": "20-24",
      "Male": 97318,
      "Female": 100903},
    
    {"Age": "25-29",
      "Male": 139156,
      "Female": 142197},
    
    {"Age": "30-34",
      "Male": 161594,
      "Female": 161712},
    
    {"Age": "35-39",
      "Male": 139246,
      "Female": 131172},
    
    { "Age": "40-44",
      "Male": 108237,
      "Female": 98747},
    
    {"Age": "45-49",
      "Male": 93098,
      "Female": 86386},
    
    {"Age": "50-54",
      "Male": 73280,
      "Female": 70823},
    
    {"Age": "55-59",
      "Male": 60387,
      "Female": 59748},
    
    {"Age": "60-64",
      "Male": 45273,
      "Female":44888},
    
    {"Age": "65-69",
      "Male": 28884,
      "Female": 30225},
    
    {"Age": "70-74",
      "Male": 19694,
      "Female": 18986},
    
    {"Age": "75-79",
      "Male": 13981,
      "Female": 12608},
    
    {"Age": "80-84",
      "Male": 9042,
      "Female": 7693},
    
    {"Age": "85-89",
      "Male": 3535,
      "Female": 3805},
    
    {"Age": "90-94",
      "Male": 1317,
      "Female": 1329},
    
    {"Age": "95-99",
      "Male": 179,
      "Female": 224},
  
    {"Age": "=<100",
      "Male": 41,
      "Female": 71}
  ],
"07": [  
    {"Age": "0-4",
      "Male": 497120,
      "Female":469853},
    
    {"Age": "5-9",
      "Male": 458616,
      "Female": 434746},
    
    {"Age": "10-14",
      "Male": 421075,
      "Female": 401141},
    
    {"Age": "15-19",
      "Male": 417982,
      "Female": 402908},
    
    {"Age": "20-24",
      "Male": 474770,
      "Female": 485620},
    
    {"Age": "25-29",
      "Male": 656933,
      "Female": 679824},
    
    {"Age": "30-34",
      "Male": 764188,
      "Female": 778351},
    
    {"Age": "35-39",
      "Male": 646446,
      "Female": 633394},
    
    { "Age": "40-44",
      "Male": 500904,
      "Female": 475615},
    
    {"Age": "45-49",
      "Male": 453314,
      "Female": 439231},
    
    {"Age": "50-54",
      "Male": 379532,
      "Female": 378511},
    
    {"Age": "55-59",
      "Male": 312653,
      "Female": 319365},
    
    {"Age": "60-64",
      "Male": 241326,
      "Female":241876},
    
    {"Age": "65-69",
      "Male": 163162,
      "Female": 167941},
    
    {"Age": "70-74",
      "Male": 115537,
      "Female": 116852},
    
    {"Age": "75-79",
      "Male": 80639,
      "Female": 79679},
    
    {"Age": "80-84",
      "Male": 55354,
      "Female": 51544},
    
    {"Age": "85-89",
      "Male": 23929,
      "Female": 25998},
    
    {"Age": "90-94",
      "Male": 8654,
      "Female": 9468},
    
    {"Age": "95-99",
      "Male": 1337,
      "Female": 1738},
  
    {"Age": "=<100",
      "Male": 201,
      "Female": 310}
  ],
  
"19": [  
    {"Age": "0-4",
      "Male": 74517,
      "Female":71635},
    
    {"Age": "5-9",
      "Male": 76823,
      "Female": 73764},
    
    {"Age": "10-14",
      "Male": 78235,
      "Female": 74804},
    
    {"Age": "15-19",
      "Male": 81989,
      "Female": 80113},
    
    {"Age": "20-24",
      "Male": 94788,
      "Female": 91851},
    
    {"Age": "25-29",
      "Male": 116181,
      "Female": 112061},
    
    {"Age": "30-34",
      "Male": 125916,
      "Female": 124204},
    
    {"Age": "35-39",
      "Male": 110453,
      "Female": 112264},
    
    { "Age": "40-44",
      "Male": 95606,
      "Female": 97546},
    
    {"Age": "45-49",
      "Male": 96514,
      "Female": 96886},
    
    {"Age": "50-54",
      "Male": 83385,
      "Female": 83619},
    
    {"Age": "55-59",
      "Male": 69752,
      "Female": 72477},
    
    {"Age": "60-64",
      "Male": 53729,
      "Female":56927},
    
    {"Age": "65-69",
      "Male": 38058,
      "Female": 40685},
    
    {"Age": "70-74",
      "Male": 26055,
      "Female": 27758},
    
    {"Age": "75-79",
      "Male": 20497,
      "Female": 20996},
    
    {"Age": "80-84",
      "Male": 15878,
      "Female": 15357},
    
    {"Age": "85-89",
      "Male": 6943,
      "Female": 7402},
    
    {"Age": "90-94",
      "Male": 2089,
      "Female": 2411},
    
    {"Age": "95-99",
      "Male": 163,
      "Female": 293},
  
    {"Age": "=<100",
      "Male": 26,
      "Female": 46}
  ],
  "21": [  
    {"Age": "0-4",
      "Male": 111520,
      "Female":106070},
    
    {"Age": "5-9",
      "Male": 109500,
      "Female": 106744},
    
    {"Age": "10-14",
      "Male": 104945,
      "Female": 101892},
    
    {"Age": "15-19",
      "Male": 105016,
      "Female": 101270},
    
    {"Age": "20-24",
      "Male": 118369,
      "Female": 116713},
    
    {"Age": "25-29",
      "Male": 164116,
      "Female": 158874},
    
    {"Age": "30-34",
      "Male": 185374,
      "Female": 179300},
    
    {"Age": "35-39",
      "Male": 147596,
      "Female": 143201},
    
    { "Age": "40-44",
      "Male": 123860,
      "Female": 122740},
    
    {"Age": "45-49",
      "Male": 116688,
      "Female": 115758},
    
    {"Age": "50-54",
      "Male": 99814,
      "Female": 100789},
    
    {"Age": "55-59",
      "Male": 82501,
      "Female": 86131},
    
    {"Age": "60-64",
      "Male": 60893,
      "Female":65668},
    
    {"Age": "65-69",
      "Male": 44054,
      "Female": 47798},
    
    {"Age": "70-74",
      "Male": 28821,
      "Female": 29853},
    
    {"Age": "75-79",
      "Male": 22391,
      "Female": 21538},
    
    {"Age": "80-84",
      "Male": 17400,
      "Female": 15592},
    
    {"Age": "85-89",
      "Male": 7830,
      "Female": 6804},
    
    {"Age": "90-94",
      "Male": 2912,
      "Female": 2430},
    
    {"Age": "95-99",
      "Male": 339,
      "Female": 351},
  
    {"Age": "=<100",
      "Male": 59,
      "Female": 68}
  ],
  "27": [  
    {"Age": "0-4",
      "Male":98246,
      "Female":93886},
    
    {"Age": "5-9",
      "Male": 84895,
      "Female": 82283},
    
    {"Age": "10-14",
      "Male": 72245,
      "Female": 69556},
    
    {"Age": "15-19",
      "Male": 65087,
      "Female": 63421},
    
    {"Age": "20-24",
      "Male": 77647,
      "Female": 75192},
    
    {"Age": "25-29",
      "Male": 97414,
      "Female": 93345},
    
    {"Age": "30-34",
      "Male": 94444,
      "Female": 95118},
    
    {"Age": "35-39",
      "Male": 78285,
      "Female": 80019},
    
    { "Age": "40-44",
      "Male": 65875,
      "Female": 66663},
    
    {"Age": "45-49",
      "Male": 52268,
      "Female": 52245},
    
    {"Age": "50-54",
      "Male": 44781,
      "Female": 45551},
    
    {"Age": "55-59",
      "Male": 37173,
      "Female": 37486},
    
    {"Age": "60-64",
      "Male": 25519,
      "Female":27476},
    
    {"Age": "65-69",
      "Male": 16325,
      "Female": 19751},
    
    {"Age": "70-74",
      "Male": 11077,
      "Female": 12409},
    
    {"Age": "75-79",
      "Male": 7643,
      "Female": 7542},
    
    {"Age": "80-84",
      "Male": 6044,
      "Female": 5315},
    
    {"Age": "85-89",
      "Male": 2446,
      "Female": 2286},
    
    {"Age": "90-94",
      "Male": 786,
      "Female": 772},
    
    {"Age": "95-99",
      "Male": 101,
      "Female": 132},
  
    {"Age": "=<100",
      "Male": 26,
      "Female": 44}
  ],
  "12": [  
    {"Age": "0-4",
      "Male":27643,
      "Female":26601},
    
    {"Age": "5-9",
      "Male": 25248,
      "Female": 24726},
    
    {"Age": "10-14",
      "Male": 23481,
      "Female": 22710},
    
    {"Age": "15-19",
      "Male": 25898,
      "Female": 23506},
   
    {"Age": "20-24",
      "Male": 34503,
      "Female": 33265},
    
    {"Age": "25-29",
      "Male": 38604,
      "Female": 37621},
    
    {"Age": "30-34",
      "Male": 38307,
      "Female": 37085},
    
    {"Age": "35-39",
      "Male": 30032,
      "Female": 28916},
   
    { "Age": "40-44",
      "Male": 23675,
      "Female": 22203},
    
    {"Age": "45-49",
      "Male": 21266,
      "Female": 21013},
    
    {"Age": "50-54",
      "Male": 17806,
      "Female": 17438},
    
    {"Age": "55-59",
      "Male": 15618,
      "Female": 15117},
    
    {"Age": "60-64",
      "Male": 11472,
      "Female":11445},
    
    {"Age": "65-69",
      "Male": 7575,
      "Female": 8367},
    
    {"Age": "70-74",
      "Male": 5859,
      "Female": 6085},
    
    {"Age": "75-79",
      "Male": 4268,
      "Female": 4376},
    
    {"Age": "80-84",
      "Male": 3250,
      "Female": 3123},
    
    {"Age": "85-89",
      "Male": 1468,
      "Female": 1475},
    
    {"Age": "90-94",
      "Male": 554,
      "Female": 530},
    
    {"Age": "95-99",
      "Male": 118,
      "Female": 93},
  
    {"Age": "=<100",
      "Male": 11,
      "Female": 9}
  ],
  
  "30": [  
    {"Age": "0-4",
      "Male":343374,
      "Female":324078},
    
    {"Age": "5-9",
      "Male": 289308,
      "Female": 275596},
    
    {"Age": "10-14",
      "Male": 254185,
      "Female": 242021},
    
    {"Age": "15-19",
      "Male": 231459,
      "Female": 230671},
   
    {"Age": "20-24",
      "Male": 253805,
      "Female": 253239},
    
    {"Age": "25-29",
      "Male": 326558,
      "Female": 321129},
    
    {"Age": "30-34",
      "Male": 340014,
      "Female": 332224},
    
    {"Age": "35-39",
      "Male": 278344,
      "Female": 271616},
   
    { "Age": "40-44",
      "Male": 212654,
      "Female": 208094},
    
    {"Age": "45-49",
      "Male": 178323,
      "Female": 177616},
    
    {"Age": "50-54",
      "Male": 144556,
      "Female": 144315},
    
    {"Age": "55-59",
      "Male": 126013,
      "Female": 129788},
    
    {"Age": "60-64",
      "Male": 90004,
      "Female":95774},
    
    {"Age": "65-69",
      "Male": 53141,
      "Female": 61770},
    
    {"Age": "70-74",
      "Male": 46510,
      "Female": 49944},
    
    {"Age": "75-79",
      "Male": 33435,
      "Female": 33001},
    
    {"Age": "80-84",
      "Male": 27024,
      "Female": 23989},
    
    {"Age": "85-89",
      "Male": 11042,
      "Female": 9823},
    
    {"Age": "90-94",
      "Male": 4757,
      "Female": 3868},
    
    {"Age": "95-99",
      "Male": 572,
      "Female": 606},
  
    {"Age": "=<100",
      "Male": 107,
      "Female":154
}
  ],
    
  "26": [  
    {"Age": "0-4",
      "Male":66282,
      "Female":63323},
    
    {"Age": "5-9",
      "Male": 57012,
      "Female": 53945},
    
    {"Age": "10-14",
      "Male": 48394,
      "Female": 46276},
    
    {"Age": "15-19",
      "Male": 46009,
      "Female": 45483},
   
    {"Age": "20-24",
      "Male": 52360,
      "Female": 53837},
    
    {"Age": "25-29",
      "Male": 69440,
      "Female": 68114},
    
    {"Age": "30-34",
      "Male": 71998,
      "Female": 69106},
    
    {"Age": "35-39",
      "Male": 58415,
      "Female": 54723},
   
    { "Age": "40-44",
      "Male": 46134,
      "Female": 42383},
    
    {"Age": "45-49",
      "Male": 37663,
      "Female": 35471},
    
    {"Age": "50-54",
      "Male": 30163,
      "Female": 28251},
    
    {"Age": "55-59",
      "Male": 24671,
      "Female": 23376},
    
    {"Age": "60-64",
      "Male": 18416,
      "Female":17362},
    
    {"Age": "65-69",
      "Male": 10369,
      "Female": 11561},
    
    {"Age": "70-74",
      "Male": 7539,
      "Female": 7811},
    
    {"Age": "75-79",
      "Male": 6117,
      "Female": 5701},
    
    {"Age": "80-84",
      "Male": 4504,
      "Female": 3934},
    
    {"Age": "85-89",
      "Male": 2052,
      "Female": 2091},
    
    {"Age": "90-94",
      "Male": 830,
      "Female": 780},
    
    {"Age": "95-99",
      "Male": 132,
      "Female": 162},
  
    {"Age": "=<100",
      "Male": 40,
      "Female":53
}
  ],
  "04": [  
    {"Age": "0-4",
      "Male":206495,
      "Female":195409},
    
    {"Age": "5-9",
      "Male": 189107,
      "Female": 179662},
    
    {"Age": "10-14",
      "Male": 170461,
      "Female": 162412},
    
    {"Age": "15-19",
      "Male": 164533,
      "Female": 159761},
   
    {"Age": "20-24",
      "Male": 185596,
      "Female": 182700},
    
    {"Age": "25-29",
      "Male": 258335,
      "Female": 256929},
    
    {"Age": "30-34",
      "Male": 289813,
      "Female": 284750},
    
    {"Age": "35-39",
      "Male": 235188,
      "Female": 229467},
   
    { "Age": "40-44",
      "Male": 191287,
      "Female": 181751},
    
    {"Age": "45-49",
      "Male": 173085,
      "Female": 162949},
    
    {"Age": "50-54",
      "Male": 144331,
      "Female": 137410},
    
    {"Age": "55-59",
      "Male": 118081,
      "Female": 116340},
    
    {"Age": "60-64",
      "Male": 93353,
      "Female":90387},
    
    {"Age": "65-69",
      "Male": 60991,
      "Female": 63045},
    
    {"Age": "70-74",
      "Male": 43292,
      "Female": 45513},
    
    {"Age": "75-79",
      "Male": 33849,
      "Female": 31905},
    
    {"Age": "80-84",
      "Male": 25223,
      "Female": 23254
},
    
    {"Age": "85-89",
      "Male": 11232,
      "Female": 12264},
    
    {"Age": "90-94",
      "Male": 4513,
      "Female": 4500},
    
    {"Age": "95-99",
      "Male": 618,
      "Female": 778},
  
    {"Age": "=<100",
      "Male": 94,
      "Female":187
}
  ],
  
  
  "29": [  
    {"Age": "0-4",
      "Male":43452,
      "Female":41521},
    
    {"Age": "5-9",
      "Male": 36077,
      "Female": 34394},
    
    {"Age": "10-14",
      "Male": 31649,
      "Female": 30415},
    
    {"Age": "15-19",
      "Male": 34558,
      "Female": 29802},
   
    {"Age": "20-24",
      "Male": 34514,
      "Female": 30638},
    
    {"Age": "25-29",
      "Male": 37468,
      "Female": 35684},
    
    {"Age": "30-34",
      "Male": 35861,
      "Female": 35090},
    
    {"Age": "35-39",
      "Male": 28835,
      "Female": 28529},
   
    { "Age": "40-44",
      "Male": 22156,
      "Female": 22876},
    
    {"Age": "45-49",
      "Male": 19487,
      "Female": 20451},
    
    {"Age": "50-54",
      "Male": 14865,
      "Female": 16221},
    
    {"Age": "55-59",
      "Male": 13871,
      "Female": 15459},
    
    {"Age": "60-64",
      "Male": 10427,
      "Female":11663},
    
    {"Age": "65-69",
      "Male": 6983,
      "Female": 7681},
    
    {"Age": "70-74",
      "Male": 6649,
      "Female": 6818},
    
    {"Age": "75-79",
      "Male": 5121,
      "Female": 4881},
    
    {"Age": "80-84",
      "Male": 4667,
      "Female": 4135
},
    
    {"Age": "85-89",
      "Male": 2213,
      "Female": 1864},
    
    {"Age": "90-94",
      "Male": 928,
      "Female": 728},
    
    {"Age": "95-99",
      "Male": 104,
      "Female": 106},
  
    {"Age": "=<100",
      "Male": 32,
      "Female":25}
  ],
  
  "15": [  
    {"Age": "0-4",
      "Male":161136,
      "Female":154318},
    
    {"Age": "5-9",
      "Male": 148687,
      "Female": 141765},
    
    {"Age": "10-14",
      "Male": 128165,
      "Female": 122793},
    
    {"Age": "15-19",
      "Male": 124679,
      "Female": 118129},
   
    {"Age": "20-24",
      "Male": 143746,
      "Female": 135463},
    
    {"Age": "25-29",
      "Male": 170748,
      "Female": 161958},
    
    {"Age": "30-34",
      "Male": 169927,
      "Female": 160246},
    
    {"Age": "35-39",
      "Male": 138173 ,
      "Female": 128075},
   
    { "Age": "40-44",
      "Male": 101886,
      "Female": 96108},
    
    {"Age": "45-49",
      "Male": 84377,
      "Female": 80943},
    
    {"Age": "50-54",
      "Male": 66052,
      "Female": 66328},
    
    {"Age": "55-59",
      "Male": 56574,
      "Female": 57236},
    
    {"Age": "60-64",
      "Male": 42535,
      "Female":43478},
    
    {"Age": "65-69",
      "Male": 26538,
      "Female": 29082},
    
    {"Age": "70-74",
      "Male": 17640,
      "Female": 18673},
    
    {"Age": "75-79",
      "Male": 15069,
      "Female": 14389},
    
    {"Age": "80-84",
      "Male": 12241,
      "Female": 10232
},
    
    {"Age": "85-89",
      "Male": 6186,
      "Female": 5123},
    
    {"Age": "90-94",
      "Male": 2710,
      "Female": 2067},
    
    {"Age": "95-99",
      "Male": 475,
      "Female": 489},
  
    {"Age": "=<100",
      "Male": 144,
      "Female":135
}
  ],
  "25": [  
    {"Age": "0-4",
      "Male":60586,
      "Female":58201},
    
    {"Age": "5-9",
      "Male": 52443,
      "Female": 50814},
    
    {"Age": "10-14",
      "Male": 43297,
      "Female": 41809},
    
    {"Age": "15-19",
      "Male": 40996,
      "Female": 37920},
   
    {"Age": "20-24",
      "Male": 44672,
      "Female": 41784},
    
    {"Age": "25-29",
      "Male": 57166,
      "Female": 55559},
    
    {"Age": "30-34",
      "Male": 65175,
      "Female": 61305},
    
    {"Age": "35-39",
      "Male": 51301 ,
      "Female": 46479},
   
    { "Age": "40-44",
      "Male": 38275,
      "Female": 33985},
    
    {"Age": "45-49",
      "Male": 32404,
      "Female": 29653},
    
    {"Age": "50-54",
      "Male": 26957,
      "Female": 24309},
    
    {"Age": "55-59",
      "Male": 22954,
      "Female": 20439},
    
    {"Age": "60-64",
      "Male": 17225,
      "Female":15937},
    
    {"Age": "65-69",
      "Male": 10215,
      "Female": 10761},
    
    {"Age": "70-74",
      "Male": 7930,
      "Female": 8391},
    
    {"Age": "75-79",
      "Male": 5981,
      "Female": 6284},
    
    {"Age": "80-84",
      "Male": 4971,
      "Female": 5078},
    
    {"Age": "85-89",
      "Male": 2362,
      "Female": 2558},
    
    {"Age": "90-94",
      "Male": 964,
      "Female": 1033},
    
    {"Age": "95-99",
      "Male": 117,
      "Female": 183},
  
    {"Age": "=<100",
      "Male": 22,
      "Female":38
}
  ],
  "14": [  
    {"Age": "0-4",
      "Male":206769,
      "Female":195245},
    
    {"Age": "5-9",
      "Male": 193313,
      "Female": 184830},
    
    {"Age": "10-14",
      "Male": 170319,
      "Female": 162488},
    
    {"Age": "15-19",
      "Male": 163223,
      "Female": 154447},
   
    {"Age": "20-24",
      "Male": 196510,
      "Female": 185995},
    
    {"Age": "25-29",
      "Male": 266350,
      "Female": 257233},
    
    {"Age": "30-34",
      "Male": 279786,
      "Female": 273436},
    
    {"Age": "35-39",
      "Male": 218763,
      "Female": 215881},
   
    { "Age": "40-44",
      "Male": 166187,
      "Female": 162888},
    
    {"Age": "45-49",
      "Male": 147925,
      "Female": 144060},
    
    {"Age": "50-54",
      "Male": 119947,
      "Female": 117357},
    
    {"Age": "55-59",
      "Male": 106253,
      "Female": 103313},
    
    {"Age": "60-64",
      "Male": 79681,
      "Female":82400},
    
    {"Age": "65-69",
      "Male": 50236,
      "Female": 57204},
    
    {"Age": "70-74",
      "Male": 29716,
      "Female": 32963},
    
    {"Age": "75-79",
      "Male": 27890,
      "Female": 26172},
    
    {"Age": "80-84",
      "Male": 21330,
      "Female": 18233},
    
    {"Age": "85-89",
      "Male": 12527,
      "Female": 11267},
    
    {"Age": "90-94",
      "Male": 3947,
      "Female": 3778},
    
    {"Age": "95-99",
      "Male": 467,
      "Female": 617},
  
    {"Age": "=<100",
      "Male": 112,
      "Female":216
}
  ],
  
  "08": [  
    {"Age": "0-4",
      "Male":48365,
      "Female":45050},
    
    {"Age": "5-9",
      "Male": 41620,
      "Female": 39866},
    
    {"Age": "10-14",
      "Male": 36531,
      "Female": 35050},
    
    {"Age": "15-19",
      "Male": 33444,
      "Female": 33267
},
   
    {"Age": "20-24",
      "Male": 40216,
      "Female": 39547},
    
    {"Age": "25-29",
      "Male": 51671,
      "Female": 48776},
    
    {"Age": "30-34",
      "Male": 51026,
      "Female": 48472},
    
    {"Age": "35-39",
      "Male": 39890,
      "Female": 38082},
   
    { "Age": "40-44",
      "Male": 32724,
      "Female": 31329},
    
    {"Age": "45-49",
      "Male": 27057,
      "Female": 25874},
    
    {"Age": "50-54",
      "Male": 21667,
      "Female": 20855},
    
    {"Age": "55-59",
      "Male": 17714,
      "Female": 17296},
    
    {"Age": "60-64",
      "Male": 13474,
      "Female":14120},
    
    {"Age": "65-69",
      "Male": 9056,
      "Female": 10600},
    
    {"Age": "70-74",
      "Male": 5364,
      "Female": 6251},
    
    {"Age": "75-79",
      "Male": 5269,
      "Female": 5005},
    
    {"Age": "80-84",
      "Male": 4140,
      "Female": 3379},
    
    {"Age": "85-89",
      "Male": 2332,
      "Female": 1916},
    
    {"Age": "90-94",
      "Male": 702,
      "Female": 551},
    
    {"Age": "95-99",
      "Male": 75,
      "Female": 93},
  
    {"Age": "=<100",
      "Male": 19,
      "Female":28}
  ],
"10": [
  {"Age": "0-4",
      "Male":249791,
      "Female":234370},
    
    {"Age": "5-9",
      "Male": 222640,
      "Female": 211585},
    
    {"Age": "10-14",
      "Male": 189516,
      "Female": 180020},
    
    {"Age": "15-19",
      "Male": 175700,
      "Female": 169341},
   
    {"Age": "20-24",
      "Male": 211447,
      "Female": 209752},
    
    {"Age": "25-29",
      "Male": 255302,
      "Female": 254806},
    
    {"Age": "30-34",
      "Male": 253679,
      "Female": 250209},
    
    {"Age": "35-39",
      "Male": 199340,
      "Female": 193900},
   
    { "Age": "40-44",
      "Male": 152464,
      "Female": 147704},
    
    {"Age": "45-49",
      "Male": 130121,
      "Female": 124630},
    
    {"Age": "50-54",
      "Male": 99641,
      "Female": 96096},
    
    {"Age": "55-59",
      "Male": 84921,
      "Female": 81335},
    
    {"Age": "60-64",
      "Male": 61712,
      "Female":62171},
    
    {"Age": "65-69",
      "Male": 36502,
      "Female": 41974},
    
    {"Age": "70-74",
      "Male": 22077,
      "Female": 24621},
    
    {"Age": "75-79",
      "Male": 19527,
      "Female": 17707},
    
    {"Age": "80-84",
      "Male": 14520,
      "Female": 12023},
    
    {"Age": "85-89",
      "Male": 7352,
      "Female": 6431},
    
    {"Age": "90-94",
      "Male": 2046,
      "Female": 2318},
    
    {"Age": "95-99",
      "Male": 282,
      "Female": 521},
  
    {"Age": "=<100",
      "Male": 94,
      "Female":321}
  ],
  
  "18": [
  {"Age": "0-4",
      "Male":38085,
      "Female":35624},
    
    {"Age": "5-9",
      "Male": 33832,
      "Female": 32245},
    
    {"Age": "10-14",
      "Male": 28376,
      "Female": 27085},
    
    {"Age": "15-19",
      "Male": 25728,
      "Female": 25403},
   
    {"Age": "20-24",
      "Male": 32051,
      "Female": 32398},
    
    {"Age": "25-29",
      "Male": 41719,
      "Female": 40354},
    
    {"Age": "30-34",
      "Male": 37556,
      "Female": 37366},
    
    {"Age": "35-39",
      "Male": 29148,
      "Female": 29256},
   
    { "Age": "40-44",
      "Male": 23795,
      "Female": 23160},
    
    {"Age": "45-49",
      "Male": 19015,
      "Female": 18851},
    
    {"Age": "50-54",
      "Male": 13009,
      "Female": 13602},
    
    {"Age": "55-59",
      "Male": 12647,
      "Female": 11845},
    
    {"Age": "60-64",
      "Male": 9266,
      "Female":8790},
    
    {"Age": "65-69",
      "Male": 4850,
      "Female": 5804},
    
    {"Age": "70-74",
      "Male": 3343,
      "Female": 3298},
    
    {"Age": "75-79",
      "Male": 3943,
      "Female": 2528},
    
    {"Age": "80-84",
      "Male": 3089,
      "Female": 2435},
    
    {"Age": "85-89",
      "Male": 1591,
      "Female": 1181},
    
    {"Age": "90-94",
      "Male": 261,
      "Female": 314},
    
    {"Age": "95-99",
      "Male": 55,
      "Female": 80},
  
    {"Age": "=<100",
      "Male": 27,
      "Female":47}
  ],
  "06": [
  {"Age": "0-4",
      "Male":59952,
      "Female":57288},
    
    {"Age": "5-9",
      "Male": 52958,
      "Female": 50770},
    
    {"Age": "10-14",
      "Male": 42910,
      "Female": 41437},
    
    {"Age": "15-19",
      "Male": 39459,
      "Female": 34862},
   
    {"Age": "20-24",
      "Male": 53318,
      "Female": 44365},
    
    {"Age": "25-29",
      "Male": 75998,
      "Female": 61668},
    
    {"Age": "30-34",
      "Male": 79454,
      "Female": 62879},
    
    {"Age": "35-39",
      "Male": 60884,
      "Female": 47736},
   
    { "Age": "40-44",
      "Male": 42435,
      "Female": 34318},
    
    {"Age": "45-49",
      "Male": 32748,
      "Female": 27661},
    
    {"Age": "50-54",
      "Male": 22410,
      "Female": 20739},
    
    {"Age": "55-59",
      "Male": 19777,
      "Female": 17788},
    
    {"Age": "60-64",
      "Male": 15222,
      "Female":15353},
    
    {"Age": "65-69",
      "Male": 8309,
      "Female": 11078},
    
    {"Age": "70-74",
      "Male": 4596,
      "Female": 5445},
    
    {"Age": "75-79",
      "Male": 4893,
      "Female": 4590},
    
    {"Age": "80-84",
      "Male": 3110,
      "Female": 2618},
    
    {"Age": "85-89",
      "Male": 1818,
      "Female": 1544},
    
    {"Age": "90-94",
      "Male": 398,
      "Female": 423},
    
    {"Age": "95-99",
      "Male": 52,
      "Female": 89},
  
    {"Age": "=<100",
      "Male": 21,
      "Female":27}
  ],
    

  "23": [
  {"Age": "0-4",
      "Male":105999,
      "Female":100880},
    
    {"Age": "5-9",
      "Male": 89716,
      "Female": 85800},
    
    {"Age": "10-14",
      "Male": 74694,
      "Female": 71571},
    
    {"Age": "15-19",
      "Male": 71021,
      "Female": 66895},
   
    {"Age": "20-24",
      "Male": 82457,
      "Female": 80242},
    
    {"Age": "25-29",
      "Male": 99821,
      "Female": 97786},
    
    {"Age": "30-34",
      "Male": 100217,
      "Female": 95598},
    
    {"Age": "35-39",
      "Male": 76776,
      "Female": 70876},
   
    { "Age": "40-44",
      "Male": 54765,
      "Female": 49348},
    
    {"Age": "45-49",
      "Male": 41224,
      "Female": 38410},
    
    {"Age": "50-54",
      "Male": 30162,
      "Female": 30804},
    
    {"Age": "55-59",
      "Male": 27341,
      "Female": 26618},
    
    {"Age": "60-64",
      "Male": 18794,
      "Female":19023},
    
    {"Age": "65-69",
      "Male": 11408,
      "Female": 13947},
    
    {"Age": "70-74",
      "Male": 5628,
      "Female": 6842},
    
    {"Age": "75-79",
      "Male": 5378,
      "Female": 5478},
    
    {"Age": "80-84",
      "Male": 6128,
      "Female": 4922},
    
    {"Age": "85-89",
      "Male": 3799,
      "Female": 2874},
    
    {"Age": "90-94",
      "Male": 1098,
      "Female": 1186},
    
    {"Age": "95-99",
      "Male": 251,
      "Female": 313},
  
    {"Age": "=<100",
      "Male": 137,
      "Female":188}
  ],
  "13": [
  {"Age": "0-4",
      "Male":215188,
      "Female":203521},
    
    {"Age": "5-9",
      "Male": 181631,
      "Female": 172694},
    
    {"Age": "10-14",
      "Male": 148271,
      "Female": 142484},
    
    {"Age": "15-19",
      "Male": 134731,
      "Female": 129884},
   
    {"Age": "20-24",
      "Male": 132510,
      "Female": 128639},
    
    {"Age": "25-29",
      "Male": 131005,
      "Female": 131301},
    
    {"Age": "30-34",
      "Male": 117172,
      "Female": 121725},
    
    {"Age": "35-39",
      "Male": 92328,
      "Female": 94889},
   
    { "Age": "40-44",
      "Male": 64658,
      "Female": 63750},
    
    {"Age": "45-49",
      "Male": 50155,
      "Female": 50271},
    
    {"Age": "50-54",
      "Male": 34250,
      "Female": 37207},
    
    {"Age": "55-59",
      "Male": 30101,
      "Female": 31068},
    
    {"Age": "60-64",
      "Male": 23595,
      "Female":22788},
    
    {"Age": "65-69",
      "Male": 15699,
      "Female": 16723},
    
    {"Age": "70-74",
      "Male": 10794,
      "Female": 9903},
    
    {"Age": "75-79",
      "Male": 6970,
      "Female": 6197},
    
    {"Age": "80-84",
      "Male": 6735,
      "Female": 5110},
    
    {"Age": "85-89",
      "Male": 3683,
      "Female": 2785},
    
    {"Age": "90-94",
      "Male": 1528,
      "Female": 1173
},
    
    {"Age": "95-99",
      "Male": 610,
      "Female": 528},
  
    {"Age": "=<100",
      "Male": 317,
      "Female":443
}
  ],
    
"01": [
  {"Age": "0-4",
      "Male":166096,
      "Female":154760},
    
    {"Age": "5-9",
      "Male": 156081,
      "Female": 147170},
    
    {"Age": "10-14",
      "Male": 138270,
      "Female": 131617},
    
    {"Age": "15-19",
      "Male": 135230,
      "Female": 124167},
   
    {"Age": "20-24",
      "Male": 148894,
      "Female": 139899},
    
    {"Age": "25-29",
      "Male": 189819,
      "Female": 179808},
    
    {"Age": "30-34",
      "Male": 199811,
      "Female": 196308},
    
    {"Age": "35-39",
      "Male": 179143,
      "Female": 175472},
   
    { "Age": "40-44",
      "Male": 148364,
      "Female": 143775},
    
    {"Age": "45-49",
      "Male": 128764,
      "Female": 124306},
    
    {"Age": "50-54",
      "Male": 103574,
      "Female": 101132},
    
    {"Age": "55-59",
      "Male": 87340,
      "Female": 90258},
    
    {"Age": "60-64",
      "Male": 67249,
      "Female":69269},
    
    {"Age": "65-69",
      "Male": 44740,
      "Female": 48694},
    
    {"Age": "70-74",
      "Male": 34874,
      "Female": 35918},
    
    {"Age": "75-79",
      "Male": 27921,
      "Female": 27283},
    
    {"Age": "80-84",
      "Male": 20002,
      "Female": 17994},
    
    {"Age": "85-89",
      "Male": 9629,
      "Female": 8949},
    
    {"Age": "90-94",
      "Male": 3270,
      "Female": 3029
},
    
    {"Age": "95-99",
      "Male": 276,
      "Female": 370},
  
    {"Age": "=<100",
      "Male": 53,
      "Female":74
}
  ],
   
 
}
