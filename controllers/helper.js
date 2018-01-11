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

function makeSlots(){
    return null
}

exports.getMinMaxTime = getMinMaxTime;