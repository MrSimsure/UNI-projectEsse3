import pymysql.cursors

connection = pymysql.connect(host='raspyexaequo.duckdns.org',
                             user='projectUserSimo',
                             password='sauropods',
                             db='projectDB',
                             charset='utf8mb4',
                             use_unicode='True',
                             cursorclass=pymysql.cursors.DictCursor)

def getEdifici():
    return
    
def getAule(edificio):

    with connection.cursor() as cursor:

        cursor.execute("SELECT EDIFICIO_ID FROM P09_EDIFICI WHERE DES like %s", (str(edificio)))
        idEdificio = cursor.fetchall()


        cursor.execute("SELECT DES FROM P09_AULE WHERE EDIFICIO_ID like %s", idEdificio[0]["EDIFICIO_ID"])
        data = cursor.fetchall()
        connection.commit()
        cursor.close()
        return data