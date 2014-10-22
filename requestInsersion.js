var insertionRequests,
    insertionWindow = 1000/120; // Only insert for part of a frame, allow time for other opperations.

var now = typeof performance !== 'undefined' ? performance.now.bind(performance): Date.now.bind(Date);

function updateFrame() {
    if(!insertionRequests){
        return;
    }

    var insertionRequest = insertionRequests[insertionRequests.length-1],
        startTime = now();

    do{
        if(!insertionRequests.length){
            break;
        }

        if(!insertionRequest.opperations.length){
            insertionRequests.pop();
            insertionRequest = insertionRequests[insertionRequests.length-1];
            continue;
        }

        var nextOpperation = insertionRequest.opperations.shift();
        insertionRequest.viewContainer.add(nextOpperation[0], nextOpperation[1]);

    } while((now() - startTime) < insertionWindow);

    if(!insertionRequests.length){
        insertionRequests = null;
    }else{
        requestAnimationFrame(updateFrame);
    }
}

function requestInsersion(viewContainer, opperations){
    var callUpdate;
    if(!insertionRequests){
        insertionRequests = [];
        callUpdate = true;
    }

    insertionRequests.push({
        viewContainer: viewContainer,
        opperations: opperations
    });

    if(callUpdate){
        requestAnimationFrame(updateFrame);
    }
};

module.exports = requestInsersion;