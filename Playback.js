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
let colors = ['#c0c0c0','#8a8a8a','#515151','#000000'];



Leap.loop(controllerOptions, function(frame)
{

    handleFrame(frame);
});

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function handleFrame(frame){
    clear();

    if(frame.hands.length === 1){
        let hand = frame.hands[0];
        handleHand(hand);
    }
}

function handleHand(hand){
    let fingers = hand.fingers;
    let i = 0;
    for(i;i<4;++i){
        let j = 0;
        for(j;j<5;++j){
            let bones = fingers[j].bones;
            handleBone(bones[i],5-i,colors[i]);
        }
    }
}

function handleFinger(finger){
    x = finger.tipPosition[0];
    y = finger.tipPosition[1];
    y *= -1;
    z = finger.tipPosition[2];

    let xScale = coordinateScale(x,0,centerX*2,rawXMin,rawXMax);
    let yScale = coordinateScale(y,0,centerY*2,rawYMin,rawYMax);
    // circle(xScale,yScale,50);
    let bones = finger.bones;
    let i = 0;

}

function handleBone(bone,order,color){
    let xt = bone.nextJoint[0];
    let xb = bone.prevJoint[0];
    let yt = bone.nextJoint[1];
    let yb = bone.prevJoint[1];
    yt *= -1;
    yb *= -1;
    let zt = bone.nextJoint[2];
    let zb = bone.prevJoint[2];
    [xb,yb] = TransformCoordinates(xb,yb);
    [xt,yt] = TransformCoordinates(xt,yt);
    stroke(color)
    strokeWeight(order);
    line(xb,yb,xt,yt);

}

function TransformCoordinates(x,y) {
    if(x < rawXMin){
        rawXMin = x;
    }

    if(x > rawXMax){
        rawXMax = x;
    }

    if(y < rawYMin){
        rawYMin = y;
    }

    if(y > rawYMax){
        rawYMax = y;
    }
    x = coordinateScale(x,0,centerY*2,rawYMin,rawYMax);
    y = coordinateScale(y,0,centerY*2,rawYMin,rawYMax);



    return [x,y]
}

function coordinateScale(pos,outputMin,outputMax,inputMin,inputMax){
    return ((pos-inputMin)/(inputMax-inputMin))*(outputMax-outputMin)+outputMin;
}
