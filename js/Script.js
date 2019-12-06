 $(function() {
    $('.scroll-down').click (function() {
      $('html, body').animate({scrollTop: $('section.ok').offset().top }, 'slow');
      return false;
    });
  });

$( document ).ready(function() {
   // Check breakpoint
var order = {
  "Europe":1,
  "Asia":2,
  "Africa":3,
  "Australia":4,
  "America":5
}  

// var year = ['1896','1900','1904','1908','1912','1916','1920','1924','1928','1932','1936','1940','1944','1948','1952','1956','1960'
//             ,'1964','1968','1972','1976','1980','1984','1988','1992','1996','2000','2004','2008','2012','2016']

function breakCalc(x){
  x <= 480 ? y = 'xs' : y = 'md';
  return y;
}

var breakpoint = breakCalc($(window).width());

$(window).resize(function(){
  var breakpoint = breakCalc($(window).width());
})

// change the height of the chart depending on the breakpoint
function breakHeight(bp){
  bp == 'xs' ? y = 250 : y = 500;
  return y;
}

// function to group by multiple properties in underscore.js
_.groupByMulti = function (obj, values, context) {
    if (!values.length)
        return obj;
    var byFirst = _.groupBy(obj, values[0], context),
        rest = values.slice(1);
    for (var prop in byFirst) {
        byFirst[prop] = _.groupByMulti(byFirst[prop], rest, context);
    }
    return byFirst;
};

// function to decide whether to pluralize the word "award" in the tooltip
function awardPlural(x){
  x == 1 ? y = 'medal' : y = 'medals';
  return y;
}

// funciton to determine the century of the datapoint when displaying the tooltip
function century(x){
  x<100 ? y = '19'+x : y = '20'+(x.toString().substring(1));
  return y;
}

// function to ensure the tip doesn't hang off the side
function tipX(x){
  var winWidth = $(window).width();
  var tipWidth = $('.tip').width();
  if (breakpoint == 'xs'){
    x > winWidth - tipWidth - 20 ? y = x-tipWidth : y = x;
  } else {
    x > winWidth - tipWidth - 30 ? y = x-45-tipWidth : y = x+10;
  }
  return y;
}

// function to create the chart
function chart(column, filterBy, groupBy) {

  // basic chart dimensions 
  var margin = {top: 20, right: 10, bottom: 30, left: 10};
  var width = $('.chart-wrapper').width() - margin.left - margin.right-50;
  var height = breakHeight(breakpoint) - margin.top - margin.bottom-120;
  //console.log("width",width);
  //console.log("height",height);

  // chart top used for placing the tooltip
  var chartTop = $('.chart.'+groupBy+'.'+filterBy).offset().top;
  //console.log(chartTop)

  // tooltip
  var tooltip = d3.select("body")
      .append("div")
      .attr("class", "tip")
      .style("position", "absolute")
      .style("z-index", "20")
      .style("visibility", "hidden")
      .style("top", 40+chartTop+"px");

  // scales:
  // x is a time scale, for the horizontal axis
  // y is a linear (quantitative) scale, for the vertical axis
  // z is in ordinal scale, to determine the colors (see var colorrange, below)
  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height-10, 0]);

  // color range provided by colorbrewer
  // i just added a bunch of grays at the end so that the categories grouped as other all appear gray.
  // there's definitely a better way to do this

  //var colorrange = ['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854','#ffd92f','#e5c494','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3'];
  // var colorrange = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3','#b3b3b3'];
  var colorrange = {
                    "Europe":"#1482C6",
                    "Asia":"#FAB349",
                    "Africa":"#242021",
                    "Australia":"#17A554",                    
                    "America":"#EA1F46"
                    }
  // console.log(range(colorrange)) 

  var z = d3.scale.ordinal()
      .range(colorrange);

  // console.log(z)
  // the x-axis. note that the ticks are years, and we'll show every 5 years
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .innerTickSize(-height)
      .outerTickSize(0)
      .tickPadding(10)
      .ticks(d3.time.years, 4);

  // stacked layout. the order is reversed to get the largest value on top
  // if you change the order to inside-out, the streams get all mixed up and look cool
  // but the graph is harder to read. reversed order ensures that the streams are in the
  // same order as the legend, which improves readability in lieu of directly labelling
  // the streams (which is another programming challenge entirely)
  var stack = d3.layout.stack()
      .offset("silhouette")
      .order("input")
      .values(function(d) { return d.values; })
      .x(function(d) { 
        return d.date; })
      .y(function(d) {
        return d.value; });

  var nest = d3.nest()
      .key(function(d) { return d.key; });

  // there are some ways other than "basis" to interpolate the area between data points
  // for example, you can use "cardinal", which makes the streams a little more wiggly.
  // the drawback with that approach is that if you have years where there is no data,
  // you won't see a flat line across the center of the chart. instead, it will look all bumpy.
  // ultimately, "cardinal" interpolation is more likely to give an inaccurate represenation of the data,
  // which is anyway a danger with any type of interpolation, including "basis"
  var area = d3.svg.area()
      .interpolate("monotone")
      .x(function(d) { return x(d.date); })
      .y0(function(d) { 
        return y(d.y0)-.2; }) // -.2 to create a little space between the layers
      .y1(function(d) { 
      return y(d.y0 + d.y)+.2; }); // +.2, likewise

  var svg = d3.select(".chart."+groupBy+'.'+filterBy).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // generate a legend
  function legend(layers){

    // generate the legend title
    function titler(filter,group){

      if (group == 'Country') {
       
          return "Continent";
      }

    }

    $('.chart.'+groupBy+'.'+filterBy).prepend('<div class="legend"><div class="title">'+titler(filterBy,groupBy)+'</div></div>');
    $('.legend').hide();
    var legend = []
    layers.forEach(function(d,i){
      var obj = {};
      if (i<5){
        obj.key = d.key;
         console.log(colorrange[d.key]);
        obj.color = colorrange[d.key];
        legend.push(obj);
      }
    });

    // others
    // if (layers.length>13){legend.push({key: "Other",color: "#b3b3b3"});}

    legend.forEach(function(d,i){
      $('.chart.'+groupBy+'.'+filterBy+' .legend').append('<div class="item legendSq"><div class="swatch" style="background: '+d.color+'"></div>'+d.key+'</div>');
    });

    $('.legend').fadeIn();

  }// end legend function

  // parse the data
  function parse(data){

    // this filters and groups the data
    // based on the filters provided in the .chart div (see the html file)
    var filter;
    var searchObj = {};
    searchObj[column] = filterBy;

    if (column=="none"){
      filter=data;
    } else {
      filter = _.where(data,searchObj);
    }

    var categories = _.chain(filter)
        .countBy(groupBy)
        .pairs()
        .sortBy(1).reverse()
        .pluck(0)
        .value();

    var sort = _.sortBy(filter,categories);

    // group by
    var group = _.groupByMulti(sort, ['year', groupBy])

    var newData = [];

    // it is necessary to add an extra year to the data (as well as duplicate the data for the final year)
    // so that the chart does not get cut off on the right side
    for (var i = 1896;i<2020;i+=4){

      var currYear = group[i];

      // no data for a year
      if (currYear == undefined) {
        currYear = {};
      }

      categories.forEach(function(area){

        var obj = {};
        if (currYear[area] == undefined){
          // if the year does not have any in a particular category
          obj.key = area;
          obj.value = 0;
          obj.date = moment(i.toString())._d;
        } else {
          //console.log(currYear)
          obj.key = currYear[area][0][groupBy];
          obj.value = currYear[area].length;
          var d = new Date(currYear[area][0].year, 0, 1, 0, 0, 0, 0);
          //console.log(d)
          obj.date = d//moment(currYear[area][0].year)._d;
        }

        newData.push(obj);
      });

    }

    data = newData;// you could just return newData, but this way seems cleaner to me
    return data;
  }

  // now we call the data, as the rest of the code is dependent upon data
  d3.csv("final_dataV5.csv", function(data) {

    // parse the data (see parsing function, above)
    data = parse(data);
    console.log(data)

    // generate our layers
    var unsorted = nest.entries(data);
    unsorted.forEach(function(elem){
      elem.sortOrder = order[elem.key]
    })
    unsorted.sort(function(a,b){
      return a.sortOrder-b.sortOrder
    })

    var layers = stack(unsorted);
    
    //console.log(layers)

    // our legend is based on our layers
    legend(layers);

    // set the domains
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);

    // and now we're on to the data joins and appending
    svg.selectAll(".layer")
        .data(layers)
      .enter().append("path")
        .attr("class", "layer")
        .attr("d", function(d) { return area(d.values); })
        .style("fill", function(d, i) { return colorrange[d.key]; });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // abbreviate axis tick text on small screens
    if (breakpoint == 'xs') {

      $('.x.axis text').each(function(){
        var curTxt = $(this).text();
        var newTxt = "'"+curTxt.substr(2);
        $(this).text(newTxt);
      });

    }

    // user interaction with the layers
    svg.selectAll(".layer")
      .attr("opacity", 1)
      .on("mouseover", function(d, i) {
        svg.selectAll(".layer").transition()
          .duration(100)
          .attr("opacity", function(d, j) {
            return j != i ? 0.6 : 1;
      })})
      .on("mousemove", function(d, i) {

        var color = d3.select(this).style('fill'); // need to know the color in order to generate the swatch

        mouse = d3.mouse(this);
        mousex = mouse[0];
        var invertedx = x.invert(mousex);
        var xDate = century(invertedx.getYear());
        d.values.forEach(function(f){
          var year = (f.date.toString()).split(' ')[3];
          if (xDate == year){
              tooltip
                .style("left", tipX(mousex) +"px")
                .html( "<div class='year'>" + year + "</div><div class='key'><div style='background:" + color + "' class='swatch'>&nbsp;</div>" + f.key + "</div><div class='value'>" + f.value + " " + awardPlural((f.value)) + "</div>" )
                .style("visibility", "visible");
          }
        });
      })
      .on("mouseout", function(d, i) {
        svg.selectAll(".layer").transition()
          .duration(100)
          .attr("opacity", '1');
        tooltip.style("visibility", "hidden");
    });

    // vertical line to help orient the user while exploring the streams
    var vertical = d3.select(".chart."+groupBy+'.'+filterBy)
          .append("div")
          .attr("class", "remove")
          .style("position", "absolute")
          .style("z-index", "19")
          .style("width", "2px")
          .style("height", "90%")
          .style("top", "10px")
          .style("bottom", "30px")
          .style("left", "0px")
          .style("background", "#fcfcfc");

    d3.select(".chart."+groupBy+'.'+filterBy)
        .on("mousemove", function(){
           mousex = d3.mouse(this);
           mousex = mousex[0] + 5;
           vertical.style("left", mousex + "px" )})
        .on("mouseover", function(){
           mousex = d3.mouse(this);
           mousex = mousex[0] + 5;
           vertical.style("left", mousex + "px")});

    // Add 'curtain' rectangle to hide entire graph
    var curtain = svg.append('rect')
     .attr('x', -1 * width)
     .attr('y', -1 * height)
     .attr('height', height)
     .attr('width', width)
     .attr('class', 'curtain')
     .attr('transform', 'rotate(180)')
     .style('fill', 'white')

    // Create a shared transition for anything we're animating
    var t = svg.transition()
     .delay(100)
     .duration(1500)
     .ease('exp')
     .each('end', function() {
       d3.select('line.guide')
         .transition()
         .style('opacity', 0)
         .remove()
     });

    t.select('rect.curtain')
      .attr('width', 0);
    t.select('line.guide')
      .attr('transform', 'translate(' + width + ', 0)');

  });

}
var column = $('.chart').attr('column');
var groupBy = $('.chart').attr("groupBy");
var filterBy = $('.chart').attr("filterBy");
$('.chart').addClass(groupBy).addClass(filterBy);
chart(column,filterBy,groupBy); 

