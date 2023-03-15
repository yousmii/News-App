from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sql.sql_config import engine

app = Flask('News-App')
db = SQLAlchemy()  ##
app_data = dict()  ##

# from app import config_data
def run_app():
    ##############################################################################
    #### NIEMAND RAAKT DIT AAN AUB!!!!!!###########################################
    # create the extension                                                       ##

    # INITIALIZE SINGLETON SERVICES                                              ##

    with app.app_context():
        # db.create_all(db.engine)
        pass
    ##
    app.secret_key = '*^*(*&)(*)(*afafafaSDD47j\3yX R~X@H!jmM]Lwf/,?KT'  ##

    app_data['app_name'] = 'NewsApp'  ##
    ##
    # INITIALIZE SINGLETON SERVICES                                              ##
    # app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"             ##
    app.config["SQLALCHEMY_DATABASE_URI"] = engine.url

    db.init_app(app)
    with app.app_context():
        db.create_all()

    ###############################################################################
    ###############################################################################


from database import *

if __name__ is '__main__':
    run_app()
