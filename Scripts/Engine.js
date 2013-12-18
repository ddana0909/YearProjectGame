/**
 * Created by Dana on 11/2/13.
 */
//<reference path="Scripts/modernizr-latest.js"/>

function canvasInit(canvasName,aspectRatio)
{
    var canvas = document.getElementById(canvasName);
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
    return theCanvas.getContext("2d");
}

function drawShapeArray(shapes)
{
    for (var i = 0; i < shapes.length; i++)
        shapes[i].draw();
}

function GeometricShape(canvasName, positionX, positionY,color,fillColor, width)
{
    this.canvasName=canvasName;
    this.positionOnX=positionX;
    this.positionOnY=positionY;
    this.color=color;
    this.fillColor=fillColor;
    this.width=width;
}


function distanceBetweenPoints(x1,y1,x2,y2)
{
    return Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));
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


function Rectangle(canvasName,width, height, positionX, positionY,color,fillColor)
{
    GeometricShape.call(this,canvasName,positionX,positionY,color,fillColor,width);
    this.height=height;
}

function assignRect( sourceName)
{var i;
    for(i in this)
        this[i]=sourceName;
}
Rectangle.prototype= new GeometricShape();

Rectangle.assign=assignRect;
Rectangle.prototype.draw=drawRectangle;

Rectangle.prototype.area=areaRectangle;

Rectangle.prototype.isPointInside = function (x, y)
{
    if (x < this.positionOnX || x > this.positionOnX + this.width) {
        //alert("x"+x.toString()+" "+ y.toString()+" "+this.positionX.toString()+" "+(this.positionX+this.width).toString());
        return false;
    }
    if (y < this.positionOnY || y > this.positionOnY + this.height) {
        //alert("y"+x.toString()+" "+ y.toString()+" "+this.positionY.toString()+" "+(this.positionY+this.height).toString());
        return false;
    }

    return true;
};

Rectangle.prototype.move=function(newX, newY)
{
    this.positionOnX=newX;
    this.positionOnY=newY;
};

function drawRectangle()
{
    var context=getCanvasContext(this.canvasName);
    context.beginPath();
    context.strokeStyle = this.color;
    context.lineWidth = 3;

    context.rect(this.positionOnX, this.positionOnY, this.width,this.height);

    context.stroke();
    if(this.fillColor)
    {
        context.fillStyle=this.fillColor;
        context.fill();
    }

}

function areaRectangle()
{
    return this.width*this.length;
}


function Circle(canvasName,positionX,positionY,radius,color,fillColor)
{
    GeometricShape.call(this,canvasName,positionX,positionY,color,fillColor, radius);

}

Circle.prototype= new GeometricShape();

Circle.prototype.draw=drawCircle;

Circle.prototype.area=areaCircle;

Circle.prototype.isPointInside = function (x, y) {
    return distanceBetweenPoints(this.positionOnX, this.positionOnY, x, y) <= this.width;

};

Circle.prototype.move = function (newX, newY) {
    this.positionOnX = newX;
    this.positionOnY = newY;
};
function drawCircle()
{
    var context=getCanvasContext(this.canvasName);
    context.beginPath();
    context.strokeStyle = this.color;
    context.lineWidth = 3;
    context.arc(this.positionOnX, this.positionOnY, this.width, 0, (Math.PI/180)*360, false);
    context.stroke();
    context.closePath();
    if(this.fillColor)
    {
        context.fillStyle=this.fillColor;
        context.fill();
    }
}

function areaCircle()
{
    return Math.PI*Math.pow(this.width,2);
}

function Triangle(canvasName,positionX,positionY,height,basisLength,color, fillColor)
{
    GeometricShape.call(this,canvasName,positionX,positionY,color,fillColor);
    this.height=height;
    this.basisLength=basisLength;
    this.x2 =this.positionOnX -basisLength/2;
    this.y2 = this.positionOnY + height;
    this.x3 = this.positionOnX + basisLength/2;
    this.y3 = this.y2;
}

Triangle.prototype=new GeometricShape();

Triangle.prototype.draw = drawTriangle;

Triangle.prototype.area=areaTriangle;

Triangle.prototype.isPointInside = function (x, y) {

    //barycentric coordinates
    var lambda1 = parseFloat((this.y2 - this.y3) * (x - this.x3) + (this.x3 - this.x2) * (y - this.y3)) / ((this.y2 - this.y3) * (this.positionOnX - this.x3) + (this.x3 - this.x2) * (this.positionOnY - this.y3));
    var lambda2 = parseFloat((this.y3 - this.positionOnY) * (x - this.x3) + (this.positionOnX - this.x3) * (y - this.y3)) / ((this.y2 - this.y3) * (this.positionOnX - this.x3) + (this.x3 - this.x2) * (this.positionOnY - this.y3));
    var lambda3 = 1 - lambda1 - lambda2;

    return lambda1 >= 0 && lambda1 <= 1 && lambda2 >= 0 && lambda2 <= 1 && lambda3 >= 0 && lambda3 <= 1;

};

Triangle.prototype.move = function (newX, newY) {
    var dx = this.positionOnX - newX;
    var dy = this.positionOnY - newY;
    this.positionOnX = newX;
    this.positionOnY = newY;
    this.x2 -= dx;
    this.y2 -= dy;
    this.x3 -= dx;
    this.y3 -= dy;
};

function drawTriangle()
{
    var context = getCanvasContext(this.canvasName);
    context.beginPath();
    context.strokeStyle = this.color;
    context.lineWidth = 3;
    context.moveTo(this.positionOnX, this.positionOnY);
    context.lineTo(this.x2, this.y2);
    context.lineTo(this.x3, this.y3);
    context.lineTo(this.positionOnX, this.positionOnY);
    context.stroke();
    if (this.fillColor)
    {
        context.fillStyle = this.fillColor;
        context.fill();
    }
}

