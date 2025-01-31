// show dropzone at file drop enter event
function dragOverHandler(ev) {
  if ( document.getElementById("flPage").style.display == "none" ) {
    showFileLoad();
  }
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}

function showLogIn() {
  document.getElementById("signIn").style.display = "flex";
  document.getElementById("signIn").innerHTML = '<img style="height:38px" src="resources/images/logo_google_icon.png"/> Sign in with Google';
  document.getElementById("spin").className = "spinner";
  document.getElementById("flUpload").style.display = "none";
}

function showLogOut() {
  document.getElementById("signIn").innerHTML = '<img style="height:38px" src="resources/images/logo_google_icon.png"/> Sign in with Google';
  document.getElementById("flUpload").style.display = "none";
  document.getElementById("swInfo").style = "animation: swipeToCenter 0.5s forwards ease-in-out";
}

function showFileLoad_init() {
  document.getElementById("signIn").innerHTML = 'Log Out';
  document.getElementById("swInfo").style = "animation: swipeToLeft 0.5s forwards ease-in-out";
  setTimeout(() => {
    document.getElementById("flUpload").style.display = "flex";
  }, "500");
}

function showFileLoad() {
  document.getElementById("flPage").style.display = "flex";
  document.getElementById("signIn").innerHTML = 'Log Out';
  document.getElementById("signIn").style.display = "flex";
  document.getElementById("spin").className = "spinner";
  document.getElementById("swInfo").style = "transform: translate(-100%, -50%)";
  document.getElementById("flUpload").style.display = "flex";
}

function showFileLoadClick() {
  showFileLoad();
  document.getElementById('filepicker').click();
}

function showLoading(){
  document.getElementById("signIn").style.display = "none";
  document.getElementById("backBtn").style.display = "none";
  document.getElementById("swInfo").style = "transform: translate(-50%, -50%)";
  document.getElementById("spin").className = "spinner-active";
  document.getElementById("flUpload").style.display = "none";
}

function showMain() {
  document.getElementById("mnPage").className += " active";
  document.getElementById("backBtn").style.display = "flex";
  document.getElementById("flPage").style.display = "none";	
}

function signIn() {
  var signIn = document.getElementById("signIn");
  if ( signIn.className.includes("parent") || signIn.className.includes("user") ) {
	signIn.className = "signInBtn";
    showLogOut();
	alert("Logged out");
  } else {
	/* ToDo: Comment out for further publications */
	alert("Sign in with Google.");
	/*var parentUser = confirm("Sign in with Google. Are you a Trimble/CTCT user?"); 
	if ( parentUser ) {
	  document.getElementById("signIn").className += " parent";
	} else {*/
      document.getElementById("signIn").className += " user";
	/*}*/
	showFileLoad_init();
  }
}

// open sidenav sub menu and activate first entry
function openBtnContent() {
  //Remove sidenav-btn active state  
  var sideBtnActive = document.getElementsByClassName("sidenav-btn active");
  for (var i = 0; i < sideBtnActive.length; i++) {
    sideBtnActive[i].className = sideBtnActive[i].className.replace(" active", "");
  }
  //Set next sidenav-container display to none
  var sideConActive = document.getElementsByClassName("sidenav-container active");
  for (var i = 0; i < sideConActive.length; i++) {
	sideConActive[i].className = sideConActive[i].className.replace(" active", "");
  }
  //Set sidenav-btn active
  var source = event.target || event.srcElement;
  source.className += " active";
  //Set following sidenav-container elements display to block
  source.nextElementSibling.className += " active";
  //Click on first visible contentlink
  var child = source.nextElementSibling.children;
  child[0].click();
}

// switch between visible content page
function openContent(sectionId) {
  //remove anchor active state
  var activeAnchor = document.getElementsByClassName("sidenav-div active");
  for (var i = 0; i < activeAnchor.length; i++) {
    activeAnchor[i].className = activeAnchor[i].className.replace(" active", "");
  }
  
  //remove section active state
  var activePage = document.getElementsByClassName("page active");
  for (var i = 0; i < activePage.length; i++) {
    activePage[i].className = activePage[i].className.replace(" active", "");
  }

  //set anchor to active
  var source = event.target || event.srcElement;
  source.className += " active";

  //set section active state
  var sourcePage = document.getElementById(sectionId);
  sourcePage.className += " active";
  document.getElementById("contentFrame").scroll({top:0,behavior:'instant'});
}

