var ip = "localhost"// "192.168.43.32"
var port = "8000"
var commissione = []

/**
 * Invia al server tutti i dati inseriti e attende il ritorno della valutazione
 * @param {object} data 
 * @param {function} callback 
 */
function sendData(callback)
{
    //colleziona dati
    let commis = dati_commis.innerHTML.split(", ");
    commis.pop()

    let ora = dati_ora.value;
    let min = dati_minuti.value;
    let edif = "";
    let aul = "";

    if(ora == "")
        ora = "00"

    if(min == "")
        min = "00"   

    for(let i=0; i<dati_edificio.childElementCount; i++)
    {
        if(dati_edificio.childNodes[i].value == dati_edificio.value)
            edif = dati_edificio.childNodes[i].innerHTML;
    }

    for(let i=0; i<dati_aula.childElementCount; i++)
    {
        if(dati_aula.childNodes[i].value == dati_aula.value)
            aul = dati_aula.childNodes[i].innerHTML;
    }

    var dati = 
    {
        data              : dati_data.value,
        ora               : ora+"-"+min+"-00",
        dal               : dati_iscr_da.value,
        al                : dati_iscr_a.value,
        desc              : dati_desc.value,
        edificio          : edif,
        aula              : aul,
        partizionamento   : dati_partiz.value,
        commissione       : commissione
    }

    //console.log(JSON.stringify(dati))

    //invio dati
    var request = new XMLHttpRequest();
    request.onreadystatechange=function()
    {
        //risposta dal server
        if (request.readyState==4 && request.status==200)
        {
            let ret = JSON.parse(request.response)
            console.log(ret)

            //se c'è una collissione di appelli
            if(ret[0].length > 0)
            {
                document.querySelector("#collisione_aula").style.display = ""
            }
            else
            {
                document.querySelector("#collisione_aula").style.display = "none"
            }

            //rimuovi tutti i messaggi di collisione dei docenti
            let errori = document.querySelectorAll("#errore_docente")
            for(let i=0; i<errori.length; i++)
            {
                let curr = errori[i];
                curr.parentElement.removeChild(curr)

            }

            //se c'è una collissione di docenti in commissione
            if(ret[1] != null && ret[1].length > 0)
            {
                for(let i=0; i<ret[1].length; i++)
                {
                    if(ret[1][i].length > 0)
                    {
                        let datiDocente = ret[1][i][0]
                        let nome = datiDocente.NOME
                        let cognome = datiDocente.COGNOME

                        let dom = document.querySelector("#collisione_docente")
                        let clone = dom.cloneNode(true)
                        dom.parentNode.insertBefore(clone, dom.nextSibling);
                        clone.id = "errore_docente"
                        clone.style.display = ""
                        clone.querySelector("div").innerHTML = "Il docente "+nome+" "+cognome+"  e' gia in un'altra commissione in quella data e ora"
                    }
                }
            }


            if(callback != undefined)
                callback(JSON.parse(request.response));
            
        }
    }
    request.open("POST", "http://"+ip+":"+port+"/sendData", true);
    request.setRequestHeader('Content-type', 'application/json');
    request.send( JSON.stringify(dati));//$.param(dati) );
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
function onSelectDocente(me)
{
    let nome = me.getAttribute("data-nome");
    let cognome = me.getAttribute("data-cognome");

    let arr = [nome, cognome]
    commissione.push(arr)

    dati_commis.innerHTML += nome+" "+cognome+", "
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
            clone.setAttribute("data-nome", docente.nome)
            clone.setAttribute("data-cognome", docente.cognome)
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

