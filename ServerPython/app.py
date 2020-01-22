#!/usr/bin/env python
from http.server import BaseHTTPRequestHandler, HTTPServer
from server import sendFile, sendData
from db import getAule, getEdifici
import inspect, os
import urllib.parse
import json

dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
verbose = True

class testHTTPServer_RequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        if self.path == "/" :
            sendFile(self ,dir+"/PaginaWeb/index.html")
        elif self.path.find("/PaginaWeb") != -1:
            sendFile(self ,dir+'/'+self.path)
        elif self.path.find("/getEdifici")  != -1:
            sendData(self, getEdifici())
            if verbose: print("invio edifici")
        return

    def do_POST(self):
        content_length = int(self.headers['Content-Length']) 
        post_data = self.rfile.read(content_length) 
        dati = urllib.parse.parse_qsl(post_data.decode('utf-8'))
        print(dati[0][1])

        if self.path == '/sendData' :
            sql = { "testname" : "akshat", "test2name" : "manjeet", "test3name" : "nikhil"} 
            ret = json.dumps(sql) 

            self.send_response(200)
            self.send_header('Content-type','application/json')
            self.end_headers()
            self.wfile.write(bytes(ret, "utf8"))
            if verbose: print("invio calcolo finale")

        elif self.path.find("/getAule") :
            #getAule()
            if verbose: print("invio aule")
            return



def run():
    print('Avvio del server...')
    server_address = ('127.0.0.1', 8080)
    httpd = HTTPServer(server_address, testHTTPServer_RequestHandler)
    print('Server in esecuzione')
    httpd.serve_forever()

run()
