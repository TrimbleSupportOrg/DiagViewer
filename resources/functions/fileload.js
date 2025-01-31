function dropHandler(ev) {
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  var signIn = document.getElementById("signIn").className;
  if ( !signIn.endsWith("signInBtn") ) {
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      [...ev.dataTransfer.items].forEach((item, i) => {
        // If dropped items aren't files, reject them
        if (item.kind === "file") {
          const file = item.getAsFile();
          loadFile(file);
        }
      });
    }
  } else {
	alert("Login required"); 
  }
}

// Import file from filepicker
function loadFile(file) {
  var backDisp = document.getElementById("backBtn").style.display;
  showLoading();
  setTimeout(() => {
    if ( file == undefined ) {	
      file = document.querySelector("#filepicker").files[0];
      if ( file == undefined ) {
        showFileLoad();
	    document.getElementById("backBtn").style.display = backDisp;
      }
    }
    if ( loadDiagnostics(file) ) {
      showMain();
	/* ToDo: Comment out for further publications */  
    /*} else if ( file.name.endsWith(".zsnap") ) {
      alert("Warning: Zsnap File is not supported yet! No data has been read.");
      // ToDo: get diagnosic file from zsnap
      // loadFile(file);
      showFileLoad();
	  document.getElementById("backBtn").style.display = backDisp; */
    } else {
      alert("Error: File does not appear to be a supported file! No data has been read.");
      showFileLoad();
	  document.getElementById("backBtn").style.display = backDisp;
    }
  }, "500");
}

// Read data from diagnostic file
function loadDiagnostics(file) {
  const reader = new FileReader();
              
  reader.addEventListener(
    "load",
    () => {
      const tStart = performance.now();
      var inputTxt = reader.result;
	  
	  // check file encoding default UTF-8 otherwise ANSI
	  // ToDo: distinguishing the cases UTF-8, ANSI, UTF-8 with single �
	  var pos = inputTxt.search("�")
      if (pos != -1 ) {
        reader.readAsText(file,'windows-1252');
	  } else {

        // write raw file in diagnostics.txt section
        var nbsp = '\u00A0';
        var diagCont = inputTxt.replaceAll('\t',nbsp.repeat(6));
        var diagCont = inputTxt.replaceAll(' ',nbsp);
        document.getElementById("diagcont").innerText = diagCont;
        document.getElementById("diagtxtA").style.display = "flex";
        
        // start logging
        logDEV('h4','Start: '+reader.fileName);
        document.getElementById("devlogA").style.display = "flex";

        // convert lines from file reader
        var lines = inputTxt.replaceAll('\t',' ');
        var lines = lines.split(/[\r\n]+/);

        // Find headers - loop through all lines
        var headerIdx = [];
        for (var i = 0; i < lines.length; i++) {
          if ( (lines[i].startsWith("| ")) && (lines[i].endsWith(" |")) ) { // indicate header lines
            headerIdx.push(i);
          }
        } // end of header loop
        headerIdx.push(lines.length+1); // add index for last section

        // get data and convert to html
        var pageHtml = document.getElementById("summary");
        var pageInfo = new lookUpData("System Information");
        var content = "";
        for (var i = 0; i < headerIdx.length-1; i++) {
          // get headline and convert
          var headLin = lines[headerIdx[i]];
          headLin = headLin.substring(2,headLin.length-2);
          logDEV('h5',headLin); 
          // look up headline dependings
          var pageInfoNew = new lookUpData(headLin); 
          if (pageInfoNew.pageId != undefined) { // keep last reference if headline not found
            pageInfo = pageInfoNew;
            logDEV('h6','convert to: ' + pageInfo.pageId);
          } else {
            logDEV('h6','! unknown, keep convert to: ' + pageInfo.pageId);   
          }
          pageHtml = document.getElementById(pageInfo.pageId);

          if ((headerIdx[i+1]-headerIdx[i])>=4) { // avoid empty entrys
            // get content
            var contTxt = lines.slice(headerIdx[i]+2 , headerIdx[i+1]-1);

            // convert content
            if (pageInfo.isHTML) {
              content = convHtml(headLin,contTxt,pageInfo);    
            } else {
              content = convRaw(headLin,contTxt,pageInfo);          
            }

            pageHtml.innerHTML += content;

            var anchorId = pageInfo.pageId + 'A';
            document.getElementById(anchorId).style.display = "flex";

            logDEV('h6','processed');

            if (pageInfo.isDiag) {
              document.getElementById("diagnostics").innerHTML += content;
              document.getElementById("diagnosticsA").style.display = "flex";			  
            }
            // set content to blank
            content = "";
          } else {
            logDEV('h6','! not processed, empty entry');  
          }
        } // end of for data loop
      } // end of reader as utf-8
      // special checks
	  logDEV('h6','processed, runtime until now: ' + (performance.now()-tStart).toFixed(1) + 'ms');
	  logDEV('h5','Convert GUI Info');
	  guiInfo();
	  logDEV('h6','processed, runtime until now: ' + (performance.now()-tStart).toFixed(1) + 'ms');
	  logDEV('h5','Convert Summary');
      editSummary();
	  logDEV('h6','processed, runtime until now: ' + (performance.now()-tStart).toFixed(1) + 'ms');
	  logDEV('h5','Convert GNSS');
      editGNSS();
	  logDEV('h6','processed, runtime until now: ' + (performance.now()-tStart).toFixed(1) + 'ms');
	  logDEV('h5','Convert REMOTEit');
      editREMOTEit();
	  logDEV('h6','processed, runtime until now: ' + (performance.now()-tStart).toFixed(1) + 'ms');
	  logDEV('h5','Convert Features');
      editFeatures();
	  logDEV('h6','processed, runtime until now: ' + (performance.now()-tStart).toFixed(1) + 'ms');
	  logDEV('h5','Convert Devices');
      editDevices();
	  logDEV('h6','processed, runtime until now: ' + (performance.now()-tStart).toFixed(1) + 'ms');
	  logDEV('h5','Convert Licenses');
      editLicenses();
	  logDEV('h6','processed, runtime until now: ' + (performance.now()-tStart).toFixed(1) + 'ms');
	  logDEV('h5','Convert Attachment');
      editAttachment();
	  logDEV('h6','processed, runtime until now: ' + (performance.now()-tStart).toFixed(1) + 'ms');
	  logDEV('h5','Convert Valves');
      editValves();
	  logDEV('h6','processed, runtime until now: ' + (performance.now()-tStart).toFixed(1) + 'ms');
	  logDEV('h5','Convert Machine View');
      editView(lines); 
	  logDEV('h6','processed, runtime until now: ' + (performance.now()-tStart).toFixed(1) + 'ms');
	  logDEV('h5','Assistant');
      assistant(lines); 
	  logDEV('h6','processed, runtime until now: ' + (performance.now()-tStart).toFixed(1) + 'ms');

    }, // end of event listener
    false,
  );
  
  if (file.name.startsWith("Diagnostics") || file.name.endsWith(".diag.txt")) {
    initPage();
	// set file name to headline
    document.getElementById("progTitle").innerHTML += "File: " + file.name;
    // read file
    reader.fileName = file.name;
    reader.readAsText(file,'utf8');
    return true;
  } else {
    return false;
  } 
}

