/**
 * Created by Dana on 11/2/13.
 */

//<reference path="scripts/engine.js"/>

window.addEventListener("load", eventWindowLoaded, false);
function eventWindowLoaded()
{   playInstructions();
    var button=document.getElementById("instructions");
    button.addEventListener("click", playInstructions,false);
    canvasApp();
}
window.addEventListener("resize", OnResize, false);

function OnResize()
{
    canvasInit("canvasOne",2.5);
    clearArray(shapes);
    clearArray(shapeModel);
    canvasApp();
}
var draggedShape;
var shapes=[];
var dx,dy;
//var shapeIndex;
var shapeModel=[];
var targetX;
var targetY;
var easeAmount=0.45;
var hit=false;
var mouseX;
var mouseY;
var dragHoldX;
var dragHoldY;

var onMoveShape;

function canvasApp()
{   if(!canvasSupport())
        return;
    canvasInit("canvasOne",2.5);
    getShapeModel(shapeModel);

    var settings = getSettingsForGrid("canvasOne",0.05,0.01,15,7,50,50,4,7);
    var square=new Square("canvasOne",settings.width,settings.height,settings.positionOnX, settings.positionOnY,"black","#8A9B0F");
    shapes.push(square);

    var cSettings=getSettingsForGrid("canvasOne",0.05,0.01,15,7,50,50,6,7);
    var circle= new Circle("canvasOne",cSettings.positionOnX+cSettings.width/2,cSettings.positionOnY+cSettings.width/2,cSettings.width/2,"black","#8A9B0F");
    shapes.push(circle);


    var tSettings=getSettingsForGrid("canvasOne",0.05,0.01,15,7,50,50,8,7);
    var triangle= new Triangle("canvasOne",tSettings.positionOnX, tSettings.positionOnY,tSettings.height,tSettings.width,"black","#8A9B0F");
    shapes.push(triangle);

    var rSettings=getSettingsForGrid("canvasOne",0.05,0.01,15,7,50,80,10,7);
    var rectangle=new Rectangle("canvasOne",rSettings.width,rSettings.height,rSettings.positionOnX, rSettings.positionOnY,"black","#8A9B0F");
    shapes.push(rectangle);

    var rvSettings=getSettingsForGrid("canvasOne",0.05,0.01,15,7,80,50,12,7);
    var vrectangle=new Rectangle("canvasOne",rvSettings.width,rvSettings.height,rvSettings.positionOnX, rvSettings.positionOnY,"black","#8A9B0F");
    shapes.push(vrectangle);

    drawShapeArray(shapes);

    drawShapeArray(shapeModel);

    displayPicture("canvasOne","Images/lionface.png",792,1009,15,4,1,4,0.01,0.01);

    canvasOne.addEventListener("mousedown",mouseDownEvent,false);
}

function mouseDownEvent(event)
{   var shapeIndex;
    mouseX=event.pageX;
    mouseY=event.pageY;
    for(var i=0;i<shapes.length;i++)
    {
        if(shapes[i].isPointInside(event.pageX,event.pageY))
        {
            hit=true;
            shapeIndex=i;
            break;
        }
    }
    if(hit)
    {  canvasOne.addEventListener("mousemove",mouseMoveEvent,false);
        var selectedShape=shapes[shapeIndex]; //select
        draggedShape=shapes[shapeIndex];
        shapes.splice(shapeIndex,1);                            //delete
        shapes.unshift(selectedShape);



        dragHoldX = mouseX - draggedShape.positionOnX;
        dragHoldY = mouseY - draggedShape.positionOnY;

        targetX = draggedShape.positionOnX;
        targetY = draggedShape.positionOnY;

        timer=setInterval(onTimerTick, 1000/30);

        onMoveShape=shapes[0];
        dx=shapes[0].positionX-event.pageX;
        dy=shapes[0].positionY-event.pageY;

    }

        window.removeEventListener("mousedown",mouseDownEvent,false);
        window.addEventListener("mouseup",mouseUpEvent,false);
}

function onTimerTick() {

    //draggedShape.positionOnX +=  easeAmount*(targetX - draggedShape.positionOnX);
    draggedShape.move(draggedShape.positionOnX+easeAmount*(targetX-draggedShape.positionOnX),draggedShape.positionOnY+easeAmount*(targetY-draggedShape.positionOnY));
    //draggedShape.positionOnY +=  easeAmount*(targetY - draggedShape.positionOnY);

    //stop the timer when the target position is reached (close enough)
    if ((!hit)&&(Math.abs(draggedShape.positionOnX - targetX) < 0.1) && (Math.abs(draggedShape.positionOnY - targetY) < 0.1)) {
        draggedShape.move(targetX, targetY);
        /*draggedShape.positionOnX = targetX;
        draggedShape.positionOnY = targetY;*/

        //stop timer:
        clearInterval(timer);
    }
    drawScreen();
}
function drawScreen()
{
    //canvasInit("canvasOne",2.5);
    //displayPicture("canvasOne","Images/lionface.png",792,1009,15,4,1,4,0.01,0.01);
    getCanvasContext("canvasOne").clearRect(100,0, canvasOne.width-100, canvasOne.height);//setge chestiile dinainte
    drawShapeArray(shapes);
    drawShapeArray(shapeModel);

    if(hit==true)
    draggedShape.draw();
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

            //getting mouse position correctly
            /*var bRect = canvasOne.getBoundingClientRect();
            mouseX = (event.clientX - bRect.left)*(canvasOne.width/bRect.width);
            mouseY = (event.clientY - bRect.top)*(canvasOne.height/bRect.height);*/

            //clamp x and y positions to prevent object from dragging outside of canvas
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

        //context.clearRect(0, 0, canvasOne.width, canvasOne.height);
        //displayPicture("canvasOne","Images/lionface.png",792,1009,15,4,1,4,0.01,0.01);
        if(match)
        {
        //alert('GOOD!');
        shapeModel[indexOfMin].fillColor=draggedShape.fillColor;
        /*drawShapeArray(shapeModel);*/
        shapes.splice(0,1); //sterge forma din lista

        drawScreen();
        }
        //draggedShape=0;
    }

function playSound() {
    var snd = new Audio("Sounds/doorbell.wav"); // buffers automatically when created
    snd.play();
}
function playInstructions()
{   //this.removeEventListener("click",playInstructions,false);
    //playSound();
    var snd = new Audio("Sounds/doorbell.wav"); // buffers automatically when created
    snd.play();
}



