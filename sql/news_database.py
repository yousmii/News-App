from sqlalchemy import create_engine
from sqlalchemy.engine import URL

url_object = URL.create(
    "postgresql",
    username="app",
    host="localhost",
    database="dbtutor",
)
engine = create_engine(url_object)