function convHtml(headLin, contTxt, pageInfo) {
  // pre check for lines
  for ( var i = 0 ; i < contTxt.length; i++ ) {
  	// convert grader measure up points
	const graderRegex = new RegExp('(^[A-Za-z]{1,2}, .)'); 
	if (graderRegex.test(contTxt[i])) {
	  contTxt[i] = 'Point '+contTxt[i].replace(', ',': (')+')';
	  logDEV('h6','! convert line to: '+contTxt[i]);
	}
  }
  
  // include icons
  contTxt = setIcon(contTxt);
  
  contTxt = contTxt.map(el => el.replace(sepOld,sepNew));
  
  // convert content
  var pre = '<tr><td>';
  var pos = '</td></tr>';
  contTxt = contTxt.map(el => pre + el + pos);
  var sepOld = ': ';
  var sepNew = '</td><td>';
  contTxt = contTxt.map(el => el.replace(sepOld,sepNew));
  contTxt = contTxt.join("");

  // set content together      
  var content = '<div class="content"';
  if (pageInfo.contId != undefined) {
    content += ' id="';
    content += pageInfo.contId;
    content += '"';
  }
  content += '><div class="content-header" onclick="toggleContent()"><h1>';
  content += headLin;
  content += '</h1><button class="content-btn"><i class="fa fa-chevron-down"></i></button></div><div class="content-flex"><table class="table-striped"><tbody>';
  content += contTxt;
  content += '</tbody></table></div></div>';
  
  return content;
}

function convRaw(headLin,contTxt,pageInfo) {
  // convert content
  var pos = '<br>';
  contTxt = contTxt.map(el => el + pos);
  contTxt = contTxt.join("");

  // set content together      
  var content = '<div class="content"';
  if (pageInfo.contId != undefined) {
    content += ' id="';
    content += pageInfo.contId;
    content += '"';
  }
  content += '><div class="content-header" onclick="toggleContent()"><h1>';
  content += headLin;
  content += '</h1><button class="content-btn"><i class="fa fa-chevron-down"></i></button></div><div class="content-flex">';
  content += contTxt;
  content += '</div></div>';
  
  return content;
}    

function setIcon(contTxt,keyWord,imgStr) {
  var test;
  var keyWord;
  var imgStr;

  for ( var i = 0 ; i < contTxt.length; i++ ) {
	test = contTxt[i].split(': ')[1];

    // add check icon
    keyWord = ['Yes','True','Connected','connected','OK'];
    imgStr = '<img style="height:20px" src="resources/images/check.png"/>';
  
    for ( var j = 0 ; j < keyWord.length; j++ ) {
	  if ( test == keyWord[j] ) {
		contTxt[i] = contTxt[i].replace(keyWord[j],imgStr + ' ' + keyWord[j]);	
	  }
    }
	
	// add error icon
    keyWord = ['No','False','Not found'];
    imgStr = '<img style="height:20px" src="resources/images/error.png"/>';
  
    for ( var j = 0 ; j < keyWord.length; j++ ) {
	  if ( test == keyWord[j] ) {
		contTxt[i] = contTxt[i].replace(keyWord[j],imgStr + ' ' + keyWord[j]);	
	  }
    }
	
	// add warning icon
    keyWord = ['Configurating','configuring'];
    imgStr = '<img style="height:20px" src="resources/images/warning.png"/>';
  
    for ( var j = 0 ; j < keyWord.length; j++ ) {
	  if ( test == keyWord[j] ) {
		contTxt[i] = contTxt[i].replace(keyWord[j],imgStr + ' ' + keyWord[j]);	
	  }
    }
	
  }
  return contTxt;
}

