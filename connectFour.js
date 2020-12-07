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

let digitToShow = 0;
let timeSinceLastDigitChange = new Date();
let timeSinceSignIn = new Date();
let timeSinceDisplayStarted = new Date();

let digitsToLearn = [0,9];
let numberTimesPassed = [0,0];
let currentDigitIndex = 0;

let previousPrediction = 0;
let firstStateTwo = true;
let accuracyNeeded = 0.67;

let isNew = false;
let users = [];
let wins = [];
let currentUser = "";

let resultLabel = 0;

let learning = false;

//Game Globals
const cols = 7;
const rows = 6;
const w = windowX/14;
const dw = w*8/10;
let board = Array(6).fill().map(() => Array(7).fill(0));

let players = [];

let player = 1;
let playerPos;
let win = 0;

let playerOneUsername = null;
let playerTwoUsername = null;


Leap.loop(controllerOptions,function(frame){
    clear();
    DetermineState(frame);
    // console.log(HandIsUncentered());
    // if (programState===0){
    //
    // } else if (programState===1){
    //
    // } else if (programState === 2){
    //
    // }
    DrawLowerLeftPanel();


});

function DetermineState(frame) {
    if (frame.hands.length === 0){
        programState = 0;
        HandleState0(frame);
    } else if(HandIsUncentered()){
        programState = 1;
        HandleState1(frame);
    } else{
        programState = 2;
        timeSinceLastDigitChange = new Date();
        if(firstStateTwo){
            timeSinceDisplayStarted = new Date();
            firstStateTwo = false;
        }
        HandleState2(frame);
    }
}

/**
 * @return {boolean}
 */
