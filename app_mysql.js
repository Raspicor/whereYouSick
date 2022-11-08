//MySql 연동 테스트용임 API짜서 수정예정
const express = require("express");
require('dotenv').config({ path: 'mysql/.env' });
const mysql = require("./mysql");
const database = require('mysql');
const app = express();

const pool = database.createPool({
    connectionLimit : process.env.MYSQL_LIMIT,
    host            : process.env.MYSQL_HOST,
    port            : process.env.MYSQL_PORT,
    user            : process.env.MYSQL_USERNAME,
    password        : process.env.MYSQL_PASSWORD,
    database        : process.env.MYSQL_DB
});


app.get("/", (_, res) => res.redirect("/main"));
app.use(express.json({
    limit : '50mb'
}));

app.listen(3000, () => {
    console.log('Listenning on http://localhost:3000');
});

const loginPatient = `select patient_id from patient;`;
//로그인한 환자의 id를 가져와서 반환하는 함수 필요
//--------------------------------------------------------------------------------------------------------------------------------
//on Web
app.get("/getrequest", async(req, res) => {
    try {
        const notification = `select patient.name, bed.bed_id, request.requests, request.requesttime from patient, bed, request where bed.token = patient.token and patient.token = request.token;`;
        pool.query(notification, function (err, result) {
            //console.log(result);
            return res.status(200).json(result);
        });
    } catch {

    }
})


app.get("/patientsearch", async (req, res) => {
    //여기서는 항상 리퀘스트랑 간호사 호출이랑 실행이 되고 있어야함
    //데이터 변동이 있으면 select 해서 웹이 showDialog;
    try {
        const searchPatient = `select * from patient`;
        console.log(req.params);
        pool.query(searchPatient, function (err, result) {
            return res.status(200).json(result);
        });
    } catch (err){
        return res.status(400).json({error : err});
    }
});

app.get("/adminweb", async (req, res) => {
    //여기서는 항상 리퀘스트랑 간호사 호출이랑 실행이 되고 있어야함
    //데이터 변동이 있으면 select 해서 웹이 showDialog;
    try {
        const notification = `select * from call`;
        pool.query(notification, function (err, result) {
            return res.status(200).json(result);
        });
    } catch (err){
        return res.status(400).json({error : err});
    }
});
app.get("/adminMain", async (req, res) => {
    try {
        const getRequirement = `select * from request`;
        pool.query(getRequirement, function (err, result) {
            return res.status(200).json(result);
        });
    } catch (err){
        return res.status(400).json({error : err});
    }
});

//선택한 DB에서 가져오기
app.get("/getDatabase", async(req, res) => {
    try {
        const getData = `select * from ${req.body.db}`
        pool.query(getData, function (err, result) {
            console.log(result);
            return res.status(200).json(result);
        }); 
    } catch (err) {
        return res.status(400).json({error : err});
    }
});
app.get("/patients", async(req, res) => {
    try {
        const getData = `select * from patient`
        pool.query(getData, function (err, result) {
            console.log(result);
            return res.status(200).json(result);
        }); 
    } catch (err) {
        return res.status(400).json({error : err});
    }
});

//환자 정보 수정
app.put('/patients/update', async(req, res) => {
    try{
        const result = await mysql.query('patientUpdate', req.body.param);
        console.log('Successfully updated!');
        return res.status(200).json('Successfully updated!');
    } catch (err) {
        return res.status(400).json({error : err});
    }
});

app.get("/getRequest", async(req, res) => {
    try {
        const getRequest = `select * from request order by request_id`;
        pool.query(getRequest, function (err, result) {
            //console.log(result);
            return res.status(200).json(result);

        }); 
    } catch (err) {
        return res.status(400).json({error : err});
    }
});

app.post("/writenotice", async(req, res) => {
    try {
        const writeNotice = `insert into notification(title, content) values ('${req.body.title}', '${req.body.content}')`;
        pool.query(writeNotice, function (err, result) {
            console.log(req.body);
            console.log('successfully write!');
            return res.status(200).json(result);
        }); 
    } catch (err) {
        return res.status(400).json({error : err});
    }
});

//app to server
//--------------------------------------------------------------------------------------------------------------------------------

//간호사 호출
app.post("/call", async(req, res) => {
    try {
        const insertCallTime = `insert into callnurse(token, requesttime) values ('${req.body.token}', '${req.body.requesttime}')`;
        pool.query(insertCallTime, function (err, result) {
            console.log(req.body);
            console.log('successfully called!');
            return res.status(200).json(result);
        }); 
    } catch (err) {
        return res.status(400).json({error : err});
    }
});

//환자 정보 등록
app.post('/register', async (req, res) => {
    try {
        const registerPatient = `insert into patient(name, gender, birthday, phone, address, reason, patient_outdate, patient_indate, token) 
        values('${req.body.name}','${req.body.gender}','${req.body.birthday}','${req.body.phone}',
        '${req.body.address}','${req.body.reason}','${req.body.patient_outdate}','${req.body.patient_indate}','${req.body.token}')`;
        pool.query(registerPatient, function (err, result) {
            console.log(req.body);
            console.log(`Successfully Requests!`);
            return res.status(200).json(result);
        });
    } catch(err){
        return res.status(400).json({error : err});
    }
});

//요청 사항 전달
app.post('/request', async(req, res) => {
    try{
        const addRequest = `insert into request(token,requests,requesttime) values ('${req.body.token}','${req.body.requests}','${req.body.requesttime}')`;
        pool.query(addRequest, function (err, result) {
            console.log(req.body);
            console.log(result);
            console.log(`Successfully Requests!`);
            return res.status(200).json(result);
        });
    } catch(err){
        return res.status(400).json({error : err});
    }
});
app.post('/meal', async(req, res) => {
    try{
        console.log(req.body);
        const mealRequest = `insert into meal(token, meal, requesttime) values ('${req.body.token}', '${req.body.meal}', '${req.body.requesttime}')`;
        pool.query(mealRequest, function (err, result) {
            console.log(req.body);
            console.log('successfully requested!');
            return res.status(200).json(result);
        });
    } catch(err){
        return res.status(400).json({error : err});
    }
});

app.post('/certificates', async(req, res) => {
    try{
        const certificatesRequest = `insert into certification(token, certificates, requesttime) values ('${req.body.token}', '${req.body.certificates}', '${req.body.requesttime}')`;
        pool.query(certificatesRequest, function (error, result) {
            console.log(req.body);
            console.log(result);
            return res.status(200).json(result);
        });
    } catch(err){
        return res.status(400).json({error : err});
    }
});


app.get('/notice' ,async(req, res) => {
    try{
        const getNotice = `select * from notification`;
        pool.query(getNotice, function (err, result) {
            console.log(req.body);
            console.log(result);
            return res.status(200).json(result);
        });
    } catch(err){
        return res.status(400).json({error : err});
    }
});