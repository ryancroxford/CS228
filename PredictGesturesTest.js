const knnClassifier = ml5.KNNClassifier();
var controllerOptions = {}

var numSamples = train2.shape[0];
var predictedClassLabels = nj.zeros([numSamples]);
var trainingCompleted  = false;
var oneFrameOfData = nj.zeros([5,4,6]);

var predictionObtained = 0;
var meanPredictionAccuracy = 0;

var programState = 0;

var digitToShow = 1;
var timeSinceLastDigitChange = new Date();

function SwitchDigits(){
    if (digitToShow === 1){
        digitToShow = 2;
    }
    else{
        digitToShow = 1;
    }
    predictionObtained = 0;
}
function TimeToSwitchDigits(){
    let currentTime = new Date()
    timeInMilliseconds = currentTime - timeSinceLastDigitChange;
    timeInSeconds = timeInMilliseconds / 1000;
    if (timeInSeconds >= 6){
        timeSinceLastDigitChange = currentTime;
        return true
    }
}
function DetermineWhetherToSwitchDigits(){
    if (TimeToSwitchDigits()){
        SwitchDigits()
    }
}

function DrawLowerRightPanel(){
    if (digitToShow == 1){
        image(digit1Sign ,window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 2.5, window.innerHeight / 2.5);
    }
    else{
        image(digit2Sign ,window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 2.5 , window.innerHeight / 2.5);
    }
}
function GotResults(err, result){
    predictedClassLabels = parseInt(result.label);

    //console.log(parseInt(result.label));

    predictionObtained++;

    meanPredictionAccuracy = (((predictionObtained - 1) * meanPredictionAccuracy) + (parseInt(result.label) == digitToShow)) / predictionObtained
    console.log(predictionObtained, meanPredictionAccuracy, parseInt(result.label) );

}
function Train(){
    for (var i = 0; i < train2.shape[3]; i++ ){

        // Digit 0
        var features = train0.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 0);
        console.log(features);

        features = train0Wills.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 0);
        console.log(features);

        features = train0Allison.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 0);
        console.log(features);


        // Digit 1
        features = train1.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 1);
        console.log(features);
        //
        features = train1Davis.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 1);
        console.log(features);
        //
        features = train1Riofrio.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 1);
        console.log(features);

        features = train1Bongard.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 1);
        console.log(features);

        features = train1Wolley.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 1);
        console.log(features);

        //do more 1 examples please

        //Digit 2

        features = train2Sheboy.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 2);
        console.log(features);

        features = train2Downs.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 2);
        console.log(features);

        features = train2Jimmo.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 2);
        console.log(features);

        //Digit 3

        features = train3Shi.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 3);
        console.log(features);

        features = train3Downs.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 3);
        console.log(features);

        features = train3Bongard.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 3);
        console.log(features);

        features = train3Beattie.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 3);
        console.log(features);


        features = train3Li.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 3);
        console.log(features);


        features = train3Riofrio.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 3);
        console.log(features);
        // //
        features = train3Luksevish.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 3);
        console.log(features);

        features = train3part2.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 3);
        console.log(features);

        //do more 3 examples

        //Digit 4

        features = train4.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 4);
        console.log(features);

        features = train4Beattie.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 4);
        console.log(features);

        features = train4Bertschinger.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 4);
        console.log(features);

        features = train4Faucher.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 4);
        console.log(features);


        features = train4Liu.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 4);
        console.log(features);

        features = train4Makovsky.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 4);
        console.log(features);

        features = train5Bertschinger.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 5);
        console.log(features);



        //Digit 6
        features = train6.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 6);
        console.log(features);

        features = train6Potts.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 6);
        console.log(features);
        //
        features = train6Timsina.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 6);
        console.log(features);

        features = train6Bongard.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 6);
        console.log(features);

        features = train6Socia.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 6);
        console.log(features);


        //Digit 7

        features = train7Bongard.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 7);
        console.log(features);

        features = train7Fisher.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 7);
        console.log(features);




        //Digit 8
        features = train8.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 8);
        console.log(features);

        features = train8Timsina.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 8);
        console.log(features);

        //Digit 9
        features = train9.pick(null,null,null,i); //bongard
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 9);
        console.log(features);

    }
    console.log("Training complete!");
    trainingCompleted = true;

}

function Test(){
    for (var i = 0; i < 2; i++ ) {
//i think not supposed to be for looop
        var currentTestingSample = oneFrameOfData.pick(null, null, null, i);
        CenterData()
        currentTestingSample = currentTestingSample.reshape(120).tolist();
        var predictedLabel = knnClassifier.classify(currentTestingSample, GotResults);
    }
}