function HandIsUncentered() {
    return HandIsTooFarToTheLeft() || HandIsTooFarToTheRight() || HandIsTooFarDown()
        || HandIsTooFarUp() || HandIsTooFarBack() || HandIsTooFarForward();
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
    TrainKNNIfNotDoneYet(frame);
    DrawImageToHelpUserPutTheirHandOverTheDevice();
    DrawBoard();
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

function HandleState2(frame) {
    handleFrame(frame);
    DrawLowerRightPanel();
    // DetermineWhetherToSwitchDigits();
    DrawBoard();
    Test();
}

function HandleState3(frame){

}

function DetermineWhetherToSwitchDigits(){
    if (CompletedDigit()){
        // SwitchDigits()
    }
}

/**
 * @return {boolean}
 */
function CompletedDigit(){
    if(meanPredAccuracy > accuracyNeeded){
        numberTimesPassed[currentDigitIndex];
        return true;
    } else {
        return false;
    }
}

function DrawLowerRightPanel() {
    let currentTime = new Date();
    let timeDifferenceInMilliseconds = currentTime.getTime() - timeSinceDisplayStarted.getTime();
    let timeDifferenceInSeconds = timeDifferenceInMilliseconds/1000;
    // console.log(timeDifferenceInSeconds,numberTimesPassed[currentDigitIndex]);
    if (timeDifferenceInSeconds < 5 - numberTimesPassed[currentDigitIndex]){
        if(digitToShow === 0){
            image(zeroASL,windowX/2,windowY/2,[windowX/2],[windowY/2]);
        } else if (digitToShow === 5){
            image(fiveASL,windowX/2,windowY/2,[windowX/2],[windowY/2]);
        } else if(digitToShow === 9){
            image(nineASL,windowX/2,windowY/2,[windowX/2],[windowY/2]);
        }
    } else {
        numPredResult = 0;
        meanPredAccuracy = 0;
    }



}

function DrawHandCorrection(imageName){
    image(imageName,windowX/2,0,[windowX/2],[windowY/2])
}

function DrawLowerLeftPanel(){
    let currentTime = new Date();
    let timeDifferenceInMilliseconds = currentTime.getTime() - timeSinceSignIn.getTime();
    let timeDifferenceInSeconds = timeDifferenceInMilliseconds/1000;
    if (timeDifferenceInSeconds > 5/2){
        isNew = false;
    }

    if(isNew){
        DrawWelcome();
    } else {
        DrawScoreboard();
    }
}

function DrawScoreboard(){
    let textHeight = 20;
    textSize(textHeight);
    textAlign(LEFT);
    fill(0);
    text("Player",50,windowY/2+textHeight+20);
    text("Wins",200,windowY/2+textHeight+20);
    for(let i = 0; i < users.length;++i){
        fill(100);
        textSize(textHeight);
        text(users[i],50,windowY/2+textHeight*(i+2)+30);
        text(wins[i],200,windowY/2+textHeight*(i+2)+30);
    }

    // noStroke();
    // fill(0);
    // if (win === 1) {
    //     fill(0, 0, 255);
    // } else if (win  === 2) {
    //     fill(255, 0, 0);
    // }
    // textAlign(CENTER, CENTER);
    // textSize(64);
    // if (win === 4) {
    //     text("Game Over!", 3*windowX/4, w/2);
    // } else if (win === 3) {
    //     text("It is a tie.", 3*windowX/4, w/2);
    // } else {
    //     text(`${win > 1 ? 'Red' : 'Blue'} won!`, 3*windowX/4, w/2);
    // }
}

function DrawWelcome(){
    image(welcome,0,windowY/2,[windowX/2],[windowY/2]);
}


function DrawArrowRight() {
    image(moveRight,windowX/2,0,[windowX/2],[windowY/2])
}

function DrawImageToHelpUserPutTheirHandOverTheDevice(){
    image(img,0,0,[windowX/2],[windowY/2]);
}

function TrainKNNIfNotDoneYet(frame) {
    if(!trainingCompleted){
        Train();
    }
    // else {
    //     currentNumHands = frame.hands.length;
    //     handleFrame(frame);
    //     // recordData();
    //     previousNumHands = currentNumHands;
    // }
}

function Train(){
    let features = 0;
    for(let i = 0; i < numSamples;++i){
        // features = train9.pick(null,null,null,i).reshape(120);
        // knnClassifier.addExample(features.tolist(),9);
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

        // Digit 1
        features = train1a.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 1);

        //
        features = train1Davis.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 1);

        //
        features = train1Riofrio.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 1);


        features = train1Bongard.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 1);


        features = train1Wolley.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 1);


        //do more 1 examples please

        //Digit 2

        features = train2Sheboy.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 2);


        features = train2Downs.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 2);


        features = train2Jimmo.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 2);


        //Digit 3

        features = train3Shi.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 3);


        features = train3Downs.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 3);


        features = train3Bongard.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 3);


        features = train3Beattie.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 3);



        features = train3Li.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 3);



        features = train3Riofrio.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 3);

        // //
        features = train3Luksevish.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 3);


        features = train3b.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 3);


        //do more 3 examples

        //Digit 4

        features = train4a.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 4);


        features = train4Beattie.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 4);


        features = train4Bertschinger.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 4);


        features = train4Faucher.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 4);



        features = train4Liu.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 4);


        features = train4Makovsky.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 4);


        features = train5Bertschinger.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 5);

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
    resultLabel = parseInt(result.label);
    // ++numPredResult;
    // if(resultLabel === digitToShow){
    //     meanPredAccuracy = (((numPredResult-1)*meanPredAccuracy + (1))/numPredResult);
    //     // DrawLowerLeftPanel(true);
    // } else {
    //     meanPredAccuracy = (((numPredResult-1)*meanPredAccuracy + (0))/numPredResult);
    //     // DrawLowerLeftPanel(false);
    // }
    // console.log(resultLabel);
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
    let alpha = (boneIndex+2)*50;
    if(learning === true){
        let red = 255-meanPredAccuracy*255;
        let green = meanPredAccuracy*255;

        stroke(red,green,0,alpha);
    } else {
        if(player === 1){
            stroke(255,255,0,alpha);
        } else if(player === 2){
            stroke(255,0,0,alpha);
        }
    }

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
function SignIn(){
    //console.log("hey this function was just called!")

    playerOneUsername = document.getElementById('player-one-username').value;
    playerTwoUsername = document.getElementById('player-two-username').value;
    let list = document.getElementById('users');
    if (IsNewUser(playerOneUsername,list)) {
        CreateNewUser(playerOneUsername,list);
        isNew = true;
    }else {
        CreateSignInItem(playerOneUsername,list);
        isNew = false;
    }
    list = document.getElementById('users');
    if (IsNewUser(playerTwoUsername,list)) {
        CreateNewUser(playerTwoUsername,list);
        isNew = true;
    }else {
        CreateSignInItem(playerTwoUsername,list);
        isNew = false;
    }

    console.log("Signed In - " + playerOneUsername);
    console.log("Signed In - " + playerTwoUsername);
    console.log(list.innerHTML);
    players = [];
    players.push(playerOneUsername,playerTwoUsername);
    console.log(players);
    timeSinceSignIn = new Date();
    board = Array(6).fill().map(() => Array(7).fill(0));
    win = 0;
    document.getElementById("play-button").innerText = "Play Again!";

    return false;

}

