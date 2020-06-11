var BROWSER_CHROME = 'Chrome';
var BROWSER_EXPLORER = 'Explorer';
var BROWSER_OPERA = 'Opera';
var BROWSER_SAFARI = 'Safari';
var BROWSER_FIREFOX = 'Firefox';
var BROWSER_MOZILLA = 'Mozilla';
var BROWSER_NETSCAPE = 'Netscape';
var BROWSER_UNKNOWN = '#NULL#';

/**
* Wrapper per il browser
*/
function Browser(name,versione){
	this.name = name;
	this.versione = versione;
}

/**
* Verifica le propriet� del browser
* e crea un oggetto wrapper.
* 
* Fare riferimento anche a questo link
* http://stackoverflow.com/questions/5899783/detect-safari-chrome-ie-firefox-opera-with-user-agent
* 
* dove si legge questo codice:
*   var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
    var is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
    var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
    var is_safari = navigator.userAgent.indexOf("Safari") > -1;
    var is_opera = navigator.userAgent.toLowerCase().indexOf("op") > -1;
    if ((is_chrome)&&(is_safari)) {is_safari=false;}
    if ((is_chrome)&&(is_opera)) {is_chrome=false;}
*/
function checkBrowser(){
	var browserName, browserVer;
	var useragent = navigator.userAgent;
	var idx_chrome = useragent.indexOf('Chrome');
    var idx_explorer = useragent.indexOf('MSIE');
    var idx_explorer11 = useragent.indexOf('Trident');
    var idx_firefox = useragent.indexOf('Firefox');
    var idx_safari = useragent.indexOf("Safari");
    var idx_opera = useragent.indexOf("Opera");
    if ((idx_chrome>-1)&&(idx_safari>-1)) {idx_safari=-1;}
    if ((idx_chrome>-1)&&(idx_opera>-1)) {idx_chrome=-1;}
    
    if(idx_chrome>-1) {
    	browserName = BROWSER_CHROME;
    	browserVer = useragent.substr(idx_chrome+7,useragent.indexOf("Safari")-(idx_chrome+7));
    } else if(idx_firefox>-1) {
    	browserName = BROWSER_FIREFOX;
    	browserVer = useragent.substring(idx_firefox+8);
    }else if(idx_explorer>-1) {
    	browserName = BROWSER_EXPLORER;
    	browserVer = useragent.substr(idx_explorer+5,1);
    }else if(idx_explorer11>-1) {
    	browserName = BROWSER_EXPLORER;
    	browserVer = useragent.substring(useragent.indexOf("rv:")+3,useragent.indexOf(")"));
    }else if(idx_safari>-1) {
    	browserName = BROWSER_SAFARI;
    	browserVer = useragent.substring(useragent.indexOf("Version")+8,useragent.indexOf("Safari")-1);
    }else if(idx_opera>-1) {
    	browserName = BROWSER_OPERA;
    	browserVer = useragent.substr(useragent.indexOf("Version")+8);
    } else {
    	browserName = BROWSER_UNKNOWN;
    	browserVer=0;
    }
	return new Browser(browserName,browserVer);
}

/**
* Istanzia la variabile wrapper per il browser utente
*/
var browserUtente = checkBrowser();

/**
* Funzione che permette di controllare che la form sia inviata una volta sola.
* Deve essere invocata nell'evento onSubmit delle form con la seguente sintassi:
* ... onSubmit="return checkFormSingleSubmit(this);" ...
*/
var submittedForm = null;
function checkFormSingleSubmit(form) {
	if (submittedForm!=form) {
		submittedForm = form;
		return true;
	} else {
		alert("Richiesta gi\u00E0 inviata!");
		return false;
	}
}

