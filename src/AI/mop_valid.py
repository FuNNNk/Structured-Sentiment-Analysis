import json

official_columns = ["sent_id", "text", "opinions"]
opinions_columns = ["Source", "Target", "Polar_expression", "Polarity", "Intensity"]
polarity_possible_values = ["Positive", "Negative", "Neutral"]
intensity_possible_values = ['Standard', 'Strong', 'Weak']


def clean_wrong_rows(df):
    print("Cleaning data..")

    for element in df:
        if set(official_columns) != set(element.keys()) or not element["opinions"]:
            df.remove(element)
        else:
            for opinion in element["opinions"]:
                if set(opinions_columns) != set(opinion.keys()):
                    df.remove(element)
                elif opinion["Intensity"] not in intensity_possible_values:
                    df.remove(element)
                elif opinion["Polarity"] not in polarity_possible_values:
                    df.remove(element)
    return df


def validate_json(df):
    print("Validating data..")

    for item in df:
        if set(official_columns) != set(item.keys()):
            return False
        if not item["opinions"]:
            return False
        else:
            for opinion in item["opinions"]:
                if set(opinions_columns) != set(opinion.keys()):
                    return False
                if opinion["Intensity"] not in intensity_possible_values:
                    return False
                if opinion["Polarity"] not in polarity_possible_values:
                    return False
    return True


def read_df_from_json(file_path):
    with open(file_path) as f:
        load_file = json.load(f)
    return load_file
