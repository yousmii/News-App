import re
import xml.etree.ElementTree as ET
import feedparser

# regex solution
# def parse(path):
#     image_link_regex = 'https:\/\/.*.(png|jpg|jpeg|gif)'
#     url_link_regex = 'https:\/\/\S+(?=["<])'
#     title_regex = '<title[^>]*>(.*?)\n?<\/title>'
#     main_title_regex = '<title[^>]*>(.[a-zA-Z\s]*:\s[a-zA-Z]*?)<\/title>'
#
#     xml_file = open(path)
#
#     xml_file_text = xml_file.read()
#
#     images = [m.group() for m in re.finditer(image_link_regex, xml_file_text)]
#     links = [m.group() for m in re.finditer(url_link_regex, xml_file_text, re.DOTALL)]
#     titles = re.findall(title_regex, xml_file_text, re.DOTALL)
#     # remove main titles
#     main_titles = re.findall(main_title_regex, xml_file_text, re.DOTALL)
#     titles = [title for title in titles if title not in main_titles]
#
#     links = [item for item in links if item not in images]
#
#     html_file = open('templates/articles.html', 'w+')
#
#     cleaned_images = []
#     for image in images:
#         if "logo" in image:
#             continue
#         else:
#             cleaned_images.append(image)
#     images = cleaned_images
#
#
#     cleaned_links = []
#     for link in links:
#         if "xml" in link:
#             continue
#         elif "homepage" in link:
#             continue
#         elif "static" in link:
#             continue
#         # remove duplicates
#         elif link not in cleaned_links:
#             cleaned_links.append(link)
#     links = cleaned_links
#
#     cleaned_titles = []
#     for title in titles:
#         if "news" in title:
#             print("removing", title)
#             continue
#         elif "Homepage" in title:
#             print("removing", title)
#             continue
#         else:
#             cleaned_titles.append(title)
#     titles = cleaned_titles
#
#     for (link, image, title) in zip(links, images, titles):
#         html_file.write("<div class=\"article\">\n")
#         html_file.write(f"<a href=\"{link}\" target='blank'>\n")
#         html_file.write(f"<img src=\"{image}\">\n")
#         html_file.write(f"<h2>{title}</h2>\n")
#         html_file.write("</a>\n</div>\n")
#
#     html_file.close()

# xml solution
# def parse(path):
#     xml_file = open(path)
#     xml_string = xml_file.read()
#     root = ET.fromstring(xml_string)
#     items = []
#     for item in root.findall('.//item'):
#         title = item.find('title').text
#         try:
#             thumbnail_image_url = item.find('.//enclosure').get('url', None)
#         except:
#             prefix_map = {'media': root.find('.//')}
#             thumbnail_image_url = item.find('.//{media}content', prefix_map).get('url', None)
#         article_url = item.find('link').text
#         items.append((title, thumbnail_image_url, article_url))
#     for entry in root.findall('.//entry'):
#         title = entry.find('title').text
#         thumbnail_image_url = entry.find('.//link[@rel="enclosure"][@type="image/jpeg"][@href]')
#         if thumbnail_image_url is not None:
#             thumbnail_image_url = thumbnail_image_url.get('href')
#         article_url = entry.find('.//link[@rel="alternate"]').get('href')
#         items.append((title, thumbnail_image_url, article_url))
#     for item in root.findall('.//channel/item'):
#         title = item.find('title').text
#         try:
#             thumbnail_image_url = item.find('.//enclosure').get('url', None)
#         except:
#             thumbnail_image_url = item.find('.//{media}content').get('url', None)
#         article_url = item.find('link').text
#         items.append((title, thumbnail_image_url, article_url))
#     print(items)

# feedparser solution (WORKS!)
def parse(path):
    # Parse the RSS feed
    xml_file = open(path)
    xml_string = xml_file.read()
    feed = feedparser.parse(xml_string)

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

        # Get the article URL
        url = entry.link

        html_file = open('templates/articles.html', 'a+')

        html_file.write("<div class=\"article\">\n")
        html_file.write(f"<a href=\"{url}\" target='blank'>\n")
        html_file.write(f"<img src=\"{thumbnail}\">\n")
        html_file.write(f"<h2>{title}</h2>\n")
        html_file.write("</a>\n</div>\n")

        html_file.close()

        print(title, url, thumbnail)



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
