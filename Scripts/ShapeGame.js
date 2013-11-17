/**
 * Created by Dana on 11/2/13.
 */

//<reference path="Scripts/Engine.js"/>

window.addEventListener("load", eventWindowLoaded, false);
function eventWindowLoaded(event)
{   playInstructions();
    var button=document.getElementById("instructions");
    button.addEventListener("click", playInstructions,false);
    canvasApp();
}
window.addEventListener("resize", OnResize, false);

function OnResize(event)
{   canvasInit("canvasOne",2.5);
    canvasApp();
}

var shapes=new Array();
var dx,dy;
var shapeIndex;




function canvasApp()
{   if(!canvasSupport())
        return;
    canvasInit("canvasOne",2.5);
    var rectangle=new Rectangle("canvasOne",50,50,20,20,"black","#FBB829");
    shapes.push(rectangle);

    var circle= new Circle("canvasOne",100,100,20,"black","#FBB829");
    shapes.push(circle);

    var triangle= new Triangle("canvasOne",200,200,50,80,"black","#FBB829");
    shapes.push(triangle);

    drawShapeArray(shapes);

    displayPicture("canvasOne","Images/lionface.png",792,1009,15,4,1,4,0.05,0.05);

    canvasOne.addEventListener("mousedown",mouseDownEvent,false);
}

function mouseDownEvent(event)
{
    var hit=false;
    for(var i=0;i<shapes.length;i++)
    {
        if(shapes[i].isPointInside(event.pageX,event.pageY))
        {
            hit=true;
            shapeIndex=i;
        }
    }
    if(hit)
    {  canvasOne.addEventListener("mousemove",mouseMoveEvent,false);

        /*var selectedShape=shapes.slice(shapeIndex,shapeIndex+1); //select
        shapes.splice(shapeIndex,1);                            //delete
        shapes.unshift(selectedShape);
        */
        dx=shapes[shapeIndex].positionX-event.pageX;
        dy=shapes[shapeIndex].positionY-event.pageY;

    }

        window.removeEventListener("mousedown",mouseDownEvent,false);
        window.addEventListener("mouseup",mouseUpEvent,false);
}

function mouseMoveEvent(event)
    {
        var newPositionX=event.pageX+dx;
        var newPositionY=event.pageY+dy;

        shapes[shapeIndex].move(newPositionX,newPositionY);

        canvasOne.addEventListener("mouseup",mouseUpEvent,false);
    }

function mouseUpEvent(event)
    {
        canvasOne.removeEventListener("mousemove",mouseMoveEvent,false);
        var context=getCanvasContext("canvasOne");
        context.clearRect(0, 0, canvasOne.width, canvasOne.height);
        displayPicture("canvasOne","Images/lionface.png",792,1009,15,4,1,4,0.05,0.05);
        drawShapeArray(shapes);
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



