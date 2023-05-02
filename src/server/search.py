from database import Article,db
from ConnectDB import ConnectDB
from sqlalchemy import desc

ConnectDB=ConnectDB(db)

def search(input_string: str):
    db_articles = Article.query.order_by(desc(Article.pub_date)).all()

    articles = []

    for db_article in db_articles:
        if db_article.title.find(input_string) == -1:
            continue
        
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
    search("Be")
