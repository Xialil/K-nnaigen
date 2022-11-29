var w,h,g,el,my={}
var firstshapeTime;
var timeID;
var shapeTimeID;
var state;

function reactionMain(){
    w=1500;
    h=500;
    clrs=["red"];
    this.MAX=5;
    this.count=0;
    this.times=[];
    var s='';
    s+=`<div style="position:relative; max-width:${w}px;height:${h}px; border-radius: 10px; margin:auto; display:block; background-color: #00bfff; ">`;
    s+='<canvas id="canvasId" width="'+w+'" height="'+h+'" style=""></canvas>';
    startStr='Klicka för att börja.';
    s+='<div id="instr" style="position: absolute; left:50px; top:100px; width:360px; font:18px Verdana; color: whitesmoke; background-color: #00bfff; border-radius: 10px; padding: 3%; transition: all linear 0.1s;">'+startStr+'</div>';
    s+='<div id="circle" style="display: block; background-color: '+clrs[0]+'; position: absolute; left:40%; top:40%; width:100px; height:100px; border-radius:50px; opacity: 0; "><canvas id="circleCanvas" ></canvas> </div>';
    s+='<div id="triangle" style="display: block; background-color: '+clrs[0]+'; position: absolute; left:40%; top:40%; width:100px; height:100px; border-radius:50px; opacity: 0; "> <canvas id="triangleCanvas" ></canvas></div>'; 
    s+='<div id="rectangle" style="display: block; background-color: '+clrs[0]+'; position: absolute; left:40%; top:40%; width:100px; height:100px; border-radius:50px; opacity: 0; "><canvas id="rectangleCanvas" ></canvas> </div>';   
    s+='<div id="result" style="position: absolute; left:5%; top:50px; width:90%; font:18px Verdana; color: whitesmoke; text-align: center;"></div>';
    s+='<div id="click" style="position: absolute; left:0; top:0; width:100%; height:100%; background-color: rgba(0,0,0,0); cursor: pointer;" onmousedown="doClick()"></div>';
    s+='</div>';
    document.write(s);
    el=document.getElementById('canvasId');
    ratio=2;el.width=w*ratio;
    el.height=h*ratio;
    el.style.width=w+"px";
    el.style.height=h+"px";
    g=el.getContext("2d");
    g.setTransform(ratio,0,0,ratio,0,0);
    drawCircle();
    drawTriangle();
    drawRectangle();
    showPage('empty')
    state='start';
}

function showPage(figureName) {
    var circleDiv = document.getElementById('circle');
    var triangleDiv = document.getElementById('triangle');
    var rectangleDiv = document.getElementById('rectangle');
    switch(figureName) {
        case 'circle':
            circleDiv.style.opacity = 1;
            triangleDiv.style.opacity = 0;
            rectangleDiv.style.opacity =0;
            break;
        case 'triangle':
            circleDiv.style.opacity = 0;
            triangleDiv.style.opacity = 1;
            rectangleDiv.style.opacity =0;
            break;
        case 'rectangle':
            circleDiv.style.opacity = 0;
            triangleDiv.style.opacity = 0;
            rectangleDiv.style.opacity =1;
            break;
        case 'empty':
            circleDiv.style.opacity = 0;
            triangleDiv.style.opacity = 0;
            rectangleDiv.style.opacity =0;
            break;
    }

}

function drawCircle(){   
    let canvas = document.querySelector("#circleCanvas");
    let context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#00bfff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#f44336';
    context.arc(100, 75, 50, 0, 2 * Math.PI);
    context.fill();
}

function drawTriangle() {
    let canvas = document.querySelector("#triangleCanvas");
    let context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#00bfff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.moveTo(100, 15);
    context.lineTo(150, 115);
    context.lineTo(50, 115);
    context.closePath();
    context.fillStyle = "#f44336";
    context.fill();
}

function drawRectangle() {
    let canvas = document.querySelector("#rectangleCanvas");
    let context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#00bfff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#f44336";
    context.fillRect(50, 15, 100, 100);
    context.fill();
}

function doShape() {
    if (state != 'firstshape' && state != 'secondshape') {
        var time=2000+Math.random()*4000;    
        timeID=setTimeout(
            function() {stateMachine('timeout');},
            time
        ); 
    }
    var shapeTime=500+Math.random()*1000;
    shapeTimeID=setTimeout(
        function() {
            stateMachine('shapeTimeout');
        },
        shapeTime
    );
    document.getElementById('instr').innerHTML='Klicka när du ser triangeln';
    g.clearRect(0,0,el.width,el.height);
    if (state == 'secondshape') {
        showPage('circle');
        state = 'firstshape';
    } else {
        showPage('rectangle');
        state = 'secondshape';
    }
}

function doMeasure() {
    firstshapeTime=performance.now();
    clearTimeout(shapeTimeID);
    showPage('triangle');
    state='measure';
}

function doTooEarly() {
    document.getElementById("instr").innerHTML="För tidigt, klicka för att försöka igen";
    clearTimeout(timeID);
    clearTimeout(shapeTimeID);
    showPage('empty');
    state = 'tooearly';
}

function doResult() {
    var clickTime=performance.now();
    elapsed=(clickTime-firstshapeTime)/1000;
    times.push(elapsed);
    document.getElementById("result").innerHTML=showResult();
    document.getElementById('instr').innerHTML="Bra jobbat! Klicka för nästa mätning";
    this.count++;
    showPage('empty');
    if(this.count==this.MAX) {
        doFinished();
    } else {
        state='result';
    }
}

function doFinished() {
    document.getElementById('instr').innerHTML="Mätningen avklarad, tack för din medverkan!<br>"+showAverage();
}

function stateMachine(eventName){
    console.log('stateMachine(' + eventName + ')');
    switch(state){
        case 'start':
            if(eventName == 'click') {
                doShape();
            }
            break;
        case 'firstshape':
        case 'secondshape':
            if(eventName == 'shapeTimeout') {
                doShape();
            }
            if(eventName == 'timeout') {
                doMeasure();
            } else if(eventName == 'click') {
                doTooEarly();
            }
            break;
        case 'tooearly':
            if(eventName == 'click') {
                doShape();
            }
            break;   
        case 'measure':
            if(eventName == 'click') {
                doResult();
            }
            break;
        case 'result':
            if(eventName == 'click') {
                doShape();
            }
            break;
        default:
    }
}

function doClick() {
    stateMachine('click');
}

function showResult(){
    var s='';
    var timesN=this.times.length;
    for(var i=0;i<timesN;i++) {
        if(i>0)s+=', ';
        s+=fmt(this.times[i])+'s';
    }
    return s;
}

function showAverage() {
    var s='';
    var timesN=this.times.length;
    var sum=0;
    for(var i=0;i<timesN;i++) {
        sum+=this.times[i];
    }
    var avg=sum/this.times.length;
    s+='Genomsnitt: '+fmt(avg)+' sec';
    return s;
}

function fmt(v){return Math.round(v*1000)/1000}

