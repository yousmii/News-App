import nltk
import gensim
import numpy as np
nltk.download('punkt')
from nltk.tokenize import word_tokenize, sent_tokenize
from typing import List

class ResemblanceObject:
    def __init__(self, dictionary, tf_idf, sims):
        self.dictionary = dictionary
        self.tf_idf = tf_idf
        self.sims = sims

def get_resemblance_object(fin):
    file_docs = []

    # Open the first file and split sentences
    with open (fin) as f:
        tokens = sent_tokenize(f.read())
        for line in tokens:
            file_docs.append(line)

    # Tokenize words for each sentence
    gen_docs = [[w.lower() for w in word_tokenize(text)]
                for text in file_docs]
   
    # Maps each word to a unique id
    dictionary = gensim.corpora.Dictionary(gen_docs)

    # Create 'bag of words' (Object that contains the word id and its frequency)
    corpus = [dictionary.doc2bow(gen_doc) for gen_doc in gen_docs]

    # Bag of words with downweighted tokens based on frequency
    tf_idf = gensim.models.TfidfModel(corpus)


    # Create similarity object
    sims = gensim.similarities.Similarity('.',tf_idf[corpus],
                                            num_features=len(dictionary))

    return ResemblanceObject(dictionary, tf_idf, sims)

# Return a dictionary of similarities between two documents
def get_resemblance(res_obj, query_file):

    file2_docs = []

    # Tokenize query file
    with open (query_file) as f:
        tokens = sent_tokenize(f.read())
        for line in tokens:
            file2_docs.append(line)

    for line in file2_docs:
        # tokenize words
        query_doc = [w.lower() for w in word_tokenize(line)]

        #update an existing dictionary and create a bag of words
        query_doc_bow = res_obj.dictionary.doc2bow(query_doc) 

    # Perform a similarity query against the corpus
    query_doc_tf_idf = res_obj.tf_idf[query_doc_bow]

    return(res_obj.sims[query_doc_tf_idf])


if __name__ == "__main__":
    res_dict = get_resemblance('demofile.txt', 'demofile2.txt')
    print(max(res_dict)) # When filtering for duplicate headlines, we only care about the max similarity
