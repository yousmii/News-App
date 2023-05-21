from datetime import datetime, timedelta

from src.server.database import Article, db, TF_IDF, Article_Labels
from src.server.ConnectDB import ConnectDB
from sqlalchemy import desc, func, cast, Date

ConnectDB = ConnectDB(db)


def get_article_by_label(labels):
    articles_label_pairs = Article_Labels.query.filter(Article_Labels.label.in_(labels)).all()
    article_links = [pair.article for pair in articles_label_pairs]
    articles = []
    for link in article_links:
        articles_to_add = list(Article.query.filter_by(link=link).all())
        for article_to_add in articles_to_add:
            articles.append(
                {
                    "title": article_to_add.title,
                    "description": article_to_add.description,
                    "image": article_to_add.image,
                    "link": article_to_add.link,
                    "pub_date": article_to_add.pub_date
                }
            )

    return articles


def newFetch():
    db_articles = Article.query.order_by(desc(Article.pub_date)).all()
    articles = []
    for article in db_articles:
        articles.append(
            {
                "title": article.title,
                "description": article.description,
                "image": article.image,
                "link": article.link,
                "pub_date": article.pub_date
            }
        )

    return articles



def newFetchPopular():
    seven_days_ago = datetime.now() - timedelta(days=7)
    db_articles = Article.query.filter(cast(Article.pub_date, Date) >= seven_days_ago.date()).order_by(
        desc(Article.views)).all()

    db_articles.extend(Article.query.filter(
        cast(Article.pub_date, Date) < seven_days_ago.date()
    ).order_by(desc(Article.pub_date)).all())

    articles = []
    for article in db_articles:
        articles.append(
            {
                "title": article.title,
                "description": article.description,
                "image": article.image,
                "link": article.link,
                "pub_date": article.pub_date
            }
        )

    return articles

if __name__ == "__main__":
    newFetch()
