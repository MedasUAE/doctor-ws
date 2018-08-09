
function queryPatientListByMobileNo(){
    const columns = [
        ' nr.patient_name','nr.sex', 'nr.date_of_birth','nr.emirates_id','nr.nationality','nr.passport_no','nr.op_number'
    ];
    return  ' select distinct ' + columns.join(',') +' FROM new_registration nr ' +
    ' where nr.mobile= ? ';
}

function queryOfficeList(){
    const columns = [
        'od.office_Id','od.office_Name'
    ];
    return  ' select distinct ' + columns.join(',') +' FROM office_details od ';
}
function queryDepartmentList(){
    const columns = [
        ' ds.department_id','ds.department_name'
    ];
    return  ' select distinct ' + columns.join(',') +' FROM department_setup ds '+
    ' inner join department_office do on ds.department_id=do.department_id '+
     ' where do.office_id=? ';
}

function queryDoctorlistByDepartmentId(){
    const columns = [
        ' ds.doctors_id','ds.doctors_name '
    ];
    return  ' select distinct ' + columns.join(',') +' FROM doctors_office do ' +
   ' inner join doctors_setup ds on ds.doctors_id=do.doctors_id ' +
   ' where do.department_id=? ';
}

function querySlotlistByDateAndDoctorId(){
    const columns = [
        ' apt_mstr.slots',' apt_mstr.doctors_id ','apt_mstr.slot_day'
    ];
    return  ' select distinct ' + columns.join(',') +' from  appointment_schmaster apt_mstr ' +
   ' inner join appointment_sch apt_sch on  apt_mstr.period_id = apt_sch.period_id ' +
   ' WHERE  apt_sch.fromdate <= ? AND ' + 
  ' apt_sch.todate >= ? AND '+  
   'apt_sch.doctors_id = ? AND '+ 
    'apt_sch.slot_day = ? AND '+ 
   ' apt_sch.active_status = \'Y\'';
}

function querySavepatient(){
   
    // return  ' INSERT INTO APPOINTMENTS VALUES ('Consultation','15:00','15:15','',null,'2017-01-31T20:00:00.000Z',null,'MALAK AL JAMAL ','52574696874','N',4,'2017-02-01T09:17:49.000Z','N',null,'+966',11,null,'1','N',null,null,'','','',null,'N','2','','',null,null,null,'N',null,null,22,'Female',null,null,null,'N',null,33,null);
    // ';
}

exports.queryPatientListByMobileNo = queryPatientListByMobileNo;
exports.queryOfficeList = queryOfficeList;
exports.queryDepartmentList = queryDepartmentList;
exports.queryDoctorlistByDepartmentId = queryDoctorlistByDepartmentId;
exports.querySlotlistByDateAndDoctorId = querySlotlistByDateAndDoctorId;
exports.querySavepatient = querySavepatient;





