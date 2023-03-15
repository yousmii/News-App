##wrapper to use the database
from datetime import datetime
from alembic import op
from flask_sqlalchemy import SQLAlchemy
from database import User, RSS
from sqlalchemy import inspect

# from src.server.config import db


class ConnectDB():
    def __init__(self, db: SQLAlchemy):
        self.db = db
        self.counter = 1000

    def checkUserExisits(self, cookie):
        return self.db.session.query(User.cookie).filter_by(cookie=cookie).first() is not None

    def checkRSSExists(self, id):
        return self.db.session.query(RSS.id).filter_by(id=id).first() is not None

    def column_exists(self,table_name, column_name):
        inst = inspect(self.db.engine)
        #attr_names = [c_attr.key for c_attr in inst.mapper.column_attrs]
        #return attr_names is None

    def addUser(self, cookie, history=""):
        u = User(cookie=cookie, history=history)
        if not self.checkUserExisits(cookie):
            self.db.session.add(u)
            self.db.session.commit()
        else:
            print("user already in db")
        print(User.query.all())

    def addRSS(self, rss_url: str, published_by: str):
        if self.column_exists(RSS,rss_url):
            print("table exists")
        else:
            print("table:"+"rss_url, doesn' exist.")
        """
        rss = RSS(rss_url=rss_url, published_by=published_by)
        if not self.checkRSSExists(rss.id):
            self.db.session.add(rss)
            self.db.session.commit()
        else:
            print("rss already in db")
        """