function IsNewUser(username,list){
    var usernameFound = false;
    var users = list.children;
    for (i = 0; i < users.length; i++)
    {
        if (users[i].innerHTML === username)
        {
            usernameFound = true;
            console.log(users[i]);
            console.log(users[i].innerHTML);
        }
    }

    return usernameFound == false;

}

function CreateNewUser(username,list) {
    var item = document.createElement('li');
    item.id = String(username) + "_name";
    item.innerHTML = String(username);
    list.appendChild(item);
    item = document.createElement('li');
    item.id = String(username) + "_signins";
    item.innerHTML = 1;
    list.appendChild(item);
    users.push(username);
    wins.push(0);
}


function CreateSignInItem(username,list) {
    var ID = String(username) + "_signins";
    var listItem = document.getElementById(ID);
    listItem.innerHTML = parseInt(listItem.innerHTML) + 1;
}



function hasWon() {
    // Test Horizontal
    for (let j = 0; j < rows; j++) {
        for (let i = 0; i <= cols-4; i++) {
            const test = board[j][i];
            if (test != 0) {
                let temp = true;
                for (let k = 0; k < 4; k++) {
                    if (board[j][i+k] !== test) {
                        temp = false;
                    }
                }
                if (temp == true) {
                    return true;
                }
            }
        }
    }

    // Test Vertical
    for (let j = 0; j <= rows-4; j++) {
        for (let i = 0; i < cols; i++) {
            const test = board[j][i];
            if (test != 0) {
                let temp = true;
                for (let k = 0; k < 4; k++) {
                    if (board[j+k][i] !== test) {
                        temp = false;
                    }
                }
                if (temp == true) {
                    return true;
                }
            }
        }
    }

    // Test Diagonal
    for (let j = 0; j <= rows-4; j++) {
        for (let i = 0; i <= cols-4; i++) {
            const test = board[j][i];
            if (test != 0) {
                let temp = true;
                for (let k = 0; k < 4; k++) {
                    if (board[j+k][i+k] !== test) {
                        temp = false;
                    }
                }
                if (temp == true) {
                    return true;
                }
            }
        }
    }

    // Test Antidiagonal
    for (let j = 0; j <= rows-4; j++) {
        for (let i = 4; i < cols; i++) {
            const test = board[j][i];
            if (test != 0) {
                let temp = true;
                for (let k = 0; k < 4; k++) {
                    if (board[j+k][i-k] !== test) {
                        temp = false;
                    }
                }
                if (temp == true) {
                    return true;
                }
            }
        }
    }

    return false;
}


/**
 * @return {boolean}
 */
function TimeToDropPiece() {
    let currentTime = new Date();
    let timeDifferenceInMilliseconds = currentTime.getTime() - timeSinceLastDigitChange.getTime();
    let timeDifferenceInSeconds = timeDifferenceInMilliseconds/1000;
    if(previousPrediction === resultLabel){
        if (timeDifferenceInSeconds > 1.75){
            dropPiece();
            timeSinceLastDigitChange = new Date();
        }
    } else {
        timeSinceLastDigitChange = new Date();
        console.log("changed here")
    }
    console.log(timeDifferenceInSeconds);
    previousPrediction = resultLabel;
}