function HandleFrame (frame){
    var InteractionBox = frame.interactionBox;
    if (frame.hands.length >= 1 ){
        var hand = frame.hands[0];
        var fingers = hand.fingers;
        //console.log(oneFrameOfData.toString())
        //Test();
        HandleHand(hand, frame, InteractionBox)
    }

}
function HandleHand(hand, frame, InteractionBox){
    for (var j = 3; j >= 0; j--){

        for (var i = 0; i < hand.fingers.length; i++){
            finger = hand.fingers[i];
            HandleBone(finger.bones[j], frame, i, j, InteractionBox)
        }

    }
}

function HandleBone(bone,frame,fingerIndex, boneIndex, InteractionBox){

    var R = (1-meanPredictionAccuracy) * 200;
    var G = meanPredictionAccuracy * 200;

    var normalizedPrevJoint = frame.interactionBox.normalizePoint(bone.prevJoint, true);
    var normalizedNextJoint = frame.interactionBox.normalizePoint(bone.nextJoint, true);

    oneFrameOfData.set(fingerIndex, boneIndex, 0, normalizedPrevJoint[0]);
    oneFrameOfData.set(fingerIndex, boneIndex, 1, normalizedPrevJoint[1]);
    oneFrameOfData.set(fingerIndex, boneIndex, 2, normalizedPrevJoint[2]);
    oneFrameOfData.set(fingerIndex, boneIndex, 3, normalizedNextJoint[0]);
    oneFrameOfData.set(fingerIndex, boneIndex, 4, normalizedNextJoint[1]);
    oneFrameOfData.set(fingerIndex, boneIndex, 5, normalizedPrevJoint[2]);

    var canvasPrevX = (window.innerWidth / 2) * normalizedPrevJoint[0];
    var canvasPrevY = (window.innerHeight / 2) * (1 - normalizedPrevJoint[1]);

    var canvasNextX = (window.innerWidth / 2) * normalizedNextJoint[0];
    var canvasNextY = (window.innerHeight / 2) * (1 - normalizedNextJoint[1]);

    xb = canvasPrevX;
    zb = canvasPrevY;

    xt = canvasNextX;
    zt = canvasNextY;


    if (bone.type == 0) {
        strokeWeight(15);
        stroke(R,G,0);
        line(xt, zt, xb, zb);
    }

    if (bone.type == 1) {
        strokeWeight(12);
        stroke(R,G,0);
        line(xt, zt, xb, zb);
    }
    if (bone.type == 2) {
        strokeWeight(10);
        stroke(R,G,0);
        line(xt, zt, xb, zb);
    }
    else if (bone.type == 3) {
        strokeWeight(8);
        stroke(R,G,0);
        line(xt, zt, xb, zb);
    }

}

function CenterXData(){
    xValues = oneFrameOfData.slice([],[],[0,6,3]);
    //console.log(xValues.shape);
    currentXMean = xValues.mean();
    //console.log(currentMean);
    horizontalShift = 0.5 - currentXMean;
    //console.log(horizontalShift);
    for (var currentRow = 0; currentRow < xValues.shape[0]; currentRow++ ) {
        for (var currentColumn = 0; currentColumn < xValues.shape[1]; currentColumn++) {
            currentX = oneFrameOfData.get(currentRow, currentColumn, 0);
            shiftedX = currentX + horizontalShift;
            oneFrameOfData.set(currentRow, currentColumn, 0, shiftedX);
            //console.log(currentX, shiftedX);


            currentX = oneFrameOfData.get(currentRow, currentColumn, 3);
            shiftedX = currentX + horizontalShift;
            oneFrameOfData.set(currentRow, currentColumn, 3, shiftedX);
            //console.log("x: " ,currentX, shiftedX);
        }
    }
    currentXMean = xValues.mean();
    //console.log(currentMean);

}

function CenterYData(){
    yValues = oneFrameOfData.slice([],[],[1,6,3]);
    currentYMean = yValues.mean()
    verticalShift = 0.5 - currentYMean;
    for (var currentRow = 0; currentRow < yValues.shape[0]; currentRow++ ){
        for(var currentColumn = 0; currentColumn < yValues.shape[1]; currentColumn++){
            currentY = oneFrameOfData.get(currentRow,currentColumn,1);
            shiftedY = currentY + verticalShift;
            oneFrameOfData.set(currentRow,currentColumn,1, shiftedY);
            //console.log(currentX, shiftedX);


            currentY = oneFrameOfData.get(currentRow,currentColumn,4);
            shiftedY = currentY + verticalShift;
            oneFrameOfData.set(currentRow,currentColumn,4, shiftedY);
            //console.log("y: ",currentY, shiftedY);
        }
    }
    currentYMean = yValues.mean();
    // console.log(currentYMean);
}