function initPage() {
	
  // headline
  document.getElementById("progTitle").innerHTML = "";
  	
  // page info
  document.getElementById("machineInfo").innerHTML = "";
  document.getElementById('machineIcon').src = "";    
  
  // action bar
  document.getElementById('posSource').src = "";
  document.getElementById('posSourceBtn').style.display = "none";
  document.getElementById('posError').innerHTML = ""; 
  document.getElementById('gnssErrorBtn').style.display = "none";  
  document.getElementById('cellSignal').src = "";
  document.getElementById('cellSignalBtn').style.display = "none";
  document.getElementById('wifiIcon').src = ""; 
  document.getElementById('wifiIconBtn').style.display = "none"; 
  document.getElementById('cloudIcon').src = "";
  document.getElementById('cloudIconBtn').style.display = "none";
  
  // content anchor
  var anchorCont = document.getElementsByClassName('sidenav-div');
  for ( var i = 0; i < anchorCont.length; i++ ) {
	anchorCont[i].style.display = "none";
  }
  
  // dev content
  document.getElementById("sidenavDevBtn").style.display = "none";
  
  clearActiveState();
    
  // clear content
  var content = document.getElementById('contentFrame');
  content.innerHTML = "";
  //content.innerHTML = '<object type="text/html" data="content.html" ></object>';
  content.innerHTML = '<section class="page active" id="assistant"><div class="page-header"><div class="imgAndHeader"><img style="height:38px" src="resources/images/assistant_logo.png"/><h1>Trimble Assistant</h1></div></div><div class="content" id="assicont"></div></section>';
  content.innerHTML += '<section class="page" id="summary"><div class="page-header"><h1>Machine Summary</h1></div></section>';
  content.innerHTML += '<section class="page" id="features"><div class="page-header"><h1>Features in the System</h1><button class="page-btn" onclick="toggleContentAll()"> <i class="fa fa-chevron-down"></i> </button></div></section>';
  content.innerHTML += '<section class="page" id="devices"><div class="page-header"><h1>Onboard Devices</h1><button class="page-btn" onclick="toggleContentAll()"> <i class="fa fa-chevron-down"></i> </button></div></section>';
  //content.innerHTML += '<section class="page" id="view"><div class="page-header"><h1>Machine View</h1></div><div class="content"><div class="content-header active"><h1>3D Measure-Up View</h1></div><div class="content-block"><table class="table-striped"><tbody id="mTableClick"><tr><th>Point (click in graph to add)</th><th>North (x)</th><th>East (y)</th><th>Height (z)</th></tr></tbody></table></div><div class="content-plot" id="mPlot"></div></div><div class="content"><div class="content-header" onclick="toggleContent()"><h1>3D Pin Positions</h1><button class="content-btn"><i class="fa fa-chevron-down"></i></button></div><div class="content-flex"><table class="table-striped"><tbody id="mTable"><tr><th>Point</th><th>North (x)</th><th>East (y)</th><th>Height (z)</th></tr></tbody></table></div></div></section>';
  content.innerHTML += '<section class="page" id="view"><div class="page-header"><h1>Machine View</h1></div><div class="content"><div class="content-header active"><h1>3D Measure-Up View</h1></div><div class="content-nextto"><div class="content-plot" id="mPlot"></div><div class="plotMeasure" id="mTableClick"><p>Click in Plot so select points:</p><br><p>Start Point:</p><table class="table-striped"><tbody id="ptStart"><tr><th>Name</th><td></td></tr><tr><th>X</th><td></td></tr><tr><th>Y</th><td></td></tr><tr><th>Z</th><td></td></tr></tbody></table><br><p>End Point:</p><table class="table-striped"><tbody id="ptEnd"><tr><th>Name</th><td></td></tr><tr><th>X</th><td></td></tr><tr><th>Y</th><td></td></tr><tr><th>Z</th><td></td></tr></tbody></table><br><p>Distance:</p><table class="table-striped"><tbody id="ptDist"><tr><th>2D</th><td></td></tr><tr><th>Vert.</th><td></td></tr><tr><th>3D</th><td></td></tr></tbody></table><br><button class="resetBtn" onclick="resetMTable()">Reset</button></div></div></div><div class="content"><div class="content-header" onclick="toggleContent()"><h1>3D Pin Positions</h1><button class="content-btn"><i class="fa fa-chevron-down"></i></button></div><div class="content-flex"><table class="table-striped"><tbody id="mTable"><tr><th>Point</th><th>North (x)</th><th>East (y)</th><th>Height (z)</th></tr></tbody></table></div></div></section>';
  content.innerHTML += '<section class="page" id="gnssdetails"><div class="page-header"><h1>GNSS Details</h1><button class="page-btn" onclick="toggleContentAll()"> <i class="fa fa-chevron-down"></i> </button></div></section>';
  content.innerHTML += '<section class="page" id="utsdetails"><div class="page-header"><h1>UTS Details</h1><button class="page-btn" onclick="toggleContentAll()"> <i class="fa fa-chevron-down"></i> </button></div></section>';
  content.innerHTML += '<section class="page" id="diagnostics"><div class="page-header"><h1>Machine Diagnostics</h1><button class="page-btn" onclick="toggleContentAll()"> <i class="fa fa-chevron-down"></i> </button></div></section>';
  content.innerHTML += '<section class="page" id="positions"><div class="page-header"><h1>Machine Positions</h1><button class="page-btn" onclick="toggleContentAll()"> <i class="fa fa-chevron-down"></i> </button></div></section>';
  content.innerHTML += '<section class="page" id="mapping"><div class="page-header"><h1>Mapping</h1><button class="page-btn" onclick="toggleContentAll()"> <i class="fa fa-chevron-down"></i> </button></div></section>';
  content.innerHTML += '<section class="page" id="install"><div class="page-header"><h1>Install Assistant</h1><button class="page-btn" onclick="toggleContentAll()"> <i class="fa fa-chevron-down"></i> </button></div></section>';
  content.innerHTML += '<section class="page" id="measure"><div class="page-header"><h1>Measure-up</h1><button class="page-btn" onclick="toggleContentAll()"> <i class="fa fa-chevron-down"></i> </button></div></section>';
  content.innerHTML += '<section class="page" id="attachment"><div class="page-header"><h1>Attachment</h1><button class="page-btn" onclick="toggleContentAll()"> <i class="fa fa-chevron-down"></i> </button></div></section>';
  content.innerHTML += '<section class="page" id="valve"><div class="page-header"><h1>Valve Test</h1><button class="page-btn" onclick="toggleContentAll()"> <i class="fa fa-chevron-down"></i> </button></div></section>';
  content.innerHTML += '<section class="page" id="autos"><div class="page-header"><h1>Autos Optimization</h1><button class="page-btn" onclick="toggleContentAll()"> <i class="fa fa-chevron-down"></i> </button></div></section>';
  content.innerHTML += '<section class="page" id="internet"><div class="page-header"><h1>Internet Gateway</h1><button class="page-btn" onclick="toggleContentAll()"> <i class="fa fa-chevron-down"></i> </button></div></section>';
  content.innerHTML += '<section class="page" id="correction"><div class="page-header"><h1>GNSS Correction Source</h1><button class="page-btn" onclick="toggleContentAll()"> <i class="fa fa-chevron-down"></i> </button></div></section>';
  content.innerHTML += '<section class="page" id="cloud"><div class="page-header"><h1>Cloud Services</h1><button class="page-btn" onclick="toggleContentAll()"> <i class="fa fa-chevron-down"></i> </button></div></section>';
  content.innerHTML += '<section class="page" id="clients"><div class="page-header"><h1>Connected Clients</h1><button class="page-btn" onclick="toggleContentAll()"> <i class="fa fa-chevron-down"></i> </button></div></section>';
  content.innerHTML += '<section class="page" id="http"><div class="page-header"><h1>Recent Http Requests</h1><button class="page-btn" onclick="toggleContentAll()"> <i class="fa fa-chevron-down"></i> </button></div></section>';
  content.innerHTML += '<section class="page" id="can"><div class="page-header"><h1>CAN API Periodic Messages</h1><button class="page-btn" onclick="toggleContentAll()"> <i class="fa fa-chevron-down"></i> </button></div></section>';
  content.innerHTML += '<section class="page" id="remote"><div class="page-header"><h1>Remote.it</h1><button class="page-btn" onclick="toggleContentAll()"> <i class="fa fa-chevron-down"></i> </button></div></section>';
  content.innerHTML += '<section class="page" id="licenses"><div class="page-header"><h1>Licenses</h1><button class="page-btn" onclick="toggleContentAll()"> <i class="fa fa-chevron-down"></i> </button></div></section>';
  content.innerHTML += '<section class="page" id="firmware"><div class="page-header"><h1>Firmware Upgrades</h1><button class="page-btn" onclick="toggleContentAll()"> <i class="fa fa-chevron-down"></i> </button></div></section>';
  content.innerHTML += '<section class="page" id="diagtxt"><div class="page-header"><h1>Diagnostics.txt</h1></div><div class="content" id="diagcont"></div></section>';
  content.innerHTML += '<section class="page" id="devlog"><div class="page-header"><h1>DEV File Log</h1></div><div class="contentLog" id="devcont"></div></section>';
 
 /*
  var xhr = new XMLHttpRequest();
  
  // Set up the callback for when the response has
  // been recieved
  xhr.onreadystatechange = function (){
   if(xhr.readyState === 4) {
     // Was the request successful?
     if(xhr.status === 200 || xhr.status == 0) {
       // Populate the <div> with the response text
  	   alert('responseText');
       alert(xhr.responseText);
       //content.innerHTML = xhr.responseText;
     }
   }
  }
  
  // Configure the request
  xhr.open("GET", "content.txt", true);
  xhr.responseType = "document";
  xhr.send(null);  // Make the call
  */
  userPermision();
}

