
var ip = "localhost"// "192.168.43.32"
var port = "8000"

var proprieta = 
{
   dataInizio : document.querySelector("#data_inizio_app"),
   oraInizio : document.getElementsByName("hh_esa")[0],
   minutiInizio : document.getElementsByName("mm_esa")[0],
   iscrizioneDal : document.querySelector("#data_inizio_iscr"),
   iscrizioneAl : document.querySelector("#data_fine_iscr"),
   edificio : document.getElementsByName("/WS/DataSet[@LocalEntityName='APP_LOG_DATI_WEB']/Row[@Num='1']/edificio_id")[0],
   aula : document.getElementsByName("/WS/DataSet[@LocalEntityName='APP_LOG_DATI_WEB']/Row[@Num='1']/aula_id")[0],
   partizionamento : document.getElementsByName("/WS/DataSet[@LocalEntityName='APP_LOG_DATI_WEB']/Row[@Num='1']/dom_part_cod")[0],
  
}

const toUrlEncoded = obj => Object.keys(obj).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&');

function init()
{
  for (val in proprieta) 
  {
    proprieta[val].addEventListener("change", sendData);
  }

}


function sendData()
{
    //collezziona dati
    let commis = ""//dati_commis.innerHTML.split(", ");
    //commis.pop()

    var dati = 
    {
        data              : proprieta.dataInizio.value,
        ora               : proprieta.oraInizio.value+":"+proprieta.minutiInizio.value,
        dal               : proprieta.iscrizioneDal.value,
        al                : proprieta.iscrizioneAl.value,
        desc              : "",//proprieta.dati_desc.value,
        edificio          : proprieta.edificio.value,
        aula              : proprieta.aula.value,
        partizionamento   : proprieta.partizionamento.value,
        commissione       : commis
    }

    console.log(dati)

    //invio
    var request = new XMLHttpRequest();
    request.withCredentials = true;
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
    request.send( toUrlEncoded(dati) );
    console.log(toUrlEncoded(dati))
}


init();