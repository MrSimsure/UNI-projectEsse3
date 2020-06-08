from db import checkAule
import json


def getReport(jsondata):
    result = []
    data = jsondata #json.loads(jsondata)
    print(data)
    #ritorna lista di eventuali appelli contrastanti (ESAME, COGNOME PROF, ORARIO)
    aula = checkAule(data["edificio"], data["aula"], data["data"], data["ora"])
    
    result[0] = aula
    return result

