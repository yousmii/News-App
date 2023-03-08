from flask import Flask
from NewsApp.config import config_data
from NewsApp.DBConnection import DBConnection

# INITIALIZE SINGLETON SERVICES
app = Flask('NewsApp ')
app.secret_key = '*^*(*&)(*)(*afafafaSDD47j\3yX R~X@H!jmM]Lwf/,?KT'
app_data = dict()
app_data['app_name'] = config_data['app_name']
connection = DBConnection(dbname=config_data['dbname'], dbuser=config_data['dbuser'], password="")

DEBUG = False
HOST = "127.0.0.1" if DEBUG else "0.0.0.0"

# TEST USER
user = {"username": "abc", "password": "xyz"}

from NewsApp import routes