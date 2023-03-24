import feedparser
from bs4 import BeautifulSoup
import dateparser
import re
#from database import Article,db
#from ConnectDB import ConnectDB

#ConnectDB=ConnectDB(db)
def parse(link):
    # Parse the RSS feed
    feed = feedparser.parse(link)

    articles = []

    # Loop through each article in the feed
    for entry in feed.entries:
        article = {}
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

        article["title"] = title
        article["description"] = description
        article["image"] = thumbnail
        article["link"] = url
        article["pub_date"] = pub_date
        # add article to db:
        #ar1=Article(title=article["title"],photo=article["image"],link=article["link"])
        """
        db.session.add(ar1)
        db.session.commit()
        print(Article.query.all())
        """
        articles.append(article)

    return articles

def main():
    print("---vrt---")
    print(parse('https://www.vrt.be/vrtnws/en.rss.articles.xml'))
    print("\n")
    print("---gva---")
    print(parse('https://www.gva.be/rss/section/ca750cdf-3d1e-4621-90ef-a3260118e21c'))
    print("\n")
    print("---het nieuwsblad---")
    print(parse('https://www.nieuwsblad.be/rss/section/55178e67-15a8-4ddd-a3d8-bfe5708f8932'))
    print("\n")
    print("---de morgen---")
    print(parse('https://www.demorgen.be/in-het-nieuws/rss.xml'))
    print("\n")
    print("---sporza---")
    print(parse('https://sporza.be/nl.rss.xml'))
    print('\n')
    print('---the bulletin---')
    print(parse('https://www.thebulletin.be/rss.xml'))

    

if __name__ == "__main__":
    main()
