
var express = require('express')
var bodyParser = require('body-parser')
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
app.get('/queryPaper', async(req,res) => {
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
app.get('/themDiem',async(req,res) =>{
	let response = await moduleChangePoint.changePoint(req.body.mssv,req.body.maLopHocPhan,req.body.diemmoi);
	res.send(response);
})
app.get('/themGiangVien', async(req,res) =>{
	let respone = await moduleThemGV.themGV(req.body.tengv,req.body.maGiangVien);
	res.send(response);
})
app.get('/truyVanTotNghiep',async(req,res) =>{
	let response = await modulequeryGraduate.queryGraduate(req.body.mssv,'appUser');
	res.send(respone);
})
app.get('/themSinhVien',async(req,res)=>{
	let response = await moduleThemSV.themSV(req.body.mssv,req.body.ten,req.cmnd,'appUser');
	res.send(respone);
})


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
