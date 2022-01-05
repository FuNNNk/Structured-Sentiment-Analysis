try:
    from Algorithm import Algorithm
    import warnings
    import tensorflow.keras as keras
    import numpy as np
    from tensorflow.keras.models import Sequential
    from tensorflow.keras import layers
    from tensorflow.keras.preprocessing.text import Tokenizer
    from tensorflow.keras.preprocessing.sequence import pad_sequences
    import itertools
except ImportError as err:
    raise ImportError("Not all required modules are installed, please install every module from requirements.txt")

warnings.filterwarnings('ignore')


class NeuralNetworksAlg(Algorithm):

    def __init__(self, *args, **kwargs):
        self.sentiment = ['Negative', 'Positive']
        self.intensity = ['Standard', 'Strong']
        self.combinations = []
        self.max_words = 30
        self.max_len = 80

        self.tokenizer = Tokenizer(num_words=self.max_words)

        for item in itertools.product(self.sentiment, self.intensity):
            self.combinations.append(item[0] + '_' + item[1])
        # print(self.combinations)
        self.model = None
        self.initialise_model()
        if 'weights_file_path' in kwargs:
            try:
                self.model.load_weights(kwargs['weights_file_path'])
            except FileNotFoundError as error:
                print("Could not find the model weights at the file destination, initializing new model")
                exit(0)

    def initialise_model(self):
        model = Sequential()
        model.add(layers.Embedding(self.max_words, 128, input_length=self.max_len))
        model.add(layers.Bidirectional(layers.GRU(64, return_sequences=True)))
        model.add(layers.Bidirectional(layers.GRU(64)))
        model.add(layers.Dense(128, activation='relu'))
        model.add(layers.Dropout(0.5))
        model.add(layers.Dense(64, activation='relu'))
        model.add(layers.Dense(len(self.combinations), activation='softmax'))

        model.compile(optimizer='rmsprop', loss='categorical_crossentropy', metrics=['accuracy'])

        self.model = model

    def train(self, training_data, n_epochs=70, batch_size=32):
        X_train = [sentence for sentence in training_data['text']]
        y_train = [target for target in training_data['opinions']]
        callbacks = [
            keras.callbacks.ModelCheckpoint(
                './models/model.acc_{acc:.2f}.hdf5',
                monitor='acc', verbose=1, save_best_only=True, mode='auto'),
        ]
        history = self.model.fit(X_train, y_train, epochs=15, callbacks=callbacks, batch_size=32)

    def test(self, test_data):
        loss, acc = self.model.evaluate(test_data, verbose=2)
        print(f"Accuracy on the test data is {100*acc}%")

    def predict_single_input(self, text):

        sequence = self.tokenizer.texts_to_sequences([text])
        test = pad_sequences(sequence, maxlen=self.max_len)
        return self.combinations[np.around(self.model.predict(test), decimals=0).argmax(axis=1)[0]]

    def save_model(self, file_path):
        self.model.save(file_path)
