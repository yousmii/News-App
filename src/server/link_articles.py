from resemblance.resemblance import get_resemblance, get_resemblance_object
import psycopg2
import numpy as np
import string

# Add all headlines to a single file
def create_source_document(cur):
    with open(".records",'w') as file:
        for record in cur:
            title = str(record[0])
            title = title.translate(str.maketrans("","", string.punctuation))
            #title = title.translate({ord('?'):None})
            title += '.'
            file.write(title)
            file.write('\n')

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

     
    cur.execute("SELECT title, link FROM article")
    query_result = list()
    for record in cur:
        query_result.append(record)

    create_source_document(query_result)
    res_obj = get_resemblance_object('.records')

    duplicates_set = set()

    for record in query_result:
        with open(".current_record",'w') as file:
            title = str(record[0])
            title = title.translate(str.maketrans("","", string.punctuation))
            title += '.'
            file.write(title)

        res_dict = get_resemblance(res_obj, '.current_record')
        for i in range(len(res_dict)):
            if res_dict[i] > 0.8 and res_dict[i] < 0.9999:
                duplicate_entry = [record[1], query_result[i][1]]
                duplicate_entry.sort()
                duplicates_set.add(tuple(duplicate_entry))

    for entry in duplicates_set:
        query = "INSERT INTO tf_idf VALUES (%s, %s, %s)"
        cur.execute(query, (entry[0], entry[1], 1.0))

if __name__ == "__main__":
    link_articles()
