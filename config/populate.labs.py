#!/usr/bin/env python3

import json
import sys
import requests
from requests.models import HTTPError

with open("./labs.json") as f:
    labs = json.load(f)

    for lab in labs:
        try:
            r = requests.post("http://localhost:8081/api/v1/labs", json=lab)
            r.raise_for_status()
            print(f"Created lab {r.json()['name']}")
        except HTTPError as e:
            print(f"Error creating lab {lab['name']}: {e}", file=sys.stderr)
