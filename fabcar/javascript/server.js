var express = require('express')
var bodyParser = require('body-parser')
const { KJUR, KEYUTIL } = require('jsrsasign');
const CryptoJS = require('crypto-js');

var app = express()
var port = 3000
var moduleEnroll = require('./enrollAdmin.js')
var registerUser = require('./registerUser.js')
//var moduleInvoke = require('./invoke.js')
//var moduleQuery = require('./query.js')
var moduleApprove = require('./approve.js')
var moduleChangePoint = require('./suaDiem.js')
var modulequeryGraduate = require('./truyVanTotNghiep.js')
var moduleThemGV = require('./themGiangVien.js')
var moduleThemSV = require('./themSinhVien.js')
var moduleTruyVan = require('./truyVan.js')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(express.static('../../frontend'))
/*app.post('/', (req, res)=> {   
        res.writeHead(200,{"Content-Type" : "text/plain"});
        res.write("MSSV:"+req.body.mssv)
        res.write("Ho va ten:"+req.body.name)
        res.write("Nam tot nghiep:"+req.body.year)
        res.write("Loai tot nghiep:"+req.body.type)
        ret = s.end()
})*/
app.post('/queryPaper', async(req,res) => {
     console.log(req.query.mssv)
     let response = await moduleQuery.queryPaper(req.query.mssv)
     //let papersRecord = JSON.parse(response)
     res.send(response)
})
app.post('/',(req, res)=> {
    console.log(req.body)
    moduleInvoke.submitPaper(req.body.mssv, req.body.name, req.body.year, req.body.type)
    .then((response) => {
      res.send(response)
      console.log(response)
    })
})

app.post('/approvePaper', async(req,res) => {
     console.log(req.query.mssv)
     approve = req.body.submit // TODO: Edit here for approval permission
     console.log('approval state:', approve)
     let response = await moduleApprove.approvePaper(req.body.mssv, approve)
     //let papersRecord = JSON.parse(response)
     res.send(response)
})
app.post('/themDiem',async(req,res) =>{
	let mssv = req.body.mssv
	let ki = req.body.hocky
	let ma = req.body.maLopHocPhan
	let diem = req.body.diemmoi
	let dinhdanh = req.body.dinhdanh
	let pk = req.body.privateKey
	let data = mssv+ki+ma+diem+dinhdanh
	var hashToAction = CryptoJS.SHA256(data).toString();
	//console.log("Hash of the file: " + hashToAction);
	var sig = new KJUR.crypto.Signature({"alg": "SHA256withECDSA"});
	sig.init(pk, "");
	sig.updateHex(hashToAction);
	var sigValueHex = sig.sign();
	var sigValueBase64 = new Buffer.from(sigValueHex, 'hex').toString('base64');
	console.log("Signature: " + sigValueBase64); 
	let response = await moduleChangePoint.changePoint(mssv,ki,ma,diem,dinhdanh,sigValueBase64);
	res.send(response);
})
app.post('/themGiangVien', async(req,res) =>{
	let dinhdanh = req.body.dinhdanh
	let msgv  = req.body.maGiangVien
	let response = await moduleThemGV.registerUser(dinhdanh,msgv);
	res.send(response);
})
app.post('/truyVanTotNghiep',async(req,res) =>{
	let mssv = req.body.mssv
	let response = await modulequeryGraduate.queryGraduate(mssv);
	res.send(response);
})
app.post('/themSinhVien',async(req,res)=>{   
  let ten = req.body.ten
  let mssv = req.body.mssv
  let cmnd = req.body.cmnd

	let response = await moduleThemSV.themSV(mssv,ten,cmnd,'appUser');
  res.send(response);
  console.log(response)
})
app.post('/truyVan',async(req,res)=>{
  let mssv = req.body.mssv
  let response = await moduleTruyVan.truyVan(mssv,'appUser');
  res.send(response);
  console.log(response)
})


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
