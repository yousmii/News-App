import unittest
from sqlalchemy import inspect
from .config import db
from ConnectDB import ConnectDB

connect = ConnectDB(db)


# python3 -m unittest src/server/sql/test_db.py
class TestStringMethods(unittest.TestCase):

    def test_upper(self):
        self.assertEqual('foo'.upper(), 'FOO')

    def test_admin_exists(self):
        t = 'admin'
        return self.assertTrue(connect.table_exists(t))

    def test_user_exists(self):
        t = 'admin'
        return self.assertTrue(connect.table_exists(t))


if __name__ == '__main__':
    unittest.main()
