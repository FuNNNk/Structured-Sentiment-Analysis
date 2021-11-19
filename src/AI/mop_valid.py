import json

official_columns = ["sent_id", "text", "opinions"]
opinions_columns = ["Source", "Target", "Polar_expression", "Polarity", "Intensity"]
polarity_possible_values = ["Positive", "Negative", "Neutral"]
intensity_possible_values = ['Standard', 'Strong', 'Weak']


def clean_wrong_rows(df):
    print("Cleaning data..")

    for i in range(len(df)):
        if set(official_columns) != set(df[i].keys()) or not df[i]["opinions"]:
            df.remove(i)
        else:
            for opinion in df[i]["opinions"]:
                if set(opinions_columns) != set(opinion.keys()):
                    df.remove(i)
                elif opinion["Intensity"] not in intensity_possible_values:
                    df.remove(i)
                elif opinion["Polarity"] not in polarity_possible_values:
                    df.remove(i)
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
        print(load_file)