class lookUpData {
  constructor(headLin) {
    this.pageId;
    this.isDiag = true;
    this.isHTML = true;
    this.contId;
    this.info;
    
    var lookUp =[
     // headline in cronological order                     | page Id     |is Diag entry| is HTML entry|content Id
      ["System Information"                                ,"summary"    ,true         ,true          ,"sysInfo"   ],
      ["Machine and Device Information"                    ,"summary"    ,true         ,true          ,"mdInfo"    ],
      ["Points Of Interest"                                ,"positions"  ,true         ,true          ,undefined   ],
      ["Current Machine Angles"                            ,"positions"  ,true         ,true          ,undefined   ],
      ["Machine Measure-Up"                                ,"measure"    ,true         ,true          ,undefined   ],
      ["Sensor Orientation"                                ,"measure"    ,true         ,true          ,undefined   ],
      ["Sensor Calibration"                                ,"install"    ,true         ,true          ,undefined   ],
      ["Sensor Correction Check"                           ,"positions"  ,true         ,true          ,undefined   ],
      ["Blade Rotation Calibration"                        ,"install"    ,true         ,true          ,undefined   ],
      ["Overcut Protection"                                ,"mapping"    ,true         ,true          ,undefined   ],
      ["Radio Settings"                                    ,"correction" ,true         ,true          ,undefined   ],
      ["Network"                                           ,"internet"   ,false        ,true          ,"network"   ],
      ["Cloud Services"                                    ,"cloud"      ,true         ,true          ,"cloudServ" ],
      ["Lane Guidance"                                     ,"autos"      ,true         ,true          ,undefined   ],
      ["GNSS"                                              ,"gnssdetails",true         ,true          ,"baseGNSS"  ],
      ["Correction Source"                                 ,"correction" ,true         ,true          ,undefined   ],
      ["Left GNSS"                                         ,"gnssdetails",true         ,true          ,"leftGNSS"  ],
      ["Right GNSS"                                        ,"gnssdetails",true         ,true          ,"rightGNSS" ],
      ["Center GNSS"                                       ,"gnssdetails",true         ,true          ,"centerGNSS"],
      ["UTS"                                               ,"utsdetails" ,true         ,true          ,undefined   ],
      ["Mainfall Adjustment"                               ,"install"    ,true         ,true          ,undefined   ],
      ["Blade Dimensions"                                  ,"install"    ,true         ,true          ,undefined   ],
      ["Drum Dimensions"                                   ,"install"    ,true         ,true          ,undefined   ],
      ["Check Length"                                      ,"positions"  ,false        ,true          ,undefined   ],
      ["Measure-up Check Length/Angle"                     ,"measure"    ,true         ,true          ,undefined   ],
      ["Autos Details"                                     ,"autos"      ,true         ,true          ,undefined   ],
      ["Mapping"                                           ,"mapping"    ,true         ,true          ,undefined   ],
      ["Cut/Fill Mapping"                                  ,"mapping"    ,true         ,true          ,undefined   ],
      ["Compaction Mapping"                                ,"mapping"    ,true         ,true          ,undefined   ],
      ["Server Info"                                       ,"internet"   ,false        ,true          ,undefined   ],
      ["General Wifi Info"                                 ,"internet"   ,false        ,true          ,"wifiInfo"  ],
      ["Features in the System"                            ,"features"   ,false        ,true          ,undefined   ],     
      ["License Info"                                      ,"licenses"   ,false        ,true          ,undefined   ],
      ["Licenses Library"                                  ,"licenses"   ,false        ,true          ,undefined   ],
      ["Licenses Installed"                                ,"licenses"   ,false        ,true          ,undefined   ],
      ["Cloud Licensing Diagnostics for Device"            ,"licenses"   ,false        ,true          ,undefined   ],
      ["Device Info"                                       ,"devices"    ,false        ,true          ,undefined   ],
      ["Connected Clients"                                 ,"clients"    ,false        ,true          ,undefined   ],
      ["Recent Http Requests"                              ,"http"       ,false        ,true          ,undefined   ],
      ["Machine Status"                                    ,"summary"    ,true         ,true          ,"mStatus"   ],
      ["Firmware Upgrades"                                 ,"firmware"   ,false        ,true          ,undefined   ],
      ["Over-The-Air EC520 Upgrade"                        ,"firmware"   ,false        ,true          ,undefined   ],
      ["Attachment Details"                                ,"attachment" ,true         ,true          ,undefined   ],
      ["Valve Calibration Details"                         ,"valve"      ,true         ,false         ,undefined   ],
      ["Tool Automation Implement Valve Calibration Table" ,"valve"      ,false        ,true          ,undefined   ],
      ["Autos Optimization"                                ,"autos"      ,true         ,true          ,undefined   ],
      ["Steering Control"                                  ,"install"    ,true         ,true          ,undefined   ],
      ["Mining Information"                                ,"install"    ,false        ,true          ,undefined   ],
      ["CAN API Periodic Messages"                         ,"can"        ,true         ,true          ,undefined   ],
      ["Remote.it diagnostics"                             ,"remote"     ,false        ,false         ,undefined   ]
    ];
    
    let i = 0;
    do {
      if ( headLin == lookUp[i][0] ) {
        this.pageId = lookUp[i][1];
        this.isDiag = lookUp[i][2];
        this.isHTML = lookUp[i][3];
        this.contId = lookUp[i][4];
        this.info = lookUp[i];
		//
      }
      i++;
    }
    while ( (this.pageId === undefined) && (i < lookUp.length) );
  }
}

