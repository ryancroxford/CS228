nj.config.printThreshold = 1000;
var controllerOptions = {};

let windowX = window.innerWidth;
let windowY = window.innerHeight;

let rawXMin = 10000;
let rawXMax = -10000;
let rawYMin = 10000;
let rawYMax = -10000;

let greenColors = ['#00d71c','#008a0f','#005109','#00350f'];
let redColors = ['#d70010','#8a0008','#510008','#350005'];

let previousNumHands = 0;
let currentNumHands = 0;

let numSamples = 100;
let currentSample = 0;
var framesOfData = nj.zeros([5,4,6,numSamples]);



Leap.loop(controllerOptions, function(frame)
{
    currentNumHands = frame.hands.length;
    handleFrame(frame);
    recordData();
    previousNumHands = currentNumHands;
});

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function handleFrame(frame){
    clear();
    let interactionBox = frame.interactionBox;
    if(frame.hands.length === 1){
        let hand = frame.hands[0];
        handleHand(hand,greenColors,interactionBox);
    } else if(frame.hands.length > 1){let hand = frame.hands[0];
        handleHand(hand,redColors,interactionBox);
    }
}

function handleHand(hand,colors,interactionBox){
    let fingers = hand.fingers;
    let i = 0;
    for(i;i<4;++i){
        let j = 0;
        for(j;j<5;++j){
            let bones = fingers[j].bones;
            handleBone(bones[i],i,colors[i],j,interactionBox);
        }
    }
}

// function handleFinger(finger){
//     x = finger.tipPosition[0];
//     y = finger.tipPosition[1];
//     y *= -1;
//     z = finger.tipPosition[2];
//
//     let xScale = coordinateScale(x,0,centerX*2,rawXMin,rawXMax);
//     let yScale = coordinateScale(y,0,centerY*2,rawYMin,rawYMax);
//     // circle(xScale,yScale,50);
//     let bones = finger.bones;
//     let i = 0;
//
// }

function handleBone(bone,boneIndex,color,fingerIndex,interactionBox){
    let normalizedPrevJoint = interactionBox.normalizePoint(bone.prevJoint,true);
    let normalizedNextJoint = interactionBox.normalizePoint(bone.nextJoint,true);
    let xt = normalizedNextJoint[0];
    let xb = normalizedPrevJoint[0];
    let yt = normalizedNextJoint[1];
    let yb = normalizedPrevJoint[1];
    let zt = normalizedNextJoint[2];
    let zb = normalizedPrevJoint[2];
    framesOfData.set(fingerIndex,boneIndex,0,currentSample,xb);
    framesOfData.set(fingerIndex,boneIndex,1,currentSample,yb);
    framesOfData.set(fingerIndex,boneIndex,2,currentSample,zb);
    framesOfData.set(fingerIndex,boneIndex,3,currentSample,xt);
    framesOfData.set(fingerIndex,boneIndex,4,currentSample,yt);
    framesOfData.set(fingerIndex,boneIndex,5,currentSample,zt);
    xt = windowX*xt;
    xb = windowX*xb;
    yt = windowY*(1-yt);
    yb = windowY*(1-yb);

    stroke(color);
    strokeWeight((5-boneIndex)*5);
    line(xb,yb,xt,yt);

}

function recordData(){
    if(currentNumHands === 2){
        ++currentSample;
        if(currentSample===numSamples){
            currentSample = 0;
        }
    }

    if(previousNumHands === 2 && currentNumHands === 1){
        console.log( framesOfData.toString() );
        background("#000000");
    }
}