/**
* Funzione che permette di calcolare e visualizzare il numero totale di CFU
* selecionati. deve essere invocata come segue
* onClick="refreshCounter(input, 3, 5, $WEB_FORMAT_DEC)"
* dove 3 e 5 sono il numero minimo e massimo associato ai cfu.
*/
function refreshCounter(input, cfuMin, cfuMax, maxUntVincolo, tipUntVincolo, testoVincViolato, formatDec) {
	var form = input.form;
	var totCFUMin;
	var totCFUMax;
	var totBLK; //usata solo nel caso il vincolo sia a blocchi
	if (form.NUM_UNT != null) {
    	totCFUMin = form.NUM_UNT.value;
    	totCFUMax = form.NUM_UNT.value;
    	totBLK = form.NUM_UNT.value;
	} else {
    	totCFUMin = form.CFU_MIN.value;
    	totCFUMax = form.CFU_MAX.value;
    	totBLK = form.BLK_MIN.value;
	}

	totCFUMin = parseFloat(totCFUMin.replace(",","."));
	totCFUMax = parseFloat(totCFUMax.replace(",","."));
	totBLK = parseInt(totBLK);

	if (input.type == 'radio') {
		totCFUMin = cfuMin;
		totCFUMax = cfuMax;
		totBLK = 1;
	} else { //� un input di tipo checkbox
		if (input.type == 'checkbox') {
			if (input.checked){
				totCFUMin += cfuMin;
				totCFUMax += cfuMax;
				totBLK += 1;
			} else {
				totCFUMin -= cfuMin;
				totCFUMax -= cfuMax;
				totBLK -= 1;
			}
		}
	}

	if (formatDec == 0) {
		totCFUMin = totCFUMin.toString().replace(".",",");
		totCFUMax = totCFUMax.toString().replace(".",",");
	}

    if (form.NUM_UNT!=null) {
    	form.NUM_UNT.value = totCFUMin;
    } else {
    	form.CFU_MIN.value = totCFUMin;
    	form.CFU_MAX.value = totCFUMax;
    	form.BLK_MIN.value = totBLK;
    }
    if (maxUntVincolo != 9999) {    	
    	var container = document.getElementById("PianiRegSceImg");
	     if ((totCFUMax > maxUntVincolo && tipUntVincolo != "BLK") || (totBLK > maxUntVincolo && tipUntVincolo == "BLK")){
	    	//se non c'� gi� l'icona la aggiungo
	    	if (!(container.hasChildNodes()) ){
		    	var oImg=document.createElement("img");
		    	oImg.setAttribute('id', 'RegSceImg');
			    oImg.setAttribute('src', 'images/attenzione.gif');
			    //oImg.setAttribute('title', testoVincViolato);
			    container.appendChild(oImg);
			    
			    var txtEl = document.createTextNode(' '+testoVincViolato);
			    container.appendChild(txtEl);
	    	}
	    } else {
	    	//se non ho superato il massimo allora rimuovo l'icona	    	
	    	container.removeChild(container.lastChild);
	    	container.removeChild(container.lastChild);
	    }
    }
}

function hideShowElem(elemId){
	var elem = document.getElementById(elemId);
	if(elem){
		var hide = (elem.style.display=='none');
		if (hide) {
			elem.style.display = '';
		} else {
			elem.style.display = 'none';
		}
	}
}

function isCookieEnabled() {
	return (navigator.cookieEnabled)? true : false;
}

function removeJsessionId() {

  if(browserUtente.name==BROWSER_SAFARI){
    if(isCookieEnabled()) {

      var elemA = document.getElementsByTagName('a');
      for (i = 0; i < elemA.length; i++) {
        var attrHref = elemA[i].getAttribute('href');
        var newA = removeJsessionIdNewUrl(attrHref);
        if (newA != "") {
        	document.links[i].href=newA;
        }
      }

      var elemFORM = document.getElementsByTagName('form');
      for (i = 0; i < elemFORM.length; i++) {
        var attrAction = elemFORM[i].getAttribute('action');
        var newA = removeJsessionIdNewUrl(attrAction);
        if (newA != "") {
        	document.forms[i].action=newA;
        }
      }
    }
  }
}

function removeJsessionIdNewUrl(attr) {

      var start_query_string = "?";
      var key_jsession = ";jsessionid=";
      var newurl = "";

      var start = attr.indexOf(key_jsession);
      if(start>0){
        newurl = attr.substring(0, start);
        var end = attr.indexOf(start_query_string, start);
        if (end>start) {
          newurl = newurl + attr.substring(end);
        }
      }
      return newurl;
}

///////////////////////////////////////
//
//  Generic onload by Brothercake
//  http://www.brothercake.com/
//
///////////////////////////////////////

//setup onload function
if(typeof window.addEventListener != 'undefined')
{
	//.. gecko, safari, konqueror and standard
	window.addEventListener('load', removeJsessionId, false);
}
else if(typeof document.addEventListener != 'undefined')
{
	//.. opera 7
	document.addEventListener('load', removeJsessionId, false);
}
else if(typeof window.attachEvent != 'undefined')
{
	//.. win/ie
	window.attachEvent('onload', removeJsessionId);
}

