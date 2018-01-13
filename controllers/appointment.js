var db_query = require('../db/executeQuery');
var async = require('async');
var moment = require('moment');
var apt_query = require('../db/appointmentQuery');
var helper = require('./helper');
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
    const params = [post_data.appoint_date, post_data.appoint_date, post_data.resource_ids, date.getDay()];

    const join_query = apt_query.queryResourceSlots();
    db_query.paramQuery(join_query, params, (err, result)=>{
        if(err) return next(err);  
        return next(null,result);
    });
}

function getDistinctResourceSlots(post_data, next) {
    getDistinctResources(post_data, (err, resources)=>{
        if(err) return callback(err);
        if(!resources.length) next(null,[]);
        else{
            post_data.resource_ids = resources.map(r=>{return r.resource_id});
            getResourceSlots(post_data, (err, resouceSlots)=>{
                if(err) return next(err);
                const minMax = helper.getMinMaxTime(resouceSlots);
                // console.log(helper.getMinMaxTime(resouceSlots));
                // console.log(helper.makeSlots(minMax.min,minMax.max, resouceSlots[0].intrvl));
                next(null, helper.makeSlots(minMax.min,minMax.max, resouceSlots[0].intrvl));
            });
        }
    });
}

function prepareSlots(results){
    if(results.length < 2) return [];
    if(!Array.isArray(results[2])) return [];
    results[2].forEach(slot => {
        slot.time = moment().set({hour:parseInt(slot.slots.split(":")[0]),minute: parseInt(slot.slots.split(":")[1])}).format("hh:mm A");
        slot.appointments = []
        for (let index = 0; index < results[0].length; index++) {
            if(betweenTime(results[0][index].appoint_hr, results[0][index].appoint_min,slot.slots)){
                (results[0][index].op_number) ? results[0][index].new_patient = false : results[0][index].new_patient = true; //new patient Oldpatient flag
                results[0][index].status = appointmentStatus(results[0][index]); //status selection
                slot.appointments.push(results[0][index]);
                // slot.status = appointmentStatus(results[0][index]); //status selection
                // slot.appointment = results[0][index]; // appointment object
                // index = results[0].length;
            }
        }
    });
    return results[2];
}

