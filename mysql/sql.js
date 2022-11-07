module.exports = {
    patientList : `select * from patient`,
    bedList : `select * from bed`,
    patientInsert :`insert into patient set ?`,
    patientUpdate : `update patient set ? where patient_id = ?`,
    patientDelete : `delete from patient where patient_id = ?`,
    patientHandle : `select * from patient`,
    dbList : `select * from ?`
}