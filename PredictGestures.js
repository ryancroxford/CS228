const knnClassifier = ml5.KNNClassifier();

let trainingCompleted = false;
let testingSampleIndex = 0;
let numSamples = train0.shape[3];
let predictedClassLabels = nj.zeros([numSamples]);

function draw(){
    clear();
    if(!trainingCompleted){
        Train();
    } else {
        console.log(testingSampleIndex);
        Test();
    }

}

function Train(){
    for(let i = 0; i < numSamples;++i){
        let features = train9.pick(null,null,null,i).reshape(120);
        knnClassifier.addExample(features.tolist(),9);
        features = train0.pick(null,null,null,i).reshape(120);
        knnClassifier.addExample(features.tolist(),0);
    }


    trainingCompleted = true;
}

function Test(){
    let currentFeatures = test.pick(null,null,null,testingSampleIndex).reshape(120);
    // let currentLabel = irisData.pick(testingSampleIndex).get(-1);
    let predictedLabel = knnClassifier.classify(currentFeatures.tolist(),GotResults);
}

function GotResults(err,result){
    let resultLabel = parseInt(result.label);
    console.log(testingSampleIndex,resultLabel);
    predictedClassLabels.set(testingSampleIndex,resultLabel);
    // console.log(testingSampleIndex,resultLabel);
    if(testingSampleIndex < numSamples - 1){
        ++testingSampleIndex;
    } else {
        testingSampleIndex = 0;
    }

}
