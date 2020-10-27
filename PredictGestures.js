nj.config.printThreshold = 1000;
const knnClassifier = ml5.KNNClassifier();

let trainingCompleted = false;
let numSamples = train0.shape[3];
let predictedClassLabels = nj.zeros([numSamples]);
var controllerOptions = {};

let windowX = window.innerWidth;
let windowY = window.innerHeight;

let greenColors = ['#00d71c','#008a0f','#005109','#00350f'];
let redColors = ['#d70010','#8a0008','#510008','#350005'];
let greyColors = ['#c0c0c0','#8a8a8a','#515151','#000000'];

let previousNumHands = 0;
let currentNumHands = 0;

let currentSample = 0;
let oneFrameOfData = nj.zeros([5,4,6]);

let numPredResult = 0;
let meanPredAccuracy = 0;

let fauxLabel = 0;

let programState = 0;

Leap.loop(controllerOptions,function(frame){
    clear();
    DetermineState(frame);
    if (programState===0){
        HandleState0(frame);
    } else if (programState===1){
        HandleState1(frame);
    }



});

function DetermineState(frame) {
    if (frame.hands.length === 0){
        programState = 0;
    } else if(HandIsUncentered){
        programState = 1;
    } else{
        programState = 2;
    }
}

/**
 * @return {boolean}
 */
function HandIsUncentered() {
    return HandIsTooFarToTheLeft() && HandIsTooFarToTheRight() && HandIsTooFarDown()
        && HandIsTooFarUp() && HandIsTooFarBack() && HandIsTooFarForward();
}

/**
 * @return {boolean}
 */
function HandIsTooFarToTheLeft(){
    let xValues = oneFrameOfData.slice([],[],[0,6,3]);
    let currentMean = xValues.mean();
    let horizontalShift = 0.5 - currentMean;
    let newMean = xValues.mean();
    return newMean < 0.25;
}

/**
 * @return {boolean}
 */
function HandIsTooFarToTheRight(){
    let xValues = oneFrameOfData.slice([],[],[0,6,3]);
    let currentMean = xValues.mean();
    let horizontalShift = 0.5 - currentMean;
    let newMean = xValues.mean();
    return newMean > 0.75;
}

/**
 * @return {boolean}
 */
function HandIsTooFarUp(){
    let yValues = oneFrameOfData.slice([],[],[1,6,3]);
    let currentMean = yValues.mean();
    let verticalShift = 0.5 - currentMean;
    let newMean = yValues.mean();
    return newMean > 0.75;
}

/**
 * @return {boolean}
 */
function HandIsTooFarDown(){
    let yValues = oneFrameOfData.slice([],[],[1,6,3]);
    let currentMean = yValues.mean();
    let horizontalShift = 0.5 - currentMean;
    let newMean = yValues.mean();
    return newMean < 0.25;
}

/**
 * @return {boolean}
 */
function HandIsTooFarBack(){
    let zValues = oneFrameOfData.slice([],[],[2,6,3]);
    let currentMean = zValues.mean();
    let verticalShift = 0.5 - currentMean;
    let newMean = zValues.mean();
    return newMean > 0.75;
}

/**
 * @return {boolean}
 */
function HandIsTooFarForward(){
    let zValues = oneFrameOfData.slice([],[],[2,6,3]);
    let currentMean = zValues.mean();
    let horizontalShift = 0.5 - currentMean;
    let newMean = zValues.mean();
    return newMean < 0.25;
}


function HandleState0(frame) {
    TrainKNNIfNotDoneYet();
    DrawImageToHelpUserPutTheirHandOverTheDevice();
}

function HandleState1(frame) {
    handleFrame(frame);
    if(HandIsTooFarToTheLeft()){
        DrawHandCorrection(moveRight);
    } else if(HandIsTooFarToTheRight()){
        DrawHandCorrection(moveLeft);
    } else if(HandIsTooFarUp()){
        DrawHandCorrection(moveDown);
    } else if(HandIsTooFarDown()){
        DrawHandCorrection(moveUp);
    } else if(HandIsTooFarForward()){
        DrawHandCorrection(moveBack);
    } else if(HandIsTooFarBack()){
        DrawHandCorrection(moveForward);
    }
    // Test();
}
function DrawHandCorrection(imageName){
    image(imageName,windowX/2,0,[windowX/2],[windowY/2])
}

