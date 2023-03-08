import feedparser

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

        # Get the article URL
        url = entry.link

        article["title"] = title
        article["image"] = thumbnail
        article["link"] = url

        articles.append(article)

    return articles

def main():
    print("---vrt---")
    parse('https://www.vrt.be/vrtnws/en.rss.articles.xml')
    print("\n")
    print("---gva---")
    parse('https://www.gva.be/rss/section/ca750cdf-3d1e-4621-90ef-a3260118e21c')
    print("\n")
    print("---het nieuwsblad---")
    parse('https://www.nieuwsblad.be/rss/section/55178e67-15a8-4ddd-a3d8-bfe5708f8932')
    print("\n")
    print("---de morgen---")
    parse('https://www.demorgen.be/in-het-nieuws/rss.xml')
    print("\n")
    print("---sporza---")
    parse('https://sporza.be/nl.rss.xml')

if __name__ == "__main__":
    main()
