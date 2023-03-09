from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_utils.types import uuid

from config import db


# Base = declarative_base()


class User(db.Model):

    __tablename__ = 'user'
    cookie = db.Column(db.Integer, db.Sequence('user_seq'), primary_key=True)
    history = db.Column(db.String(255), nullable=True)

    def add(self, cookie: int, history: str):
        u = User(cookie=cookie, history=history)
        db.session.add(u)
        db.session.commit()


class Admin(db.Model):
    __tablename__ = 'admin'
    name = db.Column(db.String(255), primary_key=True)
    password = db.Column(db.String, nullable=False)
    cookie_id = db.Column(db.Integer, db.ForeignKey('user.cookie', ondelete='CASCADE', onupdate='CASCADE'), unique=True)
    cookie = db.relationship('User', backref='user')


class Creates(db.Model):
    __tablename__ = 'creates'
    creator = db.Column(db.String, db.ForeignKey('admin.name', ondelete='CASCADE', onupdate='CASCADE'),
                        primary_key=True)
    created = db.Column(db.String, db.ForeignKey('admin.name', ondelete='CASCADE', onupdate='CASCADE'),
                        primary_key=True)


class NewsSource(db.Model):
    __tablename__ = 'source'
    name = db.Column(db.String, primary_key=True)
    magazine = db.Column(db.String, nullable=False)


class RSS(db.Model):
    __tablename__ = 'rss'
    rss_url = db.Column(db.String, nullable=False)
    id = db.Column(db.INT, primary_key=True)
    published_by = db.Column(db.String, db.ForeignKey('source.name', ondelete='CASCADE', onupdate='CASCADE'),
                             nullable=False)


class Labels(db.Model):
    __tablename__ = 'labels'
    label = db.Column(db.String, primary_key=True)


class Article(db.Model):
    __tablename__ = 'article'
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=True)
    photo = db.Column(db.String, nullable=True)
    link = db.Column(db.String, primary_key=True)
    pub_date = db.Column(db.String, nullable=False)
    pub_time = db.Column(db.String, nullable=False)
    references = db.Column(db.String, db.ForeignKey('source.name', onupdate='CASCADE', ondelete='CASCADE'),
                           nullable=False)
    rss_access = db.Column(db.INT, db.ForeignKey('rss.id', onupdate='CASCADE', ondelete='CASCADE'), nullable=False)
    label = db.Column(db.String, db.ForeignKey('labels.label', onupdate='CASCADE', ondelete='CASCADE'), nullable=False)


class TF_IDF(db.Model):
    __tablename__ = 'tf_idf'
    article1 = db.Column(db.String, db.ForeignKey('article.link', ondelete='CASCADE', onupdate='CASCADE'),
                         nullable=False, primary_key=True)
    article2 = db.Column(db.String, db.ForeignKey('article.link', ondelete='CASCADE', onupdate='CASCADE'),
                         nullable=False, primary_key=True)
    value = db.Column(db.INT, nullable=False)


class Feed(db.Model):
    __tablename__ = 'feed'
    article = db.Column(db.String, db.ForeignKey('article.link', ondelete='CASCADE', onupdate='CASCADE'),
                        nullable=False, primary_key=True)
    user = db.Column(db.INT, db.ForeignKey('user.cookie', ondelete='CASCADE', onupdate='CASCADE'), nullable=False,
                     primary_key=True)


""""
u=User()
u.add(2,"bla")
"""