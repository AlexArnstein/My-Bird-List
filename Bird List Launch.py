import os
import webbrowser

os.system('cd C:/Users/alexa/OneDrive/Documents/04 Bird List/')

url = "http://localhost:8000/bird-list.html"

chrome_path = "C://Program Files//Google//Chrome//Application//chrome.exe"

webbrowser.register('chrome', None, webbrowser.BackgroundBrowser(chrome_path))

webbrowser.get('chrome').open(url)

os.system('python -m http.server')