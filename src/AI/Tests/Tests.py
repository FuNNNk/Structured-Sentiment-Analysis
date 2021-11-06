import unittest
from PreProcessor import PreProcessor


class TestPreProcessing(unittest.TestCase):

    def test_lower(self):
        pp = PreProcessor()
        self.assertEqual(pp._to_lowercase("ASGAcqE"), "asgacqe")