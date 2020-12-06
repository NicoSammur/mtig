// visualizacion
// 1. https://plnkr.co/edit/Rsh5BqNcuP0kdCpD?preview

document.addEventListener('DOMContentLoaded', function () {

// Seteamos el nombre del archivo del dataset
var url = 'covid_rango_etario.csv'

// Leemos el archivo
d3.csv(url, function(error, data){
    // Cambiamos toda la info del dataset a número positivo
    data.forEach(function (d) {
      d.hombres = parseInt(d.Hombres);
      d.mujeres = parseInt(d.Mujeres);
      d.total = d.hombres+d.mujeres;
    });
   
   // Configuramos el tamaño y margen de la visualización
    var margin = {top: 65, bottom: 90, left: 80, right: 30}, axisPadding = 10;
    var Width = 800, Height = 400;
    var svgWidth = Width + margin.left + margin.right,
        svgHeight = Height + margin.top + margin.bottom;
    var maxTotal = d3.max(data, function(d){ return d.total; });
    
    
   // Configuramos las escalas y los ejes
    var xScale = d3.scale.ordinal()
        .domain(data.map(function(d){ return d.Rango; }))
        .rangeBands([0, Width], 0.2);
    var yScale = d3.scale.linear()
        .domain([0, maxTotal])
        .range([0, Height]);
    var color = d3.scale.category20();
    
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickSize(0,0)
        .orient('bottom');
    var yAxis = d3.svg.axis()
        .scale(yScale.copy().domain([maxTotal, 0]))
        .tickSize(6,0)
        .ticks(10)
        .orient('left');
    
    // Creamos el objeto SVG (la visualización, inicialmente vacía)
    var svg = d3.select('#graficoBarras')
        .append('svg')
        .attr({width: svgWidth, height: svgHeight})
    
    
    // Dibujamos los ejes
    var xGroup = svg.append('g')
        .attr('class', 'xGroup')
        .attr('transform', 'translate(' + [margin.left, margin.top + Height + 35 +axisPadding] + ')');
    // Labels del eje X
    xGroup.call(xAxis)
       .selectAll("text")
       .attr('transform', 'rotate(-65)')    
       .attr('x', '-10')
       .attr('y', '-25')

    styleAxis(xGroup);
    var yGroup = svg.append('g')
        .attr('class', 'yGroup')
        .attr('transform', 'translate(' + [margin.left - axisPadding, margin.top] + ')');
    yGroup.call(yAxis);
    styleAxis(yGroup);


    // Escribimos título y label (nombres de los ejes)
    var label = svg.append('g')
        .attr('transform', 'translate(' + [margin.left - axisPadding, margin.top] + ')');
    label.append('text')
        .text('Numero de casos')
        .attr('transform', 'rotate(-90)')
        .attr({
            'text-anchor': 'start',
            x: -112,
            y: 20,
        })
    label.append('text')
        .text('Cantidad de casos por rango etario')
        .attr('transform', 'translate(' + [Width / 2, - margin.top / 2] + ')')
        .attr({
            'text-anchor': 'middle',
            'font-size': '16px',
            fill: 'black',
        });


    // Agregamos las barras
    var graph = svg.append('g')
        .attr('class', 'graph')
        .attr('transform', 'translate(' + [margin.left, + margin.top + Height] + ')');
    var bars = graph.selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .attr('transform', function(d,i){ return 'translate(' + [xScale(d.Rango), -1 * yScale(d.total)] + ')'; });
    bars.append('rect')
        .each(function(d,i){
            d3.select(this).attr({
                // Le damos un color distinto a cada uno
                fill: color.range()[i],
                width: xScale.rangeBand(),
                height: yScale(d.total),
            })
        })
        // Cuando pasa el mouse por encima, se ejecuta la función mouseover
        .on('mouseover', mouseover)
        // Cuando el mouse se mueve, se ejecuta la función mousemove
        .on('mousemove', mousemove)
        // Cuando el mouse se va de la visualización, se ejecuta la función mouseout
        .on('mouseout', mouseout);
    
    bars.append('text')
    .text(function(d){ return d.total; })
    .each(function(d,i){
        d3.select(this).attr({
            fill: color.range()[i],
            stroke: 'none',
            x: xScale.rangeBand() / 2,
            y: -5,
            'text-anchor': 'middle',
        });
    })
    
    
    // Funciones de Tooltips
    var div = d3.select('#graficoBarras').append('div')
        .attr('class', 'tooltip')
        .style('display', 'none');
    
    function mouseover(){
        // Se muestra el box de la información
        div.style('display', 'inline');
    }
    function mousemove(){
        // Se mueve el box de la información con la información dentro
        var d = d3.select(this).data()[0]
        div
            .html(d.Rango + '<hr/>' + '👨 Hombres:' + d.hombres + '<br>👩 Mujeres:' + d.mujeres)
            .style('left', (d3.event.pageX - 34) + 'px')
            .style('top', (d3.event.pageY - 12) + 'px');
    }
    function mouseout(){
        // Se desaparece el box de la información

        div.style('display', 'none');
    }
})


function styleAxis(axis){
    // style path
    axis.select('.domain').attr({
        fill: 'none',
        stroke: '#888',
        'stroke-width': 1
    });
    // style tick
    axis.selectAll('.tick line').attr({
        stroke: '#888',
        'stroke-width': 1,
    })
}
});