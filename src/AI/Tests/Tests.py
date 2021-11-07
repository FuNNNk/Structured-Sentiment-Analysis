import unittest
from PreProcessor import PreProcessor


class TestPreProcessing(unittest.TestCase):

    def test_tokenization(self):
        text = "This is a TeST!?"
        pp = PreProcessor(None)
        token_list = pp._tokenize(text)
        for token in token_list:
            self.assertIn(token, ['This', 'is', 'a', 'TeST', '!', '?'], "token_list should contain: 'This', 'is', "
                                                                        "'a', 'TeST', '!', '?' ")

    def test_lowercase_transformation(self):
        text = ['This', 'is', 'a', 'TeST', '!', '?']
        pp = PreProcessor(None)
        lowercase_text = pp._to_lowercase(text)
        for word in lowercase_text:
            self.assertIn(word, ['this', 'is', 'a', 'test', '!', '?'], "lowercase_text should contain: 'this', 'is', "
                                                                       "'a', 'test', '!', '?'")

    def test_stop_words_removing(self):
        text = ['this', 'is', 'a', 'test', '!', '?']
        pp = PreProcessor(None)
        text_without_sw = pp._remove_stop_words(text)
        for word in text_without_sw:
            self.assertIn(word, ['test', '!', '?'], "text_without_sw should contain: 'test', '!', '?' ")

    def test_stemming(self):
        text = ['playing', 'plays', 'played', "!"]
        pp = PreProcessor(None)
        stemmed_text = pp._stem_text(text)
        for word in stemmed_text:
            self.assertIn(word, ['play', 'play', 'play', '!'], "stemmed_text should contain: 'play', 'play', 'play', "
                                                               "'!' ")
