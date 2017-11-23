var db_query = require('../db/executeQuery');
var async = require('async');
var moment = require('moment');
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

function getByDoctorId (post_data,next){
    if(!post_data) return next("NoPOSTDATA");
    if(!post_data.appoint_date) return next("NoAptDate");
    if(!post_data.doctor_id) return next("NoDocID");
    
    const columns = global.appoint_select_cols;
    const query = 'SELECT ' + columns.join(',') + ' FROM appointments WHERE doctors_id = ? AND appoint_date = ?';
    const params = [post_data.doctor_id, post_data.appoint_date];

    db_query.paramQuery(query, params, (err, result)=>{
        if(err) return next(err);   
        return next(null,result);
    });
}

function getDoctorSlots(post_data, next){
    if(!post_data) return next("NoPostData");
    const columns = ['apt_mstr.slots', 'apt_mstr.doctors_id', 'apt_mstr.slot_day'];
    const date = new Date(post_data.appoint_date);
    const params = [post_data.appoint_date, post_data.appoint_date, post_data.doctor_id, date.getDay()];
    const join_query = 'SELECT ' + columns.join(',') + 
    ' FROM appointment_schmaster apt_mstr JOIN appointment_sch apt_sch ON ' +
    'apt_mstr.period_id = apt_sch.period_id WHERE ' +
    'apt_sch.fromdate <= ? AND ' +
    'apt_sch.todate >= ? AND ' + 
    'apt_sch.doctors_id = ? AND ' +
    'apt_sch.slot_day = ? AND ' +
    'apt_sch.active_status = \'Y\'';

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
                (results[0][index].op_number) ? slot.new_patient = false : slot.new_patient = true;
                slot.status = appointmentStatus(results[0][index]);
                slot.appointment = results[0][index];
                index = results[0].length;
            }
        }
    });
    return results[1];
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
            getByDoctorId(post_data,(err,result)=>{
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
        }
    ],
    // optional callback
    function(err, results) {
        if(err) return next(err);
        return next(null,prepareSlots(results));
    });
}

exports.getById = getById;
exports.getByDoctorId = getDocAppointment;
exports.getDoctorSlots = getDoctorSlots;