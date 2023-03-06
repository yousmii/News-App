from .database import *

class DBConnection:
    def __init__(self):
        Base.metadata.create_all(engine)
    def commit(self,input):
        session.add(input)
        session.commit()
    def removeElement(self,input):
        pass
    def removeTable(self,table):
        table.__table__.drop(engine)
    def close_session(self):
        session.close_all()
class UsersDataAccess:
    def __init__(self):
        self.counter=0
        session.query(User).delete()
        session.commit()
    def addUser(self,cookie,history=""):
        u = User(cookie=cookie,history=history)
        exists = session.query(User.cookie)
        if exists is not None:
            session.add(u)
            session.commit()
    def addHistory(self,user,history):
        session.query(User). \
            filter(User.cookie == user). \
            update({'history': User.history + history})
        session.commit()
    def getCounter(self):
        self.counter+=1
        return self.counter