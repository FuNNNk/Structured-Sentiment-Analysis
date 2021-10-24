

from Algorithm import Algorithm

class NeuralNetworksAlg(Algorithm):

    def __init__(self, *args, **kwargs):
        if 'file_path' in kwargs:
            self.model = tf.load_model(kwargs['file_path'])
        else:
            if 'n_layers' not in kwargs:
                self.n_layers = 5
            if 'n_neurons' not in kwargs:
                self.n_neurons = [16, 32, 64, 32, 16]
            if 'lr' not in kwargs:
                self.lr = 0.01
            self.initialise_model()

    def initialise_model(self):
        self.model = tf.model('''params''') # ?

    def train(self, training_data):
        pass

    def test(self, test_data):
        pass

    def predict_single_input(self, text):
        pass

    def save_model(self, file_path):
        pass