from unittest import TestCase
# from flask.ext.testing import TestCase
# https://flask-testing.readthedocs.io/en/v0.4/

from flask import Flask

from src.server.ConnectDB import ConnectDB
from flask_sqlalchemy import SQLAlchemy

from src.server.database import User

db = SQLAlchemy()
app = Flask('test_app')


def config_app():
    app.config['TESTING'] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite://"
    # Dynamically bind SQLAlchemy to application
    db.init_app(app)
    # this does the binding
    app.app_context().push()
    return app


# don't pass in the app object yet
config_app()
connect_db = ConnectDB(db=db)


class MyTest(TestCase):
    SQLALCHEMY_DATABASE_URI = "sqlite://"
    TESTING = True

    def create_app(self):
        """
        Creates a new database for the unit test to use
        """
        with app.app_context():
            db.create_all()
            # Your function that adds test data.
            self.populate_db()

    def setUp(self):
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def testUser(self):
        # u=self.connect_db.addUser(2,"history user2")
        # this works
        u = User(cookie=30, history="prehistory")
        db.session.add(u)
        assert u in db.session

        # response = self.app.get("/")

        # this raises an AssertionError
        assert u in db.session

    def populate_db(self):
        pass
