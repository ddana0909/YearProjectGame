/**
 * Created by Dana on 11/2/13.
 */
//<reference path="Scripts/modernizr-latest.js"/>

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
{
    var theCanvas = document.getElementById(name);
    var context = theCanvas.getContext("2d");
    return context;
}

function drawShapeArray(shapes)
{
    for (var i = 0; i < shapes.length; i++)
    {
        shapes[i].draw();
    }
}

function distanceBetweenPoints(x1,y1,x2,y2)
{
    return Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));
}

function area(ax,ay,bx,by,cx,cy)
{
    return Math.abs(parseFloat(ax*(bx-cy)+bx*(cy-ay)+cx*(ay-by)))/2;
}

function Sound(source, reapeat)
{
    this.source=source;
    this.repeat=reapeat;
}
function playSound()
{
    while(this.repeat)
    {
        var snd = new Audio(source); // buffers automatically when created
        snd.play();
        this.repeat--;
    }
}

Sound.prototype.playSound=playSound;

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

Rectangle.prototype.isPointInside=function(x,y)
{
    if( x < this.positionX || x > this.positionX  + this.width)
    {
        //alert("x"+x.toString()+" "+ y.toString()+" "+this.positionX.toString()+" "+(this.positionX+this.width).toString());
        return false;
    }
    if( y < this.positionY || y > this.positionY + this.height)
    {
        //alert("y"+x.toString()+" "+ y.toString()+" "+this.positionY.toString()+" "+(this.positionY+this.height).toString());
        return false;
    }

    return true;
}

Rectangle.prototype.move=function(newX, newY)
{
    this.positionX=newX;
    this.positionY=newY;
}

function drawRectangle()
{
    var context=getCanvasContext(this.canvasname);
    context.rect(this.positionX, this.positionY, this.width,this.height);
    if(this.fillColor)
    {
        context.fillStyle=this.fillColor;
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

Circle.prototype.isPointInside=function(x,y)
{
    if (distanceBetweenPoints(this.positionX, this.positionY, x, y) > this.radius)
        return false;
    return true;
}

Circle.prototype.move=function(newX, newY)
{
    this.positionX=newX;
    this.positionY=newY;
}

function drawCircle()
{
    var context=getCanvasContext(this.canvasname);
    context.beginPath();
    context.strokeStyle = this.color;
    context.lineWidth = 5;
    context.arc(this.positionX, this.positionY, this.radius, 0, (Math.PI/180)*360, false);
    context.stroke();
    context.closePath();
    if(this.fillcolor)
    {
        context.fillStyle=this.fillcolor;
        context.fill();
    }
}

function Triangle(canvasname,positionX,positionY,height,basisLength,color, fillcolor)
{
    this.canvasname=canvasname;
    this.height=height;
    this.basisLength=basisLength;
    this.color=color;
    this.fillcolor=fillcolor;
    this.positionX=positionX;
    this.positionY=positionY;
    this.x2 =this.positionX -basisLength/2;
    this.y2 = this.positionY + height;
    this.x3 = this.positionX + basisLength/2;
    this.y3 = this.y2;
}

Triangle.prototype.draw = drawTriangle;

Triangle.prototype.isPointInside=function (x, y)
{
    /*var a1= area(this.x1,this.y1,this.x2,this.y2,x,y);
     var a2=area(this.x2,this.y2,this.x3,this.y3,x,y);
     var a3=area(this.x1,this.y1,this.x3,this.y3,x,y);
     var a4= area(this.x1,this.y1,this.x2,this.y2,this.x3,this.y3);
     alert(a1.toString()+" "+a2.toString()+" "+a3.toString()+" "+a4.toString());
     if(a1+a2+a3==a4)*/
    /*var s1= (this.x2-this.x1)*(this.y-this.y1)-(this.x-this.x1)*(this.y2-this.y1);
     var s2= (this.x3-this.x2)*(this.y-this.y2)-(this.x-this.x2)*(this.y3-this.y2);
     var s3= (this.x1-this.x2)*(this.y-this.y3)-(this.x-this.x3)*(this.y1-this.y3);
     alert(s1.toString()+" "+s2.toString()+" "+s3.toString());
     if(s1==s2&&s2==s3)*/
    //barycentric coordinates
    var lambda1=parseFloat((this.y2-this.y3)*(x-this.x3)+(this.x3-this.x2)*(y-this.y3))/((this.y2-this.y3)*(this.positionX-this.x3)+(this.x3-this.x2)*(this.positionY-this.y3))
    var lambda2=parseFloat((this.y3-this.positionY)*(x-this.x3)+(this.positionX-this.x3)*(y-this.y3))/((this.y2-this.y3)*(this.positionX-this.x3)+(this.x3-this.x2)*(this.positionY-this.y3))
    var lambda3=1-lambda1-lambda2;
    if(lambda1>=0&&lambda1<=1&&lambda2>=0&&lambda2<=1&&lambda3>=0&&lambda3<=1)
    {
        return true;
    }
    else
    {
        return false;
    }
}

Triangle.prototype.move=function(newX,newY)
{   var dx=this.positionX-newX;
    var dy=this.positionY-newY;
    this.positionX=newX;
    this.positionY=newY;
    this.x2 -=dx;
    this.y2 -=dy;
    this.x3 -=dx;
    this.y3 -=dy;
}

function drawTriangle()
{
    var context = getCanvasContext(this.canvasname);
    context.strokeStyle = this.color;
    context.moveTo(this.positionX, this.positionY);
    context.lineTo(this.x2, this.y2);
    context.lineTo(this.x3, this.y3);
    context.lineTo(this.positionX, this.positionY);
    context.stroke();
    if (this.fillcolor)
    {
        context.fillStyle = this.fillcolor;
        context.fill();
    }
}

function Picture(source, width, height)
{
    this.source=source;
    this.width=width;
    this.height=height;
}

function displayPicture(canvasname,source, width, height, gridColumns, gridRows, gridColumn, gridRow, gridMarginLeft, gridMarginTop)
{   var context=getCanvasContext(canvasname);
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