/* ------------------------------------  CONVERTING FUNCTIONS ------------------------------------ */
/* ------------------------------------  PAGE INFO ------------------------------------ */
function guiInfo() {
  var td;
  var name = '-';
  var sn = '-';
  var swv = '-';
  var type;
  var compType;
  var model;
  
  // machine type and name
  var mdInfo = document.getElementById("mdInfo");
  if (mdInfo != null) {  
    td = mdInfo.getElementsByTagName("td");
    for (const t of td) {
      if (t.innerText == "Machine Name") {
        name = t.nextElementSibling.innerText;
      }
      if (t.innerText == "Machine Type") {
        type = t.nextElementSibling.innerText;
      }
      if (t.innerText == "Compaction Type") {
        compType = t.nextElementSibling.innerText;
      }
      if (t.innerText == "Model") {
        model = t.nextElementSibling.innerText;
      }
    }    
    
    // ec sn and sw version
    var sysInfo = document.getElementById("sysInfo");
    td = sysInfo.getElementsByTagName("td");
    for (const t of td) {
      if (t.innerText =="Software Version") {
        swv = t.nextElementSibling.innerText;
      }
      if (t.innerText == "Serial Number") {
        sn = t.nextElementSibling.innerText;
      }
    }
    
    // set info
    document.getElementById("machineInfo").innerHTML = name + '<br>' + sn + '<br>' + swv;
    
    // set machine icon
    if (type != undefined) {
      switch (true) { 
        case type == "Excavator":
          document.getElementById('machineIcon').src = "resources/images/excavator.png";
          break;
        case type == "Dozer":
          document.getElementById('machineIcon').src = "resources/images/dozer.png";
          break;
        case type == "Grader":
          document.getElementById('machineIcon').src = "resources/images/grader.png";
          break;
        case type == "CompactLoader":
          if (model.includes("GB")) {
            document.getElementById('machineIcon').src = "resources/images/ctl_grade.png";    
          } else if (model.includes("BB")) {
            document.getElementById('machineIcon').src = "resources/images/ctl_box.png";    
          } else {
            document.getElementById('machineIcon').src = "resources/images/ctl_dozer.png";    
          }
          break;
        case type == "MachineType_Label_Wheel_Loader":
          document.getElementById('machineIcon').src = "resources/images/wheelloader.png";
          break;
        case type == "SoilCompactor":
          if (compType == undefined) {
            document.getElementById('machineIcon').src = "resources/images/compactor_soil.png";        
          } else if (compType.includes("LandFill")) {
            document.getElementById('machineIcon').src = "resources/images/compactor_landfill.png";    
          }
          break;
      }
    }
  }
  
  // set positioning source
  var mStatus = document.getElementById("mStatus");
  if (mStatus != null) {  
    td = mStatus.getElementsByTagName("td");
    for (const t of td) {
      if (t.innerText == "Positioning Source") {
        var posS = t.nextElementSibling.innerText;
        switch (true) { 
          case posS.includes("2D"):
            document.getElementById('posSource').src = "resources/images/icons_PS_2D.png";
            break;
          case posS.includes("Single GNSS"):
            document.getElementById('posSource').src = "resources/images/icons_PS_GNSS.png";
			document.getElementById('posSourceBtn').setAttribute('onclick','openPage("gnssdetails")');
            break;
          case posS.includes("Dual"):
            document.getElementById('posSource').src = "resources/images/icons_PS_DualGNSS.png";
			document.getElementById('posSourceBtn').setAttribute('onclick','openPage("gnssdetails")');
            break; 
          case posS.includes("UTS"):
            document.getElementById('posSource').src = "resources/images/icons_PS_UTS.png";
			document.getElementById('posSourceBtn').setAttribute('onclick','openPage("utsdetails")');
            break;
        }
		document.getElementById('posSourceBtn').style.display = "flex";
      }
    }    
  }

  // set cell Signal 
  var networkInfo = document.getElementById("network"); 
  if (networkInfo != null) {  
    td = networkInfo.getElementsByTagName("td");
    for (const t of td) {
      if (t.innerText == "Status") {
        var signal = t.nextElementSibling.innerText;
		if ( signal.includes("OK") ) {
		  document.getElementById('cellSignal').src = "resources/images/cell_excellent_warning.png";
		}
	  } else if (t.innerText == "Cell Signal") {
        var signal = t.nextElementSibling.innerText;
        switch (true) { 
          case signal == "No Signal":
            document.getElementById('cellSignal').src = "resources/images/cell_no.png";
            break;
          case signal == "Poor":
            document.getElementById('cellSignal').src = "resources/images/cell_poor.png";
            break;                  
          case signal == "Fair":
            document.getElementById('cellSignal').src = "resources/images/cell_fair.png";
            break; 
          case signal == "Good":
            document.getElementById('cellSignal').src = "resources/images/cell_good.png";
            break; 
          case signal == "Excellent":
            document.getElementById('cellSignal').src = "resources/images/cell_excellent.png";
            break;
          default:
            document.getElementById('cellSignal').src = "resources/images/cell_warning.png";
            break;
        }
		document.getElementById('cellSignalBtn').style.display = "flex";
      }
    }
  }
  
  // set wifi info
  var wifiInfo = document.getElementById("wifiInfo");
  if (wifiInfo != null) {
    td = wifiInfo.getElementsByTagName("td");
    for (const t of td) {
      if (t.innerText == "Wifi AP Enabled") {
        var wifi = t.nextElementSibling.innerText;
        if (wifi.includes("True")) {
          document.getElementById('wifiIcon').src = "resources/images/wifi_excellent.png";
          document.getElementById('wifiIconBtn').style.display = "flex";		  
        }
      }
    }
  }
  
  // set cloud Info
  var cloudInfo = document.getElementById("cloudServ");
  if (cloudInfo != null) {
    td = cloudInfo.getElementsByTagName("td");
    for (const t of td) {
      if (t.innerText == "Cloud Service Active") {
        var tcc = t.nextElementSibling.innerText;
        if (tcc == "TCC") {
          document.getElementById('cloudIcon').src = "resources/images/cloud_no.png";
        }
		document.getElementById('cloudIconBtn').style.display = "flex";	
      }
	  if (t.innerText == "Data") {
        var data = t.nextElementSibling.innerText;
        if (data.includes("Connected")) {
          document.getElementById('cloudIcon').src = "resources/images/cloud.png";
        } else {
          document.getElementById('cloudIcon').src = "resources/images/cloud_warning.png";
        } 
        document.getElementById('cloudIconBtn').style.display = "flex";			
      }
    }
  }
}

