// Data gathered from https://www.populationpyramid.net/iran-islamic-republic-of/2020/

// Age categories
var categories = [
    '0-4', '5-9', '10-14', '15-19',
    '20-24', '25-29', '30-34', '35-39', '40-44',
    '45-49', '50-54', '55-59', '60-64', '65-69',
    '70-74', '75-79', '80-84', '85-89', '90-94',
    '95-99', '100 + '
];

Highcharts.chart('container', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'IRAN Population Pyramid , 2020'
    },
    subtitle: {
        text: 'Source: <a href="https://www.populationpyramid.net/iran-islamic-republic-of/2020/">Population Pyramids of the World from 1950 to 2100</a>'
    },
    xAxis: [{
        categories: categories,
        reversed: false,
        labels: {
            step: 1
        }
    }, { // mirror axis on right side
        opposite: true,
        reversed: false,
        categories: categories,
        linkedTo: 0,
        labels: {
            step: 1
        }
    }],
    yAxis: {
        title: {
            text: null
        },
        labels: {
            formatter: function () {
                return Math.abs(this.value) + '%';
            }
        }
    },

    plotOptions: {
        series: {
            stacking: 'normal'
        }
    },

    tooltip: {
        formatter: function () {
            return '<b>' + this.series.name + ', age ' + this.point.category + '</b><br/>' +
                'Population: ' + Highcharts.numberFormat(Math.abs(this.point.y), 2);
        }
    },

    series: [{
        name: 'HOMME',
        data: [
            -4.7, -4.2, -3.8, -3.4,
            -3.3, -4.0, -5.0, -4.9,
            -3.9, -3.1, -2.8, -2.2,
            -1.9, -1.3, -0.8, -0.6,
            -0.4, -0.2, -0.0, -0.0,
            -0.0
        ]
    }, {
        name: 'FEMME',
        data: [
            4.4, 4.0, 3.6, 3.2, 3.3,
            4.1, 5.1, 4.9, 3.8, 3.0,
            2.7, 2.2, 1.9, 1.4, 0.9,
            0.5, 0.3, 0.1, 0.0, 0.0,
            0.0
        ]
    }]
});


