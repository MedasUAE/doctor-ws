var db_query = require('../db/executeQuery');
var async = require('async');
var moment = require('moment');
var apt_query = require('../db/appointmentQuery');
require('../config/global');

function getById (id,next){
    const columns = ['appoint_type', 'appoint_date'];
    const query = 'select ' + columns.join(',') +' from appointments where id = ?';
    const params = [parseInt(id)];
    
    db_query.paramQuery(query, params, (err, result)=>{
        if(err) return next(err);   
        return next(null,result);
    })
}

function getAppointmentByDoctorId (post_data,next){
    if(!post_data) return next("NoPOSTDATA");
    if(!post_data.appoint_date) return next("NoAptDate");
    if(!post_data.doctor_id) return next("NoDocID");
    
    const query = apt_query.queryAppointmentByDoctorId();
    const params = [post_data.doctor_id, post_data.appoint_date];

    db_query.paramQuery(query, params, (err, result)=>{
        if(err) return next(err);   
        return next(null,result);
    });
}

function getDoctorSlots(post_data, next){
    if(!post_data) return next("NoPostData");
    const date = new Date(post_data.appoint_date);
    const params = [post_data.appoint_date, post_data.appoint_date, post_data.doctor_id, date.getDay()];
    

    const join_query = apt_query.queryDoctorSlots();
    db_query.paramQuery(join_query, params, (err, result)=>{
        if(err) return next(err);  
        return next(null,result);
    });
}

function getDistinctResources(post_data, next){
    if(!post_data) return next("NoPostData");
    const date = new Date(post_data.appoint_date);
    const params = [post_data.doctor_id, post_data.appoint_date];
    

    const query = apt_query.queryDistinctResources();
    db_query.paramQuery(query, params, (err, result)=>{
        if(err) return next(err);  
        return next(null,result);
    });
}

function getResourceSlots(post_data, next){
    if(!post_data) return next("NoPostData");
    const date = new Date(post_data.appoint_date);
    const params = [post_data.appoint_date, post_data.appoint_date, post_data.doctor_id, date.getDay()];

    const join_query = apt_query.queryResourceSlots();
    db_query.paramQuery(join_query, params, (err, result)=>{
        if(err) return next(err);  
        return next(null,result);
    });
}

function prepareSlots(results){
    if(results.length < 2) return [];
    if(!Array.isArray(results[1])) return [];
    results[1].forEach(slot => {
        slot.time = moment().set({hour:parseInt(slot.slots.split(":")[0]),minute: parseInt(slot.slots.split(":")[1])}).format("hh:mm A");
        for (let index = 0; index < results[0].length; index++) {
            if(betweenTime(results[0][index].appoint_hr, results[0][index].appoint_min,slot.slots)){
                (results[0][index].op_number) ? slot.new_patient = false : slot.new_patient = true; //new patient Oldpatient flag
                slot.status = appointmentStatus(results[0][index]); //status selection
                slot.appointment = results[0][index]; // appointment object
                index = results[0].length;
            }
        }
    });
    return results[1];
}

function prepareDashboard(results){
    let CONFIRMED = 0, ARRIVED = 0, NOTCONFIRMED = 0, NEW = 0, REVISIT = 0, TOTAL = 0;
    results.forEach(r=>{
        if(r.appointment){
            if (r.status == "CONFIRMED") CONFIRMED +=1;
            if (r.status == "ARRIVED") ARRIVED +=1;
            if (r.status == "NOTCONFIRMED") NOTCONFIRMED +=1;
            if (!r.appointment.op_number)  NEW +=1;
            if (r.appointment.op_number) REVISIT +=1;
        }
    });
    return [
        { label: "NOT CONFIRMED", value: NOTCONFIRMED},
        { label: "CONFIRMED", value: CONFIRMED},
        { label: "ARRIVED", value: ARRIVED},
        { label: "NEW", value: NEW},
        { label: "REVISIT", value: REVISIT},
        { label: "TOTAL", value: (NOTCONFIRMED+CONFIRMED+ARRIVED)},
    ]
}

function betweenTime(fromTime,toTime,slot) {
    var regExp = /(\d{1,2})\:(\d{1,2})/;
    if(
        (parseInt(fromTime.replace(regExp, "$1$2$3")) <= parseInt(slot.replace(regExp,"$1$2$3")))
        &&
        (parseInt(slot.replace(regExp,"$1$2$3")) <= parseInt(toTime.replace(regExp, "$1$2$3")))
    ){
        return true;
    }
    else {return false;}
}

function appointmentStatus(aptObj){
    let status;
    (aptObj.confirm_status == 'Y') ? status = global.status.CONFIRMED : status = global.status.NOTCONFIRMED;
    if(aptObj.doctor_view == 'Y') status = global.status.ARRIVED;
    if(aptObj.bill_submit == 'Y') status = global.status.CLOSED;
    if(aptObj.appoint_name.toUpperCase() == 'BLOCKED') status = global.status.BLOCKED;
    return status;
}
    
function getDocAppointment(post_data, next){
    async.parallel([
        function(callback) {
            getAppointmentByDoctorId(post_data,(err,result)=>{
                if(err) return callback(err);
                callback(null, result);
            })
        },
        function(callback) {
            getDoctorSlots(post_data,(err,slots)=>{
                if(err) return callback(err);
                // console.log(slots);
                callback(null, slots);
            })
        },
        function (callback) {
            getDistinctResources(post_data, (err, resouces)=>{
                if(err) return callback(err);
                callback(null, resouces);
            });
        },
        function (callback) {
            getResourceSlots(post_data, (err, resouceSlot)=>{
                if(err) return callback(err);
                callback(null, resouceSlots);
            });
        }
    ],
    // optional callback
    function(err, results) {
        if(err) return next(err);
        console.log(results);
        let data = {list:prepareSlots(results)};
        data.dashboard = prepareDashboard(data.list);
        return next(null,data);
    });
}

exports.getById = getById;
exports.getByDoctorId = getDocAppointment;
exports.getDoctorSlots = getDoctorSlots;