/* ------------------------------------  SUMMARY ------------------------------------ */
function editSummary() {
  var page = document.getElementById("summary");
  var content = page.getElementsByClassName("content");
  
  const divElem = document.createElement("div");
  divElem.className = "threeGrid";
  divElem.id = "summaryGrid";
  page.appendChild(divElem);
  
  for ( var i = 0 ; i < content.length; i++ ) { 
	var contentElem = content[i];
    var contentHTML = contentElem.innerHTML;
    contentHTML = contentHTML.replace('content-header','content-header active');
    contentHTML = contentHTML.replace(' onclick="toggleContent()"','');
    contentHTML = contentHTML.replace('<button class="content-btn"><i class="fa fa-chevron-down"></i></button>','');
    contentHTML = contentHTML.replace('content-flex','content-block');
    content[i].innerHTML = contentHTML;
	content[i].className = "content-grid";
	divElem.appendChild(contentElem);
	i--;
  }
}
	
/* ------------------------------------  GNSS ------------------------------------ */
function editGNSS() {
  var elemGNSS = [null,null,null,null];
  elemGNSS[0] = document.getElementById("leftGNSS");
  elemGNSS[1] = document.getElementById("centerGNSS");
  elemGNSS[2] = document.getElementById("rightGNSS");
  elemGNSS[3] = document.getElementById("baseGNSS");
  var dataGNSS = [null,null,null,null];
  var numRec = 0;
  // switch entrys to non toggle and get data	  
  for ( var i = 0 ; i < elemGNSS.length-1; i++ ) { 
    if (elemGNSS[i] != null) {
      content = elemGNSS[i].innerHTML;
      content = content.replace('content-header','content-header active');
      content = content.replace(' onclick="toggleContent()"','');
      content = content.replace('<button class="content-btn"><i class="fa fa-chevron-down"></i></button>','');
      content = content.replace('content-flex','content-block');
      elemGNSS[i].innerHTML = content;
      dataGNSS[i] = getGnssData(elemGNSS[i]);
	  numRec++;
    }
  }
  if (elemGNSS[3] != null) {
    dataGNSS[3] = getGnssData(elemGNSS[3]);
  }
  
  // display multiply receiver side by side
  if ( numRec > 1 ) {
	var parentElem = document.getElementById("gnssdetails");
	const divElem = document.createElement("div");
	switch (numRec) { 
      case 2:
	    divElem.className = "twoGrid";
		break;
      case 3:
	    divElem.className = "threeGrid";
		break;
    }
    parentElem.appendChild(divElem);
	for ( var i = 0 ; i < elemGNSS.length-1; i++ ) { 
      if (elemGNSS[i] != null) {  
	    parentElem.removeChild(elemGNSS[i]);
        elemGNSS[i].className = "content-grid";
		divElem.appendChild(elemGNSS[i]);
	  }
	}	  
  }
  
  // set gnss data in action bar
  for ( var i = 0 ; i < elemGNSS.length-1; i++ ) { 
    if ( (elemGNSS[i] != null) ) {
	  var data;
	  if (dataGNSS[i] != null) {
	    data = dataGNSS[i];
	  } else {
        data = ['--','--','--','--'];
	  }		
	  var posInfo = "Num: " + data[0] + "<br>";
      posInfo += "V: " + data[1] + "<br>";
      posInfo += "H: " + data[2] + "<br>";
      posInfo += "Int/100s: " + data[3];
      document.getElementById('posError').innerHTML = posInfo;
	  document.getElementById('gnssErrorBtn').style.display = "flex";	
      break;	  
	}
  }
  
  //create map content
  var mapHeight = document.getElementById('contentFrame').offsetHeight - 120;
  content = '<div class="content"><div class="content-header" onclick="toggleContent()"><h1>';
  content += 'GNSS Map';
  /* content += '</h1><button class="content-btn"><i class="fa fa-chevron-down"></i></button></div><div class="content-flex" id="gnssmap" style="height:'+mapHeight+'px">'; */ /* ToDo: Comment out for further publications */
  content += '</h1><button class="content-btn"><i class="fa fa-chevron-down"></i></button></div><div class="content-flex" id="gnssmap">';
  content += '</div></div>';
  document.getElementById('gnssdetails').innerHTML += content;

 //calculate base length
  var latMean = 0;
  var lonMean = 0;
  if ( dataGNSS[3] != null ) {
    var baseData = dataGNSS[3];
    if ( !isNaN(baseData[4]) && !isNaN(baseData[5]) ) {
      latMean = baseData[4];
      lonMean = baseData[5];
      var baseLen;
      content = '<p>Distance Base Station to Machine approx.: ';
      for ( var i = 0 ; i < elemGNSS.length-1; i++ ) {
        if ( dataGNSS[i] != null ) {
          var recData = dataGNSS[i];
          if ( !isNaN(recData[4]) && !isNaN(recData[5]) ) {
            baseLen = haversine(baseData,recData);
            latMean = (baseData[4] + recData[4]) / 2;
            lonMean = (baseData[5] + recData[5]) / 2;
            break;
          }
        }
      }
      if ( baseLen != null ) {
        content += baseLen;	
      } else {
        content += '--';	
      }
      content += 'km</p>';
      document.getElementById('gnssmap').innerHTML += content;
    }
  }
  /* ToDo: Comment out for further publications */
  // create link
  var label = ['Left GNSS','Center GNSS','Right GNSS','Base'];
  for ( var i = 0 ; i < elemGNSS.length; i++ ) {
	if ( (elemGNSS[i] != null) ) {
	  var data;
	  if (dataGNSS[i] != null) {
	    data = dataGNSS[i];
		var href = 'https://maps.google.com/maps?q=' + data[4] + '+' + data[5];
		document.getElementById('gnssmap').innerHTML += '<a href='+href+' target="_blank">Open in Google Maps: '+label[i]+'</a>';
	  }
	}
  }
  /* // create map
  content = '<gmp-map  center="' + latMean + ',' + lonMean + '"';
  content += 'zoom="12" map-id="DEMO_MAP_ID" style="height:100%">';
  var label = ['Left GNSS','Center GNSS','Right GNSS','Base'];
  for ( var i = elemGNSS.length ; i >= 0 ; i-- ) { 
    if (elemGNSS[i] != null) {
	  var recData = dataGNSS[i];
      content += '<gmp-advanced-marker position="' + recData[4] + ',' + recData[5] + '" title="' + label[i] + '"></gmp-advanced-marker>';
    }
  }
  content += '</gmp-map>';
  document.getElementById('gnssmap').innerHTML += content;*/
}

