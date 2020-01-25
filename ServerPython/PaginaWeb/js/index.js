
/**
 * Invia al server tutti i dati inseriti e attende il ritorno della valutazione
 * @param {object} data 
 * @param {function} callback 
 */
function sendData(data, callback)
{
    var request = new XMLHttpRequest();
    request.onreadystatechange=function()
    {
        if (request.readyState==4 && request.status==200)
        {
            console.log(JSON.parse(request.response))

            if(callback != undefined)
            {
                callback(JSON.parse(request.response));
            }
        }
    }
    request.open("POST", "http://localhost:8080/sendData", true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send( $.param(data) );
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
    request.open("GET", "http://localhost:8080/getEdifici", true);
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
    request.open("POST", "http://localhost:8080/getAule", true);
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
    request.open("POST", "http://localhost:8080/getDocenti", true);
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



window.onload = function(e)
{ 
    getEdifici(function(ret)
    {
        updateEdifici(ret)
    })
}

