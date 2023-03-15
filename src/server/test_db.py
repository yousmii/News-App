from database import User
from config import db

"""
try adding  entry to each database
"""


def test_user():
    y = 200
    u = User(cookie=y, history="history user1")
    db.session.add(u)
    db.session.commit()
    print(User.query_all())
