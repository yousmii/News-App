import time

import dateparser
import re
import feedparser
import psycopg2

from bs4 import BeautifulSoup


def scrape():
    print("running scraper🥱..")
    curs_obj = con.cursor()

    curs_obj.execute('TRUNCATE TABLE article CASCADE')

    curs_obj.execute('SELECT * FROM rss')
    rss_feeds = curs_obj.fetchall()
    for rss_feed in rss_feeds:
        rss_id, rss_url, rss_name = rss_feed
        parse(rss_url, rss_id, curs_obj)
    curs_obj.close()

    print("successfully scraped new articles✅")


def parse(link, rss_id, curs_obj):
    feed = feedparser.parse(link)

    # Loop through each article in the feed
    for entry in feed.entries:
        # Get the article title
        title = entry.title

        # Get the thumbnail image URL, if available
        thumbnail = None
        if 'media_thumbnail' in entry:
            thumbnail = entry.media_thumbnail[0]['url']
        elif 'enclosures' in entry:
            for enc in entry.enclosures:
                if enc['type'].startswith('image/'):
                    thumbnail = enc['href']
                    break
        if not thumbnail:
            # Extract the image URL from the description using BeautifulSoup
            description = entry.description
            soup = BeautifulSoup(description, 'html.parser')
            img_tag = soup.find('img')
            if img_tag:
                thumbnail = img_tag['src']

        # Get the article URL
        url = entry.link

        # Get the publication date
        pub_date = dateparser.parse(entry.published).strftime('%Y-%m-%d %H:%M:%S')

        # Get the description (https://stackoverflow.com/questions/9662346/python-code-to-remove-html-tags-from-a-string)
        clean_html_tags = re.compile('<.*?>')
        description = re.sub(clean_html_tags, '', entry.description)

        query = "INSERT INTO article VALUES (%s, %s, %s, %s, %s, %s)"
        curs_obj.execute(query, (title, description, thumbnail, url, pub_date, rss_id))

    con.commit()


if __name__ == "__main__":
    con = psycopg2.connect(
        user='app',
        password='password',
        host='localhost',
        port='5432',
        database='dbtutor'
    )
    while True:
        scrape()
        time.sleep(60)
