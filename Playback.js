
oneFrameOfData = nj.array([[[0.21519,0.33678, 1,0.21519,0.33678, 1],
    [0.21519,0.33678, 1,0.33491,0.47264, 1],
    [0.33491,0.47264, 1,0.39958,0.54809, 1],
    [0.39958,0.54809, 1,0.44443,0.60036, 1]],
    [[0.14399,0.40024, 1,0.26954,0.64988, 1],
        [0.26954,0.64988, 1,0.3301,0.77577, 1],
        [0.3301,0.77577, 1,0.39583,0.80014, 1],
        [0.39583,0.80014, 1,0.44884,0.78733, 1]],
    [[0.1133,0.40309, 1,0.21057,0.63517, 1],
        [0.21057,0.63517, 1,0.29156,0.76004, 1],
        [0.29156,0.76004, 1,0.37937,0.77846,0.9663],
        [0.37937,0.77846,0.9663,0.44398,0.75976,0.91095]],
    [[0.08857,0.39476, 1,0.15308,0.59356, 1],
        [0.15308,0.59356, 1,0.2292,0.70764,0.99997],
        [0.2292,0.70764,0.99997,0.31638,0.7288,0.89424],
        [0.31638,0.7288,0.89424,0.38297,0.71465,0.84309]],
    [[0.08177,0.36412, 1,0.11368,0.54092, 1],
        [0.11368,0.54092, 1,0.16223,0.63853,0.95067],
        [0.16223,0.63853,0.95067,0.22164,0.66502,0.87983],
        [0.22164,0.66502,0.87983,0.28551,0.66527,0.83641]]]);

anotherFrameOfData = nj.array([[[0.78583,0.43458, 1,0.78583,0.43458, 1],
    [0.78583,0.43458, 1,0.67236,0.50454, 1],
    [0.67236,0.50454, 1,0.60081,0.5486, 1],
    [0.60081,0.5486, 1,0.55301,0.57803, 1]],
    [[0.84274,0.49498, 1,0.74821,0.67444, 1],
        [0.74821,0.67444, 1,0.69376,0.73883, 1],
        [0.69376,0.73883, 1,0.65379,0.75378, 1],
        [0.65379,0.75378, 1,0.62208,0.75286, 1]],
    [[0.87756,0.49382, 1,0.81396,0.65688, 1],
        [0.81396,0.65688, 1,0.76772,0.7215, 1],
        [0.76772,0.7215, 1,0.72439,0.73653, 1],
        [0.72439,0.73653, 1,0.68939,0.73473,0.97467]],
    [[0.90882,0.48203, 1,0.87828,0.61769, 1],
        [0.87828,0.61769, 1,0.83785,0.67831, 1],
        [0.83785,0.67831, 1,0.7962,0.69585, 1],
        [0.7962,0.69585, 1,0.76117,0.69718,0.95426]],
    [[0.92785,0.44841, 1,0.92759,0.56767, 1],
        [0.92759,0.56767, 1,0.90722,0.60871, 1],
        [0.90722,0.60871, 1,0.87964,0.61849, 1],
        [0.87964,0.61849, 1,0.84628,0.6183,0.99578]]]);
let windowX = window.innerWidth;
let windowY = window.innerHeight;

let frameIndex = 0;
let frameShown = 0;
function draw(){
    clear();
    let xStart;
    let yStart;
    let zStart;
    let xEnd;
    let yEnd;
    let zEnd;
    for(let fingerIndex = 0; fingerIndex < oneFrameOfData.shape[0];++fingerIndex){
        for(let boneIndex = 0; boneIndex < oneFrameOfData.shape[1];++boneIndex){
            if(frameShown===0){
                xStart = windowX*oneFrameOfData.get(fingerIndex,boneIndex,0);
                yStart = windowY*(1-oneFrameOfData.get(fingerIndex,boneIndex,1));
                zStart = oneFrameOfData.get(fingerIndex,boneIndex,2);
                xEnd = windowX*oneFrameOfData.get(fingerIndex,boneIndex,3);
                yEnd = windowY*(1-oneFrameOfData.get(fingerIndex,boneIndex,4));
                zEnd = oneFrameOfData.get(fingerIndex,boneIndex,5);
                // console.log(xStart,yStart,zStart,xEnd,yEnd,zEnd);
                line(xStart,yStart,xEnd,yEnd);
            } else if(frameShown===1) {
                xStart = windowX*anotherFrameOfData.get(fingerIndex,boneIndex,0);
                yStart = windowY*(1-anotherFrameOfData.get(fingerIndex,boneIndex,1));
                zStart = anotherFrameOfData.get(fingerIndex,boneIndex,2);
                xEnd = windowX*anotherFrameOfData.get(fingerIndex,boneIndex,3);
                yEnd = windowY*(1-anotherFrameOfData.get(fingerIndex,boneIndex,4));
                zEnd = anotherFrameOfData.get(fingerIndex,boneIndex,5);
                // console.log(xStart,yStart,zStart,xEnd,yEnd,zEnd);
                line(xStart,yStart,xEnd,yEnd);
            }
        }
    }

    ++frameIndex;
    if(frameIndex===100){
        frameIndex = 0;
        if(frameShown === 1) {
            frameShown = 0;
        } else if(frameShown === 0){
            frameShown = 1;
        }
    }
}
