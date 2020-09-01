const datacsv = `country,population
Tehran,	13267637
Khorasan-e-Razavi,6434501
Esfahan,5120850
Fars,4851274
Khuzestan,4710509
East Azarbayejan,3909652
Mazandaran,	3283582
West Azarbayejan,3265219
Kerman,	3164718
Sistan and Baluchestan,2775014`;

let data = [];

const {
  select,
  csv,
  scaleLinear,
  max,
  scaleBand,
  axisLeft,
  axisBottom,
  format,
  csvParse
} = d3;

const titleText = 'Iran top 10 populated provinces';
const xAxisLabelText = 'Population';

const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const render = d => {
  const xValue = d => d['population'];
  const yValue = d => d.country;
  const margin = { top: 150, right: 40, bottom: 77, left: 180 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const xScale = scaleLinear()
    .domain([0, max(data, xValue)])
    .range([0, innerWidth]);
  
  const yScale = scaleBand()
    .domain(d.map(yValue))
    .range([0, innerHeight])
    .padding(0.2);
  
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  const xAxisTickFormat = number =>
    format('.3s')(number)
      .replace('G', 'B');
  
  const xAxis = axisBottom(xScale)
    .tickFormat(xAxisTickFormat)
    .tickSize(-innerHeight);
  
  g.append('g')
    .call(axisLeft(yScale))
    .selectAll('.domain, .tick line')
    .remove();
  
  const xAxisG = g.append('g').call(xAxis)
    .attr('transform', `translate(0,${innerHeight})`);
  
  xAxisG.select('.domain').remove();
  
  xAxisG.append('text')
      .attr('class', 'axis-label')
      .attr('y', 65)
      .attr('x', innerWidth / 2)
      .attr('fill', 'black')
      .text(xAxisLabelText);
  
  g.selectAll('rect').data(data)
    .enter().append('rect')
      .attr('y', d => yScale(yValue(d)))
      .attr('width', d => xScale(xValue(d)))
      .attr('height', yScale.bandwidth());
  
  g.append('text')
      .attr('class', 'title')
      .attr('y', -10)
      .text(titleText);
};

csvParse(datacsv, (countryInfo) => {
    console.log(countryInfo);
    countryInfo.population = +countryInfo.population * 1000;
    data.push(countryInfo);
    if (data.length === 10){
      console.log(data)
      render(data);
    }
});
