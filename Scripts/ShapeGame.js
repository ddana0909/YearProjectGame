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


function canvasApp()
{   if(!canvasSupport())
        return;

    canvasInit("canvasOne",2.5);

    var shapes=new Array();

    var rect=new Rectangle("canvasOne",50,50,20,20,"black","#FBB829");
    shapes.push(rect);


    var circle= new Circle("canvasOne",100,100,20,"black","#FBB829");
    shapes.push(circle);


    var triangle= new Triangle("canvasOne",200,200,50,80,"black","#FBB829");
    shapes.push(triangle);
    for(var i=0;i<shapes.length;i++)
    {
        shapes[i].draw();
    }

    displayPicture("canvasOne","Images/lionface.png",792,1009,15,4,1,4,0.05,0.05);

    window.addEventListener("click",isInside,false);

    function isInside(event)
    {   var hit=false;
        for(var i=0;i<shapes.length;i++)
        {
         if(shapes[i].isPointInside(event.pageX,event.pageY))
            hit=true;
        }
       alert(hit);
    }

}

function playSound() {
    var snd = new Audio("Sounds/doorbell.wav"); // buffers automatically when created
    snd.play();
}
function playInstructions(event)
{   this.removeEventListener("click",playInstructions,false);
    //playSound();
    var snd = new Audio("Sounds/doorbell.wav"); // buffers automatically when created
    snd.play();
}



