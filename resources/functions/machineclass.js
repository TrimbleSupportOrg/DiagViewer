class Machine {
  constructor() {
    this.name = "Machine";	
    this.sn = "-"; 
    this.sw = "-"; 
    this.points = [];
	this.imgsrc = "";
  }
}

//-------------------------------------------------------------------------------------------------------------------
class Excavator {
  constructor(lines) {
	this.points = [];
	this.name = [];
	this.x = [];
	this.y = [];
	this.z = [];
	var pData;

	var A, COR, P, ML, MR, MT, B1, B, G, J, J1, Z, CC, CL, CR, K, K1, K2; //point
	var AB, AB1, B1B, BG, GJ, wA, JJ1, ZJ, CE, JK, K1K2; //length
	var AB_ang, AB1_ang, B1B_ang, BG_ang, GJ_ang, GJJ1_ang, JJ1_ang, GJK_ang, curl_ang, tilt_ang, rot_ang, swing_ang; //angles
	var curAttachName, swingStat;
	var isAttach = false;
	var pitch_ang = 0;
	var roll_ang = 0;
	
	for (var i = 0; i < lines.length; i++) {
	
	  switch (true) {
		// A and COR Points
		case lines[i].includes("Boom Pin Center To COR At Ground Level"):
		  pData = getData(lines[i]);
		  A = new point(["A",0,0,0]);
		  if ( !isNaN(Number(pData[0])) || !isNaN(Number(pData[1])) || !isNaN(Number(pData[2])) ) {
			COR = new point(["COR",pData[0],pData[1],pData[2]]);
          }
		  break;
		case lines[i].includes("Boom Pin Center To Swing Boom Pin Center"):
		  pData = getData(lines[i]);
		  if ( !isNaN(Number(pData[0])) || !isNaN(Number(pData[1])) || !isNaN(Number(pData[2])) ) {
            P = new point(["P",pData[0],pData[1],pData[2]]);
		  }
		  break;
		// ML, MR and MT Points
		case lines[i].includes("Boom Pin Center To Left GNSS Mounting"):
		  pData = getData(lines[i]);
		  if ( !isNaN(Number(pData[0])) || !isNaN(Number(pData[1])) || !isNaN(Number(pData[2])) ) {
			  ML = new point(["ML",pData[0],pData[1],pData[2]]);
          }
		  break;
		case lines[i].includes("Boom Pin Center To Right GNSS Mounting"):
		  pData = getData(lines[i]);
		  if ( !isNaN(Number(pData[0])) || !isNaN(Number(pData[1])) || !isNaN(Number(pData[2])) ) {
            MR = new point(["MR",pData[0],pData[1],pData[2]]);
		  }
		  break;
		case lines[i].includes("Boom Pin Center To Dedicated MT9xx Mast"):
		  pData = getData(lines[i]);
		  if ( !isNaN(Number(pData[0])) || !isNaN(Number(pData[1])) || !isNaN(Number(pData[2])) ) {
            MT = new point(["MT",pData[0],pData[1],pData[2]]);
		  }
	      break;
		// Point B1 Values
		case lines[i].includes("Lower Boom Length"):
		  pData = getData(lines[i]);
		  if ( !isNaN(Number(pData[0])) ) {
            AB1 = Number(pData[0]);
	      }
	      break;
		case lines[i].includes("Body To Lower Boom"):
		  pData = getData(lines[i]);
		  if ( !isNaN(Number(pData[0])) ) {
            AB1_ang = Deg2Rad(Number(pData[0]));
	      }
	      break;
		// Point B Values two-peace Boom
		case lines[i].includes("Upper Boom Length"):
		  pData = getData(lines[i]);
		  if ( !isNaN(Number(pData[0])) ) {
            B1B = Number(pData[0]);
	      }
	      break;
		case lines[i].includes("Lower Boom To Upper Boom"):
		  pData = getData(lines[i]);
		  if ( !isNaN(Number(pData[0])) ) {
            B1B_ang = Deg2Rad(Number(pData[0]));
	      }
	      break;
		// Point B Values single Boom
		case lines[i].includes("Boom Length"):
		  pData = getData(lines[i]);
		  if ( !isNaN(Number(pData[0])) ) {
            AB = Number(pData[0]);
	      }
	      break;
		case lines[i].includes("Body To Boom"):
		  pData = getData(lines[i]);
		  if ( !isNaN(Number(pData[0])) ) {
            AB_ang = Deg2Rad(Number(pData[0]));
	      }
	      break;
		// Point G Values
		case lines[i].includes("Stick Length"):
		  pData = getData(lines[i]);
		  if ( !isNaN(Number(pData[0])) ) {
            BG = Number(pData[0]);
	      }
	      break;
		case lines[i].includes("Boom To Stick"):
		  pData = getData(lines[i]);
		  if ( !isNaN(Number(pData[0])) ) {
            BG_ang = Deg2Rad(Number(pData[0]));
	      }
	      break;
		  
		// ATTACHMENT
		case lines[i].includes("Current Attachment"):
		  curAttachName = lines[i].split(': ');
		  curAttachName = curAttachName[1];
		  break;
		case lines[i].includes("Attachment Name"):
		  var attachName = lines[i].split(': ');
		  if (curAttachName == attachName[1]) {
			  isAttach = true;
		  } else {
			  isAttach = false;
		  }
		  break;
		  
		// Point K1
		case lines[i].includes("Angle G-J-K"):
		  pData = getData(lines[i]);
		  if ( !isNaN(Number(pData[0])) && isAttach ) {
            GJK_ang = Deg2Rad(Number(pData[0]));
	      }
	      break;
		case lines[i].includes("Length J-K"):
		  pData = getData(lines[i]);
		  if ( !isNaN(Number(pData[0])) && isAttach ) {
            JK = Number(pData[0]);
	      }
	      break;
		// Point K2
		case lines[i].includes("Tiltrotator (K1-K2)"):
		  pData = getData(lines[i]);
		  if ( !isNaN(Number(pData[0])) ) {
            K1K2 = Number(pData[0]);
	      }
	      break; 
		// Point J Values
		case lines[i].includes("Stick To Attachment"):
		  pData = getData(lines[i]);
		  if ( !isNaN(Number(pData[0])) ) {
            GJ_ang = Deg2Rad(Number(pData[0]));
	      }
	      break;
		case lines[i].includes("Length G-J"):
		  pData = getData(lines[i]);
		  if ( !isNaN(Number(pData[0])) && isAttach ) {
            GJ = Number(pData[0]);
	      }
	      break;
		case lines[i].includes("Width"):
		  pData = getData(lines[i]);
		  if ( !isNaN(Number(pData[0])) && isAttach ) {
            wA = Number(pData[0]);
	      }
	      break;
		// Point J1
		case lines[i].includes("Angle G-J-J1"):
		  pData = getData(lines[i]);
		  if ( !isNaN(Number(pData[0])) && isAttach ) {
            GJJ1_ang = Deg2Rad(Number(pData[0]));
	      }
	      break;
		case lines[i].includes("Length J-J1"):
		  pData = getData(lines[i]);
		  if ( !isNaN(Number(pData[0])) && isAttach ) {
            JJ1 = Number(pData[0]);
	      }
	      break;
		// Point Z
        case lines[i].includes("Length Z-J"):
		  pData = getData(lines[i]);
		  if ( !isNaN(Number(pData[0])) && isAttach ) {
            ZJ = Number(pData[0]);
	      }
	      break;
		// Point CC, CL, CR (cutting edge)
        case lines[i].includes("Cutting Edge Length"):
		  pData = getData(lines[i]);
		  if ( !isNaN(Number(pData[0])) && isAttach ) {
            CE = Number(pData[0]);
	      }
	      break; 
		// Tilt
        case lines[i].includes("Attachment Tilt"):
		  pData = getData(lines[i]);
		  if ( !isNaN(Number(pData[0])) ) {
            tilt_ang = Deg2Rad(Number(pData[0]));
	      }
		  break;  
		// Rotation
        case lines[i].includes("Attachment Rotation"):
		  pData = getData(lines[i]);
		  if ( !isNaN(Number(pData[0])) ) {
            rot_ang = -Deg2Rad(Number(pData[0]));
	      }
		  break;
		// Swing
		case lines[i].includes("Swing Boom Position"):
		  swingStat = lines[i].split(': ');
		  swingStat = swingStat[1];
		  if ( swingStat.includes("Center") ) {
			  swing_ang = 0;
		  }
		  break;
		case lines[i].includes("Swing boom angle - left"):
		  if ( (swingStat.includes("Left")) && (swing_ang == undefined) ) {
		    pData = getData(lines[i]);
	        if ( !isNaN(Number(pData[0])) ) {
              swing_ang = -Deg2Rad(Number(pData[0]));
	        }
		  }
		  break;
		case lines[i].includes("Swing boom angle - right"):
		  if ( (swingStat.includes("Right")) && (swing_ang == undefined) ) {
		    pData = getData(lines[i]);
	        if ( !isNaN(Number(pData[0])) ) {
              swing_ang = Deg2Rad(Number(pData[0]));
	        }
		  }
		  break;
		// Body pitch
        case lines[i].includes("Body Pitch"):
		  pData = getData(lines[i]);
		  if ( !isNaN(Number(pData[0])) ) {
            pitch_ang = Deg2Rad(Number(pData[0]));
	      }
		  break;  
		// Body roll
        case lines[i].includes("Body Roll"):
		  pData = getData(lines[i]);
		  if ( !isNaN(Number(pData[0])) ) {
            roll_ang = Deg2Rad(Number(pData[0]));
	      }
		  break;
	  }		  
	}
	
	try {
      // Point B1
	  if ( (A !== undefined) && !isNaN(AB1) && !isNaN(AB1_ang) ) {
      	B1 = new point(["B1",A.x,Math.cos(AB1_ang)*AB1+A.y,Math.sin(-AB1_ang)*AB1+A.z]);
      }
      // Point B single Boom
      if ( (A !== undefined) && !isNaN(AB) && !isNaN(AB_ang) ) {
      	B = new point(["B",A.x,Math.cos(AB_ang)*AB+A.y,Math.sin(-AB_ang)*AB+A.z]);
      }
      // Point B two-peace Boom
      if ( (B1 !== undefined) && !isNaN(B1B) && !isNaN(B1B_ang) ) {
      	B1B_ang = AB1_ang+B1B_ang;
      	AB_ang = B1B_ang;
      	B = new point(["B",B1.x,Math.cos(B1B_ang)*B1B+B1.y,Math.sin(-B1B_ang)*B1B+B1.z]);
      }
      // Point G
      if ( (B !== undefined) && !isNaN(BG) && !isNaN(BG_ang) ) {
      	BG_ang = AB_ang+BG_ang;
      	G = new point(["G",B.x,Math.cos(BG_ang)*BG+B.y,Math.sin(-BG_ang)*BG+B.z]);
      }
      // Point J
      if ( (G !== undefined) && !isNaN(GJ) && !isNaN(GJ_ang) ) {
        if ( !isNaN(GJK_ang) ) { // FOR TILT OPTION
          curl_ang = (Math.PI/2+GJK_ang)-(BG_ang+GJ_ang);
      	  GJ_ang = Math.PI/2+GJK_ang;
      	  J = new point(["J",G.x,Math.cos(GJ_ang)*GJ+G.y,Math.sin(-GJ_ang)*GJ+G.z]);
      	} else { // FOR NON TILT OPTION
      	  GJ_ang = BG_ang+GJ_ang;
      	  J = new point(["J",G.x,Math.cos(GJ_ang)*GJ+G.y,Math.sin(-GJ_ang)*GJ+G.z]);
      	}
      }
      // Point J1
      if ( (J !== undefined) && !isNaN(JJ1) && !isNaN(GJJ1_ang) ) {
      	JJ1_ang = GJ_ang-(Math.PI-GJJ1_ang);
      	J1 = new point(["J1",J.x,Math.cos(JJ1_ang)*JJ1+J.y,Math.sin(-JJ1_ang)*JJ1+J.z]);
      }
      // Point Z
      if ( (J !== undefined) && !isNaN(ZJ) && !isNaN(JJ1_ang) ) {
      	Z = new point(["Z",J.x,Math.cos(JJ1_ang)*ZJ+J.y,Math.sin(-JJ1_ang)*ZJ+J.z]);
      }
      // Point CC
      if ( (J1 !== undefined) && !isNaN(CE) && !isNaN(JJ1_ang) ) {
      	CC = new point(["CC",J1.x,Math.cos(JJ1_ang-Math.PI)*CE+J1.y,Math.sin(-JJ1_ang-Math.PI)*CE+J1.z]);
      }
      // Point CL/CR
      if ( (CC !== undefined) && !isNaN(wA) ) {
      	wA = wA/2;
      	CR = new point(["CR",CC.x+wA,CC.y,CC.z]);
      	CL = new point(["CL",CC.x-wA,CC.y,CC.z]);
      }
      // Point K
      if ( (J !== undefined) && !isNaN(JK) ) {
      	K = new point(["K",J.x,J.y,J.z+JK]);
      }
      // Point K1
      if ( (K !== undefined) && (G !== undefined) ) {
      	K1 = new point(["K1",G.x,G.y,K.z]);
      }
      // Point K2
      if ( (K1 !== undefined) && !isNaN(K1K2) ) {
      	K2 = new point(["K2",K1.x,K1.y+K1K2,K1.z]);
      }
      // tilt bucket
      if ( !isNaN(tilt_ang) ) { // CORRECT FOR TILT OPTION
      	 J = rotateXYZ(K1,[0,tilt_ang,0],J);
      	J1 = rotateXYZ(K1,[0,tilt_ang,0],J1);
      	 Z = rotateXYZ(K1,[0,tilt_ang,0],Z);
      	CC = rotateXYZ(K1,[0,tilt_ang,0],CC);
      	CL = rotateXYZ(K1,[0,tilt_ang,0],CL);
      	CR = rotateXYZ(K1,[0,tilt_ang,0],CR);
      }
      // rotate bucket
      if ( !isNaN(rot_ang) ) { // CORRECT FOR TILT OPTION
      	 J = rotateXYZ(K2,[0,0,rot_ang],J);
      	J1 = rotateXYZ(K2,[0,0,rot_ang],J1);
      	 Z = rotateXYZ(K2,[0,0,rot_ang],Z);
      	CC = rotateXYZ(K2,[0,0,rot_ang],CC);
      	CL = rotateXYZ(K2,[0,0,rot_ang],CL);
      	CR = rotateXYZ(K2,[0,0,rot_ang],CR);
      }
      // correct curl
      if ( !isNaN(curl_ang) ) { // CORRECT FOR ROTATION OPTION
      	 J = rotateXYZ(G,[curl_ang,0,0],J);
      	J1 = rotateXYZ(G,[curl_ang,0,0],J1);
      	 Z = rotateXYZ(G,[curl_ang,0,0],Z);
      	CC = rotateXYZ(G,[curl_ang,0,0],CC);
      	CL = rotateXYZ(G,[curl_ang,0,0],CL);
      	CR = rotateXYZ(G,[curl_ang,0,0],CR);
      	if ( ( K !== undefined) ) {  K = rotateXYZ(G,[curl_ang,0,0],K); }
      	if ( (K1 !== undefined) ) { K1 = rotateXYZ(G,[curl_ang,0,0],K1); }
      	if ( (K2 !== undefined) ) { K2 = rotateXYZ(G,[curl_ang,0,0],K2); }
      }
      // swing boom
      if ( !isNaN(swing_ang) ) { // CORRECT FOR SWING OPTION
        if ( ( A !== undefined) ) {  A = rotateXYZ(P,[0,0,swing_ang],A);  }
      	if ( (B1 !== undefined) ) { B1 = rotateXYZ(P,[0,0,swing_ang],B1); }
      	if ( ( B !== undefined) ) {  B = rotateXYZ(P,[0,0,swing_ang],B);  }
      	if ( ( G !== undefined) ) {  G = rotateXYZ(P,[0,0,swing_ang],G);  }
      	if ( ( K !== undefined) ) {  K = rotateXYZ(P,[0,0,swing_ang],K); }
      	if ( (K1 !== undefined) ) { K1 = rotateXYZ(P,[0,0,swing_ang],K1); }
      	if ( (K2 !== undefined) ) { K2 = rotateXYZ(P,[0,0,swing_ang],K2); }
      	if ( ( J !== undefined) ) {  J = rotateXYZ(P,[0,0,swing_ang],J);  }
      	if ( (J1 !== undefined) ) { J1 = rotateXYZ(P,[0,0,swing_ang],J1); }
      	if ( ( Z !== undefined) ) {  Z = rotateXYZ(P,[0,0,swing_ang],Z);  }
      	if ( (CC !== undefined) ) { CC = rotateXYZ(P,[0,0,swing_ang],CC); }
      	if ( (CL !== undefined) ) { CL = rotateXYZ(P,[0,0,swing_ang],CL); }
      	if ( (CR !== undefined) ) { CR = rotateXYZ(P,[0,0,swing_ang],CR); }
      }
      // body pitch and roll
	  if ( (  A !== undefined) ) {   A = rotateXYZ(A,[pitch_ang,roll_ang,0],  A); }
      if ( (COR !== undefined) ) { COR = rotateXYZ(A,[pitch_ang,roll_ang,0],COR); }
      if ( ( ML !== undefined) ) {  ML = rotateXYZ(A,[pitch_ang,roll_ang,0], ML); }
      if ( ( MR !== undefined) ) {  MR = rotateXYZ(A,[pitch_ang,roll_ang,0], MR); }
      if ( ( MT !== undefined) ) {  MT = rotateXYZ(A,[pitch_ang,roll_ang,0], MT); }
      if ( (  P !== undefined) ) {   P = rotateXYZ(A,[pitch_ang,roll_ang,0],  P); }
      if ( ( B1 !== undefined) ) {  B1 = rotateXYZ(A,[pitch_ang,roll_ang,0], B1); }
      if ( (  B !== undefined) ) {   B = rotateXYZ(A,[pitch_ang,roll_ang,0],  B); }
      if ( (  G !== undefined) ) {   G = rotateXYZ(A,[pitch_ang,roll_ang,0],  G); }
      if ( (  K !== undefined) ) {   K = rotateXYZ(A,[pitch_ang,roll_ang,0],  K); }
      if ( ( K1 !== undefined) ) {  K1 = rotateXYZ(A,[pitch_ang,roll_ang,0], K1); }
      if ( ( K2 !== undefined) ) {  K2 = rotateXYZ(A,[pitch_ang,roll_ang,0], K2); }
      if ( (  J !== undefined) ) {   J = rotateXYZ(A,[pitch_ang,roll_ang,0],  J); }
      if ( ( J1 !== undefined) ) {  J1 = rotateXYZ(A,[pitch_ang,roll_ang,0], J1); }
      if ( (  Z !== undefined) ) {   Z = rotateXYZ(A,[pitch_ang,roll_ang,0],  Z); }
      if ( ( CC !== undefined) ) {  CC = rotateXYZ(A,[pitch_ang,roll_ang,0], CC); }
      if ( ( CL !== undefined) ) {  CL = rotateXYZ(A,[pitch_ang,roll_ang,0], CL); }
      if ( ( CR !== undefined) ) {  CR = rotateXYZ(A,[pitch_ang,roll_ang,0], CR); }
	  
      // add points to output
      if ( (A !== undefined) ) {
		this.points.push(A);
		this.name.push(A.name);
 	    this.x.push(A.x);
 	    this.y.push(A.y);
 	    this.z.push(A.z);
	  }
      if ( (COR !== undefined) ) {
		this.points.push(COR);
		this.name.push(COR.name);
 	    this.x.push(COR.x);
 	    this.y.push(COR.y);
 	    this.z.push(COR.z);
	  }
      if ( (ML !== undefined) ) {
		this.points.push(ML);
		this.name.push(ML.name);
 	    this.x.push(ML.x);
 	    this.y.push(ML.y);
 	    this.z.push(ML.z);
	  }
      if ( (MR !== undefined) ) {
		this.points.push(MR);
		this.name.push(MR.name);
 	    this.x.push(MR.x);
 	    this.y.push(MR.y);
 	    this.z.push(MR.z);
	  }
      if ( (MT !== undefined) ) {
		this.points.push(MT);
		this.name.push(MT.name);
 	    this.x.push(MT.x);
 	    this.y.push(MT.y);
 	    this.z.push(MT.z);
	  }
      if ( (P !== undefined) ) {
		this.points.push(P);
		this.name.push(P.name);
 	    this.x.push(P.x);
 	    this.y.push(P.y);
 	    this.z.push(P.z);
	  }
      if ( (B1 !== undefined) ) {
		this.points.push(B1);
		this.name.push(B1.name);
 	    this.x.push(B1.x);
 	    this.y.push(B1.y);
 	    this.z.push(B1.z);
	  }
      if ( (B !== undefined) ) {
		this.points.push(B);
		this.name.push(B.name);
 	    this.x.push(B.x);
 	    this.y.push(B.y);
 	    this.z.push(B.z);
	  }
      if ( (G !== undefined) ) {
		this.points.push(G);
		this.name.push(G.name);
 	    this.x.push(G.x);
 	    this.y.push(G.y);
 	    this.z.push(G.z);
	  }
      if ( (J !== undefined) ) {
		this.points.push(J);
		this.name.push(J.name);
 	    this.x.push(J.x);
 	    this.y.push(J.y);
 	    this.z.push(J.z);
	  }
      if ( (J1 !== undefined) ) {
		this.points.push(J1);
		this.name.push(J1.name);
 	    this.x.push(J1.x);
 	    this.y.push(J1.y);
 	    this.z.push(J1.z);
	  }
      if ( (Z !== undefined) ) {
		this.points.push(Z);
		this.name.push(Z.name);
 	    this.x.push(Z.x);
 	    this.y.push(Z.y);
 	    this.z.push(Z.z);
	  }
      if ( (CC !== undefined) ) {
		this.points.push(CC);
		this.name.push(CC.name);
 	    this.x.push(CC.x);
 	    this.y.push(CC.y);
 	    this.z.push(CC.z);
	  }
      if ( (CL !== undefined) ) {
		this.points.push(CL);
		this.name.push(CL.name);
 	    this.x.push(CL.x);
 	    this.y.push(CL.y);
 	    this.z.push(CL.z);
	  }
      if ( (CR !== undefined) ) {
		this.points.push(CR);
		this.name.push(CR.name);
 	    this.x.push(CR.x);
 	    this.y.push(CR.y);
 	    this.z.push(CR.z);
	  }
      if ( (K !== undefined) ) {
		this.points.push(K);
		this.name.push(K.name);
 	    this.x.push(K.x);
 	    this.y.push(K.y);
 	    this.z.push(K.z);
	  }
      if ( (K1 !== undefined) ) {
		this.points.push(K1);
		this.name.push(K1.name);
 	    this.x.push(K1.x);
 	    this.y.push(K1.y);
 	    this.z.push(K1.z);
	  }
      if ( (K2 !== undefined) ) {
		this.points.push(K2);
		this.name.push(K2.name);
 	    this.x.push(K2.x);
 	    this.y.push(K2.y);
 	    this.z.push(K2.z);
	  }
	  
    } catch (error) {
	  alert("ERROR in machine PoI calculation - machine view not available");
	}
  }
}

