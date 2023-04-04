from unittest import TestCase

from flask import Flask
from src.server.config import app

from flask_sqlalchemy import SQLAlchemy

# don't pass in the app object yet
db = SQLAlchemy()


class MyTest(TestCase):
    SQLALCHEMY_DATABASE_URI = "sqlite://"
    TESTING = True

    def __init__(self):
        self.app = Flask('test_app')
        self.db = db
        self.config_app()

    def config_app(self):
        self.app.config['TESTING'] = True
        self.app.config["SQLALCHEMY_DATABASE_URI"] = "xxxxxxtestdatabasexxx"
        # Dynamically bind SQLAlchemy to application
        self.db.init_app(app)
        # this does the binding
        app.app_context().push()
        return app

    def create_app(self):
        """
        Creates a new database for the unit test to use
        """
        with self.app.app_context():
            db.create_all()
            # Your function that adds test data.
            self.populate_db()

    def setUp(self):
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