//** remove this condition to degrade older browsers
else
{
	//.. mac/ie5 and anything else that gets this far

	//if there's an existing onload function
	if(typeof window.onload == 'function')
	{
		//store it
		var existing = onload;

		//add new onload handler
		window.onload = function()
		{
			//call existing onload function
			existing();

			//call generic onload function
			removeJsessionId();
		};
	}
	else
	{
		//setup onload function
		window.onload = removeJsessionId;
	}
}

var xmlhttp=false;
function creaXmlHttpRequest(){
//  var xmlhttp=false;
  /*@cc_on @*/
  /*@if (@_jscript_version >= 5)
    // JScript gives us Conditional compilation, we can cope with old IE versions.
    // and security blocked creation of the objects.
    try {
      xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (E) {
      xmlhttp = false;
    }
  }
  @end @*/
  if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
    try {
      xmlhttp = new XMLHttpRequest();
    } catch (e) {
      xmlhttp=false;
    }
  }
  if (!xmlhttp && window.createRequest) {
    try {
      xmlhttp = window.createRequest();
    } catch (e) {
      xmlhttp=false;
    }
  }
  return xmlhttp;
}

function doCompletion(nazId, siglaProv, nameCmb) {
  xmlhttp = creaXmlHttpRequest();
  var url = "Anagrafica/Lookup/Comuni.do" + "?nazId=" + nazId + "&prov=" + siglaProv + "&tmp=" + Math.random();
  url = new Kion().getUrl(url, nameCmb);
  xmlhttp.onreadystatechange = recuperaComuni;
  xmlhttp.open("GET", url, true);
  xmlhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xmlhttp.send(null);
}

function doCompletionNascita(nazId, siglaProv, nameCmb) {
  xmlhttp = creaXmlHttpRequest();
  var url = "Anagrafica/Lookup/ComuniNascita.do" + "?nazId=" + nazId + "&prov=" + siglaProv + "&tmp=" + Math.random();
  url = new Kion().getUrl(url, nameCmb);
  xmlhttp.onreadystatechange = recuperaComuni;
  xmlhttp.open("GET", url, true);
  xmlhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xmlhttp.send(null);
}

function doCompletionConId(nazId, siglaProv, nameCmb) {
  xmlhttp = creaXmlHttpRequest();
  var url = "Anagrafica/Lookup/Comuni.do" + "?nazId=" + nazId + "&prov=" + siglaProv + "&tmp=" + Math.random();
  url = new Kion().getUrl(url, nameCmb);
  xmlhttp.onreadystatechange = recuperaComuniConId;
  xmlhttp.open("GET", url, true);
  xmlhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xmlhttp.send(null);
}

var CMB_COMUNI_NAME_HIDDEN_FIELD = '#*HIDDENfIELD*#';

function loadElencoComuni(siglaProv, cmbComuniName){
  var nameCmbComuni = document.getElementById(CMB_COMUNI_NAME_HIDDEN_FIELD);
  if(!nameCmbComuni){
    nameCmbComuni = document.createElement('input');
    nameCmbComuni.setAttribute('id', CMB_COMUNI_NAME_HIDDEN_FIELD);
    nameCmbComuni.setAttribute('type', 'hidden');
    document.forms[0].appendChild(nameCmbComuni);
  }
  nameCmbComuni.value=cmbComuniName;
  doCompletion(1, siglaProv, nameCmbComuni);
}

function loadElencoComuniNascita(siglaProv, cmbComuniName){
  var nameCmbComuni = document.getElementById(CMB_COMUNI_NAME_HIDDEN_FIELD);
  if(!nameCmbComuni){
    nameCmbComuni = document.createElement('input');
    nameCmbComuni.setAttribute('id', CMB_COMUNI_NAME_HIDDEN_FIELD);
    nameCmbComuni.setAttribute('type', 'hidden');
    document.forms[0].appendChild(nameCmbComuni);
  }
  nameCmbComuni.value=cmbComuniName;
  doCompletionNascita(1, siglaProv, nameCmbComuni);
}

