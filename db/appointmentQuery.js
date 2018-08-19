function queryAppointmentByDoctorId() {
    const columns = [
        'apt.id',
        'apt.appoint_type',
        'apt.appoint_name',
        'apt.confirm_status',
        'apt.appoint_hr',
        'apt.appoint_min',
        'apt.slot_nos',
        'apt.op_number',
        'apt.appoint_status',
        'apt.doctors_id',
        'apt.resource_id',
        'apt.doctor_view',
        'apt.bill_submit',
        'apt.appoint_purpose',
        'office.office_Name',
        'office.office_Id',
        'res.resource_Name'
    ];
    return 'SELECT ' + columns.join(',') +
        ' FROM appointments AS apt JOIN office_details AS office ON apt.office_id = office.office_Id ' +
        'LEFT OUTER JOIN resource_name AS res ON apt.resource_id = res.resource_id ' +
        'WHERE apt.doctors_id = ? AND apt.appoint_date = ? AND cancel_status=\'N\'';
}

function queryAppointmentByRange() {
    const columns = [
        'DATE_FORMAT(apt.appoint_date, "%Y-%m-%d") AS appoint_date',
        'count(appoint_date) AS count'
    ];
    return 'SELECT ' + columns.join(',') +
        ' FROM appointments AS apt JOIN office_details AS office ON apt.office_id = office.office_Id ' +
        'LEFT OUTER JOIN resource_name AS res ON apt.resource_id = res.resource_id ' +
        'WHERE apt.doctors_id = ? AND ' +
        'apt.appoint_date >= ? AND ' +
        'apt.appoint_date <= ? AND ' +
        'cancel_status=\'N\'' +
        ' group by appoint_date';
}

function queryDoctorSlots() {
    const columns = [
        'apt_mstr.slots',
        'apt_mstr.doctors_id',
        'apt_mstr.slot_day'
    ];
    return 'SELECT ' + columns.join(',') +
        ' FROM appointment_schmaster apt_mstr JOIN appointment_sch apt_sch ON ' +
        'apt_mstr.period_id = apt_sch.period_id WHERE ' +
        'apt_sch.fromdate <= ? AND ' +
        'apt_sch.todate >= ? AND ' +
        'apt_sch.doctors_id = ? AND ' +
        'apt_sch.slot_day = ? AND ' +
        'apt_sch.active_status = \'Y\'';
}

function queryResourceSlots() {
    const columns = [
        'apt_mstr.slots',
        'apt_mstr.resource_id',
        'apt_sch.slots \'intrvl\'',
        'apt_mstr.slot_day'
    ];
    return 'SELECT ' + columns.join(',') +
        ' FROM appointment_schmaster_res apt_mstr JOIN appointment_sch_res apt_sch ON ' +
        'apt_mstr.period_id = apt_sch.period_id WHERE ' +
        'apt_sch.fromdate <= ? AND ' +
        'apt_sch.todate >= ? AND ' +
        'apt_sch.resource_id IN (?) AND ' +
        'apt_sch.slot_day = ? AND ' +
        'apt_sch.active_status = \'Y\'';
}

function queryDistinctResources() {
    return 'SELECT DISTINCT (resource_id)' +
        ' FROM appointments WHERE doctors_id = ? AND appoint_date = ?';
}

function queryPatientDetailByOpNumber() {
    const columns = [
        'op_id', 'registration_date', 'patient_name', 'mobile', 'patient_email', 'mother_name'
    ];
    return 'select ' + columns.join(',') + ' from new_registration where op_number = ?';
}

function getOutPatientList() {
    const columns = [
        'op_id', 'registration_date', 'patient_name', 'mobile', 'patient_email', 'mother_name'
    ];
    return 'select ' + columns.join(',') + ' from new_registration where op_number = ?';
}

function queryOfficeList() {
    const columns = [
        'od.office_Id', 'od.office_Name'
    ];
    return ' select distinct ' + columns.join(',') + ' FROM office_details od ';
}
function queryDepartmentListByOfficeId() {
    const columns = [
        ' ds.department_id', 'ds.department_name'
    ];
    return ' select distinct ' + columns.join(',') + ' FROM department_setup ds ' +
        ' inner join department_office do on ds.department_id=do.department_id ' +
        ' where do.office_id= ? ';
}

function queryDoctorlistByDepartmentIdAndOfficeId() {
    const columns = [
        ' ds.doctors_id', 'ds.doctors_name '
    ];
    return ' select distinct ' + columns.join(',') + ' FROM doctors_office do ' +
        ' inner join doctors_setup ds on ds.doctors_id=do.doctors_id ' +
        ' where do.department_id=?  and do.office_id=?';
}

