from abc import ABC, abstractmethod

# TEMPLATE, FACADE
class Algorithm(ABC):
    model = None

    @abstractmethod
    def train(self, training_data):
        pass

    @abstractmethod
    def test(self, test_data):
        pass

    @abstractmethod
    def predict_single_input(self, text):
        pass

    @abstractmethod
    def save_model(self, file_path):
        pass