function loadElencoComuniConId(siglaProv, cmbComuniName){
  var nameCmbComuni = document.getElementById(CMB_COMUNI_NAME_HIDDEN_FIELD);
  if(!nameCmbComuni){
    nameCmbComuni = document.createElement('input');
    nameCmbComuni.setAttribute('id', CMB_COMUNI_NAME_HIDDEN_FIELD);
    nameCmbComuni.setAttribute('type', 'hidden');
    document.forms[0].appendChild(nameCmbComuni);
  }
  nameCmbComuni.value=cmbComuniName;
  doCompletionConId(1, siglaProv, nameCmbComuni);
}


function recuperaComuni() {
  if (xmlhttp.readyState == 4) {
    var resp = xmlhttp.responseText;
    var arrayComuni = eval(resp);
    var cmbComuniToUpdate = document.getElementById(CMB_COMUNI_NAME_HIDDEN_FIELD);
    var comboComuni = document.getElementById(cmbComuniToUpdate.value);

    for( var j=comboComuni.options.length;j>0;j--) {
      comboComuni.options[j] = null;
    }

    for(var i=0;i<arrayComuni.length;i++){
      var des = arrayComuni[i].des;
      comboComuni.options[i+1]=new Option(des,des);
    }
  }
}

function recuperaComuniConId() {
  if (xmlhttp.readyState == 4) {
    var resp = xmlhttp.responseText;
    var arrayComuni = eval(resp);
    var cmbComuniToUpdate = document.getElementById(CMB_COMUNI_NAME_HIDDEN_FIELD);
    var comboComuni = document.getElementById(cmbComuniToUpdate.value);

    for( var j=comboComuni.options.length;j>0;j--) {
      comboComuni.options[j] = null;
    }

    for(var i=0;i<arrayComuni.length;i++){
      var des = arrayComuni[i].des;
      var comune_id = arrayComuni[i].comune_id;
      comboComuni.options[i+1]=new Option(des,comune_id);
    }
  }
}

var DISABLE_ELEMENT=1;
var ENABLE_ELEMENT=2;

function hideShowElements(){
	var elem = document.getElementsByTagName('*');
	var inputFields, selectFields;
	for(var i=0;i<elem.length;i++){
		if(elem[i].getAttribute('showMeWithJS')){
			elem[i].style.display='';
			inputFields = elem[i].getElementsByTagName('input');
			selectFields = elem[i].getElementsByTagName('select');
			changeDisabledAttr(inputFields, ENABLE_ELEMENT);
			changeDisabledAttr(selectFields, ENABLE_ELEMENT);
		}
		if(elem[i].getAttribute('hideMeWithJS')){
			elem[i].style.display='none';
			inputFields = elem[i].getElementsByTagName('input');
			changeDisabledAttr(inputFields, DISABLE_ELEMENT);
		}
	}
}

function changeDisabledAttr(elements, operation){
  var disabled = (operation==DISABLE_ELEMENT);
  for(var j=0;j<elements.length;j++){
    elements[j].disabled=disabled;
  }
}

//Salierno R. - Inizio
  function doCompletionAule(edificioId,nameCmb) {
    xmlhttp = creaXmlHttpRequest();
    var url = "auth/docente/CalendarioEsami/LookupAule.do" + "?edificioId=" + edificioId;
    url = new Kion().getUrl(url, nameCmb);
    xmlhttp.onreadystatechange = recuperaAule;
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);
  }

  var CMB_AULE_NAME_HIDDEN_FIELD = '#*HIDDENfIELD*#';

  function loadElencoAule(edificioId, cmbAuleName){
    var nameCmbAule = document.getElementById(CMB_AULE_NAME_HIDDEN_FIELD);
    if(!nameCmbAule){
      nameCmbAule = document.createElement('input');
      nameCmbAule.setAttribute('id', CMB_AULE_NAME_HIDDEN_FIELD);
      nameCmbAule.setAttribute('type', 'hidden');
      document.forms[0].appendChild(nameCmbAule);
    }
    nameCmbAule.value=cmbAuleName;
    doCompletionAule(edificioId,nameCmbAule);
  }

  function recuperaAule() {
    if (xmlhttp.readyState == 4) {
      var resp = xmlhttp.responseText;
      var arrayAule = eval(resp);
      var cmbAuleToUpdate = document.getElementById(CMB_AULE_NAME_HIDDEN_FIELD);
      var comboAule = document.getElementById(cmbAuleToUpdate.value);

      for( var j=comboAule.options.length;j>0;j--) {
        comboAule.options[j] = null;
      }

      arrayAule.sort(function(a, b){ return a.des > b.des });
      for(var i=0;i<arrayAule.length;i++){
        var des = arrayAule[i].des;
        comboAule.options[i+1]=new Option(des,arrayAule[i].aula_id);
      }
    }
  }