function userPermision() {
  // ToDo: switch between general user and parent (trimble,ctct) user
  // parent user: permission for dev tool and all data as far as supported  --> 
  var userGroup = document.getElementById("signIn").className;
  if ( userGroup.includes("parent") ) {
	document.getElementById("sidenavDevBtn").style.display = "block";
	document.getElementById("mTableClick").style.display = "block"; 
  } else /*( userGroup.includes("user") )*/ {	
  }
}

function resetMTable() {
  var startElem = document.getElementById('ptStart');
  var endElem = document.getElementById('ptEnd');
  var distElem = document.getElementById('ptDist');
  startElem.innerHTML = '<tr><th>Name</th><td></td></tr><tr><th>X</th><td></td></tr><tr><th>Y</th><td></td></tr><tr><th>Z</th><td></td></tr>';	
  endElem.innerHTML = '<tr><th>Name</th><td></td></tr><tr><th>X</th><td></td></tr><tr><th>Y</th><td></td></tr><tr><th>Z</th><td></td></tr>';
  distElem.innerHTML = '<tr><th>2D</th><td></td></tr><tr><th>Vert.</th><td></td></tr><tr><th>3D</th><td></td></tr>';
}


function openPage(pageId) {
  clearActiveState();
  // active
  try {
    document.getElementById(pageId).className += " active";
    var sidenavA = document.getElementById(pageId + 'A');
    sidenavA.className += " active";
    var sidenavCont = sidenavA.parentNode;
    sidenavCont.className += " active";
    var sidenavBtn = sidenavCont.previousElementSibling;
    sidenavBtn.className += " active";
  } catch (error) {
  }
  
  enterNav();
  leaveNav();
}

