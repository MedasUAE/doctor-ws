var db_query = require('../db/executeQuery');

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
    const columns = ['appoint_type', 'appoint_date', 'appoint_name', 'patient_age', 'sex', 'confirm_status', 'slot_nos'];
    const query = 'SELECT ' + columns.join(',') + ' FROM appointments WHERE doctors_id=? AND appoint_date = ?';
    const params = [parseInt(post_data.doctor_id), post_data.appoint_date];

    db_query.paramQuery(query, params, (err, result)=>{
        if(err) return next(err);   
        return next(null,result);
    });
}

function getDoctorSlots(post_data, next){
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

exports.getById = getById;
exports.getByDoctorId = getByDoctorId;
exports.getDoctorSlots = getDoctorSlots;