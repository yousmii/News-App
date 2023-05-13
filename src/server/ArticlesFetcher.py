from datetime import datetime, timedelta

from src.server.database import Article,db, TF_IDF
from src.server.ConnectDB import ConnectDB
from sqlalchemy import desc, func, cast, Date

ConnectDB=ConnectDB(db)

def fetch(skip = 0):
    db_articles = Article.query.order_by(desc(Article.pub_date)).all()

    last_index = len(db_articles) - 1

    skip10 = skip + 10

    articles = []

    if skip10 > last_index:
        print("reached the end")
        return articles

    # Loop through each article in the feed
    for i in range(skip, skip10):

        db_article = db_articles[i]

        article = {
            "title": db_article.title,
            "description": db_article.description,
            "image": db_article.image,
            "link": db_article.link,
            "pub_date": db_article.pub_date
        }

        articles.append(article)


    return articles


def fetchPopular(skip = 0):
    seven_days_ago = datetime.now() - timedelta(days=7)
    db_articles = Article.query.filter(cast(Article.pub_date, Date) >= seven_days_ago.date()).order_by(desc(Article.views)).all()


    last_index = len(db_articles) - 1

    skip10 = skip + 10

    articles = []

    if skip10 > last_index:
        return fetch(skip-10)

    # Loop through each article in the feed
    for i in range(skip, skip10):
        db_article = db_articles[i]

        article = {
            "title": db_article.title,
            "description": db_article.description,
            "image": db_article.image,
            "link": db_article.link,
            "pub_date": db_article.pub_date
        }

        articles.append(article)

    return articles




if __name__ == "__main__":
    fetch()
