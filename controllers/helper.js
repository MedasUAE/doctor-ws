function getMinMaxTime(list){
    let min,max;
    const regExp = /(\d{1,2})\:(\d{1,2})/;
    list.forEach(element => {
        if(!min) min = element.slots;
        if(!max) max = element.slots;
        if(parseInt(element.slots.replace(regExp, "$1$2")) > parseInt(max.replace(regExp, "$1$2")))
            max = element.slots;
        if(parseInt(min.replace(regExp, "$1$2")) > parseInt(element.slots.replace(regExp, "$1$2")))
            min = element.slots;
    });

    return {
        min:min,
        max:max
    }
}

function makeSlots(minTime, maxTime, interval){
    let slots = [];
    const regExp = /(\d{1,2})\:(\d{1,2})/;
    minTime = parseInt(minTime.replace(regExp, "$1$2"));
    maxTime = parseInt(maxTime.replace(regExp, "$1$2"));
    
    while(maxTime > minTime){
        minTime = formatTime(minTime, interval);
        slots.push({slots: minTime});
        minTime = parseInt(minTime.replace(regExp, "$1$2"));
        minTime = minTime + interval;
    }
    return slots;

    //internal method to format time
    function formatTime(time, interval){
        let hrs,minutes;
        if(time.toString().length<4){
            minutes = parseInt(time.toString().substr(1,2));
            hrs = parseInt(time.toString().substr(0,1));    
        }
        else if(time.toString().length == 4){
            minutes = parseInt(time.toString().substr(2,2));
            hrs = parseInt(time.toString().substr(0,2));
        }
        if(minutes>59){
            minutes = "00"
            if(hrs == 23) hrs = 0;
            else hrs = hrs + 1;
        }
        if(hrs<10) hrs = "0" + hrs;
        return hrs + ":" + minutes;
    }
}

exports.getMinMaxTime = getMinMaxTime;
exports.makeSlots = makeSlots;