from PredictionSystem import PredictionSystem
import source_target
import sys
import argparse
import os
import json

"""
Parse input arguments for prediction and type of algorithm
"""

# Create parser
parser = argparse.ArgumentParser(description="Input arguments parser")

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
parser.add_argument("-REG", "-reg", "--REG",
                    action="store_true",
                    help="Algorithm type for training option.")

args = parser.parse_args()

options = [args.predict]
file_path = args.path
algorithm = [args.NN, args.REG]

if not os.path.isfile(file_path):
    print("!!! Invalid file path !!!")
    sys.exit()
else:
    if any(options):
        if options[0] and algorithm[0]:  # Predict with a neural network
            prediction_system = PredictionSystem('NN')

        if options[0] and algorithm[1]:  # Predict with regression
            prediction_system = PredictionSystem('REG')

        list_of_sentences = source_target.get_test_sentences(file_path)
        list_of_outputs = []
        for sentence in list_of_sentences:
            prediction = prediction_system.predict_text(sentence)
            output = {
                    # "sent_id": file_path,
                    "text": sentence,
                    "opinions": prediction
            }
            print(output, '\n\n')
            list_of_outputs.append(output)

        with open(file_path.replace('.txt', '.json'), 'w') as output_file:
            json.dump(list_of_outputs, output_file)

    else:
        print("\n Some arguments are missing! Check out and run again... \n ...or enter 'main.py -h' to see the "
              "full list of arguments you must have.")


# Example call
# [python or path/to/python/executable] main.py -nn -predict path/to/plainText_file
