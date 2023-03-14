from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sql.sql_config import engine
#from app import config_data

##############################################################################
#### NIEMAND RAAKT DIT AAN AUB!!!!!!###########################################
# create the extension                                                       ##
db = SQLAlchemy()                                                            ##
# INITIALIZE SINGLETON SERVICES                                              ##
app = Flask('News-App')                                                      ##
app.secret_key = '*^*(*&)(*)(*afafafaSDD47j\3yX R~X@H!jmM]Lwf/,?KT'          ##
app_data = dict()                                                            ##
app_data['app_name'] = 'NewsApp'                             ##
                                                                             ##
# INITIALIZE SINGLETON SERVICES                                              ##
# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"             ##
app.config["SQLALCHEMY_DATABASE_URI"] = engine.url                           ##
db.init_app(app)
###############################################################################
###############################################################################
