from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship

from src.server.sql.sql_config import engine
from flask_bcrypt import Bcrypt
from flask_login import LoginManager

app = Flask('News-App')
db = SQLAlchemy()
app_data = dict()
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)


# from app import config_data``
def run_app():
    # create the extension
    # INITIALIZE SINGLETON SERVICES
    with app.app_context():
        """
        if table doesn't exists:
        1. Copy all tables from database.py to right above this function definition
        2. In the python console, run the following:
        `from src.server.config import run_app`
        `run_app()`
        """
        pass
    app.secret_key = '*^*(*&)(*)(*afafafaSDD47j\3yX R~X@H!jmM]Lwf/,?KT'
    app_data['app_name'] = 'NewsApp'
    # INITIALIZE SINGLETON SERVICES
    app.config["SQLALCHEMY_DATABASE_URI"] = engine.url
    db.init_app(app)
    with app.app_context():
        db.create_all()


if __name__ == '__main__':
    run_app()
