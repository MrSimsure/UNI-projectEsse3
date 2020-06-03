from db import checkAule
import json


def getReport(jsondata):
    result = []
    data = json.loads(jsondata)

    #ritorna lista di eventuali appelli contrastanti (ESAME, COGNOME PROF, ORARIO)
    aula = checkAule(data[0]["edificio"], data[0]["aula"], data[0]["data"], data[0]["ora"])
    
    result[0] = aula
    return result

