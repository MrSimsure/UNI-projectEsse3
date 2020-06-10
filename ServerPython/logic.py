from db import checkAule
import json


def getReport(jsondata):
    result = []
    data = jsondata #json.loads(jsondata)

    #ritorna lista di eventuali appelli contrastanti (ESAME, COGNOME PROF, ORARIO)
    aula = checkAule(data["edificio"], data["aula"], data["data"], data["ora"])

    return aula

