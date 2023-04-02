import feedparser
from bs4 import BeautifulSoup
import dateparser
import re
from database import Article,db
from ConnectDB import ConnectDB

ConnectDB=ConnectDB(db)

def fetch():
    db_articles = Article.query.all()

    articles = []
    # Loop through each article in the feed
    for db_article in db_articles:
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
