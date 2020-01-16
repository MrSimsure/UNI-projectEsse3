#!/usr/bin/env python
from http.server import BaseHTTPRequestHandler, HTTPServer
from server import server_send_file
from db import *
import inspect, os
import urllib.parse

dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))

class testHTTPServer_RequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        if self.path == "/" :
            server_send_file(self ,dir+"/PaginaWeb/index.html")
        else :
            server_send_file(self ,dir+'/'+self.path)
        return

    def do_POST(self):
        if self.path == '/sendData' :
            content_length = int(self.headers['Content-Length']) 
            post_data = self.rfile.read(content_length) 
            dati = urllib.parse.parse_qs(post_data.decode('utf-8'))
            print(dati)
            print(dati["ogg"])

def run():
    print('Avvio del server...')
    print(str(getAule("POLO DI FISICA %")))
    server_address = ('127.0.0.1', 8080)
    httpd = HTTPServer(server_address, testHTTPServer_RequestHandler)
    print('Server in esecuzione')
    httpd.serve_forever()

run()