function DrawBoard() {
    // playerPos = floor(mouseX/w) - 7;
    playerPos = resultLabel;

    stroke(0);
    fill(0,0,255);
    strokeWeight(1);
    rect(windowX/2, 0, windowX/2, windowY);
    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            fill(255);
            if (board[j][i] === 1) {
                fill(255, 255,0);
            } else if (board[j][i] === 2) {
                fill(255, 0, 0);
            }
            ellipse(i*w + w/2 + windowX/2, j*w + 3*w/2, dw);
        }
    }

    stroke(102, 102, 0);
    for (let x = w+windowX; x < width; x += w) {
        line(x, w, x, windowY/2);
    }

    if (win !== 0) {
        noStroke();
        fill(0);
        if (win === 1) {
            fill(255,255,0);
        } else if (win  === 2) {
            fill(255, 0, 0);
        }
        textAlign(CENTER, CENTER);
        textSize(64);
        if (win === 4) {
            text("Game Over!", 3*windowX/4, w/2);
        } else if (win === 3) {
            text("It is a tie.", 3*windowX/4, w/2);
        } else {
            text(`${win > 1 ? players[1] : players[0]} won!`, 3*windowX/4, w/2);
        }
        noLoop();
    } else if (win === 0){
        stroke(0);
        if (player === 1) {
            fill(255,255,0);
        } else if (player  === 2) {
            fill(255, 0, 0);
        }
        if(programState === 2){
            if(playerPos >= 0){
                ellipse((playerPos + 0.5) * w+windowX/2, w/2, dw);
            }
            TimeToDropPiece();
        }
        textAlign(CENTER, CENTER);
        fill(255);
        textSize(64);
        for (let i = 0; i < cols; i++) {
            text(i.toString(),i*w + w/2 + windowX/2, w/2);
        }
    }
}


function dropPiece() {
    // if (board[0][playerPos] !== 0) {
    //     win = 4;
    // }

    board[0][playerPos] = player;
    let i = 0;
    while (true) {
        if (i >= rows-1) {
            break;
        }
        if (board[i+1][playerPos] !== 0) {
            break;
        }
        [board[i+1][playerPos], board[i][playerPos]] = [board[i][playerPos], board[i+1][playerPos]];
        i++;
    }

    if (hasWon()) {
        //console.log(`${player > 1 ? 'Red' : 'Blue'} won!`);
        win = player;
        if (win === 1){
            wins[users.indexOf(players[0])]++;
        } else {
            wins[users.indexOf(players[1])]++;
        }
    }

    let tie = true;
    for (let j = 0; j < rows; j++) outer: {
        for (let i = 0; i < cols; i++) {
            if (board[j][i] === 0) {
                tie = false;
            }
        }
    }

    if (tie) {
        win = 3;
    }

    player = 3 - player;
}



// function mousePressed() {
//     if (board[0][playerPos] !== 0) {
//         win = 4;
//     }
//
//     board[0][playerPos] = player;
//     let i = 0;
//     while (true) {
//         if (i >= rows-1) {
//             break;
//         }
//         if (board[i+1][playerPos] !== 0) {
//             break;
//         }
//         [board[i+1][playerPos], board[i][playerPos]] = [board[i][playerPos], board[i+1][playerPos]];
//         i++;
//     }
//
//     if (hasWon()) {
//         //console.log(`${player > 1 ? 'Red' : 'Blue'} won!`);
//         win = player;
//     }
//
//     let tie = true;
//     for (let j = 0; j < rows; j++) outer: {
//         for (let i = 0; i < cols; i++) {
//             if (board[j][i] === 0) {
//                 tie = false;
//             }
//         }
//     }
//
//     if (tie) {
//         win = 3;
//     }
//
//     player = 3 - player;
// }
