from flask import Flask
from config import config_data

# INITIALIZE SINGLETON SERVICES
app = Flask('NewsApp ')
app.secret_key = '*^*(*&)(*)(*afafafaSDD47j\3yX R~X@H!jmM]Lwf/,?KT'
app_data = dict()
app_data['app_name'] = config_data['app_name']

DEBUG = False
HOST = "127.0.0.1" if DEBUG else "0.0.0.0"

# TEST USER
user = {"username": "abc", "password": "xyz"}

import routes
