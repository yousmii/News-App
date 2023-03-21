from flask import Flask

app = Flask('News-App')
app_data = dict()
config_data = dict()
config_data['app_name'] = 'NewsApp'
config_data['dbname'] = 'dbtutor'
config_data['dbuser'] = 'app'

DEBUG = False
HOST = "127.0.0.1" if DEBUG else "0.0.0.0"

# TEST USER
user = {"username": "abc", "password": "xyz"}

import routes
