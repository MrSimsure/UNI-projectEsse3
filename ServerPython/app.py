#!/usr/bin/env python
from http.server import BaseHTTPRequestHandler, HTTPServer
from server import *
import inspect, os

dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
print()
class testHTTPServer_RequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        print(self.path)
        if self.path == "/" :
            server_send_file(self ,dir+"\PaginaWeb\index.html")
        else:
            server_send_file(self ,dir+'/'+self.path)

        return

def run():
    print('Avvio del server...')
    server_address = ('127.0.0.1', 8080)
    httpd = HTTPServer(server_address, testHTTPServer_RequestHandler)
    print('Server in esecuzione')
    httpd.serve_forever()

run()