function DrawArrowRight() {
    image(moveRight,windowX/2,0,[windowX/2],[windowY/2])
}

function DrawImageToHelpUserPutTheirHandOverTheDevice(){
    image(img,0,0,[windowX/2],[windowY/2]);
}

function TrainKNNIfNotDoneYet() {
    // if(!trainingCompleted){
    //     // Train();
    // } else {
    //     currentNumHands = frame.hands.length;
    //     handleFrame(frame);
    //     // recordData();
    //     previousNumHands = currentNumHands;
    // }
}

function Train(){
    let features = 0;
    for(let i = 0; i < numSamples;++i){
        features = train9.pick(null,null,null,i).reshape(120);
        knnClassifier.addExample(features.tolist(),9);
        features = train0.pick(null,null,null,i).reshape(120);
        knnClassifier.addExample(features.tolist(),0);
        features = train5.pick(null,null,null,i).reshape(120);
        knnClassifier.addExample(features.tolist(),5);
        features = train1a.pick(null,null,null,i).reshape(120);
        knnClassifier.addExample(features.tolist(),1);
        features = train1b.pick(null,null,null,i).reshape(120);
        knnClassifier.addExample(features.tolist(),1);
        features = train2a.pick(null,null,null,i).reshape(120);
        knnClassifier.addExample(features.tolist(),2);
        features = train3a.pick(null,null,null,i).reshape(120);
        knnClassifier.addExample(features.tolist(),3);
        features = train3b.pick(null,null,null,i).reshape(120);
        knnClassifier.addExample(features.tolist(),3);
        features = train4a.pick(null,null,null,i).reshape(120);
        knnClassifier.addExample(features.tolist(),4);
        features = train6a.pick(null,null,null,i).reshape(120);
        knnClassifier.addExample(features.tolist(),6);
        features = train7a.pick(null,null,null,i).reshape(120);
        knnClassifier.addExample(features.tolist(),7);
        features = train8a.pick(null,null,null,i).reshape(120);
        // knnClassifier.addExample(features.tolist(),8);
        // features = train8Bongard.pick(null,null,null,i).reshape(120);
    }
    console.log("Training Completed!");

    trainingCompleted = true;
}

function Test(){
    centerXData();
    centerYData();
    centerZData();
    let currentFeatures = oneFrameOfData.reshape(120);
    // let currentLabel = irisData.pick(testingSampleIndex).get(-1);
    let predictedLabel = knnClassifier.classify(currentFeatures.tolist(),GotResults);
}

function GotResults(err,result){
    let resultLabel = parseInt(result.label);
    // console.log(resultLabel);
    ++numPredResult;
    if(resultLabel === 5){
        meanPredAccuracy = (((numPredResult-1)*meanPredAccuracy + (1))/numPredResult);
    } else {
        meanPredAccuracy = (((numPredResult-1)*meanPredAccuracy + (0))/numPredResult);
    }
    if(numPredResult % 120 === 0){
        fauxLabel++;
    }
    // console.log(numPredResult,resultLabel);
    console.log(numPredResult,fauxLabel);
}

function centerXData(){
    let xValues = oneFrameOfData.slice([],[],[0,6,3]);
    let currentMean = xValues.mean();
    let horizontalShift = 0.5 - currentMean;
    for(let currentRow = 0; currentRow<5;++currentRow){
        for(let currentColumn = 0;currentColumn<4;++currentColumn){
            let currentX = oneFrameOfData.get(currentRow,currentColumn,0);
            let shiftedX = currentX + horizontalShift;
            oneFrameOfData.set(currentRow,currentColumn,0,shiftedX);
            currentX = oneFrameOfData.get(currentRow,currentColumn,3);
            shiftedX = currentX + horizontalShift;
            oneFrameOfData.set(currentRow,currentColumn,3,shiftedX);
        }
    }
    let newMean = xValues.mean();
    // console.log(newMean);
}

