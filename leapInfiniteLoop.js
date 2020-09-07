var controllerOptions = {};

let centerX = window.innerWidth / 2;
let centerY = window.innerHeight / 2;

let rawXMin = 10000;
let rawXMax = -10000;
let rawYMin = 10000;
let rawYMax = -10000;

let x = centerX;
let y = centerY;
let z = 0;
Leap.loop(controllerOptions, function(frame)
{
    handleFrame(frame);
});

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function handleFrame(frame){
    clear();
    let xScale = coordinateScale(x,0,centerX*2);
    let yScale = coordinateScale(y,0,centerY*2);
    circle(xScale,yScale,50);
    // x += getRndInteger(-1,1);
    // y += getRndInteger(-1,1);

    if(frame.hands.length === 1){
        let hand = frame.hands[0];
        handleHand(hand);
    }
}

function handleHand(hand){
    let fingers = hand.fingers;
    let i = 0;
    for(i;i<fingers.length;++i){
        if(fingers[i].id % 10 === 1){
            handleFinger(fingers[i]);
        }
    }
}

function handleFinger(finger){
    x = finger.tipPosition[0];
    y = finger.tipPosition[1];
    z = finger.tipPosition[2];

    if(x < rawXMin){
        rawXMin = x;
        console.log("rawXMin:" + rawXMin);
    }

    if(x > rawXMax){
        rawXMax = x;
        console.log("rawXMax:"+ rawXMax);
    }

    if(y < rawYMin){
        rawYMin = y;
        console.log("rawYMin:"+ rawYMin);
    }

    if(y > rawYMax){
        rawYMax = y;
        console.log("rawYMax:"+ rawYMax);
    }

}

function coordinateScale(pos,outputLow,outputHigh){
    return ((pos-rawXMin)/(rawYMax-rawXMin))*(outputHigh-outputLow)+outputLow;
}
