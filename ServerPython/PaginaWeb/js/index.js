
function sendData(data)
{
    console.log($.param(data))

    var request = new XMLHttpRequest();
    request.onreadystatechange=function()
    {
        if (request.readyState==4 && request.status==200)
        {
            alert(request.status);
        }
        else
        {
            console.log("an error occurred")
        }
    }
    request.open("POST", "http://localhost:8080/sendData", true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send( $.param(data) );
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