function centerYData(){
    let yValues = oneFrameOfData.slice([],[],[1,6,3]);
    let currentMean = yValues.mean();
    let verticalShift = 0.5 - currentMean;
    for(let currentRow = 0; currentRow<5;++currentRow){
        for(let currentColumn = 0;currentColumn<4;++currentColumn){
            let currentY = oneFrameOfData.get(currentRow,currentColumn,1);
            let shiftedY = currentY + verticalShift;
            oneFrameOfData.set(currentRow,currentColumn,1,shiftedY);
            currentY = oneFrameOfData.get(currentRow,currentColumn,4);
            shiftedY = currentY + verticalShift;
            oneFrameOfData.set(currentRow,currentColumn,4,shiftedY);
        }
    }
    let newMean = yValues.mean();
    // console.log(newMean);
}

function centerZData(){
    let zValues = oneFrameOfData.slice([],[],[2,6,3]);
    let currentMean = zValues.mean();
    let depthShift = 0.5 - currentMean;
    for(let currentRow = 0; currentRow<5;++currentRow){
        for(let currentColumn = 0;currentColumn<4;++currentColumn){
            let currentZ = oneFrameOfData.get(currentRow,currentColumn,2);
            let shiftedZ = currentZ + depthShift;
            oneFrameOfData.set(currentRow,currentColumn,2,shiftedZ);
            currentZ = oneFrameOfData.get(currentRow,currentColumn,5);
            shiftedZ = currentZ + depthShift;
            oneFrameOfData.set(currentRow,currentColumn,5,shiftedZ);
        }
    }
    let newMean = zValues.mean();
    // console.log(newMean);
}

function handleFrame(frame){
    clear();
    let interactionBox = frame.interactionBox;

    if(frame.hands.length >= 1){
        let hand = frame.hands[0];
        handleHand(hand,greyColors,interactionBox);
    }

    // if(frame.hands.length === 1){
    //     let hand = frame.hands[0];
    //     handleHand(hand,greenColors,interactionBox);
    // } else if(frame.hands.length > 1){
    //     let hand = frame.hands[0];
    //     handleHand(hand,redColors,interactionBox);
    // }
}

function handleHand(hand,colors,interactionBox){
    let fingers = hand.fingers;
    let i = 0;
    for(i;i<4;++i){
        let j = 0;
        for(j;j<5;++j){
            let bones = fingers[j].bones;
            handleBone(bones[3-i],i,colors[i],j,interactionBox);
        }
    }
}

function handleBone(bone,boneIndex,color,fingerIndex,interactionBox){
    let normalizedPrevJoint = interactionBox.normalizePoint(bone.prevJoint,true);
    let normalizedNextJoint = interactionBox.normalizePoint(bone.nextJoint,true);
    let xt = normalizedNextJoint[0];
    let xb = normalizedPrevJoint[0];
    let yt = normalizedNextJoint[1];
    let yb = normalizedPrevJoint[1];
    let zt = normalizedNextJoint[2];
    let zb = normalizedPrevJoint[2];
    oneFrameOfData.set(fingerIndex,boneIndex,0,xb);
    oneFrameOfData.set(fingerIndex,boneIndex,1,yb);
    oneFrameOfData.set(fingerIndex,boneIndex,2,zb);
    oneFrameOfData.set(fingerIndex,boneIndex,3,xt);
    oneFrameOfData.set(fingerIndex,boneIndex,4,yt);
    oneFrameOfData.set(fingerIndex,boneIndex,5,zt);
    xt = windowX/2*xt;
    xb = windowX/2*xb;
    yt = windowY/2*(1-yt);
    yb = windowY/2*(1-yb);

    stroke(color);
    strokeWeight((boneIndex+2)*7);
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
        // console.log( oneFrameOfData.toString() );
        background("#000000");
    }
}
