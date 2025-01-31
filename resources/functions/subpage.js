// swich between collaps and expand for all content container
function toggleContentAll() { // ToDo: mislead elements with block content
  var activePage = document.getElementsByClassName("page active")[0];
  var pageBtn = activePage.getElementsByClassName("page-btn")[0];
  var contentHead = activePage.getElementsByClassName("content-header");
  var contentHeadInfo = activePage.getElementsByClassName("content-header-info");
  var contentBtn = activePage.getElementsByClassName("content-btn");
  var contentFlex = activePage.getElementsByClassName("content-flex");
  var subContentHead = activePage.getElementsByClassName("content-header-sub");
  var subContentBtn = activePage.getElementsByClassName("sub-content-btn");
  var subContentFlex = activePage.getElementsByClassName("sub-content-flex");
  //check if one content-container is expand, then collaps all
  if (pageBtn.className.includes("active")) {
	 for (const ch of contentHead) {
	   ch.className = ch.className.replace(" active", "");
	 }
	 for (const chi of contentHeadInfo) {
	   chi.className = chi.className.replace(" active", "");
	 }
	 for (const btn of contentBtn) {
	   btn.className = btn.className.replace(" active", "");
	 }
	 for (const sch of subContentHead) {
	   sch.className = sch.className.replace(" active", "");
	 }
	 for (const btn of subContentBtn) {
	   btn.className = btn.className.replace(" active", "");
	 }
     for (const cont of contentFlex) {
	   cont.style.display = "none";
	 }
	 for (const cont of subContentFlex) {
	   cont.style.display = "none";
	 }
	 pageBtn.className = pageBtn.className.replace(" active", "");
  //expand all content-container 	 
  } else {
	 pageBtn.className += " active"
	 for (const ch of contentHead) {
	   ch.className += " active"
	 }
	 for (const chi of contentHeadInfo) {
	   chi.className += " active"
	 }
	 for (const btn of contentBtn) {
	   btn.className += " active"
	 }
     for (const cont of contentFlex) {
	   cont.style.display = "flex";
	 }	 
  }
}

// swich between collaps and expand for content container
function toggleContent() {
  var source = event.target || event.srcElement;
  var contentBtn = source.getElementsByClassName("content-btn")[0];
  var activePage = document.getElementsByClassName("page active")[0];
  var pageBtn = activePage.getElementsByClassName("page-btn")[0];  
  // check if content-header is active
  // collaps content-container and deactivate content-btn
  if (source.className.includes("active")){
	source.className = source.className.replace(" active", "");
    contentBtn.className = contentBtn.className.replace(" active", "");
	source.nextSibling.style.display = "none";
	var contentBtnAll = activePage.getElementsByClassName("content-btn active");
	if (contentBtnAll.length == 0) {
	  pageBtn.className = pageBtn.className.replace(" active", "");
	}
	var parentSource = source.parentElement;
    var contentSub = parentSource.getElementsByClassName("content-sub");
	if( contentSub.length != 0 ){
	  var subContentHead = parentSource.getElementsByClassName("content-header-sub active")[0];
      subContentHead.className = subContentHead.className.replace(" active", "");
      var subContentBtn = parentSource.getElementsByClassName("sub-content-btn active")[0];
      subContentBtn.className = subContentBtn.className.replace(" active", "");
      var subContentFlex = parentSource.getElementsByClassName("sub-content-flex")[0];
      subContentFlex.style.display = "none";
	}
  // expand content-container and activate content-btn
  } else {
	source.className += " active";
    contentBtn.className += " active";
	source.nextSibling.style.display = "flex";
	if (!pageBtn.className.includes("active")) {
      pageBtn.className += " active";	
	}
  }
}

// swich between collaps and expand for sub content container
function toggleSubContent() {
  var source = event.target || event.srcElement;
  var activePage = document.getElementsByClassName("page active")[0];
  //check if content-container is expand
  //collaps content-container and deactivate content-btn and subcontent-btn
  if (source.nextSibling.style.display == "flex"){
	source.nextSibling.style.display = "none";
	source.children[1].className = source.children[1].className.replace(" active", "");
	source.className = source.className.replace(" active", "");
  //expand content-container and activate content-btn and subcontent-btn
  } else {
	source.nextSibling.style.display = "flex";
	source.children[1].className += " active";
	source.className += " active";
  }
}

// copy butoon id to clip board
function copyToClip() {
	const source = event.target || event.srcElement;
    navigator.clipboard.writeText(source.parentElement.id);
}