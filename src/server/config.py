from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sql.sql_config import engine

app = Flask('News-App')
db = SQLAlchemy()
app_data = dict()


# from app import config_data
def run_app():
    # create the extension
    # INITIALIZE SINGLETON SERVICES
    with app.app_context():
        # db.create_all(db.engine)
        """
        if table doesn't exists => in python console:
        from src.server.config import app
        from src.server.config import db
        db.create_all()
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
