function queryAppointmentByDoctorId(){
    const columns = [
        'apt.appoint_type', 
        'apt.appoint_name', 
        'apt.confirm_status', 
        'apt.appoint_hr' ,
        'apt.appoint_min' , 
        'apt.slot_nos', 
        'apt.op_number', 
        'apt.appoint_status', 
        // 'apt.doctor_view', 
        'apt.bill_submit',
        'office.office_Name',
        'office.office_Id'
    ];
    return  'SELECT ' + columns.join(',') + 
            ' FROM appointments as apt join office_details as office on apt.office_id = office.office_Id '+
            'WHERE apt.doctors_id = ? AND apt.appoint_date = ?';
}

function queryDoctorSlots(){
    const columns = [
        'apt_mstr.slots', 
        'apt_mstr.doctors_id', 
        'apt_mstr.slot_day'
    ];
    return  'SELECT ' + columns.join(',') + 
            ' FROM appointment_schmaster apt_mstr JOIN appointment_sch apt_sch ON ' +
            'apt_mstr.period_id = apt_sch.period_id WHERE ' +
            'apt_sch.fromdate <= ? AND ' +
            'apt_sch.todate >= ? AND ' + 
            'apt_sch.doctors_id = ? AND ' +
            'apt_sch.slot_day = ? AND ' +
            'apt_sch.active_status = \'Y\'';
}

function queryResourceSlots(){
    const columns = [
        'apt_mstr.slots', 
        'apt_mstr.resource_id', 
        'apt_sch.slots \'interval\'',
        'apt_mstr.slot_day'
    ];
    return  'SELECT ' + columns.join(',') + 
            ' FROM appointment_schmaster_res apt_mstr JOIN appointment_sch_res apt_sch ON ' +
            'apt_mstr.period_id = apt_sch.period_id WHERE ' +
            'apt_sch.fromdate <= ? AND ' +
            'apt_sch.todate >= ? AND ' + 
            'apt_sch.resource_id IN (?) AND ' +
            'apt_sch.slot_day = ? AND ' +
            'apt_sch.active_status = \'Y\'';
}

function queryDistinctResources(){
    return  'SELECT DISTINCT (resource_id)' +
            ' FROM appointments WHERE doctors_id = ? AND appoint_date = ?';
}

exports.queryDoctorSlots = queryDoctorSlots;
exports.queryResourceSlots = queryResourceSlots;
exports.queryAppointmentByDoctorId = queryAppointmentByDoctorId;
exports.queryDistinctResources = queryDistinctResources;