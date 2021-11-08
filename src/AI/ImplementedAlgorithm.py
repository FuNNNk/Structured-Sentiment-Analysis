import tensorflow as tf
from tensorflow.keras.layers import LSTM

from Algorithm import Algorithm
import tensorflow.keras as keras
from tensorflow.keras.models import Sequential
from tensorflow.keras import layers
from tensorflow.keras import regularizers
import h5py

class NeuralNetworksAlg(Algorithm):

    def __init__(self, *args, **kwargs):
        if 'file_path' in kwargs:
            try:
                self.model = keras.models.load_model(kwargs['file_path'])
            except:
                print("Could not find the desired model at the file destination, initializing new model")
                self.model = None
                self.initialise_model()
        else:
            if 'n_layers' in kwargs:
                self.n_layers = kwargs['n_layers']

            else:
                self.n_layers = 5
            if 'n_neurons' in kwargs:
                self.n_neurons = kwargs['n_neurons']
            else:
                self.n_neurons = [16,32,64,32,16]
            if 'lr' in kwargs:
                self.lr = kwargs['lr']
            else:
                self.lr = 0.01
            self.model = None
            self.initialise_model()

    def initialise_model(self):
        self.model = Sequential()
        self.model.add(layers.Embedding(128, 40, input_length=256))
        self.model.add(layers.Conv1D(20, 6, activation='relu', kernel_regularizer=regularizers.l1_l2(l1=2e-3, l2=2e-3),
                                 bias_regularizer=regularizers.l2(2e-3)))
        self.model.add(layers.MaxPooling1D(5))
        self.model.add(layers.Conv1D(20, 6, activation='relu', kernel_regularizer=regularizers.l1_l2(l1=2e-3, l2=2e-3),
                                 bias_regularizer=regularizers.l2(2e-3)))
        self.model.add(layers.GlobalMaxPooling1D())
        #self.model.add(LSTM(128))
        self.model.add(layers.Dense(5, activation='softmax'))
        optimizer = keras.optimizers.Adam(self.lr)
        self.model.compile(optimizer, loss='categorical_crossentropy', metrics=['acc'])

    def train(self, training_data, n_epochs=70, batch_size=32):
        X_train = [sentence for sentence in training_data['text']]
        y_train = [target for target in training_data['opinions']]
        callbacks = [
            keras.callbacks.ModelCheckpoint(
                './models/model.acc_{acc:.2f}.hdf5',
                monitor='acc', verbose=1, save_best_only=True, mode='auto'),
        ]
        self.history = self.model.fit(X_train, y_train, epochs=n_epochs,
                                  callbacks=callbacks, lr=self.lr, batch_size=batch_size)

    def test(self, test_data):
        loss, acc = self.model.evaluate(test_data, verbose=2)
        print(f"Accuracy on the test data is {100*acc}%")

    def predict_single_input(self, text):
        self.model.predict(text)

    def save_model(self, file_path):
        self.model.save(file_path)
