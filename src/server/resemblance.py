import nltk
nltk.download('punkt')
from nltk.tokenize import word_tokenize

data = "Mars is approximately half the diameter of Earth."
print(word_tokenize(data))
