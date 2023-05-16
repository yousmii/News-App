##wrapper to use the database
from flask_sqlalchemy import SQLAlchemy
from src.server.database import RSS, User
from sqlalchemy import inspect
from src.server.config import app


class ConnectDB:
    def __init__(self, db: SQLAlchemy):
        self.db = db
        self.counter = 1000
        with app.app_context():
            self.add_default_admin()

    def add_default_admin(self):
        # Add default admin user if he does not exist already
        exists = User.query.filter_by(username="admin").first()
        if not exists:
            admin_user = User(
                username="admin",
                email_address="admin@team2.ua-ppdb.me",
                password="team2-admin",
                is_admin = True
            )
            self.db.session.add(admin_user)
            self.db.session.commit()


    def checkRSSExists(self, id_):
        return self.db.session.query(RSS.id).filter_by(id=id_).first() is not None

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

    def addRSS(self, feed_name: str, feed_url: str):
        rss = RSS(name=feed_name, rss_url=feed_url)
        if not self.checkRSSExists(rss.id):
            self.db.session.add(rss)
            self.db.session.commit()
            return 201, "New RSS feed successfully added."
        else:
            return 500, "RSS feed already in database. Please choose a different RSS feed."
