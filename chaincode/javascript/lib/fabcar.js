'use strict';
const { Contract } = require('fabric-contract-api');
const ClientIdentity = require('fabric-shim').ClientIdentity;
class QuanLyDiem extends Contract {
	
	async getIdentity(ctx) { 
		let cid = new ClientIdentity(ctx.stub)
		let id = cid.getAttributeValue('name')
		return id
	}

	async khoiTao(ctx){
		const obj_sv = 
		{
			"B1609548":{
				"ten": "Truong Thi Phuong Thao",
				"cmnd": "092198000255",
				"hocphan":{
				    "CT173-01":{
				    	"diem": 7,
				    	"tinchi":3,
				    	"choboi": "GV-001-TMThai"
				    },
				    "CT174-01":{
				    	"diem": 4,
				    	"tinchi":3,
				    	"choboi": "GV-002-VTThuc"
				    },
				    "ML002-02":{
				    	"diem": 10,
				    	"tinchi":3,
                                        "choboi": "GV-003-PVBua"
				    },
				    "KL001-01":{
				    	"diem": 8,
				    	"tinchi":3,
				    	"choboi": "GV-003-DTNguyen"
				    }
				 }
			},
		    "AllowedUser":[
				{"tengv": "GV-002-PTCang"},
				{"tengv": "GV-003-NTNghe"}
			]		
		}
		await ctx.stub.putState("B1609548",Buffer.from(JSON.stringify(obj_sv["B1609548"])))
		await ctx.stub.putState("AllowedUser",Buffer.from(JSON.stringify(obj_sv["AllowedUser"])))
		console.info(obj_sv["B1609548"])
		console.info(obj_sv["AllowedUser"])
	}
	// Khoi tao hoc phan
	async khoiTaoCacHocPhan(ctx, hocphan) {
		// TODO: Privilege
		ctx.stub.putState("__hocphan__", hocphan)
	}
	// khoi tao giang vien
	async khoiTaoGiangVien(ctx, giangvien){
		ctx.stub.putState("__giangvien__", giangvien)
		
	}
	// them giang vien 
	async themGiangVien(ctx, mahp, tengv, magv){ 
		 // let tatCaGiangVien = JSON.parse(await ctx.stub.getState('__giangvien__'))
		 // let gvinfo = JSON.parse(tatCaGiangVien.toString())
		 let tatCaGiangVien = await ctx.stub.getState('__giangvien__') 
		 const gvinfo = JSON.parse(tatCaGiangVien.toString())
		 console.log("Giang vien",gvinfo)
		const GV = {	
			'tengv' : tengv,
			'magv' : magv
		}
	   const result = await ctx.stub.putState(magv, Buffer.from(JSON.stringify(GV)));
	   console.log("them giang vien thanh cong")
	}
	//truy van giang vien
	//   async truyVanGV(ctx, magv){ // truy van cac diem cua sinh vien
	// 	const gv = await ctx.stub.getState(magv)
	// 	// console.log("Giang vien:",gv.toString())
	// 	return gv.toString()
	// }
	 async themSinhVien(ctx, mssv, ten, cmnd) {
		// console.log(ctx.stub.getState('__hocphan__'))
		let tatCaHocPhan = JSON.parse(await ctx.stub.getState('__hocphan__'))
		// let tatCaSinhVien = JSON.parse(await ctx.stub.getState('__sinhvien__')) // e ko can lam cai nay
		// TODO: add middleware
        
		const sinhvien = {
			'ten': ten,
			'cmnd': cmnd,
			'hocki' : {
				'hocki1nam1' : {
					
				},
				'hocki2nam1' : {

				},
				'hocki3nam1' : {

				},
				'hocki1nam2' : {

				},
				'hocki2nam2' : {

				},
				'hocki3nam2' : {

				},
				'hocki1nam3' : {

				},
				'hocki2nam3' : {

				},
				'hocki3nam3' : {

				},
				'hocki4nam1' : {

				},
				'hocki4nam2' : {

				},
				'hocki4nam3' : {

				},
				'hocki5nam1' : {

				}
			} 
				
		}
	    const result = await ctx.stub.putState(mssv, Buffer.from(JSON.stringify(sinhvien)));
	    console.log("them sinh vien thanh cong")
	    return "Them Sinh vien thanh cong"
	}
	