function clearActiveState() {
   //remove section active state
  var activePage = document.getElementsByClassName("page active");
  for (var i = 0; i < activePage.length; i++) {
    activePage[i].className = activePage[i].className.replace(" active", "");
  }
  document.getElementById("contentFrame").scroll({top:0,behavior:'instant'});
  
  // hide anchors
  var elem = document.getElementsByClassName('sidenav-div active');
  for (var i = 0; i < elem.length; i++) {
    elem[i].className = elem[i].className.replace(" active", "");
  }
  elem = document.getElementsByClassName('sidenav-container active');
  for (var i = 0; i < elem.length; i++) {
    elem[i].style.display = ""; /*default*/
	elem[i].className = elem[i].className.replace(" active", "");
  }
  elem = document.getElementsByClassName('sidenav-btn active');
  for (var i = 0; i < elem.length; i++) {
    elem[i].style.backgroundColor = ""; /*default*/
	elem[i].className = elem[i].className.replace(" active", "");
  }		
}

function fixNav(){
  var sideClass = document.getElementById("sidenav").className;
  if ( sideClass.includes("active") ) {
    sideClass = sideClass.replace(" active", "");
	document.getElementById("lockIcon").src = "resources/images/unlocked.png";
  } else {
	sideClass += " active";
	document.getElementById("lockIcon").src = "resources/images/locked.png";
  }
  document.getElementById("sidenav").className = sideClass;
}

