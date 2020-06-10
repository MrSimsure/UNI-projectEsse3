from db import checkAule,checkCommissione
import json


def getReport(jsondata):
    
    data = jsondata #json.loads(jsondata)

    #ritorna lista di eventuali appelli contrastanti (ESAME, COGNOME PROF, ORARIO)
    aula = checkAule(data["edificio"], data["aula"], data["data"], data["ora"])
    commissione = checkCommissione(data["commissione"], data ["data"], data["ora"])
    result = [aula,commissione] 
    return result

