from src.server.config import db, bcrypt, login_manager
from sqlalchemy.orm import relationship
from flask_login import UserMixin

"""
overview:
https://app.dbdesigner.net/designer/schema/0-ppdb-d7c61811-cf52-4f48-9926-df356a03e147

"""

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer(), primary_key=True)
    username = db.Column(db.String(length=30), nullable=False, unique=True)
    email_address = db.Column(db.String(length=50), nullable=False, unique=True)
    password_hash = db.Column(db.String(length=60), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)


    @property
    def password(self):
        # password_hash?
        return self.password

    @password.setter
    def password(self, plain_text_password):
        self.password_hash = bcrypt.generate_password_hash(plain_text_password).decode('utf-8')

    def check_password_correction(self, attempted_password):
        return bcrypt.check_password_hash(self.password_hash, attempted_password)


# class Admin(db.Model):
#     __tablename__ = 'admin'
#     name = db.Column(db.String(255), primary_key=True)
#     password = db.Column(db.String, nullable=False)
#     id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE', onupdate='CASCADE'), unique=True)


class Creates(db.Model):
    __tablename__ = 'creates'
    creator = db.Column(db.String, db.ForeignKey('user.username', ondelete='CASCADE', onupdate='CASCADE'),
                        primary_key=True)
    created = db.Column(db.String, db.ForeignKey('user.username', ondelete='CASCADE', onupdate='CASCADE'),
                        primary_key=True)


class RSS(db.Model):
    __tablename__ = 'rss'
    id = db.Column(db.Integer, db.Sequence('rss_id_seq', start=0, increment=1), primary_key=True)
    rss_url = db.Column(db.String, nullable=False)
    name = db.Column(db.String)


class Labels(db.Model):
    __tablename__ = 'labels'
    label = db.Column(db.String, primary_key=True)
    articles = relationship()


class Article(db.Model):
    __tablename__ = 'article'
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=True)
    image = db.Column(db.String, nullable=True)
    link = db.Column(db.String, primary_key=True)
    pub_date = db.Column(db.String, nullable=False)
    rss = db.Column(db.INT, db.ForeignKey('rss.id', onupdate='CASCADE', ondelete='CASCADE'), nullable=False)
    labels = relationship('Labels', secondary= 'article_labels', back_populates='article')



class TF_IDF(db.Model):
    __tablename__ = 'tf_idf'
    article1 = db.Column(db.String, db.ForeignKey('article.link', onupdate='CASCADE'),
                         nullable=False, primary_key=True)
    article2 = db.Column(db.String, db.ForeignKey('article.link', onupdate='CASCADE'),
                         nullable=False, primary_key=True)



class Feed(db.Model):
    __tablename__ = 'feed'
    article = db.Column(db.String, db.ForeignKey('article.link', ondelete='CASCADE', onupdate='CASCADE'),
                        nullable=False, primary_key=True)
    user = db.Column(db.INT, db.ForeignKey('user.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False,
                     primary_key=True)


class ArticleLabels(db.Model):

    __tablename__= 'article_labels'




