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
    // let xScale = coordinateScale(x,0,centerX*2,rawXMin,rawXMax);
    // let yScale = coordinateScale(y,0,centerY*2,rawYMin,rawYMax);
    // circle(xScale,yScale,50);
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
    for(i;i<4;++i){
        let j = 0;
        for(j;j<5;++j){
            let bones = fingers[j].bones;
            handleBone(bones[i],5-i);
        }
    }
}

function handleFinger(finger){
    x = finger.tipPosition[0];
    y = finger.tipPosition[1];
    y *= -1;
    z = finger.tipPosition[2];

    // if(x < rawXMin){
    //     rawXMin = x;
    // }
    //
    // if(x > rawXMax){
    //     rawXMax = x;
    // }
    //
    // if(y < rawYMin){
    //     rawYMin = y;
    // }
    //
    // if(y > rawYMax){
    //     rawYMax = y;
    // }

    let xScale = coordinateScale(x,0,centerX*2,rawXMin,rawXMax);
    let yScale = coordinateScale(y,0,centerY*2,rawYMin,rawYMax);
    // circle(xScale,yScale,50);
    let bones = finger.bones;
    let i = 0;
    // for(i;i < 4;++i){
    //     // if(bones[i].id % 10 === 1){
    //     //     handleFinger(bones[i]);
    //     // }
    //     handleBone(bones[i],i);
    // }

}

function handleBone(bone,order){
    let xt = bone.nextJoint[0];
    let xb = bone.prevJoint[0];
    let yt = bone.nextJoint[1];
    let yb = bone.prevJoint[1];
    yt *= -1;
    yb *= -1;
    let zt = bone.nextJoint[2];
    let zb = bone.prevJoint[2];
    let xtScale = coordinateScale(xt,0,centerX*2,rawXMin,rawXMax);
    let ytScale = coordinateScale(yt,0,centerY*2,rawYMin,rawYMax);
    let xbScale = coordinateScale(xb,0,centerX*2,rawXMin,rawXMax);
    let ybScale = coordinateScale(yb,0,centerY*2,rawYMin,rawYMax);
    // [xb,yb] = TransformCoordinates(xb,yb);
    // [xt,yt] = TransformCoordinates(xt,yt);
    strokeWeight(order);
    line(xbScale,ybScale,xtScale,ytScale);

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
    return ((pos-inputMin)/(inputMax-inputMin))*(outputMax-outputMin)+outputMin;
}
