
# WEB SCRAPING
# The program will use urllib to read the HTML from the data files below, and parse the data, extracting numbers and compute the sum of the numbers in the file.

import re
import urllib.request, urllib.parse, urllib.error
from bs4 import BeautifulSoup

url2 = 'http://py4e-data.dr-chuck.net/comments_42.html'
url = 'http://py4e-data.dr-chuck.net/comments_767165.html'
html = urllib.request.urlopen(url).read()
data = BeautifulSoup(html, 'html.parser')

sumv = 0
data_span = data('span')
for line in data_span :
    val = re.findall('>([0-9]+)<',str(line))
    sumv += int(val[0])
    
print(sumv)



