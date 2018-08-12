
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

<<<<<<< HEAD
function queryPatientDetailByOpNumber(){
    const columns = [
        'op_id', 'registration_date','patient_name','mobile','patient_email','mother_name'
    ];
    return  'select ' + columns.join(',') +' from new_registration where op_number = ?';
}

function getOutPatientList(){
    const columns = [
        'op_id', 'registration_date','patient_name','mobile','patient_email','mother_name'
    ];
    return  'select ' + columns.join(',') +' from new_registration where op_number = ?';
}

function queryAppointmentListByOpNumber(){
    const columns = [
        'dc.consult_id', 'dc.consult_date','ds.doctors_name','od.office_Name'
    ];
    return  ' select distinct ' + columns.join(',') +' FROM doctor_consult dc ' +
    'JOIN doctors_setup ds ON dc.doctors_id = ds.doctors_id ' +
    'JOIN doctors_office do ON do.office_id = dc.office_id ' +
    'JOIN office_details od ON od.office_id = do.office_id ' +
    'where dc.op_number= ?';
}

function queryVitalListByConsultId(){
    const columns = [
        ' vsm.vital_sign', 'vsm.vital_type','vs.value'
    ];
    return  ' select distinct ' + columns.join(',') +' FROM vitalsign_master vsm ' +
    'JOIN vital_signs vs ON vs.vital_sign = vsm.id ' +
     'where  vs.consult_id= ? and vsm.active_status=\'Y\'';
}

function queryTestdetailListByConsultId(){
    const columns = [
        ' docCon.consult_id', 'docCon.op_number',
        'testSet.test_id','testSet.test_Name',
        'testptrset.parameter_id','testptrset.parameter_name','testptrset.group_name',
        'testSet.amount',
        'testDtls.remarks','testDtls.test_Date','testDtls.sms_status',
        ' testresults.test_Result' 
    ];
    return  ' select distinct ' + columns.join(',') +' FROM Test_Details testDtls ' +
    'inner JOIN doctor_Consult docCon  ON docCon.consult_id = testDtls.consult_id ' +
    ' INNER JOIN test_Setup testSet  ON testDtls.test_id = testSet.test_Id ' +
    'INNER JOIN test_results testresults  ON testresults.test_Detailsid = testDtls.test_Detailsid ' +
    'INNER JOIN test_parameter_setup testptrset  ON testptrset.parameter_id = testresults.parameter_id ' +
     ' where docCon.consult_id= ?';
}

function queryExaminationDetailListByConsultId(){
    const columns = [
        ' testdtls.consult_id','testdtls.op_number','testdtls.remarks','testdtls.test_Date','testdtls.test_Status',
        'conlabtest.labtest_price',
        'attacheddoc.document_Filename'
    ];
    return  ' select distinct ' + columns.join(',') +' FROM consult_labtest conlabtest ' +
    'inner join test_details  testdtls on testdtls.consult_id= conlabtest.consult_id  ' +
    ' inner join test_setup  testset on testset.test_Id= testdtls.test_id  ' +
    'inner join attacheddocuments  attacheddoc on attacheddoc.consult_id= testdtls.consult_id ' +
     ' where testdtls.consult_id=? and testset.lab_type=\'X\'';
}

exports.queryDoctorSlots = queryDoctorSlots;
exports.queryResourceSlots = queryResourceSlots;
exports.queryAppointmentByDoctorId = queryAppointmentByDoctorId;
exports.queryDistinctResources = queryDistinctResources;
exports.queryAppointmentByRange = queryAppointmentByRange;
exports.queryPatientDetailByOpNumber = queryPatientDetailByOpNumber;
exports.getOutPatientList = getOutPatientList;
exports.queryAppointmentListByOpNumber = queryAppointmentListByOpNumber;
exports.queryVitalListByConsultId = queryVitalListByConsultId;
exports.queryTestdetailListByConsultId = queryTestdetailListByConsultId;
exports.queryExaminationDetailListByConsultId = queryExaminationDetailListByConsultId;
=======
exports.queryPatientListByMobileNo = queryPatientListByMobileNo;
exports.queryOfficeList = queryOfficeList;
exports.queryDepartmentList = queryDepartmentList;
exports.queryDoctorlistByDepartmentId = queryDoctorlistByDepartmentId;
exports.querySlotlistByDateAndDoctorId = querySlotlistByDateAndDoctorId;
exports.querySavepatient = querySavepatient;





>>>>>>> fc2535a84c45f850988ae13530208522dca90dd1
