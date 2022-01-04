from Singleton import Singleton
from ImplementedAlgorithm import *
from PreProcessor import PreProcessor
import polar_expression
import source_target


# MEDIATOR, SINGLETON
class PredictionSystem(metaclass=Singleton):
    preprocessor = PreProcessor()
    algorithm = None

    def __init__(self, alg_type='NN'):

        # STRATEGY

        if alg_type == 'NN':
            self.algorithm = NeuralNetworksAlg(weights_file_path='./models/best_model.hdf5')
        # else ...

    def train_model(self, data):
        preprocessed_data = self.preprocessor.pre_process_input(data)
        self.algorithm.train(preprocessed_data)

    def test_predictions(self, data):
        preprocessed_test_data = self.preprocessor.pre_process_input(data)
        return self.algorithm.test(preprocessed_test_data)

    def predict_text(self, text):
        """
        Extracting source, target, polar expression
        """
        opinions = []

        polar_expr = polar_expression.polar_expression_extraction(text)
        polar_expr_positions_list = []  # position list for polar expression
        for item in polar_expr:
            polar_expr_positions_list.append(source_target.get_position(text, item))

        sour_tar, sour_tar_positions_list = source_target.return_output(text)
        source_positions_list = [sour_tar_positions_list[i] for i in range(len(sour_tar_positions_list)) if i % 2 == 0]
        target_positions_list = [sour_tar_positions_list[i] for i in range(len(sour_tar_positions_list)) if i % 2 == 1]

        for item in zip(sour_tar, source_positions_list, target_positions_list, polar_expr, polar_expr_positions_list):
            opinions.append({"Source": [[item[0][0][8::]] if item[0][0][8::] else [], item[1]],
                             "Target": [[item[0][1][8::]] if item[0][1][8::] else [], item[2]],
                             "Polar_expression": [[item[3]] if item[3] else [], item[4]]})

        return opinions

    def save_model(self, file_path):
        self.algorithm.save_model(file_path)


if __name__ == "__main__":
    predict = PredictionSystem()
    # print(predict.predict_text("Even though the price is decent for Paris , I would not recommend this hotel ."))
    print(predict.predict_text("It is raining."))
