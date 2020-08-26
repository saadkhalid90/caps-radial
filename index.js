const data = [
  {country: "Vietnam", value: 56},
  {country: "Thailand", value: 87}
]
function draw(data, colArr) {
  // function that helps us draw the arc
  const svgWidth = 500;
  const svgHeight = 500;
  const innerOutRad = [[220, 250], [180, 210]];
  const innerOutRadAvg = innerOutRad.map(d => d3.mean(d));

  const arc1 = d3.arc()
                .innerRadius(220)
              	.outerRadius(250)
                .cornerRadius(0);

  const arc2 = d3.arc()
                .innerRadius(180)
              	.outerRadius(210)
                .cornerRadius(0);



  const arcs = [arc1, arc2];

  const svgG = d3.select('svg.radialBars')
                  .append('g')
                  .attr('transform', `translate(${svgWidth/2}, ${svgHeight/2})`);

  svgG.selectAll('path.bG')
      .data(data)
      .enter()
      .append('path')
      .attr('class', 'bG')
      .attr('d', (d, i) => arcs[i]({
        innerRadius: 0,
        outerRadius: 100,
        startAngle: 0,
        endAngle: (Math.PI*3/2)
      }))
      .style('fill', 'none')
      .style('stroke', 'grey')
      .style('stroke-width', '2px');

  const filledArcs = svgG.selectAll('path.fillArc')
      .data(data)
      .enter()
      .append('path')
      .attr('class', 'fillArc')
      .attr('d', (d, i) => arcs[i]({
        innerRadius: 0,
        outerRadius: 100,
        startAngle: 0,
        endAngle: 0//(Math.PI*3/2) * (d.value/ 100)
      }))
      .style('fill', (d, i) => colArr[i]);


  const countryTitles = svgG.selectAll('text')
                            .data(data)
                            .enter()
                            .append('text')
                            .attr('transform', (d, i) => `translate(${-10}, -${innerOutRadAvg[i] - 6})`)
                            .text(d => `${d.country} - ${d.value}%` )
                            .style('fill', 'black')
                            .style('font-family', "'Roboto', sans-serif")
                            .style('font-size', '20px')
                            .style('text-anchor', 'end');


  // animating filled arcs
  filledArcs.transition()
      .duration(1000)
      .attrTween('d', (d, i) => {
        return function(t) {
          const interp = d3.interpolate({
            innerRadius: 0,
            outerRadius: 100,
            startAngle: 0,
            endAngle: 0//(Math.PI*3/2) * (d.value/ 100)
          },
          {
            innerRadius: 0,
            outerRadius: 100,
            startAngle: 0,
            endAngle: (Math.PI*3/2) * (d.value/ 100)
          })

          return arcs[i](interp(t));
        }
      });



}

draw(data, ['teal', 'purple']);
