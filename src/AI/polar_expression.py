import nltk
from nltk.corpus import wordnet as wn
from nltk.corpus import sentiwordnet as swn
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize


lemmatizer = WordNetLemmatizer()

adjectives = ('JJ', 'JJB', 'JJR', 'JJS')
verbs = ('VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ', 'MD', 'TO')
adverbs = ('RB', 'RBR', 'RBS')


def tokenization(text):
    return word_tokenize(text)


def penn_to_wn(tag):
    """
    Convert the PennTreebank tags to simple Wordnet tags
    """

    if tag.startswith('J'):
        return wn.ADJ
    elif tag.startswith('N'):
        return wn.NOUN
    elif tag.startswith('R'):
        return wn.ADV
    elif tag.startswith('V'):
        return wn.VERB

    return None


def get_sentiment(word, tag):
    """
    :param word: a string
    :param tag: word's Part-of-speech tag
    :return: a list of positive, negative and objective score, if "word" is present in SentiWordNet,
             otherwise returns an empty list
    """

    wn_tag = penn_to_wn(tag)
    if wn_tag not in (wn.NOUN, wn.ADJ, wn.ADV, wn.VERB):
        return []

    lemma = lemmatizer.lemmatize(word, pos=wn_tag)
    if not lemma:
        return []

    synsets = wn.synsets(word, pos=wn_tag)
    if not synsets:
        return []

    # Take the first sense, the most common
    synset = synsets[0]
    swn_synset = swn.senti_synset(synset.name())

    return [swn_synset.pos_score(), swn_synset.neg_score(), swn_synset.obj_score()]


def pos_neg(word, tag):
    sentiment = get_sentiment(word, tag)
    if len(sentiment) > 0:
        max_sent = max(sentiment[0], sentiment[1])
        max_index = sentiment.index(max_sent)
        if max_sent != 0:
            if max_index == 0:
                return 2
            if max_index == 1:
                return -2
        else:
            return 1
    else:
        return 1


def polar_expression_extraction(text):
    """
    :param text: a string
    :return: a list of polar expressions that are found in "text"
    """

    tokenized_text = tokenization(text)
    pos_vals = nltk.pos_tag(tokenized_text)
    senti_list = []
    for (word, tag) in pos_vals:
        senti_list.append({
            "Word": word,
            "POS": tag,
            "Pol-Scores": get_sentiment(word, tag),
            "Polarity": pos_neg(word, tag)
        })
        # print((word, tag), get_sentiment(word, tag), pos_neg(word, tag))
    polar_expressions = []
    i = 0
    while i < len(senti_list):
        expression = ""
        if senti_list[i]["POS"] == "MD":
            index = i
            i += 1
            while senti_list[i]["POS"] in verbs or senti_list[i]["POS"] in adverbs:
                expression += senti_list[i]["Word"] + " "
                i += 1
            if expression != "":
                expression = f'{senti_list[index]["Word"]} {expression}'
                polar_expressions.append(expression.strip())
        elif senti_list[i]["Polarity"] != 1:
            if senti_list[i]["POS"] in adjectives:
                polar_expressions.append(senti_list[i]["Word"])
                i += 1
            if senti_list[i]["POS"] in adverbs:
                adv_index = i
                expression = senti_list[i]["Word"] + " "
                i += 1
                while senti_list[i]["POS"] in adjectives:
                    expression += senti_list[i]["Word"] + " "
                    i += 1
                if len(expression) > len(senti_list[adv_index]["Word"]) + 1:
                    polar_expressions.append(expression.strip())
            if senti_list[i - 1]["POS"] == "MD":
                expression = senti_list[i - 1]["Word"] + " "
                while senti_list[i]["POS"] in verbs or senti_list[i]["POS"] in adverbs:
                    expression += senti_list[i]["Word"] + " "
                    i += 1
                if expression != "":
                    polar_expressions.append(expression.strip())
            if senti_list[i]["POS"] in verbs:
                sentiment_ratings = get_sentiment(senti_list[i]["Word"], senti_list[i]["POS"])
                diff = abs(sentiment_ratings[0] - sentiment_ratings[1])
                if diff >= 0.3:
                    polar_expressions.append(senti_list[i]["Word"])
            if senti_list[i]["POS"] in verbs or senti_list[i]["POS"] in adverbs:
                index = i
                while senti_list[i]["POS"] in verbs or senti_list[i]["POS"] in adverbs:
                    expression += senti_list[i]["Word"] + " "
                    i += 1
                if len(expression) > len(senti_list[index]["Word"]) + 1:
                    if senti_list[i]["POS"] in adjectives and senti_list[i - 1]["POS"] in adverbs:
                        polar_expressions.append(expression + senti_list[i]["Word"])
                        i += 1
                    else:
                        polar_expressions.append(expression.strip())
            else:
                i += 1
        else:
            i += 1
    return polar_expressions


def get_test_sentences(file):
    sent_array = []
    sentences_file = open(file, 'r')
    lines = sentences_file.readlines()
    for line in lines:
        sent_array.append(line[:-1])
    return sent_array


# print(polar_expression_extraction("Donald Trump is the worst president of USA, but Hillary is better than him."))