function getGnssData(elem) {
  var td = elem.getElementsByTagName("td");
  var data = [NaN,NaN,NaN,NaN,NaN,NaN]; //SV, vErr, hErr, Integrity, Lat, Lon
  for (const t of td) {
    if (t.innerText == "SVs Used") {
      data[0] = t.nextElementSibling.innerText;
      //data[0] = Number(data[0]);
    } else if (t.innerText == "Vertical Error") {
      data[1] = t.nextElementSibling.innerText;
      //data[1] = data[1].substring(0, data[1].length-1);
        //data[1] = Number(data[1]);
    } else if (t.innerText == "Horizontal Error") {
      data[2] = t.nextElementSibling.innerText;
      //data[2] = data[2].substring(0, data[2].length-1);
        //data[2] = Number(data[2]);
    }  else if (t.innerText.includes("Data Link Integrity")) {
      data[3] = t.nextElementSibling.innerText;
      data[3] = data[3].split(' ');
      data[3] = data[3][0];
      //data[3] = data[3].substring(0, data[3].length-1);
        //data[3] = Number(data[3]);
    } else if (t.innerText.includes("Latitude")) {
      data[4] = t.nextElementSibling.innerText;
        data[4] = data[4].substring(0, data[4].length-1);
        data[4] = Number(data[4]);
    } else if (t.innerText.includes("Longitude")) {
      data[5] = t.nextElementSibling.innerText;
        data[5] = data[5].substring(0, data[5].length-1);
        data[5] = Number(data[5]);
    }
  }
  return data;    
}

function haversine(baseData,leftData) {
  var d = '--';
  var lat1 = baseData[4] * Math.PI/180;
  var lat2 = leftData[4] * Math.PI/180;
  var dLat = (leftData[4]-baseData[4]) * Math.PI/180;
  var dLon = (leftData[5]-baseData[5]) * Math.PI/180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1) * Math.cos(lat2) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var R = 6371; // kilometres
  var d = R * c;
  d = d.toFixed(1);
    
  return d;
}

/* ------------------------------------  REMOTE IT ------------------------------------ */
function editREMOTEit() {
  var page = document.getElementById("remote");
  var remote = page.getElementsByClassName("content")[0];
  if (remote != null) {
    var lines = page.getElementsByClassName("content-flex")[0].innerHTML;
    lines = lines.split('<br>');
    
    page.removeChild(remote);
    
	var lastLine = 0;
    var content = '<div class="content"><div class="content-header" onclick="toggleContent()"><h1>';
    content += 'Diagnostics';
    content += '</h1>';
    content += '<button class="content-btn"><i class="fa fa-chevron-down"></i></button></div><div class="content-flex" style="justify-content:start">';
    content += '<p>';
    for (var i = 0; i < lines.length-1; i++) {
      if (lines[i+1].includes("----------")) {
        content += '</p></div></div>';
		if ( (i-lastLine) > 2 ) { // avoid empty elements
          page.innerHTML += content;
		}
		lastLine = i;
        content = '<div class="content"><div class="content-header" onclick="toggleContent()"><h1>';
		
        content += lines[i].replace(":","");
        content += '</h1>';
        content += '<button class="content-btn"><i class="fa fa-chevron-down"></i></button></div><div class="content-flex" style="justify-content:start">';
        content += '<p>';
        i++;
      } else {
        content += lines[i];
        content += "<br>";
      }
    }
    content += lines[lines.length-1];
    content += '</p></div></div>';
    page.innerHTML += content;
  }
}

