from src.server.resemblance.resemblance import get_resemblance, get_resemblance_object
import psycopg2
import numpy as np
import string
import re

'''
Regex for url
https:\/\/([0-z]+\.)+[0-z]*\/
'''

def from_same_site(url1, url2):
    domain1 = re.search("https:\/\/([0-z]+\.)+[0-z]*\/", url1) 
    domain2 = re.search("https:\/\/([0-z]+\.)+[0-z]*\/", url2) 

    return domain1.group() == domain2.group()

# Add all headlines to a single file
def create_source_document(cur):
    with open(".records",'w') as file:
        for record in cur:
            file.write(record[0])
            file.write('\n\n')

# Link duplicate articles to each other
def link_articles():
    # Connect to an existing database
    conn = psycopg2.connect(
        user='app',
        password='password',
        host='localhost',
        port='5432',
        database='dbtutor'
    )

    # Open a cursor to perform database operations
    cur = conn.cursor()

    cur.execute('TRUNCATE TABLE tf_idf CASCADE')

     
    cur.execute("SELECT title, description, link FROM article")
    query_result = list()
    for record in cur:
        text = record[0] + " " + record[1]
        text = text.replace("\n", "")
        text = ''.join([i if (i.isalnum()) else ' ' for i in text]) # Strip all special characters
        text += '.'
        query_result.append((text, record[2]))

    create_source_document(query_result)

    res_obj = get_resemblance_object('.records')
    
    duplicates_set = set()

    for record in query_result:
        with open(".current_record",'w') as file:
            text = record[0] + " " + record[1]
            text = text.replace("\n", "")
            text = ''.join([i if (i.isalnum()) else ' ' for i in text]) # Strip all special characters
            text += '.'
            file.write(text)
            file.write('\n')

        res_dict = get_resemblance(res_obj, '.current_record')
        print("--------------------------------------------------------------------------------------------------------------------")
        print(f"Linking article {record[0]}:")
        for i in range(len(res_dict)):
            if res_dict[i] > 0.3:
                if record[1] != query_result[i][1]:
                    print(f"\t>> score: `{res_dict[i]}` for `{query_result[i][0]}`")
                    if not from_same_site(record[1], query_result[i][1]):
                        duplicate_entry = [record[1], query_result[i][1]]
                        duplicate_entry.sort()
                        duplicates_set.add(tuple(duplicate_entry))

    for entry in duplicates_set:
        query = "INSERT INTO tf_idf VALUES (%s, %s) ON CONFLICT DO NOTHING"
        cur.execute(query, (entry[0], entry[1]))

    conn.commit()

if __name__ == "__main__":
    link_articles()
