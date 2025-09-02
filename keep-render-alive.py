#!/usr/bin/env python3
import requests
import datetime

def ping_backend():
    # Replace this URL with your Backend 1 URL and health endpoint
    url = "https://is-code-compiler.onrender.com/health"
    
    try:
        print(f"{datetime.datetime.now()}: Pinging Backend 1 at {url}")
        response = requests.get(url, timeout=30)
        print(f"Response: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Backend 1 is alive")
        else:
            print(f"⚠️ Unexpected status code: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error pinging Backend 1: {e}")

if __name__ == "__main__":
    ping_backend()