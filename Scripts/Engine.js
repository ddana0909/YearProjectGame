/**
 * Created by Dana on 11/2/13.
 */
//<reference path="Scripts/modernizr-latest.js"/>

function Sound(source, reapeat)
    {this.source=source;
     this.repeat=reapeat;
    }
function playSound()
    {while(this.repeat)
        {
            var snd = new Audio(source); // buffers automatically when created
            snd.play();
            this.repeat--;
        }

    }
new Sound(0,0,0);
Sound.prototype.playSound=playSound;

function canvasInit(canvasname,aspectRatio)
{
    var canvas = document.getElementById(canvasname);
    canvas.width = window.innerWidth;
    canvas.height = canvas.width/aspectRatio;

}

function canvasSupport ()
{
    return Modernizr.canvas;
}
function getCanvasContext(name)
{   var theCanvas = document.getElementById(name);
    var context = theCanvas.getContext("2d");
    return context;
}
function Rectangle(canvasname,width, height, positionX, positionY,color,fillColor)
{
    this.canvasname=canvasname;
    this.width=width;
    this.height=height;
    this.positionX=positionX;
    this.positionY=positionY;
    this.color=color;
    this.fillColor=fillColor;
}
Rectangle.prototype.draw=drawRectangle;
function drawRectangle()
{
    var context=getCanvasContext(this.canvasname);
    context.rect(this.width,this.height,this.positionX,this.positionY);
    if(this.fillColor)
    {   context.fillStyle=this.fillColor;
        context.fill();
    }

    context.strokeStyle = this.color;
    context.stroke();
}
function Circle(canvasname,positionX,positionY,radius,color,fillcolor)
{
    this.canvasname=canvasname;
    this.positionX=positionX;
    this.positionY=positionY;
    this.radius=radius;
    this.color=color;
    this.fillcolor=fillcolor;

}
Circle.prototype.draw=drawCircle;
function drawCircle()
{
    var context=getCanvasContext(this.canvasname);
    context.beginPath();
    context.strokeStyle = this.color;
    context.lineWidth = 5;
    context.arc(this.positionX, this.positionY, this.radius, (Math.PI/180)*0, (Math.PI/180)*360, false);
    context.stroke();
    context.closePath();
    if(this.fillcolor)
    {
        context.fillStyle=this.fillcolor;
        context.fill();
    }
}

function Triangle(canvasname,positionTopX,positionTopY,height,basisLength,color, fillcolor)
{
    this.canvasname=canvasname;
    this.height=height;
    this.basisLength=basisLength;
    this.color=color;
    this.fillcolor=fillcolor;
    this.x1=positionTopX;
    this.y1=positionTopY;
    this.x2 =this.x1 -basisLength/2;
    this.y2 = this.y1 + height;
    this.x3 = this.x1 + basisLength/2;
    this.y3 = this.y2;

}
Triangle.prototype.draw = drawTriangle;
function drawTriangle() {
    var context = getCanvasContext(this.canvasname);

   context.strokeStyle = this.color;
    context.moveTo(this.x1, this.y1);
    context.lineTo(this.x2, this.y2);
    context.lineTo(this.x3, this.y3);
    context.lineTo(this.x1, this.y1);
    context.stroke();

    if (this.fillcolor) {
        context.fillStyle = this.fillcolor;
        context.fill();
    }
}
function area(ax,ay,bx,by,cx,cy)
{
    return parseFloat(ax(bx-cy)+bx(xy-ay)+cx(ay-by))/2;
}
Triangle.prototype.isPointInside=function (x, y){


/*var lambda1=parseFloat((this.y2-this.y3)*(x-this.x3)+(this.x3-this.x2)*(y-this.y3))/((this.y2-this.y3)*(this.x1-this.x3)+(this.x3-this.x2)*(this.y1-this.y3))
var lambda2=parseFloat((this.y3-this.y1)*(x-this.x3)+(this.x1-this.x3)*(y-this.y3))/((this.y2-this.y3)*(this.x1-this.x3)+(this.x3-this.x2)*(this.y1-this.y3))
var lambda3=1-lambda1-lambda2;
if(lambda1<1&&lambda2<1&&lambda3<1)*/
if(area(this.x1,this.y1,this.x2,this.y2,x,y)+area(this.x2,this.y2,this.x3,this.y3,x,y)+area(this.x1,this.y1,this.x3,this.y3,x,y)==area(this.x1,this.y1,this.x2,this.y2,this.x3,this.y3))
    return true;
else
    return false;
}


function Picture(source, width, height)
{
    this.source=source;
    this.width=width;
    this.height=height;
}

function displayPicture(canvasname,source, width, height, gridColumns, gridRows, gridColumn, gridRow, gridMarginLeft, gridMarginTop)
{  var context=getCanvasContext(canvasname);
    var canvas=document.getElementById(canvasname);
    gridMarginLeft=gridMarginLeft*canvas.width;
    gridMarginTop=gridMarginTop*canvas.height;

    var availableWidth=canvas.width-2*gridMarginLeft;
    var availableHeight=canvas.height-2*gridMarginTop;
    var imageRatio=width/height;

    //create the grid stuff
    var cellWidth=availableWidth/parseFloat(gridColumns);
    var cellHeight=availableHeight/parseFloat(gridRows);

    if(cellHeight<height)
    {
        height=cellHeight;
        width=imageRatio*height;
    }
    if(cellWidth<width)
    {
        width=cellWidth;
        height=width/imageRatio;
    }

    var positionOnX=gridMarginLeft+(gridColumn-1)*cellWidth;
    var positionOnY=gridMarginTop+(gridRow-1)*cellHeight;

    //center in cell on OX

    var d=(cellWidth-width)/2;
    positionOnX=positionOnX+d;


    //display image

    var imageToDisplay = new Image();
    imageToDisplay.src = source;
    imageToDisplay.id=source;
    imageToDisplay.onload = function ()
    {
        context.drawImage(imageToDisplay, positionOnX,positionOnY,width,height);
    }

}




