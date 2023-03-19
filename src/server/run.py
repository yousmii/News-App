import unittest

from app import app
from config import run_app
from test_db import *

if __name__ == '__main__':
    run_app()
    #test_db.main()
    app.run(debug=True)
