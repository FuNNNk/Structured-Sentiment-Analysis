import json
import re
import gensim
from aspectlib import Aspect
from nltk.tokenize.treebank import TreebankWordDetokenizer
from Singleton import Singleton


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
def json_file_parser(file_name):
    with open(file_name) as f:
        load_file = json.load(f)
    texts_from_file = []
    for dic in load_file:
        texts_from_file.append(dic["text"])
    return texts_from_file


def write_list_into_file(list_of_sentences):
    textfile = open("Training data/corpus2.txt", "ab")
    for sentence in list_of_sentences:
        textfile.write(sentence.encode("UTF-8") + " ".encode("UTF-8"))
    textfile.close()