function CenterZData(){
    zValues = oneFrameOfData.slice([],[],[2,6,3]);
    currentZMean = zValues.mean();
    zShift = 0.5 - currentZMean;
    for (var currentRow = 0; currentRow < zValues.shape[0]; currentRow++ ){
        for(var currentColumn = 0; currentColumn < zValues.shape[1]; currentColumn++){
            currentZ = oneFrameOfData.get(currentRow,currentColumn,2);
            shiftedZ = currentZ + zShift;
            oneFrameOfData.set(currentRow,currentColumn,2, shiftedZ);
            //console.log(currentZ, shiftedZ);


            currentZ = oneFrameOfData.get(currentRow,currentColumn,5);
            shiftedZ = currentZ + zShift;
            oneFrameOfData.set(currentRow,currentColumn,5, shiftedZ);
            //console.log(currentZ, shiftedZ);
        }
    }
    currentZMean = zValues.mean();
    //console.log(currentZMean);
}

function CenterData(){
    CenterXData();
    CenterYData();
    CenterZData();


}

function DetermineState(frame){
    //console.log(programState)
    if (frame.hands.length == 0){
        programState = 0;
    }
    else if (HandIsUncentered()){
        programState = 1;
    }
    else {
        programState = 2;
    }
}

function HandleState0(frame){
    TrainKNNIfNotDoneYet();
    DrawImageToHelpUserPutTheirHandOverTheDevice();
}

function HandleState1(frame){
    HandleFrame(frame);

    if (HandIsTooFarToTheLeft()){
        DrawArrowRight();
    }
    else if (HandIsTooFarToTheRight()){
        DrawArrowLeft();
    }
    else if (HandIsTooFarUp()){
        DrawArrowDown();
    }
    else if (HandIsTooFarDown()){
        DrawArrowUp();
    }
    else if(HandIsTooClose()){
        DrawArrowAway();
    }
    else if(HandIsTooFar()){
        DrawArrowTowards();
    }

}

function HandleState2(frame){
    HandleFrame(frame);
    Test();
    DrawLowerRightPanel();
    DetermineWhetherToSwitchDigits();
}

function HandIsUncentered(frame){

    return HandIsTooFarToTheLeft() || HandIsTooFarToTheRight() || HandIsTooFarUp() || HandIsTooFarDown() || HandIsTooClose() || HandIsTooFar();

}

function HandIsTooFarToTheLeft(){
    xValues = oneFrameOfData.slice([],[],[0,6,3]);
    currentXMean = xValues.mean();

    return (currentXMean < 0.25);
}

function DrawArrowRight(){
    image(imgTooLeft,window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight / 2);
}

function HandIsTooFarToTheRight(){
    xValues = oneFrameOfData.slice([],[],[0,6,3]);
    currentXMean = xValues.mean();

    return (currentXMean > 0.75);
}

function DrawArrowLeft(){
    image(imgTooRight,window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight / 2);
}

function HandIsTooFarUp(){
    yValues = oneFrameOfData.slice([],[],[1,6,3]);
    currentYMean = yValues.mean();

    return (currentYMean > 0.75);
}

function DrawArrowDown(){
    image(imgTooHigh,window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight / 2);
}

function HandIsTooFarDown(){
    yValues = oneFrameOfData.slice([],[],[1,6,3]);
    currentYMean = yValues.mean();

    return (currentYMean < 0.25);
}

function DrawArrowUp(){
    image(imgTooLow,window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight / 2);
}

function HandIsTooClose(){
    zValues = oneFrameOfData.slice([],[],[2,6,3]);
    currentZMean = zValues.mean();

    return (currentZMean > 0.75);
}

function DrawArrowAway(){
    image(imgTooClose,window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight / 2);
}

function HandIsTooFar(){
    zValues = oneFrameOfData.slice([],[],[2,6,3]);
    currentZMean = zValues.mean();

    return (currentZMean < 0.25);
}

function DrawArrowTowards(){
    image(imgTooFar,window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight / 2);
}

function TrainKNNIfNotDoneYet(){
    if (trainingCompleted == false) {
        Train();
    }
}

function DrawImageToHelpUserPutTheirHandOverTheDevice(){
    image(img,0,0, window.innerWidth / 2, window.innerHeight / 2);
}

function SignIn(){
    //console.log("hey this function was just called!")

    username = document.getElementById('username').value;
    var list = document.getElementById('users');
    if (IsNewUser(username,list)) {
        CreateNewUser(username,list);
    }else {
        CreateSignInItem(username,list);
    }
    console.log("Signed In - " + username);
    console.log(list.innerHTML);
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

function CreateNewUser(username,list)
{
    var item = document.createElement('li');
    item.id = String(username) + "_name";
    item.innerHTML = String(username);
    list.appendChild(item);
    item = document.createElement('li');
    item.id = String(username) + "_signins";
    item.innerHTML = 1;
    list.appendChild(item);
}


function CreateSignInItem(username,list)
{
    var ID = String(username) + "_signins";
    var listItem = document.getElementById(ID);
    listItem.innerHTML = parseInt(listItem.innerHTML) + 1;
}



Leap.loop(controllerOptions, function(frame) {
    clear();
    DetermineState(frame);

    if (programState==0){
        HandleState0(frame);
    }
    else if (programState==1){
        HandleState1(frame);
    }
    else if (programState==2){
        HandleState2(frame);
    }

});