function enterNav() {
  document.getElementById("sidenav").style.width = "270px";
  document.getElementById("sidenav").style.overflowY = "auto";
  var elem = document.getElementsByClassName("sidenav-container active");
  for (var i = 0; i < elem.length; i++) {
    elem[i].style.display = ""; /*default*/
  }
  var elem = document.getElementsByClassName("sidenav-btn active");
  for (var i = 0; i < elem.length; i++) {
    elem[i].style.border = ""; /*default*/
	elem[i].style.backgroundColor = ""; /*default*/
  }
}

function leaveNav() {
  var sideClass = document.getElementById("sidenav").className;
  if ( !sideClass.includes("active") ) {
	document.getElementById("sidenav").style.width = "60px";
	document.getElementById("sidenav").style.overflowY = "hidden";
	var elem = document.getElementsByClassName("sidenav-container active");
	for (var i = 0; i < elem.length; i++) {
	  elem[i].style.display = "none";
	}
	var elem = document.getElementsByClassName("sidenav-btn active");
	for (var i = 0; i < elem.length; i++) {
	  elem[i].style.border = "none";
	  elem[i].style.backgroundColor = window.getComputedStyle(document.documentElement).getPropertyValue('--sidenav-div-active-background');
	}
 }
}

function changeTheme(){
  var themeinfo = document.getElementById("themeInfo").className;
  var dropthemeinfo = document.getElementById("dropThemeInfo").className;
  if ( themeinfo.includes("active") ) { // enable light theme
    themeinfo = themeinfo.replace(" active", "");
	dropthemeinfo = dropthemeinfo.replace(" active", "");
	document.documentElement.setAttribute('data-theme','light');
	document.getElementById("themeIcon").src = "resources/images/ligth.png";
	document.getElementById("dropThemeIcon").src = "resources/images/ligth.png";
	changePlotTheme();
  } else { // enable dark theme
	themeinfo += " active";
	document.documentElement.setAttribute('data-theme','dark');
	document.getElementById("themeIcon").src = "resources/images/dark.png";
	document.getElementById("dropThemeIcon").src = "resources/images/dark.png";
	changePlotTheme();
  }
  var elem = document.getElementsByClassName("sidenav-btn active");
  for (var i = 0; i < elem.length; i++) {
    elem[i].style.backgroundColor = window.getComputedStyle(document.documentElement).getPropertyValue('--sidenav-div-active-background');
  }
  document.getElementById("themeInfo").className = themeinfo;
  document.getElementById("dropThemeInfo").className = dropthemeinfo;
}

