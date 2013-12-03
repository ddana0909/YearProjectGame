/**
 * Created by Dana on 11/2/13.
 */

//<reference path="Scripts/Engine.js"/>

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

var shapes=[];
var dx,dy;
//var shapeIndex;
var shapeModel=[];


function canvasApp()
{   if(!canvasSupport())
        return;
    canvasInit("canvasOne",2.5);
    getShapeModel(shapeModel);

    var settings = getSettingsForGrid("canvasOne",0.05,0.01,15,7,50,50,4,7);
    var square=new Rectangle("canvasOne",settings.width,settings.height,settings.positionOnX, settings.positionOnY,"black","#8A9B0F");
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
        var selectedShape=shapes[shapeIndex]; //select
        shapes.splice(shapeIndex,1);                            //delete
        shapes.unshift(selectedShape);


        dx=shapes[0].positionX-event.pageX;
        dy=shapes[0].positionY-event.pageY;

    }

        window.removeEventListener("mousedown",mouseDownEvent,false);
        window.addEventListener("mouseup",mouseUpEvent,false);
}

function mouseMoveEvent(event)
    {
        //var newPositionX=event.pageX+dx;
        //var newPositionY=event.pageY+dy;

        //shapes[0].move(newPositionX,newPositionY);

        canvasOne.addEventListener("mouseup",mouseUpEvent,false);
    }

function mouseUpEvent(event)
    {
        canvasOne.removeEventListener("mousemove",mouseMoveEvent,false);

        var nrMatch=0;
        var match=false;
        var shapeIndex=[];
        var indexOfMin=0;

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
           if(getObjectType(shapeModel[indexOfMin])==getObjectType(shapes[0]))
                match=true;
           else
                 alert("bai! ce vrei sa faci?")
        }
        if(nrMatch==1)
            if(getObjectType(shapeModel[shapeIndex[0]])==getObjectType(shapes[0]))
            {match=true;
             indexOfMin=shapeIndex[0];
            }

        //context.clearRect(0, 0, canvasOne.width, canvasOne.height);
        //displayPicture("canvasOne","Images/lionface.png",792,1009,15,4,1,4,0.01,0.01);
        if(match)
        {
        alert('GOOD!');
        shapeModel[indexOfMin].fillColor=shapes[0].fillColor;
        drawShapeArray(shapeModel);
        }
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



