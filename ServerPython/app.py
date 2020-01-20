#!/usr/bin/env python
from http.server import BaseHTTPRequestHandler, HTTPServer
from server import server_send_file
import inspect, os
import urllib.parse
import json

dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))

class testHTTPServer_RequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        if self.path == "/" :
            server_send_file(self ,dir+"/PaginaWeb/index.html")
        elif self.path.find("/PaginaWeb") :
            server_send_file(self ,dir+'/'+self.path)
        elif self.path.find("/listaEdifici") :


        return

    def do_POST(self):
        if self.path == '/sendData' :
            content_length = int(self.headers['Content-Length']) 
            post_data = self.rfile.read(content_length) 
            dati = urllib.parse.parse_qs(post_data.decode('utf-8'))
            print(json.dumps(dati))

            sql = { "testname" : "akshat", "test2name" : "manjeet", "test3name" : "nikhil"} 
            ret = json.dumps(sql) 

            self.send_response(200)
            self.send_header('Content-type','application/json')
            self.end_headers()
            self.wfile.write(bytes(ret, "utf8"))



def run():
    print('Avvio del server...')
    server_address = ('127.0.0.1', 8080)
    httpd = HTTPServer(server_address, testHTTPServer_RequestHandler)
    print('Server in esecuzione')
    httpd.serve_forever()

run()