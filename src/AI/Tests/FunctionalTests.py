import unittest
import source_target
import polar_expression
import spacy


class TestSourceTarget(unittest.TestCase):

    def test_source_target_extraction(self):
        sentence = "Donald Trump is the worst president of USA, but Hillary is better than him."
        nlp = spacy.load('en_core_web_sm')
        parsed_sentence = nlp(sentence)
        source_target_list = source_target.source_target_extraction(parsed_sentence)
        for item in source_target_list:
            self.assertIn(item, [('Source: Donald Trump', 'Target: the worst president of USA'), ('Source: Hillary', 'Target: him')])

    def test_polar_expression_extraction(self):
        sentence = "Donald Trump is the worst president of USA, but Hillary is better than him."
        polar_expression_list = polar_expression.polar_expression_extraction(sentence)
        for item in polar_expression_list:
            self.assertIn(item, ['worst', 'better'])