//-------------------------------------------------------------------------------------------------------------------
class Dozer {
  constructor(lines) {
	this.points = [];
	this.name = [];
	this.x = [];
	this.y = [];
	this.z = [];
	var pData;
	
	for (var i = 0; i < lines.length; i++) {
	
	  switch (true) {
		//Measure-Up
		case lines[i].startsWith("Point "):
		  pData = getPointData(lines[i]);
		  if (pData.length==4) {
			this.points.push(new point(pData));
		    this.name.push(pData[0]);
 	        this.x.push(Number(pData[1]));
 	        this.y.push(Number(pData[2]));
 	        this.z.push(Number(pData[3]));
		  }
		  break;
	  }		  
	}
  }
}

//-------------------------------------------------------------------------------------------------------------------
class Grader {
  constructor(lines) {
	this.points = [];
	this.name = [];
	this.x = [];
	this.y = [];
	this.z = [];
	var pData = [];
	
	for (var i = 0; i < lines.length; i++) {
	/*
	  switch (true) {
		//Measure-Up
		case lines[i].startsWith("Point "):
		  pData = getPointData(lines[i]);
		  if (pData.length==4) {
			this.points.push(new point(pData));
		    this.name.push(pData[0]);
 	        this.x.push(Number(pData[1]));
 	        this.y.push(Number(pData[2]));
 	        this.z.push(Number(pData[3]));
		  }
		  break;
	  }
	  */
	  switch (true) {
		//Measure-Up
		case lines[i].startsWith("ML,"):
		  pData = getPointData(lines[i]);
		  break;
		case lines[i].startsWith("MR,"):
		  pData = getPointData(lines[i]);
		  break;
		case lines[i].startsWith("BL,"):
		  pData = getPointData(lines[i]);
		  break;
		case lines[i].startsWith("BR,"):
		  pData = getPointData(lines[i]);
		  break;
		case lines[i].startsWith("CL,"):
		  pData = getPointData(lines[i]);
		  break;
		case lines[i].startsWith("CR,"):
		  pData = getPointData(lines[i]);
		  break;
		case lines[i].startsWith("DL,"):
		  pData = getPointData(lines[i]);
		  break;
		case lines[i].startsWith("DR,"):
		  pData = getPointData(lines[i]);
		  break;
		case lines[i].startsWith("E,"):
		  pData = getPointData(lines[i]);
		  break;
		case lines[i].startsWith("FL,"):
		  pData = getPointData(lines[i]);
		  break;
		case lines[i].startsWith("GL,"):
		  pData = getPointData(lines[i]);
		  break;
		case lines[i].startsWith("FR,"):
		  pData = getPointData(lines[i]);
		  break;
		case lines[i].startsWith("GR,"):
		  pData = getPointData(lines[i]);
		  break;
		case lines[i].startsWith("JL,"):
		  pData = getPointData(lines[i]);
		  break;
		case lines[i].startsWith("JR,"):
		  pData = getPointData(lines[i]);
		  break;
		case lines[i].startsWith("KL,"):
		  pData = getPointData(lines[i]);
		  break;
		case lines[i].startsWith("KR,"):
		  pData = getPointData(lines[i]);
		  break;
		case lines[i].startsWith("NL,"):
		  pData = getPointData(lines[i]);
		  break;
		case lines[i].startsWith("NR,"):
		  pData = getPointData(lines[i]);
		  break;
		case lines[i].startsWith("AF,"):
		  pData = getPointData(lines[i]);
		  break;
		case lines[i].startsWith("AB,"):
		  pData = getPointData(lines[i]);
		  break;
	  }
	  
      if (pData.length==4) {
	    this.points.push(new point(pData));
		this.name.push(pData[0]);
 	    this.x.push(Number(pData[1]));
 	    this.y.push(Number(pData[2]));
 	    this.z.push(Number(pData[3]));
		pData = [];
	  }
		  
	}
  }
}

