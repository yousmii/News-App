from resemblance.resemblance import get_resemblance
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

     
    cur.execute("SELECT title, link FROM article;")
    query_result = list()
    for record in cur:
        query_result.append(record)

    print(len(query_result))
    create_source_document(query_result)

    for record in query_result:
        with open(".current_record",'w') as file:
            title = str(record[0])
            title = title.translate(str.maketrans("","", string.punctuation))
            title += '.'
            file.write(title)

        res_dict = get_resemblance('.records', '.current_record')
        for i in range(len(res_dict)):
            if res_dict[i] > 0.8 and res_dict[i] < 0.9999:
                print(res_dict[i])
                print('(' + str(record) + ', \n\t' + str(query_result[i]) + ')\n')

    '''
    Loop through all headlines again and link duplicate articles
        If it's already on the right-hand side, link article on LHS with current entry
    '''
    pass

if __name__ == "__main__":
    link_articles()
