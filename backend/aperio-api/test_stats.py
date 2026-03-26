import sys
import urllib.request
import urllib.error

try:
    req = urllib.request.urlopen("http://127.0.0.1:8000/v1/stats/")
    print(req.read().decode())
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code}")
    print(e.read().decode())
    sys.exit(1)
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
