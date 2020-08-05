#Extract XML File for library from apple music, and use that
#to make a Database of Songs.

import sqlite3 as sq
import xml.etree.ElementTree as ET

conn = sq.connect('musicdb.sqlite')
cur  = conn.cursor()

cur.executescript('''
    DROP TABLE IF EXISTS Artist;
    DROP TABLE IF EXISTS Genre;
    DROP TABLE IF EXISTS Album;
    DROP TABLE IF EXISTS Track;
    
    CREATE TABLE Artist (
        id  INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
        name    TEXT UNIQUE
    );

    CREATE TABLE Genre (
        id  INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
        name    TEXT UNIQUE
    );

    CREATE TABLE Album (
        id  INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
        artist_id  INTEGER,
        title   TEXT UNIQUE
    );

    CREATE TABLE Track (
        id  INTEGER NOT NULL PRIMARY KEY 
            AUTOINCREMENT UNIQUE,
        title TEXT  UNIQUE,
        album_id  INTEGER,
        genre_id  INTEGER,
        len INTEGER, rating INTEGER, count INTEGER
    );
''')

def myfunc(xml_node, name):
    found = False
    for child in xml_node :
        if found==True : return child.text
        if child.tag=='key' and child.text==name :
            found=True
    return None

fname = './Library.xml'
data = ET.parse(fname)
songs = data.findall('dict/dict/dict')
for child in songs :
    
    track_title = myfunc(child,'Name')
    album_title = myfunc(child,'Album')
    genre_title = myfunc(child,'Genre')
    artist_title = myfunc(child,'Artist')
    
    if track_title is None or album_title is None or genre_title is None or artist_title is None : continue
    
    cur.execute('''INSERT OR IGNORE INTO Artist (name) 
                   VALUES (?)''', (artist_title,))
    cur.execute('''SELECT id FROM Artist WHERE name = ?''',
               (artist_title,))
    artist_id = cur.fetchone()[0]
    
    cur.execute('''INSERT OR IGNORE INTO Genre (name)
                   VALUES (?)''', (genre_title,))
    cur.execute('''SELECT id FROM Genre WHERE name = ?''',
               (genre_title,))
    genre_id = cur.fetchone()[0]
    
    cur.execute('''INSERT OR IGNORE INTO Album (artist_id,title)
                   VALUES (?,?)''', (artist_id,album_title))
    cur.execute('''SELECT id FROM Album WHERE title = ?''',
               (album_title,))
    album_id = cur.fetchone()[0]
    
    cur.execute('''INSERT OR REPLACE INTO Track (title,
                    album_id,genre_id) VALUES (?,?,?) ''',
                   (track_title,album_id,genre_id))
    
    conn.commit()

    print(track_title + ' inserted. ')

