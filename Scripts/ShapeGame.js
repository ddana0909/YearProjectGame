/**
 * Created by Dana on 11/2/13.
 */

//<reference path="scripts/engine.js"/>

window.addEventListener("load", eventWindowLoaded, false);
function eventWindowLoaded()
{   playInstructions();
    var button=document.getElementById("instructions");
    button.addEventListener("click", playInstructions,false);
    shapeGame();
}
window.addEventListener("resize", OnResize, false);

function OnResize()
{
    canvasInit("canvasOne",2.5);
    clearArray(shapeMenu);
    clearArray(shapeModel);
    shapeGame();
}
var draggedShape;
var shapeMenu=[];
var shapeModel=[];
var dx,dy;
//var shapeIndex;

var targetX;
var targetY;
var easeAmount=0.45;
var hit=false;
var mouseX;
var mouseY;
var dragHoldX;
var dragHoldY;
var matchingAttempts=0;
var timer;

function initShapeMenu(shapeMenu)
{
    var settings = getSettingsForGrid("canvasOne", 0.05, 0.01, 15, 7, 50, 50, 4, 7);
    var square = new Square("canvasOne", settings.width, settings.height, settings.positionOnX, settings.positionOnY, "black", "#8A9B0F");
    shapeMenu.push(square);

    var cSettings = getSettingsForGrid("canvasOne", 0.05, 0.01, 15, 7, 50, 50, 6, 7);
    var circle = new Circle("canvasOne", cSettings.positionOnX + cSettings.width / 2, cSettings.positionOnY + cSettings.width / 2, cSettings.width / 2, "black", "#8A9B0F");
    shapeMenu.push(circle);


    var tSettings = getSettingsForGrid("canvasOne", 0.05, 0.01, 15, 7, 50, 50, 8, 7);
    var triangle = new Triangle("canvasOne", tSettings.positionOnX, tSettings.positionOnY, tSettings.height, tSettings.width, "black", "#8A9B0F");
    shapeMenu.push(triangle);

    var rSettings = getSettingsForGrid("canvasOne", 0.05, 0.01, 15, 7, 50, 80, 10, 7);
    var rectangle = new Rectangle("canvasOne", rSettings.width, rSettings.height, rSettings.positionOnX, rSettings.positionOnY, "black", "#8A9B0F");
    shapeMenu.push(rectangle);

    var rvSettings = getSettingsForGrid("canvasOne", 0.05, 0.01, 15, 7, 80, 50, 12, 7);
    var vRectangle = new VRectangle("canvasOne", rvSettings.width, rvSettings.height, rvSettings.positionOnX, rvSettings.positionOnY, "black", "#8A9B0F");
    shapeMenu.push(vRectangle);
}

function shapeGame()
{   if(!canvasSupport())
        return;

    canvasInit("canvasOne",2.5);
  //  if(arguments.callee.caller.name!="OnResize")
    {
         initShapeMenu(shapeMenu);
         getShapeModel(shapeModel);
    }
    drawShapeArray(shapeMenu);
    drawShapeArray(shapeModel);

    displayPicture("canvasOne","images/lionface.png",792,1009,15,4,1,4,0.01,0.01);

    canvasOne.addEventListener("mousedown",mouseDownEvent,false);
}

function gameOver()
{
    if((!winGame())&&matchingAttempts==shapeModel.length)
        return true;
}
function winGame()
{
    var shape;
    for(shape in shapeModel)
    {
        if(shapeModel[shape].fillColor!="#8A9B0F")
        return false;
    }
    return true;
}

function mouseDownEvent(event)
{   var shapeIndex;
    mouseX=event.pageX;
    mouseY=event.pageY;
    for(var i=0;i<shapeMenu.length;i++)
    {
        if(shapeMenu[i].isPointInside(event.pageX,event.pageY))
        {
            hit=true;
            shapeIndex=i;
            break;
        }
    }
    if(hit)
    {  canvasOne.addEventListener("mousemove",mouseMoveEvent,false);
        var selectedShape=shapeMenu[shapeIndex]; //select
        draggedShape=shapeMenu[shapeIndex];
        shapeMenu.splice(shapeIndex,1);                            //delete
        shapeMenu.unshift(selectedShape);



        dragHoldX = mouseX - draggedShape.positionOnX;
        dragHoldY = mouseY - draggedShape.positionOnY;

        targetX = draggedShape.positionOnX;
        targetY = draggedShape.positionOnY;

        timer=setInterval(onTimerTick, 1000/30);

    }

        window.removeEventListener("mousedown",mouseDownEvent,false);
        window.addEventListener("mouseup",mouseUpEvent,false);
}