//-------------------------------------------------------------------------------------------------------------------
class CompactLoader {
  constructor(lines) {
	this.points = [];
	this.name = [];
	this.x = [];
	this.y = [];
	this.z = [];
	var pData;
	
	for (var i = 0; i < lines.length; i++) {
	
	  switch (true) {	  
		//Measure-Up
		case lines[i].startsWith("Point "):
		  pData = getPointData(lines[i]);
		  if (pData.length==4) {
			this.points.push(new point(pData));
		    this.name.push(pData[0]);
 	        this.x.push(Number(pData[1]));
 	        this.y.push(Number(pData[2]));
 	        this.z.push(Number(pData[3]));
		  }
		  break;
	  }		  
	}
  }
}

//-------------------------------------------------------------------------------------------------------------------
class WheelLoader {
  constructor(lines) {
	this.points = [];
	this.name = [];
	this.x = [];
	this.y = [];
	this.z = [];
	var pData;
	
	for (var i = 0; i < lines.length; i++) {
	
	  switch (true) {
		//Measure-Up
		case lines[i].startsWith("Point "):
		  pData = getPointData(lines[i]);
		  if (pData.length==4) {
			this.points.push(new point(pData));
		    this.name.push(pData[0]);
 	        this.x.push(Number(pData[1]));
 	        this.y.push(Number(pData[2]));
 	        this.z.push(Number(pData[3]));
		  }
		  break;
	  }		  
	}
  }
}

