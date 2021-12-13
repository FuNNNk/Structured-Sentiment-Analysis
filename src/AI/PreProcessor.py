import gensim as gensim

from Singleton import Singleton
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
import json
from aspectlib import Aspect
import re
import gensim
from nltk.tokenize.treebank import TreebankWordDetokenizer

# SINGLETON
class PreProcessor(metaclass=Singleton):

    def __init__(self, text=None):
        if text is not None:
            self.text = self.pre_process_input(text)
        else:
            self.text = None

    def depure_data(self, text: str):

        url_pattern = re.compile(r'https?://\S+|www\.\S+')
        text = url_pattern.sub(r'', text)

        text = re.sub(r'\S*@\S*\s?', '', text)

        text = re.sub(r'\s+', ' ', text)

        text = re.sub(r"\'", "", text)

        text = re.sub(r"\’", "", text)

        return text

    def simple_preprocess(self, sentence):
        return TreebankWordDetokenizer().detokenize(gensim.utils.simple_preprocess(self.depure_data(sentence), deacc=True))

    def pre_process_input(self, text):
        return self.simple_preprocess(self.depure_data(text))

        # probably gonna be changed on the next iteration


        # text = self._tokenize(text)
        # text = self._to_lowercase(text)
        # text = self._remove_stop_words(text)
        # text = self._stem_text(text)
        # return text

    # def _tokenize(self, text):
    #     return word_tokenize(text)
    #
    # def _to_lowercase(self, text):
    #     lowercase_text = []
    #     for word in text:
    #         lowercase_text.append(word.lower())
    #     return lowercase_text
    #
    # def _remove_stop_words(self, text):
    #     text_without_sw = []
    #     for word in text:
    #         if word not in stopwords.words():
    #             text_without_sw.append(word)
    #     return text_without_sw
    #
    # def _stem_text(self, text):
    #     porter = PorterStemmer()
    #     stemmed_text = []
    #     for word in text:
    #         stemmed_text.append(porter.stem(word))
    #     return stemmed_text

    def get_unstructured_dataset(self, ds, save_file_path):
        output = []

        for sent in ds:
            try:
                if sent["opinions"]:
                    for opinion in sent["opinions"]:
                        x = re.findall(r'^[a-zA-Z]+', str(opinion['Polar_expression'][0][0]))
                        if x and opinion['Intensity'] and opinion['Polarity']:
                            if len(opinion['Polar_expression'][0]) == 1:
                                output.append({"text": opinion['Polar_expression'][0][0],
                                               "Polarity": opinion['Polarity'] + '_' + opinion['Intensity'].replace('Average', 'Standard')})
                            else:
                                print(sent)
                                print("More polar expressions for a target")
            except TypeError as err:
                print(f"{err=}")

        with open(save_file_path, 'w') as f:
            json.dump(output, f, indent=4)


@Aspect(bind=True)
def file_parser(cutpoint, *args):
    print("Parsing '%s' file with '%s' method..." % (args[0], cutpoint.__name__))
    result = yield
    print(" ... in this file are %s texts." % len(result))


@file_parser
def json_file_parser(file):
    with open(file) as f:
        load_file = json.load(f)
    texts_from_file = []
    for dic in load_file:
        # print(dic)
        texts_from_file.append(dic["text"])
    return texts_from_file


def write_list_into_file(list):
    textfile = open("Training data/corpus2.txt", "ab")
    for element in list:
        textfile.write(element.encode("UTF-8") + " ".encode("UTF-8"))
    textfile.close()


if __name__ == "__main__":
    # pp = PreProcessor("This is a TeST?? I'm just playing.")
    # print(pp.text)

    file = "Training data/train2.json"
    list_of_texts = json_file_parser(file)
    # print(list_of_texts)

    # write_list_into_file(list_of_texts)

    # processed_texts = []
    # for text in list_of_texts:
    #     pp = PreProcessor(text)
    #     # print(pp.pre_process_input(text))
    #     processed_texts.append(pp.pre_process_input(text))
