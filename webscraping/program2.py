
# WEB LINK FOLLOWER
#The program will use urllib to read the HTML from the data files below, extract the href= vaues from the anchor tags, scan for a tag that is in a particular position relative to the first name in the list, follow that link and repeat the process a number of times and report the last name you find.

import re
import urllib.request, urllib.parse, urllib.error
from bs4 import BeautifulSoup

url = 'http://py4e-data.dr-chuck.net/known_by_Dhavid.html'
posn = 18
st_times = 7

def recursion(url,times):
    html = urllib.request.urlopen(url).read()
    data = BeautifulSoup(html, 'html.parser')
    links = data('a')
    newurl = (links[posn-1]['href'])
    name = (re.findall('that\s([a-zA-Z]+)\s',str(data('h1')[0].contents)))[0]
    #print(newurl)
    #print(name)
    if(times == 0) : return name
    else : return recursion(newurl,times-1)

print(recursion(url,st_times))

