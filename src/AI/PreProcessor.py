from Singleton import Singleton
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer


# SINGLETON
class PreProcessor(metaclass=Singleton):

    def __init__(self, text=None):
        if text != None:
            self.text = self.pre_process_input(text)
        else:
            self.text = None

    def pre_process_input(self, text):
        text = self._tokenize(text)
        text = self._to_lowercase(text)
        text = self._remove_stop_words(text)
        text = self._stem_text(text)
        return text

    def _tokenize(self, text):
        return word_tokenize(text)

    def _to_lowercase(self, text):
        lowercase_text = []
        for word in text:
            lowercase_text.append(word.lower())
        return lowercase_text

    def _remove_stop_words(self, text):
        text_without_sw = []
        for word in text:
            if word not in stopwords.words():
                text_without_sw.append(word)
        return text_without_sw

    def _stem_text(self, text):
        porter = PorterStemmer()
        stemmed_text = []
        for word in text:
            stemmed_text.append(porter.stem(word))
        return stemmed_text


if __name__ == "__main__":
    pp = PreProcessor("This is a TeST?? I'm just playing.")
    print(pp.text)
