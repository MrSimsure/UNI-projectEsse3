var ip = "localhost"// "192.168.43.32"
var port = "8080"


/**
 * Invia al server tutti i dati inseriti e attende il ritorno della valutazione
 * @param {object} data 
 * @param {function} callback 
 */
function sendData(callback)
{
    //collezziona dati
    let commis = dati_commis.innerHTML.split(", ");
    commis.pop()

    var dati = 
    {
        data              : dati_data.value,
        ora               : dati_ora.value+":"+dati_minuti.value,
        dal               : dati_iscr_da.value,
        al                : dati_iscr_a.value,
        desc              : dati_desc.value,
        edificio          : dati_edificio.value,
        aula              : dati_aula.value,
        partizionamento   : dati_partiz.value,
        commissione       : commis
    }

    console.log(dati)

    //invio
    var request = new XMLHttpRequest();
    request.onreadystatechange=function()
    {
        if (request.readyState==4 && request.status==200)
        {
            if(callback != undefined)
            {
                callback(JSON.parse(request.response));
            }
        }
    }
    request.open("POST", "http://"+ip+":"+port+"/sendData", true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send( $.param(dati) );
}

/**
 * Elimina tutte le opzioni gia presenti in una select
 * @param {dom} dom 
 */
function clearOption(dom)
{
    var length = dom.options.length;
    for (i = 1; i < length; i++) 
    {
        dom.options[i] = null;
    }
}

/**
 * Ritorna sotto forma di object la lista di tutti gli edifici unicam
 * Il json è formattato come segue:
 * EDIFICO_ID   :  (number) id dell'edeficio nel database
 * DES          :  (string) nome dell'edificio
 * COMUNE_ID    :  (string) nome del comune dove si trova l'edifico (dovrebbe contenere l'id ma lo scambio viene gia effettuato dal server)
 * VIA          :  (string) nome della via dove si trova l'edificio
 * @param {function} callback 
 */
function getEdifici(callback)
{
    var request = new XMLHttpRequest();
    request.onreadystatechange=function()
    {
        if (request.readyState==4 && request.status==200)
        {
            if(callback != undefined)
            {
                callback(JSON.parse(request.response));
            }
        }
    }
    request.open("GET", "http://"+ip+":"+port+"/getEdifici", true);
    request.send();
}


/**
 * Ritorna sotto forma di object la lista di aule dato l'id di un edificio
 * @param {number} id 
 * @param {function} callback 
 */
function getAule(id, callback)
{
    var request = new XMLHttpRequest();
    request.onreadystatechange=function()
    {
        if (request.readyState==4 && request.status==200)
        {
            if(callback != undefined)
            {
                callback(JSON.parse(request.response));
            }
        }
    }
    request.open("POST", "http://"+ip+":"+port+"/getAule", true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send( $.param({id}) );
}


/**
 * Ritorna sotto forma di object la lista di aule dato l'id di un edificio
 * @param {number} id 
 * @param {function} callback 
 */
function getDocenti(matricola, nome, cognome, callback)
{
    var request = new XMLHttpRequest();
    request.onreadystatechange=function()
    {
        if (request.readyState==4 && request.status==200)
        {
            if(callback != undefined)
            {
                callback(JSON.parse(request.response));
            }
        }
    }
    request.open("POST", "http://"+ip+":"+port+"/getDocenti", true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    let obj = {matricola:matricola, nome:nome, cognome:cognome}
    request.send( $.param(obj) );
}


/**
 * Aggiorna la lista degli edifici nella pagina html dato un object con tutti gli edifici
 * @param {object} list 
 */
function updateEdifici(list)
{
    let dom = document.getElementsByName("/WS/DataSet[@LocalEntityName='APP_LOG_DATI_WEB']/Row[@Num='1']/edificio_id")[0]

    clearOption(dom)

    for(let i=0; i<list.length; i++)
    {
        let nome = list[i].DES;
        let comune = list[i].COMUNE_ID;

        if(nome !== " ")
        {
            if(!nome.includes(comune) && comune !== null)
            {
                nome += ", "+ comune
            }
    
            dom.options[i+1] = new Option(nome , list[i].EDIFICIO_ID);
        }        
    }
}


/**
 * Aggiorna la lista delle aule nella pagina html dato un object con tutte le aule
 * @param {object} list 
 */
function updateAule(list)
{
    let dom = document.getElementById("cmbAule1")

    clearOption(dom)

    for(let i=0; i<list.length; i++)
    {
        let nome = list[i].DES;
        let capienza = list[i].CAPIENZA;

        if(nome !== null)
        {
            if(!nome.includes("posti") && capienza !== null && capienza != 0)
            {
                nome += ", "+capienza+" posti"
            }

            dom.options[i+1] = new Option(nome, list[i].AULA_ID);
        }
       
    }
}


/**
 * Funzione eseguita quando viene selezionato un'altro edificio dalla lista
 * esegue le fuzioni per ottenere l'elenco delle aule e le aggiorna
 * @param {number} id 
 */
function onChangeEdificio(id)
{
    getAule(id, function(ret)
    {
        updateAule(ret)
    })
}

/**
 * Evento quando vience cliccato un docente dalla lista per aggiungerlo alla commissione
 * @param {string} nome 
 */
function onSelectDocente(nome)
{
    dati_commis.innerHTML += nome+", "
}


/**
 * Evento quando viene scritto qualcosa nei campi matricola, nome e cognome nella ricerca dei docenti per la commissione
 */
function onChangeDocenti()
{
    let matr = document.querySelector("#doc_matr").value;
    let nome = document.querySelector("#doc_nome").value;
    let cogn = document.querySelector("#doc_cogn").value;
    
    if(matr == "") {matr = " "}
    if(nome == "") {nome = " "}
    if(cogn == "") {cogn = " "}

    getDocenti(matr,nome,cogn,function(ret)
    {
        lista.innerHTML = ""

        for(let i=0; i<ret.length; i++)
        {
            let docente = ret[i];

            let temp = toClone.cloneNode(true);
            let clone = lista.appendChild(temp);
            clone.innerHTML = docente.nome+" "+docente.cognome
        }
        
    })
}


window.onload = function(e)
{ 
    toClone         =   document.getElementById("doc_docente").content.querySelector("li");
    lista           =   document.getElementById("doc_lista");

    dati_data       =    document.getElementById("data_inizio_app");
    dati_ora        =    document.getElementById("ora_inizio");
    dati_minuti     =    document.getElementById("minuti_inizio");
    dati_iscr_da    =    document.getElementById("data_inizio_iscr");
    dati_iscr_a     =    document.getElementById("data_fine_iscr");
    dati_desc       =    document.getElementById("descr_appello");
    dati_edificio   =    document.getElementById("edificio_appello");
    dati_aula       =    document.getElementById("cmbAule1");
    dati_partiz     =    document.getElementById("partiz_appello");
    dati_commis     =    document.getElementById("commissione");

    getEdifici(function(ret)
    {
        updateEdifici(ret)
    })
}

