import urllib.request, urllib.parse, urllib.error
import sqlite3
import json

api_key = 42
serviceurl = "http://py4e-data.dr-chuck.net/json?"

conn = sqlite3.connect('places_database.sqlite')
cur = conn.cursor()

cur.execute('''
CREATE TABLE IF NOT EXISTS Locations (address TEXT, geodata TEXT)''')

fh = open("tourist_places")

for line in fh:

    address = line.strip()
    #print('')
    cur.execute("SELECT geodata FROM Locations WHERE address= ?",
        (memoryview(address.encode()), ))

    try:
        data = cur.fetchone()[0]
        print("Found in database ",address)
        continue
    except:
        pass

    parms = dict()
    parms["address"] = address
    parms['key'] = api_key
    url = serviceurl + urllib.parse.urlencode(parms)

    print('Fetching', url)
    uh = urllib.request.urlopen(url)
    data = uh.read().decode()
    #print('Retrieved', len(data), 'characters', data[:20].replace('\n', ' '))

    js = json.loads(data)

    if 'status' not in js or (js['status'] != 'OK' and js['status'] != 'ZERO_RESULTS') :
        print('==== Failure To Retrieve ====')
        print(data)
        break

    cur.execute('''INSERT INTO Locations (address, geodata)
            VALUES ( ?, ? )''', (memoryview(address.encode()), memoryview(data.encode()) ) )
    conn.commit()

print('The Database has been created and filled.')