//-------------------------------------------------------------------------------------------------------------------
class Compactor {
  constructor(lines) {
	this.points = [];
	this.name = [];
	this.x = [];
	this.y = [];
	this.z = [];
	var pData;
	
	for (var i = 0; i < lines.length; i++) {
	
	  switch (true) {
		//Measure-Up
		case lines[i].startsWith("Point "):
		  pData = getPointData(lines[i]);
		  if (pData.length==4) {
			this.points.push(new point(pData));
		    this.name.push(pData[0]);
 	        this.x.push(Number(pData[1]));
 	        this.y.push(Number(pData[2]));
 	        this.z.push(Number(pData[3]));
		  }
		  break;
	  }		  
	}
  }
}

//-------------------------------------------------------------------------------------------------------------------
class point {
  constructor(dVec) {
	  this.name = dVec[0];
	  this.x = Number(dVec[1]);
	  this.y = Number(dVec[2]);
	  this.z = Number(dVec[3]);
  }	  
}

function getPointData(line) {
  var data = line;
  data = data.replaceAll('Point ', '');
  data = data.replaceAll(' Point:', '');
  data = data.replaceAll(':', '');
  data = data.replaceAll('(', '');
  data = data.replaceAll('m', '');
  data = data.replaceAll(',', '');
  data = data.replaceAll(')', '');
  data = data.split(' ');
  if ( isNaN(Number(data[1])) || isNaN(Number(data[2])) || isNaN(Number(data[3])) ) {
  	data = [];
  }
  
  return data;
}

