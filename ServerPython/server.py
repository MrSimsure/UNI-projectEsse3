from mimetypes import MimeTypes
import os
import json

mime = MimeTypes()

## RITORNA UN FILE AL CLIENT, DA USARE DOPO UNA RICHIESTA GET O POST
def sendFile(resp, file) :

    if os.path.exists(file):
        with open(file, 'r') as myfile:
                data = myfile.read()
        resp.send_response(200)
        resp.send_header('Content-type',mime.guess_type(file)[0])
        resp.end_headers()
        resp.wfile.write(bytes(data, "utf8"))
    else:
        resp.send_response(404)



## RITORNA UN JSON AL CLIENT, DA USARE DOPO UNA RICHIESTA GET O POST
def sendData(resp, data):
    resp.send_response(200)
    resp.send_header('Access-Control-Allow-Origin', '*')
    resp.send_header('Content-type',"application/json")
    
    resp.end_headers()
    resp.wfile.write(bytes(json.dumps(data), "utf8"))
