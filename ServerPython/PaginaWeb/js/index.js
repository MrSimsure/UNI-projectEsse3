
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


function testSend()
{
    let obj = 
    {
        prova : 1,
        ogg : "parole",
        parapupu : 1121,
    }

    sendData(obj)
}