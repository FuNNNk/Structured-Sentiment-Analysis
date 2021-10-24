from Singleton import Singleton
from ImplementedAlgorithm import *
from PreProcessor import PreProcessor


# MEDIATOR, SINGLETON
class PredictionSystem(metaclass=Singleton):
    preprocessor = PreProcessor()
    algorithm = None

    def __init__(self, alg_type='NN'):

        # STRATEGY

        if alg_type == 'NN':
            self.algorithm = NeuralNetworksAlg()
        # else ...

    def train_model(self, data):
        preprocessed_data = self.preprocessor.pre_process_input(data)
        self.algorithm.train(preprocessed_data)

    def test_predictions(self, data):
        preprocessed_test_data = self.preprocessor.pre_process_input(data)
        self.algorithm.test(preprocessed_test_data)

    def predict_text(self, text):
        preprocessed_text = self.preprocessor.pre_process_input(text)
        self.algorithm.predict_single_input(preprocessed_text)

    def save_model(self, file_path):
        self.algorithm.save_model(file_path)
