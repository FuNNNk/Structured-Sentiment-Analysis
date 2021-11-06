from PredictionSystem import PredictionSystem
import sys


def main(argv):
    """
    Parse input arguments for training/testing/predicting and type of algorithm
    """

    predictor = PredictionSystem('NN')


if __name__ == '__main__':
    main(sys.argv[1:])

# Example call
"python AI/main.py train -p \"path/to/training_data.json\" -a NN -l 3 -shape 5,5,5"

