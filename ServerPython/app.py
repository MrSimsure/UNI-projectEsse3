#!/usr/bin/env python
from http.server import BaseHTTPRequestHandler, HTTPServer
from server import sendFile, sendData
from db import getAule, getEdifici, getDocenti
from logic import getReport
import inspect, os
import urllib.parse
import json

dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
verbose = True

class testHTTPServer_RequestHandler(BaseHTTPRequestHandler):

    ## HANDLER DELLE CHIAMATE GET AL SERVER - richiesta file della pagina web - lista edifici
    def do_GET(self):
        
        if self.path == "/" :
            sendFile(self ,dir+"/PaginaWeb/index.html")

        elif self.path.find("/PaginaWeb") != -1:
            sendFile(self ,dir+'/'+self.path)

        elif self.path.find("/getEdifici")  != -1:
            sendData(self, getEdifici())
            if verbose: print("invio edifici")

        return

    ## HANDLER DELLE CHIAMATE POST AL SERVER - calcolo dati finali - lista aule - lista docenti
    def do_POST(self):
        content_length = int(self.headers['Content-Length']) 
        post_data = self.rfile.read(content_length)
        

        if self.path == '/sendData' :
            dati = json.loads(post_data)
            sql = getReport(dati)
            ret = json.dumps(sql) 

            self.send_response(200)
            self.send_header('Content-type','application/json')
            self.end_headers()
            self.wfile.write(bytes(ret, "utf8"))
            if verbose: print("invio calcolo finale")

        elif self.path.find("/getAule") != -1:
            dati = urllib.parse.parse_qsl(post_data.decode('utf-8'))
            sendData(self, getAule(dati[0][1]))
            if verbose: print("invio aule per edificio con id ", str(dati[0][1]))
            return

        elif self.path.find("/getDocenti") != -1:
            dati = urllib.parse.parse_qsl(post_data.decode('utf-8'))
            sendData(self, getDocenti( dati[0][1], dati[1][1], dati[2][1] ))
            if verbose: print("invio aule per edificio con id ", str(dati[0][1]))
            return



def run():
    print('Avvio del server...')
    server_address = ('localhost', 8000)
    httpd = HTTPServer(server_address, testHTTPServer_RequestHandler)
    print('Server in esecuzione')
    httpd.serve_forever()

run()
 