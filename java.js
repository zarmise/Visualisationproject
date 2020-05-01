// Paramètres de la visualisation
const width = 600;
const height = 200;
const margin = { top: 20, right: 0, bottom: 0, left: 50 };
const color = 'steelBlue';

// Données
const populations = [
  { name: "1956", count: 18954704 },
  { name: "1966", count: 25788722 },
  { name: "1976", count: 33708744 },
  { name: "1986", count: 49445010 },
  { name: "1996", count: 60055488 },
  { name: "2006", count: 70495782 },
  { name: "2011", count: 75149669 },
  { name: "2016", count: 79926270 }
];

// Créer l'élément SVG et le configurer
const svg = d3.select('body')
              .append('svg')
              .attr('width', width)
              .attr('height', height)
              .attr('style', 'font: 10px sans-serif')

// Créer l'échelle horizontale (fonctions D3)
const x = d3.scaleLinear()
            .domain([0, d3.max(populations, d => d.count)])
            .range([margin.left + 5, width - margin.right])
            .interpolate(d3.interpolateRound)

// Créer l'échelle verticale (fonctions D3)
const y = d3.scaleBand()
            .domain(populations.map(d => d.name))
            .range([margin.top, height - margin.bottom])
            .padding(0.1)
            .round(true)

const teinte = d3.scaleSequential()
                 .domain([0, d3.max(populations, d => d.count)])
                 .interpolator(d3.interpolateBlues)

// Ajouter les barres
svg.selectAll('rect')
     .data(populations)
     .enter()
     .append('rect')
     .attr('width', 0) // sera animé
     .attr('height', y.bandwidth())
     .attr('x', x(0))
     .attr('y', d => y(d.name))
     .style('fill', d => teinte(d.count))
     .transition()
       .duration(1000)
       .attr('width', d => x(d.count) - x(0))

// Ajouter les titres
svg.append('g')
   .attr('text-anchor', 'end')
   .attr('transform', `translate(-6, ${y.bandwidth() / 2})`)
   .selectAll('text')
     .data(populations)
     .enter()
     .append('text')
     .attr('dy', '0.35em')
     .attr('x', 0)
     .attr('y', d => y(d.name))
     .style('fill', d => d3.lab(teinte(d.count)).l < 60 ? "white" : "black")
     .text(d => d.count)
     .transition()
       .duration(1000)
       .attr('x', d => x(d.count))

// Ajouter l'échelle horizontale
svg.append('g')
   .attr('transform', `translate(0, ${margin.top})`)
   .call(d3.axisTop(x))
   .call(g => g.select('.domain').remove())

// Ajouter l'échelle verticale
svg.append('g')
   .attr('transform', `translate(${margin.left}, 0)`)
   .call(d3.axisLeft(y))
   .call(g => g.select('.domain').remove())

// Source: https://observablehq.com/@d3/learn-d3-scales