function getData(line) {
  var data = line.split(': ');
  data = data[1];
  data = data.replaceAll('(', '');
  data = data.replaceAll(',', '');
  data = data.replaceAll(')', '');
  data = data.split(' ');
  for (var i = 0; i < data.length; i++) {
	  data[i] = Number(data[i].substring(0, data[i].length - 1));
  }
  return data;
}

function Rad2Deg (angle) {
  return angle * (180 / Math.PI);
}

function Deg2Rad (angle) {
  return angle * (Math.PI / 180);
}

function rotateXYZ(O,ang,P) {
  // center in origin
  var x, y, z;
  var xyz = [P.x-O.x, P.y-O.y, P.z-O.z];
  
  // rotate
  var xcos = Math.cos(ang[0]);
  var xsin = Math.sin(ang[0]);
  var x_rot = [1, 0, 0,
               0, xcos, -xsin,
               0, xsin, xcos]; // x-axis rotation matrice
  x = x_rot[0] * xyz[0] + x_rot[1] * xyz[1] + x_rot[2] * xyz[2];
  y = x_rot[3] * xyz[0] + x_rot[4] * xyz[1] + x_rot[5] * xyz[2];
  z = x_rot[6] * xyz[0] + x_rot[7] * xyz[1] + x_rot[8] * xyz[2];
  xyz = [x,y,z];
  
  var ycos = Math.cos(ang[1]);
  var ysin = Math.sin(ang[1]);
  var y_rot = [ycos, 0, -ysin,
               0, 1, 0,
               ysin, 0, ycos]; // y-axis rotation matrice
  x = y_rot[0] * xyz[0] + y_rot[1] * xyz[1] + y_rot[2] * xyz[2];
  y = y_rot[3] * xyz[0] + y_rot[4] * xyz[1] + y_rot[5] * xyz[2];
  z = y_rot[6] * xyz[0] + y_rot[7] * xyz[1] + y_rot[8] * xyz[2];
  xyz = [x,y,z];
  
  var zcos = Math.cos(ang[2]);
  var zsin = Math.sin(ang[2]);
  var z_rot = [zcos, zsin, 0,
               -zsin, zcos, 0,
               0, 0, 1]; // z-axis rotation matrice
  x = (z_rot[0] * xyz[0]) + (z_rot[1] * xyz[1]) + (z_rot[2] * xyz[2]);
  y = (z_rot[3] * xyz[0]) + (z_rot[4] * xyz[1]) + (z_rot[5] * xyz[2]);
  z = (z_rot[6] * xyz[0]) + (z_rot[7] * xyz[1]) + (z_rot[8] * xyz[2]);
  xyz = [x,y,z];                                   
  
  // center in origin
  P.x = xyz[0] + O.x;
  P.y = xyz[1] + O.y;
  P.z = xyz[2] + O.z;
  
  return P;
}