// ---------------------------------------------------------------------------------------------------


var currentCard = 0;

/*var data = [
  {"title":"Description",
   "body":"Keeping in sight the history of Olympics, we are trying to tell the history of our world in the last century. \
            When Olympics started, victories were dominated by a handful of countries namely United States, \
            Britain, France, Germany. While most of the countries were still struggling with colonial rule or monarchies, \
            these countries had already started their progress in full swing. As the time progressed, more countries started to \
            win, signaling the growth of other parts of world as well. When the olympics began, the medal winners were clustered \
            around West, but now it has spread across entire globe.But this path has not been a smooth one. There were several \
            hiccups on the way. We have picked up select moments of the last century which had their impact on entire world \
            and can also be seen through the Olympics.",
   "image":""
   },
  {"title":"Year - 1896",
   "body":"In the first Olympic games in 1896, medals were awarded to 11 teams and most of them\
            were either from Europe or from the United States. At this time, much of the world was a part of\
            European colonies and the number of teams winning Olympic medals reflects this.","left_margin":"0%",
    "image":"1896.jpg"},

  {"title":"Year - (1914 - 1918)",
   "body":"The sixth olympic games were due to be held in Berlin in 1916, but due to the \
            raging war across the globe, games were cancelled.","left_margin":"16%",
    "image":"ww1.jpg"},

  {"title":"Year - (1920 & 1924)",
   "body":"In 1920 Olympics were awarded to Antwerp in hopes of bringing a spirit of renewal to Belgium,
             which had been devastated during World War I. The defeated countries—Germany, Austria, Hungary, Bulgaria, and 
             Turkey—were not invited. While all other banned nations were invited back in 1924, Germany was again not invited.","left_margin":"20.8%",
    "image":"1924.jpg"},

  {"title":"Year - (1939 - 1945)",
   "body":"The 1940 Olympic Games were originally set to be hosted by Tokyo. However, 
            the Japanese pulled out in 1938, due to the Second Sino-Japanese War, which broke out in 1937. The Games were then awarded to 
            the runners-up in the original bidding process, Helsinki. The Games were cancelled for a second time when 
            the Winter War broke out between Finland and the Soviet Union. After this, the Games were then suspended 
            indefinitely, whilst the Second World War played out. The Olympics did not take place again until 1948.   ","left_margin":"36.9%",
    "image":"Atomic-Bomb-US.jpg"},

  {"title":"Year - 1948",
   "body":"The summer games were held in London when they resumed in 1948. Because of post-war conditions, \
            the 1948 Olympics were called the “Austerity Games.” Athletes were asked to bring their own towels. Germany and Japan, \
            the Axis powers in World War II, were not invited to the 1948 Games. ","left_margin":"41.5%",
    "image":"1948.jpg"},

  {"title":"Year - 1980",
   "body":"Soviet Union invaded Afghanistan in 1979, as a sign of protest, the U.S. boycotted the Summer Olympics \
            when they were held in Moscow in 1980.","left_margin":"67.2%",
    "image":"1980.jpg"},

  {"title":"Year - 1984",
   "body":"The Soviets led a counter-boycott when the Games were held in 1984 in Los Angeles. 1984 also marked the\
            entry  of China back in summer olympics. Since then, China has won medals in every olympics and have been constantly growing.","left_margin":"70.65%",
    "image":"1980.jpg"},

  {"title":"Year 2016",
   "body":"The olympics has come a long way, from just 20 counries winning medals in 1896 to 86 countries winning medals\
            in 2016. If we compare at continent level - Asia shows the most growth.","left_margin":"96%",
    "image":"2016.jpg"}
]*/

$('.title_card').text(data[0].title);
$('.body_card').text(data[0].body);

$(".arrow-left").click(function() {
  if(currentCard>0) currentCard-=1
  if(currentCard === 0) $('.vl').css("opacity", 0);
  else $('.vl').css("opacity", 0.2);

    $('.body_card').text(data[currentCard].body) 
    $('.title_card').text(data[currentCard].title)
    $(".img").attr("src",data[currentCard].image);
    $('.vl').css("margin-left", data[currentCard].left_margin);
});


$(".arrow-right").click(function() {
  if(currentCard<8) currentCard+=1
  if(currentCard === 0) $('.vl').css("opacity", 0);
  else $('.vl').css("opacity", 0.2);
    
   $('.body_card').text(data[currentCard].body) 
   $('.title_card').text(data[currentCard].title)
   $(".img").attr("src",data[currentCard].image);
   $('.vl').css('margin-left',data[currentCard].left_margin);
});

});
