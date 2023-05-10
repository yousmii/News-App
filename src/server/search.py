from src.server.database import Article, db
from src.server.ConnectDB import ConnectDB
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk

ConnectDB = ConnectDB(db)


def convert_date_string(date_str):
    date_parts = date_str.split(' ')
    date_part = date_parts[0]
    time_part = date_parts[1]
    time_parts = time_part.split(':')

    # Convert time to UTC
    utc_hour = int(time_parts[0]) - 5
    utc_minute = int(time_parts[1]) - 30
    if utc_minute < 0:
        utc_minute += 60
        utc_hour -= 1
    if utc_hour < 0:
        utc_hour += 24

    # Format date and time strings
    utc_time_str = f"{utc_hour:02}:{utc_minute:02}:{time_parts[2]}"
    utc_date_str = f"{date_part}T{utc_time_str}"
    return utc_date_str


def search(input_string: str):
    ELASTIC_PASSWORD = "d3XoONXMROuT84slk7qMft9O"
    CLOUD_ID = "PPDB:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyRmODg1MTM4ZDU3NjI0NDZhOGM5MjhhZjQ1NmJhZmUwMCQxZjg0Y2M0YT" \
               "YyNTM0YTU2YmVkMDcwYTM3MmUyYzg5Ng=="

    # Connect to Elasticsearch cluster
    es = Elasticsearch(
        cloud_id=CLOUD_ID,
        http_auth=("elastic", ELASTIC_PASSWORD)
    )

    # Create the Elasticsearch index mapping
    index_mapping = {
        "settings": {
            "analysis": {
                "analyzer": {
                    "custom_analyzer": {
                        "tokenizer": "whitespace",
                        "filter": ["lowercase"]
                    }
                }
            }
        },
        "mappings": {
            "properties": {
                "title": {"type": "text", "analyzer": "custom_analyzer"},
                "description": {"type": "text", "analyzer": "custom_analyzer"},
                "image": {"type": "keyword"},
                "link": {"type": "keyword"},
                "pub_date": {"type": "date"}
            }
        }
    }

    # Create the Elasticsearch index if it doesn't exist
    if not es.indices.exists(index="articles"):
        es.indices.create(index="articles", body=index_mapping)

    # Define the Elasticsearch bulk helper
    def article_actions():
        for db_article in Article.query.all():
            article = {
                "_index": "articles",
                "_id": db_article.link,
                "title": db_article.title,
                "description": db_article.description,
                "image": db_article.image,
                "link": db_article.link,
                "pub_date": convert_date_string(db_article.pub_date)
            }
            yield article

    # Index using the bulk helper
    bulk(es, article_actions())

    # Define the query
    query = {
        "query": {
            "bool": {
                "should": [
                    {"term": {"title": {"value": input_string, "boost": 3}}},
                    {"term": {"description": {"value": input_string, "boost": 2}}}
                ],
                "must": {
                    "multi_match": {
                        "query": input_string,
                        "fields": ["title^2", "description"],
                        "type": "best_fields",
                        "fuzziness": "AUTO"
                    }
                }
            }
        }
    }

    # Execute the search
    results = es.search(index="articles", body=query)

    # Extract articles from hits
    articles = []
    for hit in results["hits"]["hits"]:
        article = {
            "title": hit["_source"]["title"],
            "description": hit["_source"]["description"],
            "image": hit["_source"]["image"],
            "link": hit["_source"]["link"],
            "pub_date": hit["_source"]["pub_date"]
        }
        articles.append(article)

    return articles


if __name__ == "__main__":
    search("Be")
