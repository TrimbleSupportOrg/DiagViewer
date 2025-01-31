function assistant(lines) {
  
  const contSelec = document.getElementById("assicont");
  contSelec.innerHTML += '<h3>Diagnostics</h3>';
  
  var pageInfo = new lookUpData("System Information");
	  
  var headLin = "";
  var headCont = "";
  var content = "";
  
  // Loop through all rows
  for (var i = 0; i < lines.length; i++) {
    
    if ( (lines[i].startsWith("| ")) && (lines[i].endsWith(" |")) ) { // Handel header lines
	
	  // write data
	  if (content.length>=1) {
        contSelec.innerHTML += headCont;
        headLin = "";
	    headCont = "";
	    
		contSelec.innerHTML += '<table class="table-assistant"><tbody>' + content + '</tbody></table>';
        content = "";
      }
	
	  headLin = lines[i].substring(2,lines[i].length-2);
	  var pageInfoNew = new lookUpData(headLin); 
      if (pageInfoNew.pageId != undefined) { // keep last reference if headline not found
        pageInfo = pageInfoNew;
	  }
	  headCont = '<button class="pageLink" onclick=openPage("' + pageInfo.pageId + '")>';
	  headCont += headLin;
	  headCont += '</button>';
	  //alert(headCont);	
    }

    // Switch Element for content input
    switch (true) {
      // SENSOR
      case lines[i].includes("Calibration Angle"):
        var lineRow = lines[i].split(': ');
        lineRow[1] = lineRow[1].replaceAll('(','');
        lineRow[1] = lineRow[1].replaceAll(')','');
        lineRow[1] = lineRow[1].replaceAll(' ','');
        lineRow = lineRow[1].split(',');
        for (var j = 0; j < lineRow.length; j++) {
          lineRow[j] = lineRow[j].substring(0,lineRow[j].length-1);
          if (!isNaN(Number(lineRow[j])) && !Number(lineRow[j])==0) {
          } else {
            content += '<tr><td>' + lines[i] + '</td><td>\u2190 Value does not seem to be calibrated</td><td>';
			break;			
          }
        }
        break;
      // DEVICE
      case lines[i].startsWith("Status"):
        if (lines[i].includes("Connected")) {
        } else if (lines[i].includes("OK")) {
        } else {
          content += '<tr><td>' + lines[i] + '</td><td>\u2190 Device Status not connected</td><td>'; 
        }
        break;
      // GNSS VALUES
      case lines[i].includes("GNSS Mode"):
        if (!lines[i].includes("RTK Fixed")) {
          content += '<tr><td>' + lines[i] + '</td><td>\u2190 Mode not RTK fixed</td><td>';
        }
      case lines[i].includes("SVs Used"):
        var lineRow = lines[i].split(': ');
        if (lineRow[1]<10) {
          content += '<tr><td>' + lines[i] + '</td><td>\u2190 Recommendation of at least 10 satellites used</td><td>';
        }
        break;
      case lines[i].includes("Vertical Error"):
        var lineRow = lines[i].split(': ');
        lineRow[1] = lineRow[1].substring(0,lineRow[1].length-1);
        if (lineRow[1]>=0.045) {
          content += '<tr><td>' + lines[i] + '</td><td>\u2190 Recommendation error less than 0.045m</td><td>';
        }
        break;
      case lines[i].includes("Horizontal Error"): //medium 0.045
        var lineRow = lines[i].split(': ');
        lineRow[1] = lineRow[1].substring(0,lineRow[1].length-1);
        if (lineRow[1]>=0.045) {
          content += '<tr><td>' + lines[i] + '</td><td>\u2190 Recommendation error less than 0.045m</td><td>';
        }
        break;
      case lines[i].includes("Data Link Integrity"):
        var lineRow = lines[i].split(': ');
        lineRow = lineRow[1].split(' ');
        lineRow[0] = lineRow[0].substring(0,lineRow[0].length-1);
        if (lineRow[0]<95.0) {
          content += '<tr><td>' + lines[i] + '</td><td>\u2190 Recommendation integrity of last 100s greater than 95.0%</td><td>';
        }
        break;
      // CELL SIGNAL
      case lines[i].includes("Cell Signal"):
        if (lines[i].includes("No Signal") || lines[i].includes("Poor") || lines[i].includes("Fair") ) {
          content += '<tr><td>' + lines[i] + '</td><td>\u2190 Cell Signal equal or worse than fair</td><td>';
        }
        break;
      // CLOUD SERVICE
      case lines[i].includes("Data: Not Connected"):
        content += '<tr><td>' + lines[i] + '</td><td>\u2190 Missing connection</td><td>';
        break;
      // VALVES
      case lines[i].includes("Valve Calibration is not done"):
        content += '<tr><td>' + lines[i] + '</td><td>\u2190 Missing calibration</td><td>';
        break;
	  // GENERAL
	  case lines[i].includes("WARNING"):
        content += '<tr><td>' + lines[i] + '</td><td>\u2190 Check general warning info</td><td>';
        break;
	  case lines[i].includes("ERROR"):
        content += '<tr><td>' + lines[i] + '</td><td>\u2190 Check general error info</td><td>';
        break;
    } // end of switch
    
  } //end of for loop

}