/* ------------------------------------  FEATURES ------------------------------------ */
function editFeatures() {
  var page = document.getElementById("features");
  var content = page.getElementsByClassName("content");
  for (const c of content) {
    var td = c.getElementsByTagName("td");
	var headLinElem = c.childNodes[0];
    for (const t of td) {
      if (t.innerText == "Feature Enabled") {
		// TO DO changen head line
		var img = document.createElement('img');
        if (t.nextElementSibling.innerText.includes("No")) {
		  img.src = "resources/images/error.png"; 
        } else if (t.nextElementSibling.innerText.includes("Yes")) {
		  img.src = "resources/images/check.png";   
        }
		
		headLinElem.className = "content-header-info"; 
		var h1 = headLinElem.getElementsByTagName('h1')[0];
		var info1 = document.createElement("h2");
		var info2 = document.createElement("h2");
	    var btn = headLinElem.getElementsByTagName('button')[0];
		
	    headLinElem.innerHTML = "";
		headLinElem.appendChild(img);
		headLinElem.appendChild(h1);
		headLinElem.appendChild(info1);
		headLinElem.appendChild(info2);
		headLinElem.appendChild(btn);

		break;
        }
    }
  }
}

/* ------------------------------------  DEVICES ------------------------------------ */
function editDevices() {
  var page = document.getElementById("devices");
  var content = page.getElementsByClassName("content");
  for (const c of content) {
    var img = document.createElement("img");
	var fw = document.createElement("h2");
	var add = document.createElement("h2");
    var td = c.getElementsByTagName("td");
    for (const t of td) {
	  if (t.innerText.includes("Serial Number")) {
	    var sn = t.nextElementSibling.innerText;
		if (sn.length > 0) {
	      var btn = '<button class="copy-btn" id="' + sn + '" onclick="copyToClip()"><i class="fa fa-clone"></i></button>';
		  t.nextElementSibling.innerHTML += btn;
	    }
	  }
	  if (t.innerText.includes("Status")) {  
        if (t.nextElementSibling.innerText.includes("Not found")) {
            img.src= "resources/images/error.png"; 
          } else if (t.nextElementSibling.innerText.includes("Connected")) {
            img.src= "resources/images/check.png";   
          } else /*if (t.nextElementSibling.innerText.includes("Configurating"))*/ {
            img.src= "resources/images/warning.png"; 
          }
        }
      if (t.innerText.includes("Application Firmware Version")) {
        fw.innerHTML += t.nextElementSibling.innerText;
      }
	  if (t.innerText.includes("J1939 Address")) {
        add.innerHTML += t.nextElementSibling.innerText;
      }
    }
	var headLinElem = c.childNodes[0];
	headLinElem.className = "content-header-info";
	var h1 = headLinElem.getElementsByTagName('h1')[0];
	var btn = headLinElem.getElementsByTagName('button')[0];
		
	headLinElem.innerHTML = "";
	headLinElem.appendChild(img);
	headLinElem.appendChild(h1);
	headLinElem.appendChild(fw);
	headLinElem.appendChild(add);
	headLinElem.appendChild(btn);
  }
}

/* ------------------------------------  LICENSES ------------------------------------ */
function editLicenses() {
  var page = document.getElementById("licenses");
  var content = page.getElementsByClassName("content");
  for (const c of content) {
      var sn = c.childNodes[0].childNodes[0].innerHTML;
      sn = sn.substring(sn.length-10,sn.length)
      var btn = '<button class="copy-btn" id="' + sn + '" onclick="copyToClip()"><i class="fa fa-clone"></i></button>';
      c.childNodes[0].childNodes[0].innerHTML += btn;
  }
}

/* ------------------------------------  ATTACHEMENT ------------------------------------ */
function editAttachment() {
  var page = document.getElementById("attachment");
  var content = page.getElementsByClassName("content");
  
  if (content.length > 0) {
    var name;
    var i = 0;
    var divElem;
    
    // get current attachment from detail  
    var headLinElem = content[i].childNodes[0];
    var h1 = headLinElem.getElementsByTagName('h1')[0];
    if (h1.innerHTML.includes("Attachment Details")) {
 	  h1.innerHTML = h1.innerHTML.replace("Attachment ","");
      var td = content[i].getElementsByTagName("td");
      for (const t of td) {
        if (t.innerText.includes("Current Attachment")) {    
          name = t.nextElementSibling.innerText;
        }      
      }
 	  divElem = document.createElement("div");
      divElem.className = "fourGrid";
      page.appendChild(divElem);
 	  i++;
    }
    
    // change attachment as grid element
    for ( i ; i < content.length; i++ ) {
      var headLinElem = content[i].childNodes[0];
 	  var h1 = headLinElem.getElementsByTagName('h1')[0];
 	  h1.innerHTML = h1.innerHTML.replace("Attachment: ","");
      if (h1.innerHTML.includes(name)) {
 	    headLinElem.className = "content-header-info";
        var img = document.createElement("img");
 	    img.src= "resources/images/check.png"; 
		var info1 = document.createElement("h2");
		var info2 = document.createElement("h2");
 	    var btn = headLinElem.getElementsByTagName('button')[0];
 	   	
 	    headLinElem.innerHTML = "";
 	    headLinElem.appendChild(img);
 	    headLinElem.appendChild(h1);
 	    headLinElem.appendChild(info1);
 	    headLinElem.appendChild(info2);
 	    headLinElem.appendChild(btn);
      }
 	  if (divElem != undefined) {
 	 	content[i].className = "content-grid";
 	 	i--;
 	  }
    }
    
    // add element to grid
    if (divElem != undefined) {
      var contentGrid = page.getElementsByClassName("content-grid");
      var elem = contentGrid.length;
      for ( i = 0 ; i < elem; i++ ) {
        divElem.appendChild(contentGrid[0]);  
      }
    }
  }
}