function changePlotTheme() {
	
  var colorText = window.getComputedStyle(document.documentElement).getPropertyValue('--content-color');
  var colorSurf = window.getComputedStyle(document.documentElement).getPropertyValue('--content-header-active-background');

  // machine Plot
  if ( document.getElementById('mPlot') != null ) {
    var updateMachine = document.getElementById('mPlot').layout;
    updateMachine.scene.xaxis.title.font.color = colorText;
    updateMachine.scene.xaxis.gridcolor = colorText;
    updateMachine.scene.xaxis.zerolinecolor = colorText;
    updateMachine.scene.xaxis.tickcolor = colorText;
    updateMachine.scene.xaxis.tickfont.color = colorText;
    updateMachine.scene.xaxis.spikecolor = colorText;
    updateMachine.scene.yaxis.title.font.color = colorText;
    updateMachine.scene.yaxis.gridcolor = colorText;
    updateMachine.scene.yaxis.zerolinecolor = colorText;
    updateMachine.scene.yaxis.tickcolor = colorText;
    updateMachine.scene.yaxis.tickfont.color = colorText;
    updateMachine.scene.yaxis.spikecolor = colorText;
    updateMachine.scene.zaxis.title.font.color = colorText;
    updateMachine.scene.zaxis.gridcolor = colorText;
    updateMachine.scene.zaxis.zerolinecolor = colorText;
    updateMachine.scene.zaxis.tickcolor = colorText;
    updateMachine.scene.zaxis.tickfont.color = colorText;
    updateMachine.scene.zaxis.spikecolor = colorText;
    updateMachine.scene.zaxis.backgroundcolor = colorSurf;
    
    var updateTrace = document.getElementById('mPlot').data[0];
    updateTrace.textfont.color = colorText;
 	 
    Plotly.react('mPlot', [updateTrace], updateMachine);
  }
  // valve Plot
  if ( document.getElementById("valve") != null ) {
    var page = document.getElementById("valve");
    var content = page.getElementsByClassName("content");
    for (var i = 0; i < content.length; i++) {

      var plotId = "vPlot" + i;

      if ( document.getElementById(plotId) != null ) {
        var updateValve = document.getElementById(plotId).layout;
        updateValve.xaxis.title.font.color = colorText;
        updateValve.xaxis.gridcolor = colorText;
        updateValve.xaxis.zerolinecolor = colorText;
        updateValve.xaxis.tickcolor = colorText;
        updateValve.xaxis.tickfont.color = colorText;
        updateValve.yaxis.title.font.color = colorText;
        updateValve.yaxis.gridcolor = colorText;
        updateValve.yaxis.zerolinecolor = colorText;
        updateValve.yaxis.tickcolor = colorText;
        updateValve.yaxis.tickfont.color = colorText;
        updateValve.legend.font.color = colorText;

        if ( updateValve.yaxis2 != undefined ) {
          updateValve.yaxis2.title.font.color = colorText;
          updateValve.yaxis2.gridcolor = colorText;
          updateValve.yaxis2.zerolinecolor = colorText;
          updateValve.yaxis2.tickcolor = colorText;
          updateValve.yaxis2.tickfont.color = colorText;
        }

        Plotly.relayout(plotId, updateValve);	
      }
    }
  }
}


window.addEventListener("resize", resizeSize);
function resizeSize() {

  //update machine plot
  if ( document.getElementById('mPlot') != null ) {
	var elemWidth = document.getElementById('contentFrame').offsetWidth - 520;
    var elemHeight = document.getElementById('contentFrame').offsetHeight - 155;
    
    var updateMachine = {
      width: elemWidth,
      height: elemHeight
    };
    
    Plotly.relayout('mPlot', updateMachine);
  }

  // valve Plot
  if ( document.getElementById("valve") != null ) {
    var elemWidth = document.getElementById('contentFrame').offsetWidth - 340;
    var elemHeight = document.getElementById('contentFrame').offsetHeight - 210;
    
     var updateValve = {
      width: elemWidth,
      height: elemHeight
    };
    
    var page = document.getElementById("valve");
    var content = page.getElementsByClassName("content");
    for (var i = 0; i < content.length; i++) {
      var plotId = 'vPlot' + i;
	  var plotCont = document.getElementById(plotId);
	  if ( plotCont != null ) {
 	    Plotly.relayout(plotId, updateValve);	
	  }
    }
  }
  
  
  /* ToDo: Comment out for further publications */ 
  /*// gnss map
  if ( document.getElementById('gnssmap') != null ) {
    var mapHeight = document.getElementById('contentFrame').offsetHeight - 120;
    var gMap = document.getElementById('gnssmap');
    gMap.style.height = mapHeight + 'px';
  }*/
}