//Salierno R. - Fine

//Salierno R. GS: 24522
function setDiffDate(data_ini, gg_diff, data_new) {

  data_ini = data_ini.split('-').reverse().join('-')
  var arrayData = data_ini.split("-");
  var my_data_ini = new Date(1900,1,1);
  var oneDay = 1000*60*60*24;

  // la trasformazione dava dei problemi con cifre del tipo 09, con lo 0 avanti
  if (arrayData[0].charAt(0)=='0') arrayData[0] = arrayData[0].substr(1,1);
  if (arrayData[1].charAt(0)=='0') arrayData[1] = arrayData[1].substr(1,1);

  my_data_ini.setMonth(parseInt(arrayData[1]) - 1);
  my_data_ini.setDate(parseInt(arrayData[0]));
  my_data_ini.setFullYear(parseInt(arrayData[2]));

  var new_date = my_data_ini.getTime() + (oneDay * gg_diff);
  var my_new_date = new Date(new_date);

  var str_new_date = "";
  if (parseInt(my_new_date.getDate())<10) str_new_date = str_new_date + "0"+my_new_date.getDate()+"/";
  else str_new_date = str_new_date + my_new_date.getDate() + "/";
  if (parseInt(my_new_date.getMonth() + 1)<10) str_new_date = str_new_date + "0"+(my_new_date.getMonth() + 1)+"/";
  else str_new_date = str_new_date + (my_new_date.getMonth() + 1) + "/";
  str_new_date = str_new_date + my_new_date.getFullYear();

  var campoData = document.getElementById(data_new);
  campoData.value = str_new_date.replace("/","-").replace("/","-").split('-').reverse().join('-');

}
//calcola la differenza tra ora/min inizio e ora/min fine
//paramOra indica come deve essere calcolata 1 ora (per alcuni atenei 1 ora � composta da 50 minuti)
function setDiffHour(paramOra) {
	var oraIni = document.getElementById('hh_inizio').value;
	var minIni = document.getElementById('mm_inizio').value;
	var oraFine = document.getElementById('hh_fine').value;
	var minFine = document.getElementById('mm_fine').value;
	
	  //Trasformo l'ora di inizio e minuti inizio tutto in minuti
	  var InitMin = (oraIni * 60) + (minIni * 1);
	  console.log('InitMin: ' + InitMin);
	  //Trasformo l'ora fine e minuti fine tutto in minuti
	  var EndMin = (oraFine * 60) + (minFine * 1);
	  console.log('EndMin: ' + EndMin);
	  //Calcolo la differenza
	  var nDiff = (EndMin - InitMin) / paramOra;
	  
	  if (nDiff >= 0){
		  document.getElementById('ore_accademiche').value = nDiff;
		  document.getElementById('ore_accademiche_hidden').value = nDiff;
	  }
}

function checkDecheck1To1(checkboxDom, idCheckboxSlave, canCheck, canDecheck)
{
  checkboxDomState = checkboxDom.checked
  checkboxSlave=document.getElementById(idCheckboxSlave)
  if(!checkboxSlave.disabled) checkboxSlave.checked = ((checkboxSlave.checked && (checkboxDomState || !canDecheck)) || (checkboxDomState && canCheck))
}

function checkDecheckAllIdNum(checkboxSelectAll, idListaCheck, num)
{
  checkboxSelectAllState = checkboxSelectAll.checked

  for (i=1; i<num+1; ++ i){
    checkBoxList=document.getElementById(idListaCheck + i)
    if(checkBoxList&&!checkBoxList.disabled) checkBoxList.checked=checkboxSelectAllState
  }
}

//funzione che seleziona/deseleziona una serie di checkbox in base al valore di un'espressione (es. voto)
function checkDecheckAllIdNumExpr(checked, idListaCheck, num, value, condition)
{
  checkboxSelectExprState = checked
  for (i=1; i<num+1; ++ i){
    checkBoxList=document.getElementById(idListaCheck + i)
    val = eval(value.replace('index',i)+condition);
    if(checkBoxList&&!checkBoxList.disabled) {
    	if(val) {
    		checkBoxList.checked=checkboxSelectExprState
    	} else {
    		checkBoxList.checked=!checkboxSelectExprState
    	}
    }
  }
}

