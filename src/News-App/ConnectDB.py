from config import db
from database import *


class ConnectDB:
    def __init__(self):
        self.db = db

    def add_user(self, cookie, history):
        user = User(cookie=cookie, history=history)
        db.session.add(user)
        db.session.commit()

    def getUsers(self):
        return User.query.all()