function prepareDashboard(results){
    let CONFIRMED = 0, ARRIVED = 0, NOTCONFIRMED = 0, NEW = 0, REVISIT = 0, TOTAL = 0;
    results.forEach(r=>{
        if(r.appointments.length){
            r.appointments.forEach(apt=>{
                if (apt.status == "CONFIRMED") CONFIRMED +=1;
                if (apt.status == "ARRIVED") ARRIVED +=1;
                if (apt.status == "NOTCONFIRMED") NOTCONFIRMED +=1;
                if (!apt.op_number)  NEW +=1;
                if (apt.op_number) REVISIT +=1;
            })
            // if (r.status == "CONFIRMED") CONFIRMED +=1;
            // if (r.status == "ARRIVED") ARRIVED +=1;
            // if (r.status == "NOTCONFIRMED") NOTCONFIRMED +=1;
            // if (!r.appointment.op_number)  NEW +=1;
            // if (r.appointment.op_number) REVISIT +=1;
        }
    });
    return [
        { label: "NOT CONFIRMED", value: NOTCONFIRMED},
        { label: "CONFIRMED", value: CONFIRMED},
        { label: "ARRIVED", value: ARRIVED},
        { label: "NEW", value: NEW},
        { label: "REVISIT", value: REVISIT},
        { label: "TOTAL", value: (NOTCONFIRMED+CONFIRMED+ARRIVED)},
    ];
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
    (aptObj.confirm_status == 'N' && aptObj.appoint_status == 'Y') ? status = global.status.CONFIRMED : status = global.status.NOTCONFIRMED;
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
            getDistinctResourceSlots(post_data, (err, result)=>{
                if(err) return callback(err);
                callback(null, result);
            });
        },
        // function (callback) {
        //     getResourceSlots(post_data, (err, resouceSlots)=>{
        //         if(err) return callback(err);
        //         callback(null, resouceSlots);
        //     });
        // }
    ],
    // optional callback
    function(err, results) {
        if(err) return next(err);
        // console.log(results);
        // results = [[{"appoint_type":"Consultation","appoint_name":"SHAMMA MOHD WITH FATIMA WITH WADHA","confirm_status":"N","appoint_hr":"09:30","appoint_min":"10:30","slot_nos":"2","op_number":null,"appoint_status":"N","bill_submit":"N","office_Name":"Damas Medical Center","office_Id":4},{"appoint_type":"Consultation","appoint_name":"FATIMA ZAHRA 11856","confirm_status":"N","appoint_hr":"10:30","appoint_min":"11:00","slot_nos":"1","op_number":null,"appoint_status":"Y","bill_submit":"N","office_Name":"Damas Medical Center","office_Id":4},{"appoint_type":"Procedure","appoint_name":"MUNA ABDULLAH","confirm_status":"N","appoint_hr":"11:00","appoint_min":"12:30","slot_nos":"3","op_number":"DMC01-23891","appoint_status":"Y","bill_submit":"N","office_Name":"Damas Medical Center","office_Id":4},{"appoint_type":"Consultation","appoint_name":"AMNA AL AHMMADI","confirm_status":"N","appoint_hr":"11:00","appoint_min":"11:30","slot_nos":"1","op_number":"DMC01-23699","appoint_status":"Y","bill_submit":"Y","office_Name":"Damas Medical Center","office_Id":4},{"appoint_type":"Consultation","appoint_name":"ABDULLAH AL MARZOOQI NP","confirm_status":"N","appoint_hr":"12:30","appoint_min":"13:00","slot_nos":"1","op_number":null,"appoint_status":"N","bill_submit":"N","office_Name":"Damas Medical Center","office_Id":4},{"appoint_type":"Consultation","appoint_name":"SARA 13213","confirm_status":"N","appoint_hr":"13:00","appoint_min":"13:30","slot_nos":"1","op_number":null,"appoint_status":"N","bill_submit":"N","office_Name":"Damas Medical Center","office_Id":4},{"appoint_type":"Consultation","appoint_name":"MARYAM YOUSAF ABDULLAH","confirm_status":"N","appoint_hr":"13:30","appoint_min":"14:00","slot_nos":"1","op_number":"DMC01-007081","appoint_status":"N","bill_submit":"N","office_Name":"Damas Medical Center","office_Id":4},{"appoint_type":"Consultation","appoint_name":"AISHA 11367","confirm_status":"N","appoint_hr":"14:00","appoint_min":"14:30","slot_nos":"1","op_number":null,"appoint_status":"N","bill_submit":"N","office_Name":"Damas Medical Center","office_Id":4},{"appoint_type":"Consultation","appoint_name":"SAEED MAJID 12436","confirm_status":"N","appoint_hr":"14:30","appoint_min":"15:00","slot_nos":"1","op_number":null,"appoint_status":"N","bill_submit":"N","office_Name":"Damas Medical Center","office_Id":4}],[],[{"resource_id":18},{"resource_id":17}],[{"slots":"09:30","resource_id":2,"slot_day":4},{"slots":"09:45","resource_id":2,"slot_day":4},{"slots":"10:00","resource_id":2,"slot_day":4},{"slots":"10:15","resource_id":2,"slot_day":4},{"slots":"10:30","resource_id":2,"slot_day":4},{"slots":"10:45","resource_id":2,"slot_day":4},{"slots":"11:00","resource_id":2,"slot_day":4},{"slots":"11:15","resource_id":2,"slot_day":4},{"slots":"11:30","resource_id":2,"slot_day":4},{"slots":"11:45","resource_id":2,"slot_day":4},{"slots":"12:00","resource_id":2,"slot_day":4},{"slots":"12:15","resource_id":2,"slot_day":4},{"slots":"12:30","resource_id":2,"slot_day":4},{"slots":"12:45","resource_id":2,"slot_day":4},{"slots":"13:00","resource_id":2,"slot_day":4},{"slots":"13:15","resource_id":2,"slot_day":4},{"slots":"13:30","resource_id":2,"slot_day":4},{"slots":"13:45","resource_id":2,"slot_day":4},{"slots":"14:00","resource_id":2,"slot_day":4},{"slots":"14:15","resource_id":2,"slot_day":4},{"slots":"14:30","resource_id":2,"slot_day":4},{"slots":"14:45","resource_id":2,"slot_day":4},{"slots":"15:00","resource_id":2,"slot_day":4},{"slots":"15:15","resource_id":2,"slot_day":4},{"slots":"15:30","resource_id":2,"slot_day":4},{"slots":"15:45","resource_id":2,"slot_day":4},{"slots":"16:00","resource_id":2,"slot_day":4},{"slots":"16:15","resource_id":2,"slot_day":4},{"slots":"16:30","resource_id":2,"slot_day":4},{"slots":"16:45","resource_id":2,"slot_day":4},{"slots":"17:00","resource_id":2,"slot_day":4},{"slots":"17:15","resource_id":2,"slot_day":4},{"slots":"17:30","resource_id":2,"slot_day":4},{"slots":"17:45","resource_id":2,"slot_day":4},{"slots":"18:00","resource_id":2,"slot_day":4},{"slots":"18:15","resource_id":2,"slot_day":4},{"slots":"18:30","resource_id":2,"slot_day":4},{"slots":"18:45","resource_id":2,"slot_day":4},{"slots":"19:00","resource_id":2,"slot_day":4},{"slots":"19:15","resource_id":2,"slot_day":4},{"slots":"19:30","resource_id":2,"slot_day":4},{"slots":"19:45","resource_id":2,"slot_day":4},{"slots":"20:00","resource_id":2,"slot_day":4},{"slots":"20:15","resource_id":2,"slot_day":4},{"slots":"20:30","resource_id":2,"slot_day":4},{"slots":"20:45","resource_id":2,"slot_day":4},{"slots":"21:00","resource_id":2,"slot_day":4},{"slots":"21:15","resource_id":2,"slot_day":4},{"slots":"21:30","resource_id":2,"slot_day":4},{"slots":"21:45","resource_id":2,"slot_day":4},{"slots":"22:00","resource_id":2,"slot_day":4},{"slots":"22:15","resource_id":2,"slot_day":4},{"slots":"22:30","resource_id":2,"slot_day":4},{"slots":"22:45","resource_id":2,"slot_day":4},{"slots":"23:00","resource_id":2,"slot_day":4},{"slots":"23:15","resource_id":2,"slot_day":4}]];
        let data = {list:prepareSlots(results), results: results};
        // let data = {list:results};

        data.dashboard = prepareDashboard(data.list);
        return next(null,data);
    });
}

exports.getById = getById;
exports.getByDoctorId = getDocAppointment;
exports.getDoctorSlots = getDoctorSlots;