// utilizzata da RegistrazioneEsitiEsame.xsl per trasformare il voto numerico in lettere
function getVotoLettere(votoNum,arrayVotiNum,arrayVotiString) {
	if(votoNum=='' || votoNum=='ASS' || votoNum=='RIT') {
		return '';
	}
	var posVoto=arrayVotiNum.indexOf(votoNum);
	if(isNaN(votoNum) || posVoto < 0){
		return 'Error';
	} else{
		return arrayVotiString[posVoto];
	}
}

/**
 * Funzione che permette di ottenere l'array di nody che hanno 
 * la classe css fornita come primo parametro a partire dal 
 * nodo passato come secondo parametro.
 * Se il secondo parametro � vuoto la ricerca partir� dal nodo body.
 */
function getElementsByClassName(classname, node) {
	if(!node) node = document.getElementsByTagName("body")[0];
	var a = [];
	var re = new RegExp('\\b' + classname + '\\b');
	var els = node.getElementsByTagName("*");
	for(var i=0,j=els.length; i<j; i++)
	if(re.test(els[i].className))a.push(els[i]);
	return a;

}

function selezionaServer(currSelect) {
	selIndex = currSelect.selectedIndex;
    serverToSelect = currSelect.options[selIndex].value;

	//Deseleziono le scelte precedenti
    checkServerType('JAGUAR', false);
    checkServerType('TOMCAT', false);
    checkServerType('JBOSS', false);
    
    //Seleziono solo quello scelto
    if(serverToSelect=='ALL'){
    	checkServerType('JAGUAR', true);
    	checkServerType('TOMCAT', true);
    	checkServerType('JBOSS', true);
    } else if (serverToSelect=='NOTHING') {
    	//Non faccio nullaperch� ho gi� deselezionato le scelte precedenti 
    }else {
    	checkServerType(serverToSelect, true);
    }
}

function getCheckedValue(radioObj) {
	if(!radioObj)
		return "";
	var radioLength = radioObj.length;
	if(radioLength == undefined)
		if(radioObj.checked)
			return radioObj.value;
		else
			return "";
	for(var i = 0; i < radioLength; i++) {
		if(radioObj[i].checked) {
			return radioObj[i].value;
		}
	}
	return "";
}

function checkServerType(serverToSelect, seleziona) {
    var inputs = document.body.getElementsByTagName("input");    
    
    var inputsForServer = getElementsByClassName(serverToSelect);
    for (var i =0; i < inputsForServer.length; i++){
		if(inputsForServer[i].type='checkbox'){
			inputsForServer[i].checked = seleziona;
		}
	}
}

var Kion = function() {};

Kion.prototype.getUrl = function(pUrl, pReferredElement) {
    var url = pUrl;
    return url;
};

/**
 * Funzione chiamata sul body onload per calcolare l'immagine di sfondo nel banner
 * Cerca nei css i selector scritta_bg<n> (vedi custom.css unipd)
 * @param sid
 */    
function randomBackgroundImageOnScritta(seed) {
	var rules = findMatchingCssRule('^.scritta_bg\\d');
	var n = rules.length;
	if (n > 0) {
		x = seed.charCodeAt(0) % n + 1;
//		x=(Math.floor(Math.random()*n));
		var divScritta = document.getElementById('scritta');
		divScritta.className += ' scritta_bg' + x;
//		var ruleScritta = findMatchingCssRule('^#scritta$');
//		if (ruleScritta && ruleScritta.length > 0) {
//			ruleScritta[0].style.backgroundImage = rules[x].style.backgroundImage;
//		} 
	}
}

/**
 * Funzione che data una regexp ritorna tutte le rules il cui selectorText fa match
 * @param regexp
 * @returns {Array}
 */
function findMatchingCssRule(regexp) {
	var matchedRules = new Array();
	var mysheets = document.styleSheets;
	var n = 0;
	for (var j = 0; j < mysheets.length; j++) {
		var rules = mysheets.item(j).cssRules ? mysheets.item(j).cssRules : mysheets.item(j).rules;
    	for (var i = 0; (rules) && (i < rules.length); i++) {
    		var selector = rules.item(i).selectorText;
    		if (selector && selector.match(regexp)) {
    			matchedRules[n] = rules.item(i);
    			n++;
    		}
    	}
	}
	return matchedRules;
}