function areaTriangle()
{
    return (this.basisLength*this.height)/2;
}

function Square(canvasName,width, height, positionX, positionY,color,fillColor)
{
    Rectangle.call(this,canvasName,width, height, positionX, positionY,color,fillColor);
}
Square.prototype=new Rectangle();

function VRectangle(canvasName,width, height, positionX, positionY,color,fillColor)
{
    if(height<width) //daca nu e vertical
         {
          var aux=height;
          height=width;
          width=aux;
         }
        Rectangle.call(this,canvasName,width, height, positionX, positionY,color,fillColor);
}
VRectangle.prototype=new Rectangle();

function Picture(source, width, height)
{
    this.source=source;
    this.width=width;
    this.height=height;
}
var shapeTypes=[];
shapeTypes["Square"]=Square;
shapeTypes["VRectangle"]=VRectangle;
shapeTypes["Rectangle"]=Rectangle;
shapeTypes["Circle"]=Circle;
shapeTypes["Triangle"]=Triangle;


function getObjectType(obj)
{
    for(var oType in shapeTypes)
        if(obj instanceof shapeTypes[oType])
            return oType;
}

function clearArray(name)
{
    name.splice(0,name.length);
}

function adjustDimensionsForGrid(cellHeight, cellWidth, height, width)
{
    var imageRatio = width / height;
    if (cellHeight < height) {
        height = cellHeight;
        width = imageRatio * height;
    }
    if (cellWidth < width) {
        width = cellWidth;
        height = width / imageRatio;
    }
    return {height: height, width: width};
}

function getSettingsForGrid( canvasName,gridMarginLeft,gridMarginTop, gridColumns, gridRows, height, width, gridColumn, gridRow)
{
    var canvas = document.getElementById(canvasName);

    gridMarginLeft = gridMarginLeft * canvas.width;
    gridMarginTop = gridMarginTop * canvas.height;

    var availableWidth = canvas.width - 2 * gridMarginLeft;
    var availableHeight = canvas.height - 2 * gridMarginTop;

    //create the grid stuff
    var cellWidth = availableWidth / parseFloat(gridColumns);
    var cellHeight = availableHeight / parseFloat(gridRows);

    var __ret = adjustDimensionsForGrid(cellHeight, cellWidth, height, width);
    height = __ret.height;
    width = __ret.width;

    var positionOnX = gridMarginLeft + (gridColumn - 1) * cellWidth;
    var positionOnY = gridMarginTop + (gridRow - 1) * cellHeight;

    //center in cell on OX

    var d = (cellWidth - width) / 2;
    positionOnX = positionOnX + d;

    //center in cell on OY

    var dy=(cellHeight-height)/2;
    positionOnY=positionOnY+dy;

    return {height: height, width: width, positionOnX: positionOnX, positionOnY: positionOnY};
}

function displayPicture(canvasName,source, width, height, gridColumns, gridRows, gridColumn, gridRow, gridMarginLeft, gridMarginTop)
{
    var context = getCanvasContext(canvasName);

    var __ret = getSettingsForGrid(canvasName, gridMarginLeft, gridMarginTop, gridColumns, gridRows, height, width, gridColumn, gridRow);
    height = __ret.height;
    width = __ret.width;
    var positionOnX = __ret.positionOnX;
    var positionOnY = __ret.positionOnY;

    //display imag
    var imageToDisplay = new Image();
    imageToDisplay.src = source;
    imageToDisplay.id = source;
    imageToDisplay.onload = function ()
    {
        context.drawImage(imageToDisplay, positionOnX, positionOnY, width, height);
    }
}

function getShapeModel(shapeModel)
{
    var settings = getSettingsForGrid("canvasOne",0.05,0.01,3,3,150,150,2,2);
    var square=new Square("canvasOne",settings.width,settings.height,settings.positionOnX, settings.positionOnY,"black","#FBB829");
    shapeModel.push(square);

    var cSettings=getSettingsForGrid("canvasOne",0.05,0.01,3,3,50,50,2,2);
    cSettings.width=settings.width/3;
    cSettings.positionOnX=settings.positionOnX+settings.width/2;
    cSettings.positionOnY=settings.positionOnY+settings.width/2;
    var circle= new Circle("canvasOne",cSettings.positionOnX,cSettings.positionOnY,cSettings.width/2,"black","#FBB829");
    shapeModel.push(circle);


    var tSettings=getSettingsForGrid("canvasOne",0.05,0.01,3,3,40,40,2,2);
    tSettings.width=0.8*settings.width/3;
    tSettings.height=0.8*settings.height/3;
    var triangle= new Triangle("canvasOne",cSettings.positionOnX ,cSettings.positionOnY-tSettings.height-cSettings.width/2-3,tSettings.height,tSettings.width,"black","#FBB829");
    shapeModel.push(triangle);

    var rvSettings=getSettingsForGrid("canvasOne",0.05,0.01,3,3,80,50,2,2);
    rvSettings.width=settings.width/3;
    rvSettings.height=settings.height/2;
    rvSettings.positionOnY-=(rvSettings.height+(rvSettings.positionOnY-settings.positionOnY+3));
    rvSettings.positionOnX=settings.positionOnX+rvSettings.width;
    var vrectangle=new VRectangle("canvasOne",rvSettings.width,rvSettings.height,rvSettings.positionOnX, rvSettings.positionOnY,"black","#FBB829");
    shapeModel.push(vrectangle);
}