function onTimerTick() {

    draggedShape.move(draggedShape.positionOnX+easeAmount*(targetX-draggedShape.positionOnX),draggedShape.positionOnY+easeAmount*(targetY-draggedShape.positionOnY));

    if ((!hit)&&(Math.abs(draggedShape.positionOnX - targetX) < 0.1) && (Math.abs(draggedShape.positionOnY - targetY) < 0.1)) {
        draggedShape.move(targetX, targetY);
        clearInterval(timer);
    }
    drawScreen();
}

function drawScreen()
{

    if(gameOver() || winGame())
    { var context=getCanvasContext("canvasOne");
        if(gameOver())
        {  context.clearRect(0,0,canvasOne.width,canvasOne.height);

            displayPicture("canvasOne","images/lose.jpg",197,164,1,1,1,1,0.05,0.05);
            context.fillStyle = "#000000";
            context.font = "40px _sans";
            context.textBaseline = "top";

            //center your message
            var message="GAME OVER!!!"
            var position=centerText(message);
            context.fillText(message,position,50);
            window.instructions.style.visibility="hidden";
        }
        if(winGame())
        {  context.clearRect(0,0,canvasOne.width,canvasOne.height);

            displayPicture("canvasOne","images/win.jpg",288,175,1,1,1,1,0.05,0.05);

            context.fillStyle = "#000000";
            context.font = "40px _sans";
            context.textBaseline = "top";

            //center your message
            var message="Well done!!!"
            var position=centerText(message);
            context.fillText(message,position,50);
            window.instructions.style.visibility="hidden";
        }
    }
        else
        {
            getCanvasContext("canvasOne").clearRect(100,0, canvasOne.width-100, canvasOne.height);//setge chestiile dinainte
            drawShapeArray(shapeMenu);
            drawShapeArray(shapeModel);

            if(hit==true)
                draggedShape.draw();
        }

    function centerText(message)
    {
        var metrics=context.measureText(message);
        var messageSize=metrics.width;
        var position=(canvasOne.width/2)-(messageSize/2);
        return position;
    }
}

function mouseMoveEvent(event)
    {
            var posX;
            var posY;
            var shapeRad = draggedShape.width;
            var minX = shapeRad;
            var maxX = canvasOne.width - shapeRad;
            var minY = shapeRad;
            var maxY = canvasOne.height - shapeRad;

            mouseX=event.clientX;
            mouseY=event.clientY;

            posX = mouseX - dragHoldX;
            posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
            posY = mouseY - dragHoldY;
            posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);

            targetX = posX;
            targetY = posY;

    }

function mouseUpEvent(event)
    {
        canvasOne.removeEventListener("mousemove",mouseMoveEvent,false);

        var nrMatch=0;
        var match=false;
        var shapeIndex=[];
        var indexOfMin=0;
        matchingAttempts++;
        hit=false;

        for(var i=0;i<shapeModel.length;i++)
        {
            if(shapeModel[i].isPointInside(event.pageX,event.pageY))
            {
                nrMatch++;
                shapeIndex.push(i);
            }
        }

        if(nrMatch>1)
        {
           var minSize=999*999;

           for( var j in shapeIndex)
            {  var indexInShapeModel=shapeIndex[j];
                if (shapeModel[indexInShapeModel].area() < minSize)
                {
                    minSize = shapeModel[indexInShapeModel].area();
                    indexOfMin = indexInShapeModel;
                }
            }
           if(getObjectType(shapeModel[indexOfMin])==getObjectType(draggedShape))
                match=true;

        }
        if(nrMatch==1)
            if(getObjectType(shapeModel[shapeIndex[0]])==getObjectType(draggedShape))
            {
             match=true;
             indexOfMin=shapeIndex[0];
            }

        if(match)
        {

        shapeModel[indexOfMin].fillColor=draggedShape.fillColor;

        }
        shapeMenu.splice(0,1);
        if(gameOver())
        {drawScreen();

            window.removeEventListener("mousedown",mouseDownEvent,false);
        }
        else
            if(winGame())
            {
                drawScreen();

                window.removeEventListener("mousedown",mouseDownEvent,false);
            }

    }

function playSound() {
    var snd = new Audio("sounds/doorbell.wav"); // buffers automatically when created
    snd.play();
}
function playInstructions()
{
    var snd = new Audio("sounds/doorbell.wav"); // buffers automatically when created
    snd.play();
}



