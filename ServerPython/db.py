import pymysql.cursors

connection = pymysql.connect(host='raspyexaequo.duckdns.org',
                             user='projectUserSimo',
                             password='sauropods',
                             db='projectDB',
                             charset='utf8mb4',
                             use_unicode='True',
                             cursorclass=pymysql.cursors.DictCursor)

def getEdifici():

    with connection.cursor() as cursor:

        cursor.execute("SELECT EDIFICIO_ID, DES, COMUNE_ID, VIA FROM P09_EDIFICI")
        edifici = cursor.fetchall()

        #crea la lista di id dei comuni
        lista = []
        for record in edifici:
            item = record['COMUNE_ID']
            if item is not None and item not in lista:
                lista.append(item)

        for i in range(len(lista)):
            cursor.execute("SELECT DES,COMUNE_ID FROM P01_COMU WHERE COMUNE_ID like "+str(lista[i]))
            rt = cursor.fetchall()

            for record in edifici:
                if str(record['COMUNE_ID']) == str(rt[0]["COMUNE_ID"]):
                    record['COMUNE_ID'] = str(rt[0]["DES"])
        
        connection.commit()
        cursor.close()
        return edifici
        
    
def getAule(edificio):

    with connection.cursor() as cursor:

        cursor.execute("SELECT EDIFICIO_ID FROM P09_EDIFICI WHERE DES like %s", (str(edificio)))
        idEdificio = cursor.fetchall()


        cursor.execute("SELECT DES FROM P09_AULE WHERE EDIFICIO_ID like %s", idEdificio[0]["EDIFICIO_ID"])
        data = cursor.fetchall()
        connection.commit()
        cursor.close()
        return data