/* ------------------------------------  VALVE ------------------------------------ */
function editValves() {
  var page = document.getElementById("valve");
  var content = page.getElementsByClassName("content");
  
  if (content.length > 0) {
    var trtd = '<tr><td>';
    var tdtr = '</td></tr>';
    var sepOld = ': ';
    var sepNew = '</td><td>';
    var start = '<table class="table-striped"><tbody>';
    var end = '</tbody></table>';
    var ln = [];  
    for (var i = 0; i < content.length; i++) {
      var contentElem = content[i].childNodes[1];
      var lines = contentElem.innerHTML;
	  if ( (!lines.includes('not done')) && (!lines.includes('WARNING')) ) {
        lines = lines.split('<br>');
        
        // ----- general data -----
        ln = [];
        sepOld = ': ';
        for (var j = 0; j < lines.length; j++) {
          if (lines[j].includes(': ')) {
            ln.push(lines[j]);		
          } else {
            break;
          }
        }
        // convert content
        ln = ln.map(el => trtd + el + tdtr);
        ln = ln.map(el => el.replaceAll(sepOld,sepNew));
        ln = ln.join("");
        contentElem.innerHTML = start + ln + end;
        
        // ----- calibration values -----	
        var headline = '';
        var line = '';
        ln = [];
        sepOld = ' ';
        var ComVelPre = [];
        for (j ; j < lines.length; j++) {
          if (lines[j].includes('Command')) {
            headline = lines[j].replaceAll(/ +(?= )/g,'');
            headline = headline.replace(' ','</th><th>');
            headline = headline.replace(' ','</th><th>');
            headline = '<tr><th>' + headline + '</th></tr>';
          } else if (lines[j].includes('Raise') || lines[j].includes('Lower')) {
            //skip line
          } else if ((lines[j].length > 0)) {
            line = lines[j].replace(/ +(?= )/g,'');
          if (line[line.length-1].includes(' ')) {
            line = line.substring(0,line.length-1);
          }
          ln.push(line);
          ComVelPre.push(line.split(' '));
          }
        }
		
		if ( ComVelPre.length > 0 ) {
		  // sorting values in ascending order
		  ComVelPre.sort(function(a, b){return a[0] - b[0]});
		  
		  // create html content
	      var plotId = "vPlot" + i;
          var contentHTML = '<div class="content-plot" id=' + plotId + '></div>';
		  
		  var tableId = 'vTable' + i;
		  contentHTML += '<div class="content-sub"><div class="content-header-sub" onclick="toggleSubContent()"><h1>';
          contentHTML += 'Calibration Values';
          contentHTML += '</h1>';
          contentHTML += '<button class="sub-content-btn"><i class="fa fa-chevron-down"></i></button></div><div class="sub-content-flex">';
          contentHTML += '<table class="table-striped"><tbody id=' + tableId + '>';
          contentHTML += '</table></tbody>';
          contentHTML += '</div></div>';
          contentElem.innerHTML += contentHTML;
		
		  // create plot
		  plotValve(plotId, ComVelPre);	
		  
		  // convert content and write in table
		  for (var c = 0; c < ComVelPre.length; c++) {
	 	   ComVelPre[c] = ComVelPre[c].join('</td><td>');
          }
          ComVelPre = ComVelPre.map(el => trtd + el + tdtr);
          ComVelPre = ComVelPre.join('');
          
	      document.getElementById(tableId).innerHTML += headline;
          document.getElementById(tableId).innerHTML += ComVelPre; 
		}
	  } else {
        ln = lines.split('<br>');
        ln = ln.filter(n => n);
        // convert content
        ln = ln.map(el => trtd + el + tdtr);
        ln = ln.join("");
        contentElem.innerHTML = start + ln + end;
	  }
    }
  }
}

/* ------------------------------------  MACHINE ------------------------------------ */
function editView(lines) {
  // machine type
  var mdInfo = document.getElementById("mdInfo");
  var type;
  var td = mdInfo.getElementsByTagName("td");
  for (const t of td) {
    if (t.innerText.includes("Machine Type")) {
      type = t.nextElementSibling.innerText;
	  break;
    }
  }

  if (type != undefined) {
    //machine data
    var machine = new Machine();
    switch (true) { 
      case type == "Excavator":
        machine = new Excavator(lines);
        break;
      case type == "Dozer":
        machine = new Dozer(lines);
        break;
      case type == "Grader":
        machine = new Grader(lines);
        break;
      case type == "CompactLoader":
        machine = new CompactLoader(lines);
        break;
      case type == "MachineType_Label_Wheel_Loader":
        machine = new WheelLoader(lines);
        break;
      case type == "SoilCompactor":
        machine = new Compactor(lines);
        break;
    }
	// plot view
    plotMachine('mPlot',machine);
	
    //point list
    var pointEntry = "";
    for (p of machine.points) {
 	  pointEntry += '<tr><td>';
 	  pointEntry += p.name;
 	  pointEntry += '</td><td>';
 	  pointEntry += p.x.toFixed(3);
 	  pointEntry += '</td><td>';
 	  pointEntry += p.y.toFixed(3);
 	  pointEntry += '</td><td>';
 	  pointEntry += p.z.toFixed(3);
 	  pointEntry += '</td></tr>';
    }
    document.getElementById('mTable').innerHTML += pointEntry;
    document.getElementById("viewA").style.display = "flex";	
  }
}

/* ------------------------------------  LOG DEV ------------------------------------ */
function logDEV(elem, str) {
	childElem = document.createElement(elem);
	childElem.innerHTML = str;
	document.getElementById("devcont").appendChild(childElem);
}