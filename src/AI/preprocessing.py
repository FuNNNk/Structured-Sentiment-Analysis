import nltk
import sys
# nltk.download('punkt')
import stanza
from nltk.corpus import stopwords
from nltk.corpus import wordnet as wn
from nltk.corpus import sentiwordnet as swn
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import sent_tokenize, word_tokenize


def tokenization(text):
    return word_tokenize(text)


def penn_to_wn(tag):
    """
    Convert between the PennTreebank tags to simple Wordnet tags
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


lemmatizer = WordNetLemmatizer()


def get_sentiment(word, tag):
    """
    Returns list of pos neg and objective score. But returns empty list if not present in senti wordnet.
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


adjectives = ('JJ', 'JJB', 'JJR', 'JJS')
verbs = ('VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ', 'MD', 'TO')
adverbs = ('RB', 'RBR', 'RBS')


def polar_expression_extraction(text):
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
        print((word, tag), get_sentiment(word, tag), pos_neg(word, tag))
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
                # expression = senti_list[index]["Word"] + " " + expression
                expression = f'{senti_list[index]["Word"]} {expression}'
                polar_expressions.append(expression)
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
                    polar_expressions.append(expression)
            if senti_list[i-1]["POS"] == "MD":
                print(senti_list[i-1]["Word"])
                expression = senti_list[i-1]["Word"] + " "
                while senti_list[i]["POS"] in verbs or senti_list[i]["POS"] in adverbs:
                    expression += senti_list[i]["Word"] + " "
                    i += 1
                if expression != "":
                    polar_expressions.append(expression)
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
                # else:
                #     i += 1
                if len(expression) > len(senti_list[index]["Word"]) + 1:
                    if senti_list[i]["POS"] in adjectives and senti_list[i-1]["POS"] in adverbs:
                        polar_expressions.append(expression + senti_list[i]["Word"])
                        i += 1
                    else:
                        polar_expressions.append(expression)
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

t = "Even though the price is decent for Paris, I would not recommend this hotel."
s = "Good muffins cost $3.88 in New York. Please buy me two of them. Thanks."

t1 = "We will surely visit it again next summer !"
t2 = "Good value for money"
t3 = "Would recommend when in transit ."
t4 = "I enjoyed the central location ; it was very near to the Barcelona's main touristic street La Rambla ."
t5 = "Best hotel we have been to !"
t6 = "The hotel was a little bit shabby on first appearances but the room was absolutely fine !"
t7 = "It is beautifully painful to watch you."
t8 = "Bar staff is friendly ( probably students ) ."
t9 = "The hotel is very very very very very very very excellent ."
t10 = "Very comfortable bed and room with sea views ."
t11 = "Very nice hotel with good wellness facilities. the hotel is just a 15min walk from the city center ."
t12 = "Spacious room and modern style ( not old like in other polish hotel )"
t13 = "Staff well prepared and kind ."
t14 = "Spoiled the impression of the trip"


def main(args):
    # print(args[1])
    sent_array = get_test_sentences(args[1]+"\\"+args[2])
    with open(args[1]+ "\\" + args[2] + "_result", 'w') as fileNew:
        fileNew.write(str(polar_expression_extraction(sent_array[0])))


if __name__ == "__main__":
    main(sys.argv)

# print(polar_expression_extraction(t10), "\n")
# print(polar_expression_extraction(t11), "\n")
# print(polar_expression_extraction(t12), "\n")
# print(polar_expression_extraction(t13), "\n")
# print(polar_expression_extraction(t14), "\n")

# print(polar_expression_extraction(t),  "\n")
# print(polar_expression_extraction(s),  "\n")
# print(polar_expression_extraction(t1), "\n")
# print(polar_expression_extraction(t2), "\n")
# print(polar_expression_extraction(t3), "\n")
# print(polar_expression_extraction(t4), "\n")
# print(polar_expression_extraction(t5), "\n")
# print(polar_expression_extraction(t7), "\n")
# print(polar_expression_extraction(t8), "\n")
# print(polar_expression_extraction(t9), "\n")





#####   Stanza for POS tagging   #####
# nlp = stanza.Pipeline(lang='en', processors='tokenize,pos')
# doc = nlp(text)
# print(doc.sentences[0].words[0].xpos)
# print(*[f'word: {word.text}\tupos: {word.upos}\txpos: {word.xpos}\tfeats: {word.feats if word.feats else "_"}' for sent in doc.sentences for word in sent.words], sep='\n')


#####   Stanza for sentence tokenization   #####
# sentence_tokenize = [word_tokenize(t) for t in sent_tokenize(s)]
# print(sentence_tokenize)
#
# nlp = stanza.Pipeline(lang='en', processors='tokenize')
# doc = nlp(text)
# print([sentence.text for sentence in doc.sentences])
