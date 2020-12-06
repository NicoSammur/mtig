//  visualizacion: 
// 1. https://www.d3-graph-gallery.com/graph/bubble_color.html
// 2. http://plnkr.co/edit/qTlidYpavVXqqMZM?preview

// set the dimensions and margins of the graph
var margin = {top: 10, right: 20, bottom: 30, left: 50},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#graficoBurbujas")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Titulo 
svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 10 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text("Correlación países, handwashing_facilities y life_expectancy​");

//Read the data
d3.csv("covid_mundial.csv", function(data) {

  // Add X axis
  var x = d3.scaleLinear()
    .domain([50, 80])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    
    .call(d3.axisBottom(x));

// Label del eje Y
svg.append("text")
      .attr("text-anchor", "start")
      .attr("x", -250)
      .attr("y", -30 )
      .text("Handwashing facilities")
      .attr('transform', 'rotate(-90)')

// Label del eje X
svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Life expectancy");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([-5, 100])
    .range([ height, 0]);
  svg.append("g")
  
    .call(d3.axisLeft(y));

  // Add a scale for bubble size
  var z = d3.scaleLinear()
    .domain([0, 100])
    .range([ 4, 19999]);

  // Add a scale for bubble color
  var myColor = d3.scaleOrdinal()
    .domain(["Asia", "Africa", "Europe", "North America", "South America"])
    .range(d3.schemeSet1);

  // -1- Create a tooltip div that is hidden by default:
  var tooltip = d3.select("#graficoBurbujas")
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "30px")
      .style("color", "white")

  // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
  var showTooltip = function(d) {
    tooltip
      .transition()
      .duration(200)
    // Toda la informacion del dataset de covid_mundial.csv
    tooltip
      .style("opacity", 1)
      .html("Location: " + d.location +
            "<br> Continent: " + d.continent +
            "<br> Life expectancy: " + d.life_expectancy +
            "<br> Handwashing facilities: " + d.handwashing_facilities +
            "<br> Total deaths: " + d.total_deaths +
            "<br> Total cases: " + d.total_cases +
            "<br> Total deaths / Total cases: " + d.total_deaths_devided_by_total_cases )

      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  var moveTooltip = function(d) {
    tooltip
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  var hideTooltip = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", "bubbles")
      .attr("cx", function (d) { return x(d.life_expectancy); } )
      .attr("cy", function (d) { return y(d.handwashing_facilities); } )
      .attr("r", function (d) { return z(d.total_deaths_devided_by_total_cases); } )
      .style("fill", function (d) { return myColor(d.continent); } )
    // -3- Trigger the functions
    .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip )

  })


