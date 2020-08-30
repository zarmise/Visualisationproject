const dataSource = {
  chart: {
    caption: "la population urbaine et rurale de l'Iran",
    subcaption: "1956-2016",
    xaxisname: "Years",
    yaxisname: "population",
    formatnumberscale: "1",
    plottooltext:
      "<b>$dataValue</b> The  <b>$seriesName</b> in $label",
    theme: "fusion",
    drawcrossline: "1"
  },
  categories: [
    {
      category: [
        {
          label: "1956"
        },
        {
          label: "1966"
        },
        {
          label: "1976"
        },
        {
          label: "1986"
        },
        {
          label: "1991"
        },
        {
          label: "1996"
        },
        {
          label: "2006"
        },
        {
          label: "2011"
        },
        {
          label: "2016"
        }
      ]
    }
  ],
  dataset: [
    {
      seriesname: "Rural Population",
      data: [
        {
          value: "12952082"
        },
        {
          value: "15284677"
        },
        {
          value: "17506252"
        },
        {
          value: "22349351"
        },
        {
          value: "23636591"
        },
        {
          value: "23026293"
        },
        {
          value: "22131101"
        },
        {
          value: "21446783"
        },
        {
          value: "20730625"
        }
      ]
    },
    {
      seriesname: "Urban Population",
      data: [
        {
          value: "5953563"
        },
        {
          value: "9794246"
        },
        {
          value: "15854680"
        },
        {
          value: "26844561"
        },
        {
          value: "31836598"
        },
        {
          value: "36817789"
        },
        {
          value: "48259964"
        },
        {
          value: "53646661"
        },
        {
          value: "59146847"
        }
      ]
    },
    {
      seriesname: "Total Population",
      data: [
        {
          value: "18905645"
        },
        {
          value: "25078923"
        },
        {
          value: "33360932"
        },
        {
          value: "49193912"
        },
        {
          value: "55473189"
        },
        {
          value: "59844082"
        },
        {
          value: "70391065"
        },
        {
          value: "75093444"
        },
        {
          value: "79877472"
        }
      ]
    }
  ]
};

FusionCharts.ready(function() {
  var myChart = new FusionCharts({
    type: "mscolumn2d",
    renderAt: "chart-container",
    width: "100%",
    height: "100%",
    dataFormat: "json",
    dataSource
  }).render();
});

