from datetime import datetime, timedelta

from src.server.database import Article,db, TF_IDF
from src.server.ConnectDB import ConnectDB
from sqlalchemy import desc, cast, Date, or_

ConnectDB = ConnectDB(db)
class ArticlesFetcher:
    def __init__(self):
        self.article_links = []

    def create_articles(self, articles, skip, stop, db_articles):
        if skip == 0:
            self.article_links = []

        for i in range(skip, stop):
            db_article = db_articles[i]

            # Retrieve all rows in the tf_idf table where the given article ID is present
            rows = db.session.query(TF_IDF).filter(or_(TF_IDF.article1 == db_article.link, TF_IDF.article2 == db_article.link)).all()

            # Create a set of unique article IDs that are similar to the given article ID
            similar_articles = set()
            for row in rows:
                if row.article1 == db_article.link:
                    similar_articles.add(row.article2)
                else:
                    similar_articles.add(row.article1)

            add = not any([similar_article for similar_article in similar_articles if similar_article in self.article_links])


            if add:
                self.article_links.append(db_article.link)

                article = {
                    "title": db_article.title,
                    "description": db_article.description,
                    "image": db_article.image,
                    "link": db_article.link,
                    "pub_date": db_article.pub_date
                }

                articles.append(article)

        return articles

    def fetch_recent(self, skip = 0):
        db_articles = Article.query.order_by(desc(Article.pub_date)).all()

        last_index = len(db_articles) - 1

        skip10 = skip + 10

        stop = last_index

        if skip10 < last_index:
            stop = skip10

        articles = []

        if skip > last_index:
            print("reached the end")
            return articles

        return self.create_articles(articles, skip, stop, db_articles)

    def fetch_popular(self, skip = 0):
        seven_days_ago = datetime.now() - timedelta(days=7)
        db_articles = Article.query.filter(cast(Article.pub_date, Date) >= seven_days_ago.date()).order_by(desc(Article.views)).all()

        last_index = len(db_articles) - 1

        skip10 = skip + 10

        articles = []

        if skip10 > last_index:
            return self.fetch_recent(skip - 10)

        # Loop through each article in the feed
        return self.create_articles(articles, skip, skip10, db_articles)
