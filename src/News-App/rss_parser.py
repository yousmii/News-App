import xml.etree.ElementTree as ET


def parse(path):
    image_link_regex = "\"https:?//.*.(png|jpg|jpeg)\""
    url_link_regex = "\"https?:\/\/.*.\""



    html_file = open('templates/articles.html', 'w+')

    tree = ET.parse(path)
    root = tree.getroot()

    for entry in root:
        if entry.tag[29:] == "entry":
            html_file.write("<div class=\"article\">\n")
            for child in entry:
                if child.tag[29:] == "link" and child.attrib["type"] in ["image/jpeg", "image/png"]:
                    html_file.write(f"<img src=\"{child.attrib['href']}\">\n")
                elif child.tag[29:] == "link" and child.attrib["type"] == "text/html":
                    html_file.write(f"<a href=\"{child.attrib['href']}\" target='blank'>\n")
            for child in entry:
                if child.tag[29:] == "title":
                    html_file.write(f"<h2>{child.text}</h2>\n")
            html_file.write("</a>\n</div>\n")


def main():
    parse('static/vrtnieuws.xml')
    # parse('static/gva.xml')


if __name__ == "__main__":
    main()