	// Giang vien cho diem
	async choDiem(ctx, mssv, ki, maLopHocPhan,diemmoi){
		const identity = await this.getIdentity(ctx)
		//const identity = 'test'
	    const sv = await ctx.stub.getState(mssv);
	    const svinfo = JSON.parse(sv.toString());
	    const gv = await ctx.stub.getState('__giangvien__')
	    const gvinfo = JSON.parse(gv.toString())
        let GV = gvinfo
        // console.log(GV[maLopHocPhan].magv,null,4)
	    for(let hocki in svinfo.hocki){
	    	if (svinfo.hocki[ki][maLopHocPhan] != undefined) {
	    		svinfo.hocki[ki][maLopHocPhan] = {
	    			'diem' : diemmoi,
	    			'magv' : GV[maLopHocPhan].magv,
	    			'tengv' : GV[maLopHocPhan].tengv
	    		}
	    	}

	    }
	    const result = await ctx.stub.putState(mssv, Buffer.from(JSON.stringify(svinfo)))
	    console.log("Ket qua cho diem:",JSON.stringify(svinfo, null, 4))
	}
    async truyVan(ctx, mssv){ // truy van cac diem cua sinh vien
		const sv = await ctx.stub.getState(mssv)
		console.log("Sinh vien:"+sv.toString())
		return sv.toString()
	}
	
	async dangKyHocPhan(ctx, mssv, hocki, hocphan) {
		const sv = await ctx.stub.getState(mssv);
		const svinfo = JSON.parse(sv.toString());
		// todo: Kiem tra hocphan xem hop le k
		if (svinfo.hocki[hocki] != undefined){
			svinfo.hocki[hocki] = hocphan
			await ctx.stub.putState(mssv, Buffer.from(JSON.stringify(svinfo)));
		} 

		else throw 'khong the dang ky duoc nua'
	}
	async tinhTichLuy(ctx, mssv, hocki){// xet xem sinh vien co tot nghiep khong 
			// lay ra sinh vien
			const sv = await ctx.stub.getState(mssv) 
			const svinfo = JSON.parse(sv.toString()) 
			// lay ra hoc phan
			const hp = await ctx.stub.getState('__hocphan__')
			const hpinfo = JSON.parse(hp.toString())
			let sinhvien = svinfo
			let tthp = hpinfo
			let tong = 0;
			let tongSoChiTL = 0;
			for(let hocphan in sinhvien.hocki[hocki]){
				let diem = sinhvien.hocki[hocki][hocphan].diem
				switch(diem){
				     	case 'A' : diem = 4.0;  break;
				     	case 'B+': diem = 3.5; break;
				     	case 'B' : diem = 3.0; break;
				     	case 'C+': diem = 2.5; break;
				     	case 'C': diem = 2.0; break;
				     	case 'D+': diem = 1.5; break;
				     	case 'D': diem = 1.0; break;
				     	case 'F': diem = 0.0; break;
				     }
				if(diem!='F'){
					tong +=diem * tthp[hocphan].sotinchi
					tongSoChiTL += tthp[hocphan].sotinchi
				}
			}
			const diemTBTL = tong/tongSoChiTL
			return {
				   'diem' : diemTBTL.toFixed(2),
			       'sochi' : tongSoChiTL}
	}

	async xetTotNghiep(ctx, mssv){
			const sv = await ctx.stub.getState(mssv) 
			const svinfo = JSON.parse(sv.toString())
			let sinhvien = svinfo 
			let tong = 0, kq;
			let tongSoChi = 0;
			for(let hocki in sinhvien.hocki){
			 let tinhDiem =	await this.tinhTichLuy(ctx,mssv,hocki)
			 if(tinhDiem["sochi"]!=0){
			 	 // lay tong cho tat ca hoc ki
				 tong += tinhDiem['diem']*tinhDiem['sochi']
				 // lay tong so chi cho tat ca hoc ki
				 tongSoChi += tinhDiem['sochi']
			 }	
		  }
		  const diemTotNghiep = tong / tongSoChi
		  if(tongSoChi>=145){
		  	 kq = " da tot nghiep "
		  }
		  else{
		  	 kq = " chua tot nghiep "
		  }
		  console.log({ 'diemtotnghiep' : diemTotNghiep.toFixed(2),
		            	'tongSoChi' : tongSoChi,
		            	 'kq' : kq })
		  return { 'diemtotnghiep' : diemTotNghiep.toFixed(2),
		            'tongSoChi' : tongSoChi,
		            'kq' : kq
		  }		  
	}
}	    
module.exports = QuanLyDiem;
