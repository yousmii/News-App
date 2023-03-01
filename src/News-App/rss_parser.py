import re


def parse(path):
    image_link_regex = 'https:\/\/.*.(png|jpg|jpeg)'
    url_link_regex = 'https:\/\/\S+(?=["<])'
    title_regex = '<title[^>]*>(.*?)\n?<\/title>'

    xml_file = open(path)

    xml_file_text = xml_file.read()

    images = [m.group() for m in re.finditer(image_link_regex, xml_file_text)]
    links = [m.group() for m in re.finditer(url_link_regex, xml_file_text, re.DOTALL)]
    titles = re.findall(title_regex, xml_file_text, re.DOTALL)

    links = [item for item in links if item not in images]

    html_file = open('templates/articles.html', 'w+')

    cleaned_images = []
    print("images")
    for image in images:
        if "logo" in image:
            print("removing", image)
            continue
        else:
            cleaned_images.append(image)
    images = cleaned_images

    cleaned_links = []
    print("links")
    for link in links:
        if "xml" in link:
            print("removing", link)
            continue
        elif "homepage" in link:
            print("removing", link)
            continue
        elif "static" in link:
            print("removing", link)
            continue
        elif link == "https://www.vrt.be/vrtnws/en/":
            print("removing", link)
            continue
        # remove duplicates
        elif link not in cleaned_links:
            cleaned_links.append(link)
    links = cleaned_links



    cleaned_titles = []
    print("titles")
    for title in titles:
        if "news" in title:
            print("removing", title)
            continue
        elif "Homepage" in title:
            print("removing", title)
            continue
        else:
            cleaned_titles.append(title)
    titles = cleaned_titles

    for (link, image, title) in zip(links, images, titles):
        html_file.write("<div class=\"article\">\n")
        html_file.write(f"<a href=\"{link}\" target='blank'>\n")
        html_file.write(f"<img src=\"{image}\">\n")
        html_file.write(f"<h2>{title}</h2>\n")
        html_file.write("</a>\n</div>\n")


def main():
    # print("---vrt nieuws---")
    # parse('static/vrtnieuws.xml')
    # print("\n")
    # print("---gva---")
    parse('static/gva.xml')


if __name__ == "__main__":
    main()
