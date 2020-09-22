var oneFrameOfData = nj.zeros([5,4,6]);
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
let greenColors = ['#00d71c','#008a0f','#005109','#00350f'];
let redColors = ['#d70010','#8a0008','#510008','#350005'];

let previousNumHands = 0;
let currentNumHands = 0;


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

    if(frame.hands.length === 1){
        let hand = frame.hands[0];
        handleHand(hand,greenColors);
    } else if(frame.hands.length > 1){
        let hand = frame.hands[0];
        handleHand(hand,redColors);
    }
}

function handleHand(hand,colors){
    let fingers = hand.fingers;
    let i = 0;
    for(i;i<4;++i){
        let j = 0;
        for(j;j<5;++j){
            let bones = fingers[j].bones;
            handleBone(bones[i],i,colors[i],j);
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

function handleBone(bone,boneIndex,color,fingerIndex){
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
    let coordinateSum = xt+xb+yt+yb+zt+zb;
    oneFrameOfData.set(fingerIndex,boneIndex,0,xb);
    oneFrameOfData.set(fingerIndex,boneIndex,1,yb);
    oneFrameOfData.set(fingerIndex,boneIndex,2,zb);
    oneFrameOfData.set(fingerIndex,boneIndex,3,xt);
    oneFrameOfData.set(fingerIndex,boneIndex,4,yt);
    oneFrameOfData.set(fingerIndex,boneIndex,5,zt);
    stroke(color)
    strokeWeight(5-boneIndex);
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

function recordData(){
    if(previousNumHands === 2 && currentNumHands === 1){
        console.log(oneFrameOfData.toString())
        background("#000000");
    }
}
