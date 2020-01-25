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
        
        cursor.execute("SELECT DES, AULA_ID, CAPIENZA FROM P09_AULE WHERE EDIFICIO_ID like %s", str(edificio))
        data = cursor.fetchall()
        connection.commit()
        cursor.close()
        return data


def getDocenti(matricola, nome, cognome):

    with connection.cursor() as cursor:
        
        ricerca = "SELECT nome, cognome FROM docenti"

        if nome != " " or cognome != " " or matricola != " ":
            ricerca += " WHERE"
            
        if nome != " ":
            ricerca += " "+"nome like '%"+nome+"%'"

        if nome != " " and cognome != " ":
            ricerca += " and"

        if cognome != " ":
            ricerca += " "+"cognome like '%"+cognome+"%'"

        if cognome != " " and matricola != " ":
            ricerca += " and "

        if matricola != " ":
            ricerca += " "+"matricola like '%"+matricola+"%'"

        print(ricerca)

        cursor.execute(ricerca)
        data = cursor.fetchall()
        connection.commit()
        cursor.close()
        return data