##wrapper to use the database
from flask_sqlalchemy import SQLAlchemy
from src.server.database import User, RSS, Admin
from sqlalchemy import inspect


# from src.server.config import db


class ConnectDB():
    def __init__(self, db: SQLAlchemy):
        self.db = db
        self.counter = 1000

    # def checkUserExists(self, cookie):
    #     return self.db.session.query(User.cookie).filter_by(cookie=cookie).first() is not None

    def checkRSSExists(self, id_):
        return self.db.session.query(RSS.id).filter_by(id=id_).first() is not None

    def checkAdminExists(self, username):
        return self.db.session.query(Admin.name).filter_by(name=username).first() is not None

    def column_exists(self, table=None, column=None):
        found = False
        inspector = inspect(self.db.engine)
        schemas = inspector.get_schema_names()
        for schema in schemas:
            if schema == 'public':
                for table_name in inspector.get_table_names(schema=schema):
                    if str(table_name) == str(table):
                        for column_name in inspector.get_columns(table_name, schema=schema):
                            if str(column_name['name']) == str(column):
                                found = True
                                return found
        return found

    def table_exists(self, table):
        found = False
        inspector = inspect(self.db.engine)
        schemas = inspector.get_schema_names()
        for schema in schemas:
            if schema == 'public':
                for table_name in inspector.get_table_names(schema=schema):
                    if str(table_name) == str(table):
                        found = True
                        return found
        return found

    def column_in_schema(self, column):
        found = False
        inspector = inspect(self.db.engine)
        schemas = inspector.get_schema_names()
        for schema in schemas:
            if schema == 'public':
                for table_name in inspector.get_table_names(schema=schema):
                    for column_name in inspector.get_columns(table_name, schema=schema):
                        if str(column_name['name']) == str(column):
                            found = True
                            return found
        return found

    # def addUser(self, cookie, history=""):
    #     u = User(cookie=cookie, history=history)
    #     if not self.checkUserExists(cookie):
    #         self.db.session.add(u)
    #         self.db.session.commit()
    #     else:
    #         print("user already in db")

    def addAdmin(self, username: str, password: str):
        admin = Admin(name=username, password=password)
        if not self.checkAdminExists(admin.name):
            self.db.session.add(admin)
            self.db.session.commit()
            return 201, "New admin successfully added."
        else:
            return 500, "Admin name already in database. Please choose a different username."

    def addRSS(self, feed_name: str, feed_url: str):
        rss = RSS(name=feed_name, rss_url=feed_url)
        if not self.checkRSSExists(rss.id):
            self.db.session.add(rss)
            self.db.session.commit()
            return 201, "New RSS feed successfully added."
        else:
            return 500, "RSS feed already in database. Please choose a different RSS feed."
