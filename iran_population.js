// Paramètres de la visualisation
const width = 600;
const height = 300;
const margin = { top: 20, right: 0, bottom: 20, left: 100 };

// Données
const populations = [
  { name: "1950", count: 17119265 , color: 'orange' },
  { name: "1955", count: 19294127 , color: 'blueviolet' },
  { name: "1960", count: 21906914 , color: 'greenyellow' },
  { name: "1965", count: 24954873 , color: 'yellow' },
  { name: "1970", count: 28513866 , color: 'yellowgreen' },
  { name: "1975", count: 32729772 , color: 'gold' },
  { name: "1980", count: 38650246 , color: 'red' },
  { name: "1985", count: 47347186 , color: 'orangered' }
];

// Créer l'élément SVG et le configurer
const svg = d3.select('body')
              .append('svg')
              .attr('width', width)
              .attr('height', height)
              .attr('style', 'font: 10px sans-serif')

// Créer l'échelle horizontale (fonctions D3)
const x = d3.scaleBand()
            .domain(populations.map(d => d.name))
            .range([margin.left, width - margin.right])
            .padding(0.1)
            .round(true)

// Créer l'échelle verticale (fonctions D3)
const y = d3.scaleLinear()
            .domain([0, d3.max(populations, d => d.count)])
            .range([height - margin.bottom - 5, margin.top])
            .interpolate(d3.interpolateRound)

// Ajouter les barres
svg.append('g')
   .selectAll('rect')
     .data(populations)
     .enter()
     .append('rect')
     .attr('width', x.bandwidth())
     .attr('height', d => y(0) - y(d.count))
     .attr('x', d => x(d.name))
     .attr('y', d => y(d.count))
     .style('fill', d => d.color)

// Ajouter les titres
svg.append('g')
   .style('fill', 'white')
   .attr('text-anchor', 'middle')
   .attr('transform', `translate(${x.bandwidth() / 2}, 6)`)
   .selectAll('text')
     .data(populations)
     .enter()
     .append('text')
     .attr('dy', '0.35em')
     .attr('x', d => x(d.name))
     .attr('y', d => y(d.count))
     .text(d => d.count)

// Ajouter l'axe horizontal
svg.append('g')
   .attr('transform', `translate(0, ${height - margin.bottom})`)
   .call(d3.axisBottom(x))
   .call(g => g.select('.domain').remove())

// Ajouter l'axe vertical
svg.append('g')
   .attr('transform', `translate(${margin.left}, 0)`)
   .call(d3.axisLeft(y))
   .call(g => g.select('.domain').remove())

// Source: https://observablehq.com/@d3/learn-d3-scales