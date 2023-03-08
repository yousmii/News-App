import feedparser

def parse(path):
    # Parse the RSS feed
    xml_file = open(path)
    xml_string = xml_file.read()
    feed = feedparser.parse(xml_string)

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
    parse('static/vrtnieuws.xml')
    print("\n")
    print("---gva---")
    parse('static/gva.xml')
    print("\n")
    print("---hln---")
    parse('static/hln.xml')
    print("\n")
    print("---de morgen---")
    parse('static/demorgen.xml')
    print("\n")
    print("---sporza---")
    parse('static/sporza.xml')

if __name__ == "__main__":
    main()
