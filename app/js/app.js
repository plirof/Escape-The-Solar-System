jQuery(document).ready ( function () {
  // shim layer with setTimeout fallback
  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
      window.webkitRequestAnimationFrame       ||
      window.mozRequestAnimationFrame          ||
        function( callback ){
          window.setTimeout(callback, 1000 / 60);
        };
  })();
  
  var canvas, context, toggle, starSize,canvasHeight,canvasWidth,stageX,stageY;
  var cloudsArr = [];
  var starsArr = [];
  var planetSegments = [];
  var buildingLocations = [];
  var pulsate;
  var planetPosition = 0;
  var gameTime = 12345678;
  var unit =0;
  var generation =0;
  var food =0;
  var screenDepth;
  var drawmenu = false;
  var alpha = 1;
  var alpha2 = 0.8;
  var targetPlanet = "saturn";

  init();

  (function animloop(){
    requestAnimFrame(animloop);
    render();
  })();
  
  function init() {
    canvasWidth = jQuery('body').width();
    canvasHeight = jQuery('body').height();
    createBackgound();
    createPlanetSegments();
    canvas = document.createElement( 'canvas' );
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    screenDepth = planets[targetPlanet].size;

    unit = canvasWidth / 300;
    pulsate = canvasWidth/4.5;
    window.addEventListener("mousedown", mouseClick, true);
    window.addEventListener( "keydown", doKeyDown, true);
    canvas.addEventListener( "mousemove", mouseOver, true);

    context = canvas.getContext( '2d' );
    context.fillStyle = "black";
    context.rect(0, 0, canvasWidth, canvasHeight);
    context.fill();

    document.body.appendChild( canvas );
  }

  function mouseOver (e) {
    console.log(e);
    var location = planetSegments[8][0];
    var x = (Math.sin( planetPosition +location) * (stageX / 2.2)) + canvasWidth / 2;
    var y = (Math.cos( planetPosition+location) * (stageX / 2.2)) + stageY ;
      

    if(e.x > (x-(unit*2)) && e.x < (x+(unit*2)) && e.y < (y +(unit*2)) && e.y > (y-(unit*2)) ){
                drawmenu = true;
    }else{
      drawmenu = false;
    }
  }
  function drawMenu (draw, info) {
    var location = planetSegments[8][0];
    var x = (Math.sin( planetPosition +location) * (stageX / 2.2)) + canvasWidth / 2;
    var y = (Math.cos( planetPosition+location) * (stageX / 2.2)) + stageY ;
      var r = -(planetPosition + location);
    if(drawmenu){
      context.fillStyle = 'white';
      context.beginPath();
      context.rect(x, y, 20, 30);
      context.closePath();
      context.fill();
    }
  }
  function doKeyDown (e) {
    //left
    if(e.keyCode == 37){
      planetPosition += 0.05;
    }
    //right
    if (e.keyCode == 39) {

      planetPosition -= 0.05;
    }
    //down 40
    if (e.keyCode == 40) {
      if(screenDepth  > 0.05)
      {
      screenDepth -= 0.05;
      }
    }
    //up 38
    if (e.keyCode == 38) {
      if(screenDepth  < 1.2)
      {
      screenDepth += 0.05;
    }

    }
  }

  function render() {
    if(context){
      context.clearRect(0,0,canvasWidth,canvasHeight);
      drawBackground();

      stageX = canvasWidth * screenDepth;
      unit = (stageX / 300 );

      stageY = canvasHeight * screenDepth;
      if(stageY > (canvasHeight/2))
      {
      stageY = stageY;
      }else{
        stageY = canvasHeight/2;
      }
      
      if(screenDepth >= 0.3){

        drawPlanet(context);
        drawWorkforce();
        drawLab();
        drawFactory();
        drawSections();
      }else{
        drawSun();
        drawSolarSystem();
        /*drawEarth();
        drawMars();
        drawJupiter();
        drawSaturn();*/
      }
      drawMenu();
      drawDashboard();
    }
  }
  
  function createBackgound () {
    for (i = 0; i <= 1000; i++) {
      var star = [];
      // Get random positions for stars.
      var x = Math.floor(Math.random() * (canvasWidth - 1));
      var y = Math.floor(Math.random() * (canvasHeight - 1));
      toggle = !toggle;

      starSize = toggle ? 0.8 :  0.2;
      starColour = toggle ? 'white' :  'aqua';

      star.push(x,y,starSize,starColour);
      starsArr.push(star);
    }
    for (i = 0; i <= 70; i++) {
      var cloud = [];
      // Get random positions for stars.
      var size = (Math.random() * 1 + 0.5).toFixed(3);
      var speed = (Math.random()*0.00001+0.000001).toFixed(8);
      toggle = !toggle;

      var direction = toggle;

      cloud.push(size,speed,direction);
      cloudsArr.push(cloud);
    }
  }

  function drawSun() {

    
    var colour = "rgba(255, 255, 0, " + alpha +")";
    var colour2 = "rgba(255, 255, 0, " + alpha2 +")";
    pulsate += 0.2;
    
        context.beginPath();    
        context.fillStyle = colour;
        context.arc( -(canvasHeight/4), canvasHeight /2, pulsate, 0, Math.PI * 5, true );
        context.closePath();
        context.fill(); 

        context.beginPath();    
        context.fillStyle = colour2;
        context.arc( -(canvasHeight/4), canvasHeight /2, pulsate /0.9, 0, Math.PI * 5, true );
        context.closePath();
        context.fill(); 
      
      if (pulsate >= canvasWidth/3.5) {
        pulsate = canvasWidth/4.5;
        alpha = 0.8;
        alpha2 = 0.8;
      }
      context.fillStyle = 'gold';
      context.beginPath();
      context.arc( -(canvasHeight/4) , canvasHeight /2, canvasWidth/4, 0, Math.PI * 5, true );
      context.closePath();
      context.fill(); 

      alpha  -= 0.00219;
      alpha2 -= 0.0029;
    
  }

  function createPlanetSegments () {
    
    for (var i = 0; i <= 17; i++) {
      var radians = (i / 90 * Math.PI) * 10;
      var planetSegment =[];
      planetSegment.push(radians, false);
      planetSegments.push(planetSegment);

    };
  }

  function drawBackground() {
    for (var arr in starsArr) {
      for (var i = 0; i < starsArr[arr].length; i++) {
        // Draw an individual star.
        context.fillStyle = starsArr[arr][3];
        context.beginPath();
        context.rect(starsArr[arr][0], starsArr[arr][1], starsArr[arr][2], starsArr[arr][2]);
        context.closePath();
        context.fill();
      }
    }
  }

  function drawSolarSystem () {
    //draw target planet last
    for(var obj in planets){
      if(obj != targetPlanet) {
        var grd = context.createRadialGradient(canvasWidth/planets[obj].distance, stageY, stageX / planets[obj].build[0][3], canvasWidth/2, canvasHeight, canvasWidth/2);
        grd.addColorStop(0,planets[obj].build[0][1]);
        grd.addColorStop(1,planets[obj].build[0][2]);
        context.beginPath();    
        context.fillStyle = grd;
        context.arc( canvasWidth / planets[obj].distance , canvasHeight/2, canvasWidth / (2 / planets[obj].size), 0, Math.PI * 5, true );
        context.closePath();
        context.fill(); 

        grd = context.createRadialGradient(canvasWidth/planets[obj].distance, stageY, stageX/planets[obj].build[0][3], canvasWidth/2, canvasHeight, canvasWidth/2);
        grd.addColorStop(0,planets[obj].build[1][1]);
        grd.addColorStop(1,planets[obj].build[1][2]);
        context.beginPath();    
        context.fillStyle = grd;
        context.arc( canvasWidth / planets[obj].distance , canvasHeight/2, canvasWidth / (2.3 / planets[obj].size), 0, Math.PI * 5, true );
        context.closePath();
        context.fill(); 
      }
      //draw target planet
      grd = context.createRadialGradient(canvasWidth/planets[targetPlanet].distance, stageY, stageX / planets[targetPlanet].build[0][3], canvasWidth/2, canvasHeight, canvasWidth/2);
      grd.addColorStop(0,planets[targetPlanet].build[0][1]);
      grd.addColorStop(1,planets[targetPlanet].build[0][2]);
      context.beginPath();    
      context.fillStyle = grd;
      context.arc( canvasWidth / planets[targetPlanet].distance , stageY, stageX / 2.8, 0, Math.PI * 5, true );
      context.closePath();
      context.fill(); 

      grd = context.createRadialGradient(canvasWidth/planets[targetPlanet].distance, stageY, stageX/planets[targetPlanet].build[0][3], canvasWidth/2, canvasHeight, canvasWidth/2);
      grd.addColorStop(0,planets[targetPlanet].build[1][1]);
      grd.addColorStop(1,planets[targetPlanet].build[1][2]);
      context.beginPath();    
      context.fillStyle = grd;
      context.arc( canvasWidth / planets[targetPlanet].distance , stageY, stageX / planets[targetPlanet].build[1][3], 0, Math.PI * 5, true );
      context.closePath();
      context.fill(); 
    }
    
  }
  /*function drawEarth() {
    var grd = context.createRadialGradient(canvasWidth/2.2, stageY, stageX/planets[targetPlanet].build[2][3,] canvasWidth/2, canvasHeight, canvasWidth/2);
    grd.addColorStop(0,"rgba(10, 255, 100, 1)");
    grd.addColorStop(1,"green");
    context.beginPath();    
    context.fillStyle = grd;
    if(targetPlanet == "earth"){
      context.arc( canvasWidth / 2.2 , stageY, stageX / 2.3, 0, Math.PI * 5, true );
    }else{
      context.arc( canvasWidth / 2.2 , canvasHeight/2, canvasWidth / 120, 0, Math.PI * 5, true );
    }
    context.closePath();
    context.fill(); 
    
    grd = context.createRadialGradient(canvasWidth/2.3, stageY, stageX/2.2, canvasWidth/2, canvasHeight, canvasWidth/2);
    grd.addColorStop(0,"rgba(102, 255, 255, 0.5)");
    grd.addColorStop(1,"rgba(102, 255, 255, 0.1)");
    context.beginPath();    
    context.fillStyle = grd;
    if(targetPlanet == "earth"){
      context.arc( canvasWidth/2.2 , stageY, stageX / 2.2, 0, Math.PI * 5, true );
    }else{
      context.arc( canvasWidth/2.2 , canvasHeight/2, canvasWidth / 135, 0, Math.PI * 5, true );
    }
    context.closePath();
    context.fill(); 

    
  }
function drawMars() {
    var grd = context.createRadialGradient(canvasWidth/2.5, canvasHeight/2, canvasWidth/2.5, canvasWidth/2, canvasHeight, canvasWidth/2);
    grd.addColorStop(0,"rgba(255, 0, 0, 1)");
    grd.addColorStop(1,"brown");
    context.beginPath();    
    context.fillStyle = grd;
    if(targetPlanet == "mars"){
      context.arc( canvasWidth / 2.5 , stageY, stageX / 2.8, 0, Math.PI * 5, true );
    }else{
      context.arc( canvasWidth / 2.5 , canvasHeight/2, canvasWidth / 120, 0, Math.PI * 5, true );
    }
    context.closePath();
    context.fill(); 
    
    grd = context.createRadialGradient(canvasWidth/2.5, canvasHeight/2, canvasWidth/2.2, canvasWidth/2, canvasHeight, canvasWidth/2);
    grd.addColorStop(0,"rgba(255, 100, 0, 0.8)");
    grd.addColorStop(1,"rgba(255, 100, 0, 0.5)");
    context.beginPath();    
    context.fillStyle = grd;
    if(targetPlanet == "mars"){
      context.arc( canvasWidth / 2.5 , stageY, stageX / 2.5, 0, Math.PI * 5, true );
    }else{
      context.arc( canvasWidth / 2.5 , canvasHeight/2, canvasWidth / 130, 0, Math.PI * 5, true );
    }
    context.closePath();
    context.fill(); 
  }


  function drawJupiter() {
    var grd = context.createRadialGradient(canvasWidth/3, canvasHeight/2, canvasWidth/2.5, canvasWidth/2, canvasHeight, canvasWidth/2);
    grd.addColorStop(0,"rgba(255, 100, 0, 1)");
    grd.addColorStop(1,"orange");
    context.beginPath();    
    context.fillStyle = grd;
    if(targetPlanet == "jupiter"){
      context.arc( canvasWidth / 1.8 , stageY, stageX / 2.4, 0, Math.PI * 5, true );
    }else{
      context.arc( canvasWidth / 1.8 , canvasHeight/2, canvasWidth / 50, 0, Math.PI * 5, true );
    }
    context.closePath();
    context.fill(); 
    
    grd = context.createRadialGradient(canvasWidth/3, canvasHeight/2, canvasWidth/2.2, canvasWidth/2, canvasHeight, canvasWidth/2);
    grd.addColorStop(0,"rgba(255, 100, 0, 0.8)");
    grd.addColorStop(1,"rgba(255, 100, 0, 0.5)");
    context.beginPath();    
    context.fillStyle = grd;
    if(targetPlanet == "jupiter"){
      context.arc( canvasWidth / 1.8 , stageY, stageX / 2.2, 0, Math.PI * 5, true );
    }else{
      context.arc( canvasWidth / 1.8 , canvasHeight/2, canvasWidth / 52, 0, Math.PI * 5, true );
    }
    context.closePath();
    context.fill(); 
  }

  function drawSaturn() {
    var grd = context.createRadialGradient(canvasWidth/1.6, canvasHeight/2, canvasWidth/2.5, canvasWidth/1.6, canvasHeight, canvasWidth/2);
    grd.addColorStop(0,"rgba(255, 100, 0, 1)");
    grd.addColorStop(1,"grey");
    context.beginPath();    
    context.fillStyle = grd;
    if(targetPlanet == "saturn"){
      context.arc( canvasWidth / 1.6 , stageY, stageX / 2.4, 0, Math.PI * 5, true );
    }else{
      context.arc( canvasWidth / 1.6 , canvasHeight/2, canvasWidth / 50, 0, Math.PI * 5, true );
    }
    context.closePath();
    context.fill(); 
    
    grd = context.createRadialGradient(canvasWidth/1.6, canvasHeight/2, canvasWidth/2.2, canvasWidth/1.6, canvasHeight, canvasWidth/2);
    grd.addColorStop(0,"rgba(191, 193, 194, 0.2)");
    grd.addColorStop(1,"rgba(191, 193, 194, 0.5)");
    context.beginPath();    
    context.fillStyle = grd;
    if(targetPlanet == "saturn"){
      context.arc( canvasWidth / 1.6 , stageY, stageX / 1.8, 0, Math.PI * 5, true );
    }else{
      context.arc( canvasWidth / 1.6 , canvasHeight/2, canvasWidth / 52, 0, Math.PI * 5, true );
    }
    context.closePath();
    context.fill(); 
  }*/

  function drawPlanet(context) {
    var planetArr = planets[targetPlanet].build;
    for(var arr in planetArr){
      var layerName = planetArr[arr][0],
          gradColour1 = planetArr[arr][1],
          gradColour2 = planetArr[arr][2],
          gradRadius = planetArr[arr][3],
          layerRadius = planetArr[arr][4];
      var grd = context.createRadialGradient(canvasWidth/2, stageY, stageX/gradRadius, canvasWidth/2, stageY, stageX/(gradRadius*0.1));
      grd.addColorStop(0,gradColour1);
      grd.addColorStop(1,gradColour2);

      context.beginPath();
      context.fillStyle = grd;
      context.arc( canvasWidth / 2, stageY, stageX / layerRadius, 0, Math.PI * 5, true );
      context.fill();
      context.closePath();
    }
    if(planets[targetPlanet].atmosphere.exists){

        drawClouds(planets[targetPlanet].atmosphere.colour,planets[targetPlanet].atmosphere.size);
    }

    drawResources(planets[targetPlanet].productionResources);
    drawResources(planets[targetPlanet].luxuryResources);
  }

  function drawClouds(colour,size){
    for(var arr in cloudsArr){
      for (var i = 0; i < cloudsArr[arr].length; i++) {
        var cloudSize = cloudsArr[arr][0],
            cloudSpeed = cloudsArr[arr][1],
            antiClockwise = cloudsArr[arr][2];
        var time = (gameTime * cloudSpeed) + planetPosition;
        
        if(antiClockwise){
        	time = -time;
        }

        var cloudx = Math.sin( time ) * ((stageX / 2.12) + (cloudSize * (unit*3) ) )+ canvasWidth / 2;
        var cloudy = Math.cos( time ) * ((stageX / 2.12) + (cloudSize  * (unit*3) ) )+ stageY;

        var cloud2x = Math.sin( time - unit/2 ) * unit + cloudx;
        var cloud2y = Math.cos( time - unit/2 ) * unit + cloudy;

        var cloud3x = Math.sin( time + unit/2 ) * unit + cloudx;
        var cloud3y = Math.cos( time + unit/2 ) * unit + cloudy;

        context.fillStyle = "rgba(255, 255, 255, 0.3)";

        context.beginPath();
        context.arc( cloudx, cloudy, cloudSize*unit, 0, Math.PI * 5, true );
        context.closePath();

        context.fill();

        context.beginPath();
        context.arc( cloud2x, cloud2y, cloudSize*unit / 2, 0, Math.PI * 5, true );
        context.closePath();

        context.fill();

        context.beginPath();
        context.arc( cloud3x, cloud3y, cloudSize*unit /1.5, 0, Math.PI * 5, true );
        context.closePath();

        context.fill();
      }
    }
  }

  function drawResources (resource) {
    
    var name = resource.name;
    var colour = resource.colour;
    var location = resource.location;
    var depth = resource.depth;

    for(var arr in resource.build){

     // check that the referenced property exists at each level of the array.
      //if(resource.build[arr] && resource.build[arr][0]) {
       // var location = resource.build[arr][0];
     // }
      var r = -(planetPosition + location);
      var x = ((Math.sin( planetPosition + location ) * (stageX / depth)) + canvasWidth / 2) ;
      var y = ((Math.cos( planetPosition + location ) * (stageX / depth)) + stageY);
          context.save();
          context.beginPath();
          context.translate(x,y);
          context.rotate(r);
          context.rect((unit*resource.build[arr][0]),(unit*resource.build[arr][1]),(unit*resource.build[arr][2]),(unit*resource.build[arr][2]));
          context.fillStyle=colour;
          context.fill();
          context.restore();
    }

  }

  function drawFactory () {
    var location = planetSegments[4][0];
    var x = (Math.sin( planetPosition+location) * (stageX / 2.2)) + canvasWidth / 2;
    var y = (Math.cos( planetPosition+location) * (stageX / 2.2)) + stageY ;
    var r = -(planetPosition +location);
    
    context.save();
    context.beginPath();
    context.translate(x,y);
    context.rotate(r);
    //factory
    context.rect(-(unit*5),0,(unit*8),(unit*2));
    context.rect(-(unit*5),0,unit,(unit*6));
    //factory roof
    context.moveTo(-(unit*3),(unit*2));
    context.lineTo(-(unit*3),(unit*4));
    context.lineTo(0,(unit*2));
    context.moveTo(0,(unit*2));
    context.lineTo(0,(unit*4));
    context.lineTo((unit*3),(unit*2));
    //mine
    if(generation>1){ context.rect(0,-(unit*10),(unit/2),(unit*10)); }
    if(generation>3){ context.rect(-(unit*5),-(unit*10),(unit*14),(unit/2)); }
    if(generation>5){ context.rect(-(unit*7),-(unit*10),(unit*6),(unit/2)); }
    if(generation>7){ context.rect(-(unit*3),-(unit*30),(unit/2),(unit*20)); }
    if(generation>9){ context.rect(-(unit*3),-(unit*30),(unit*4),(unit/2)); }

    context.fillStyle="#FF0000";
    context.fill();
    context.restore();
  }

  function drawLab () {
    var location = planetSegments[3][0];
    var x = (Math.sin( planetPosition+location) * (stageX / 2.2)) + canvasWidth / 2;
    var y = (Math.cos( planetPosition+location) * (stageX / 2.2)) + stageY ;
    var r = -(planetPosition +location);
    
    context.save();
    context.beginPath();
    context.translate(x,y);
    context.rotate(r);
    if(generation==1){
    context.rect(-(unit*5),0,(unit*10),unit);
    //roof
    }
    if(generation==2){
    context.rect(-(unit*5),0,(unit*10),(unit*2));
    //roof
    }
    if(generation==3){
    context.rect(-(unit*5),0,(unit*10),(unit*3));
    //roof
    }
    if(generation>3){
    context.rect(-(unit*5),0,(unit*10),(unit*4));
    //roof
    }
  if(generation>9){
    context.moveTo(-(unit*5),(unit*4));
    context.lineTo((unit*4),(unit*5));
    context.lineTo((unit*5),(unit*4));
    }
    context.fillStyle="blue";
    context.fill();
    context.restore();
  }

  function drawWorkforce () {
    var citizenArray = gameData.planet[targetPlanet].workforce.locations;
    for(var arr in citizenArray){
      var position = citizenArray[arr][0],
          buildingPosition = citizenArray[arr][1],
          buildingWidth = citizenArray[arr][2],
          buildingHeight = citizenArray[arr][3];

      var location = position;
      var x = (Math.sin( planetPosition+location) * (stageX / 2.2)) + canvasWidth / 2;
      var y = (Math.cos( planetPosition+location) * (stageX / 2.2)) + stageY ;
      var r = -(planetPosition +location);

      context.save();
      context.beginPath();
      context.translate(x,y);
      context.rotate(r);

      context.rect(unit*buildingPosition,-((unit*buildingPosition)/16),(unit*buildingWidth),(unit*buildingHeight));

      context.fillStyle="green";
      context.fill();
      context.restore();

      if(food > 1){
        var ranPos = (Math.random()*10+ 1).toFixed(8);
        var ranHeight = (Math.random()*10+1).toFixed(8);
        var newCititzens = [position, ranPos, 1.5, ranHeight];
        citizenArray.push(newCititzens);
        food = 0;
        console.log(gameData.planet[targetPlanet].workforce.locations);
      }

    }

  }

  function drawSections () {  
    for(var arr in planetSegments){
      for (var i = 0; i < planetSegments[arr].length; i++) {
        var location = planetSegments[arr][0],
            occupied = planetSegments[arr][1];

        var x = (Math.sin( planetPosition +location) * (stageX / 2.2)) + canvasWidth / 2;
        var y = (Math.cos( planetPosition+location) * (stageX / 2.2)) + stageY ;
      var r = -(planetPosition +location);

        context.save();
        context.beginPath();
        context.translate(x,y);
        context.rotate(r);    
        context.fillStyle = "rgba(50, 0, 60, 0.3)";
        context.rect(-(unit*2),-(unit*2),unit*4,(unit*4));
        context.closePath();
        context.fill(); 
        context.restore();

        context.save();
        context.beginPath();
        context.translate(x,y);
        context.rotate(r);    
        context.fillStyle = "rgba(50, 0, 60, 1)";
        context.rect(-unit,-unit,unit*2,(unit*2));
        context.closePath();
        context.fill(); 
        context.restore();
      }
    }
    

  }

  function drawDashboard () {
    //dashboard
    context.beginPath();
    context.fillStyle="#333";
    context.fillRect(0,0,canvasWidth,50);
    context.fill();

    //generation text
    context.beginPath();
    context.fillStyle="#fff";
    context.fillRect(canvasWidth / 2 - 75,5,250,40);
    context.fill();

    context.beginPath();
    context.fillStyle="#000";
    context.font="30px Arial";
    var gameText = "Generation: " + generation;
    context.fillText(gameText,canvasWidth / 2 - 45,45)
    context.fill();

    //planet text
    context.beginPath();
    context.fillStyle="#fff";
    context.fillRect(canvasWidth / 4 - 75,5,250,40);
    context.fill();

    context.beginPath();
    context.fillStyle="#000";
    context.font="30px Arial";
    var planetText = "target: " + targetPlanet;
    context.fillText(planetText,canvasWidth / 4 - 45,45)
    context.fill();

    //next turn
    context.save();
    context.beginPath();
    //context.translate(canvasWidth/2,canvasHeight-90);
    context.rect(canvasWidth-(unit*39),canvasHeight-(unit*15),unit*36,unit*12);
    context.fillStyle="red";
    context.fill();
    context.restore();

    context.beginPath();
    context.fillStyle="white";
    context.font="30px Arial";
    context.fillText("Next Gen",canvasWidth-(unit*36),canvasHeight-(unit*6))
    context.fill();
  }

  function mouseClick (e) {
    //alert(e.y);
    if(e.x >= canvasWidth-(unit*39) && e.x <= (canvasWidth-(unit*39)) + unit*36  && e.y >= canvasHeight-(unit*15) && e.y <= (canvasHeight-(unit*15))+ unit*12){
      
    generation++;
    food+= 0.2;
      //alert('generation' + generation);
    }
   
  }

  

});