function queryTimeSlotlistByAptDateDoctorIdAndOfficeId() {
    const columns = [
        ' apt_mstr.slots', ' apt_mstr.doctors_id ', 'apt_mstr.slot_day'
    ];
    return ' select distinct ' + columns.join(',') + ' from  appointment_schmaster apt_mstr ' +
        ' inner join appointment_sch apt_sch on  apt_mstr.period_id = apt_sch.period_id ' +
        ' WHERE  apt_sch.fromdate <= ? AND ' +
        ' apt_sch.todate >= ? AND ' +
        'apt_sch.doctors_id = ? AND ' +
        'apt_sch.slot_day = ? AND ' +
        ' apt_sch.office_id=? AND ' +
        ' apt_sch.active_status = \'Y\'';
}


function queryAppointmentListByOpNumber() {
    const columns = [
        'dc.consult_id', 'dc.consult_date', 'ds.doctors_name', 'od.office_Name'
    ];
    return ' select distinct ' + columns.join(',') + ' FROM doctor_consult dc ' +
        'JOIN doctors_setup ds ON dc.doctors_id = ds.doctors_id ' +
        'JOIN doctors_office do ON do.office_id = dc.office_id ' +
        'JOIN office_details od ON od.office_id = do.office_id ' +
        'where dc.op_number= ?';
}

function queryVitalListByConsultId() {
    const columns = [
        ' vsm.vital_sign', 'vsm.vital_type', 'vs.value'
    ];
    return ' select distinct ' + columns.join(',') + ' FROM vitalsign_master vsm ' +
        'JOIN vital_signs vs ON vs.vital_sign = vsm.id ' +
        'where  vs.consult_id= ? and vsm.active_status=\'Y\'';
}

function queryTestdetailListByConsultId() {
    const columns = [
        ' docCon.consult_id', 'docCon.op_number',
        'testSet.test_id', 'testSet.test_Name',
        'testptrset.parameter_id', 'testptrset.parameter_name', 'testptrset.group_name',
        'testSet.amount',
        'testDtls.remarks', 'testDtls.test_Date', 'testDtls.sms_status',
        ' testresults.test_Result'
    ];
    return ' select distinct ' + columns.join(',') + ' FROM Test_Details testDtls ' +
        'inner JOIN doctor_Consult docCon  ON docCon.consult_id = testDtls.consult_id ' +
        ' INNER JOIN test_Setup testSet  ON testDtls.test_id = testSet.test_Id ' +
        'INNER JOIN test_results testresults  ON testresults.test_Detailsid = testDtls.test_Detailsid ' +
        'INNER JOIN test_parameter_setup testptrset  ON testptrset.parameter_id = testresults.parameter_id ' +
        ' where docCon.consult_id= ?';
}

function queryExaminationDetailListByConsultId() {
    const columns = [
        ' testdtls.consult_id', 'testdtls.op_number', 'testdtls.remarks', 'testdtls.test_Date', 'testdtls.test_Status',
        'conlabtest.labtest_price',
        'attacheddoc.document_Filename'
    ];
    return ' select distinct ' + columns.join(',') + ' FROM consult_labtest conlabtest ' +
        'inner join test_details  testdtls on testdtls.consult_id= conlabtest.consult_id  ' +
        ' inner join test_setup  testset on testset.test_Id= testdtls.test_id  ' +
        'inner join attacheddocuments  attacheddoc on attacheddoc.consult_id= testdtls.consult_id ' +
        ' where testdtls.consult_id=? and testset.lab_type=\'X\'';
}

function querySaveAppointmentDetail() {
    var insertQuery = 'INSERT INTO appointments(appoint_type, appoint_hr, appoint_min,  appoint_date,op_number,' +
        ' appoint_name, mobile, appoint_status, doctors_id, entry_date, cancel_status, mobile_code, enteredby,' +
        ' slot_nos, confirm_status, bill_submit, office_id, sms_status)' +
        ' VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    return insertQuery;
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
exports.queryOfficeList = queryOfficeList;
exports.queryDepartmentListByOfficeId = queryDepartmentListByOfficeId;
exports.queryDoctorlistByDepartmentIdAndOfficeId = queryDoctorlistByDepartmentIdAndOfficeId;
exports.queryTimeSlotlistByAptDateDoctorIdAndOfficeId = queryTimeSlotlistByAptDateDoctorIdAndOfficeId;
exports.querySaveAppointmentDetail = querySaveAppointmentDetail;

