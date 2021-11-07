from PredictionSystem import PredictionSystem
import sys
import argparse
import os


"""
Parse input arguments for training/testing/prediction and type of algorithm
"""

# Create parser
parser = argparse.ArgumentParser(description="Input arguments parser")

# Add arguments
parser.add_argument("-train", "--train",
                    action="store_true",
                    help="The argument that indicates the fact that data in the file is for training.")
parser.add_argument("-test", "--test",
                    action="store_true",
                    help="The argument that indicates the fact that data in the file is for testing.")
parser.add_argument("-predict", "--predict",
                    action="store_true",
                    help="The argument that indicates the fact that data in the file is for prediction.")
parser.add_argument("path",
                    metavar="path",
                    type=str,
                    help="Path to the file that contains data for training/testing/predicting.")
parser.add_argument("-NN", "-nn", "--NN",
                    action="store_true",
                    help="Algorithm type for training option.")
parser.add_argument("-layers", "-l", "--n_layers",
                    type=int,
                    help="The number of layers the neural network must have.")
parser.add_argument("-neurons", "-n", "--n_neurons",
                    nargs="*",
                    type=int,
                    default=[],
                    help="The number of neurons for each layer that the neural network must have.")

args = parser.parse_args()

options = [args.train, args.test, args.predict]
file_path = args.path
algorithm = [args.NN]
nr_layers = args.n_layers
nr_neurons = args.n_neurons

if not os.path.isfile(file_path):
    print("!!! Invalid file path !!!")
    sys.exit()
else:
    if any(options):
        if options[0] and algorithm[0] and nr_layers and nr_neurons:
            print("0")
        elif options[1]:
            print("1")
        elif options[2]:
            print("2")
        else:
            print("\n Some arguments are missing! Check out and run again... \n ...or enter 'main.py -h' to see the "
                  "full list of arguments you must have.")
    else:
        print(" ___ ")


# Example call
# >main.py -train "path/to/training_data_file" -nn -l 3 -n 5 5 5
# >main.py -test "path/to/testing_data_file"
# >main.py -predict "path/to/prediction_data_file"
