import pymysql.cursors

connection = pymysql.connect(host='raspyexaequo.duckdns.org:3306',
                             user='projectUserSimo',
                             password='sauropods.',
                             db='projectDB',
                             charset='utf8mb4',
                             use_unicode='True',
                             cursorclass=pymysql.cursors.DictCursor)


def getAule():

    with connection.cursor() as cursor:
        data = cursor.execute("SELECT DES FROM P09_AULE")
        connection.commit()
        cursor.close()
        return data