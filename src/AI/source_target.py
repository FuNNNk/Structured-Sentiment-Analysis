import json
import spacy

nlp = spacy.load('en_core_web_sm')

SUBJECTS = ["nsubj", "nsubjpass", "csubj", "csubjpass", "agent", "expl"]
OBJECTS = ["dobj", "dative", "attr", "oprd", "pobj", "npadvmod"]
ADJECTIVES = ["acomp", "advcl", "advmod", "amod", "appos", "nn", "nmod", "ccomp", "complm",
              "hmod", "infmod", "xcomp", "rcmod", "poss", " possessive"]
COMPOUNDS = ["compound"]
PREPOSITIONS = ["prep"]
AUX_VERBS = ["was", "is", "am", "were", "are", "have", "has", "had", "been"]
DETERMINERS = ["determiner"]


def getSubsFromConjunctions(subs):
    moreSubs = []
    for sub in subs:
        rights = list(sub.rights)
        rightDeps = {tok.lower_ for tok in rights}
        if "and" in rightDeps:
            moreSubs.extend([tok for tok in rights if tok.dep_ in SUBJECTS or tok.pos_ == "NOUN"])
            if len(moreSubs) > 0:
                moreSubs.extend(getSubsFromConjunctions(moreSubs))
    return moreSubs


def getObjsFromConjunctions(objs):
    moreObjs = []
    for obj in objs:
        rights = list(obj.rights)
        rightDeps = {tok.lower_ for tok in rights}
        if "and" in rightDeps:
            moreObjs.extend([tok for tok in rights if tok.dep_ in OBJECTS or tok.pos_ == "NOUN"])
            if len(moreObjs) > 0:
                moreObjs.extend(getObjsFromConjunctions(moreObjs))
    return moreObjs


def findSubs(tok):
    head = tok.head
    while head.pos_ != "VERB" and head.pos_ != "NOUN" and head.head != head:
        head = head.head
    if head.pos_ == "VERB":
        subs = [tok for tok in head.lefts if tok.dep_ == "SUB"]
        if len(subs) > 0:
            verbNegated = isNegated(head)
            subs.extend(getSubsFromConjunctions(subs))
            return subs, verbNegated
        elif head.head != head:
            return findSubs(head)
    elif head.pos_ == "NOUN":
        return [head], isNegated(tok)
    return [], False


def isNegated(tok):
    negations = {"no", "not", "n't", "never", "none"}
    for dep in list(tok.lefts) + list(tok.rights):
        if dep.lower_ in negations:
            return True
    return False


def getObjsFromPrepositions(deps):
    objs = []
    for dep in deps:
        if dep.pos_ == "ADP" and dep.dep_ == "prep":
            objs.extend(
                [tok for tok in dep.rights if tok.dep_ in OBJECTS or (tok.pos_ == "PRON" and tok.lower_ == "me")])
    return objs


def getObjFromXComp(deps):
    for dep in deps:
        if dep.pos_ == "VERB" and dep.dep_ == "xcomp":
            v = dep
            rights = list(v.rights)
            objs = [tok for tok in rights if tok.dep_ in OBJECTS]
            objs.extend(getObjsFromPrepositions(rights))
            if len(objs) > 0:
                return v, objs
    return None, None


def getAllSubs(v):
    verbNegated = isNegated(v)
    subs = [tok for tok in v.lefts if tok.dep_ in SUBJECTS and tok.pos_ != "DET"]
    if len(subs) > 0:
        subs.extend(getSubsFromConjunctions(subs))
    else:
        foundSubs, verbNegated = findSubs(v)
        subs.extend(foundSubs)

    return subs, verbNegated


def getAllObjsWithAdjectives(v):
    rights = list(v.rights)
    rights_children = rights
    for i in rights:
        rights_children.extend(list(i.rights))

    objs = []
    for tok in rights_children:
        if tok.dep_ in OBJECTS:
            objs.append(tok)

    lefts = list(v.lefts)
    if len(objs) == 0:
        objs = [tok for tok in rights if tok.dep_ in OBJECTS]
    if len(objs) == 0:
        objs = [tok for tok in lefts if tok.dep_ in OBJECTS]

    potentialNewVerb, potentialNewObjs = getObjFromXComp(rights)
    if potentialNewVerb is not None and potentialNewObjs is not None and len(potentialNewObjs) > 0:
        objs.extend(potentialNewObjs)
        v = potentialNewVerb
    if len(objs) > 0:
        objs.extend(getObjsFromConjunctions(objs))
    return v, objs


def source_target_extraction(tokens):
    source_target_list = []
    verbs = [tok for tok in tokens if (tok.pos_ == "VERB" or tok.text in AUX_VERBS) and tok.dep_ != "aux"]
    # print(f'verbs: {verbs}')
    if len(verbs) == 0:
        nouns = [tok for tok in tokens if tok.pos_ == "NOUN" and tok.dep_ != "aux"]
        # print(f'nouns: {nouns}')
        for i in range(len(nouns)):
            adjectives = [tok for tok in list(nouns[i].lefts) if tok.pos_ == "ADJ"]
            if len(adjectives) == 0:
                adjectives = [tok for tok in list(nouns[i].rights) if tok.pos_ == "ADJ"]
            if len(adjectives) == 0:
                adjectives = [tok for tok in tokens if tok.pos_ == "ADJ"]
            # print(f"adjectives: {adjectives}")
            conjs = [tok for tok in list(nouns[i].rights) if tok.pos_ == "CCONJ"]
            # print(f"conjs: {conjs}")
            compound = " ".join(str(tok) for tok in generate_sub_compound(nouns[i]))
            if adjectives and not conjs:
                count = 0
                for s in source_target_list:
                    for t in s:
                        if compound in t:
                            count += 1
                if count == 0:
                    source_target_list.append(("Source: ",
                                               f"Target: {compound}"))
            elif adjectives and conjs:
                source_target_list.append(("Source: ",
                                           f"Target: {nouns[i]}"))
                source_target_list.append(("Source: ",
                                           f"Target: {nouns[i + 1]}"))
    else:
        flag = False
        for v in verbs:
            objects = [tok for tok in list(v.lefts) if
                       ((tok.pos_ == "NOUN" or tok.pos_ == "PRON") and tok.dep_ == "nsubj")]
            for i in range(len(objects)):
                compound = " ".join(str(tok) for tok in generate_sub_compound(objects[i]))
                if len(compound) > len(objects[i]):
                    objects[i] = compound
            # print(f'objects: {objects}')
            adjectives = [tok for tok in list(v.rights) if tok.pos_ == "ADJ"]
            # print(f'adjectives: {adjectives}')
            if len(objects) != 0:
                if len(adjectives) != 0:
                    source_target_list.append(("Source: ",
                                               f"Target: {objects[0]}"))
                    flag = True
                else:
                    for i in range(len(tokens)):
                        if tokens[i] == v:
                            j = i + 1
                            count = 0
                            while j < len(tokens):
                                if tokens[j].pos_ == "ADJ" and count < 1:
                                    adjectives.extend(tokens[j].text)
                                j += 1
                                count += 1
                            if adjectives:
                                source_target_list.append(("Source: ",
                                                           f"Target: {objects[0]}"))
                                flag = True
            subs, verbNegated = getAllSubs(v)
            # print(f'FLAG: {flag}')
            # print(f'subs: {subs}')
            if len(subs) > 0 and flag is False:
                v, objs = getAllObjsWithAdjectives(v)
                # print(f'objs: {objs}')
                for sub in subs:
                    if len(objs) != 0:
                        for obj in objs:
                            obj_desc_tokens = generate_left_right_adjectives(obj)
                            sub_compound = generate_sub_compound(sub)
                            if "passive" in spacy.explain(sub.dep_):
                                source_target_list.append(("Source: " + " ".join(str(tok) for tok in obj_desc_tokens),
                                                           "Target: " + " ".join(str(tok) for tok in sub_compound)))
                                break
                            elif "adverbial modifier" in spacy.explain(
                                    obj.dep_) and "adjectival modifier" in spacy.explain(list(obj.lefts)[0].dep_):
                                source_target_list.append(("Source: ",
                                                           "Target: " + " ".join(str(tok) for tok in obj_desc_tokens)))
                                break
                            elif "adverbial modifier" in spacy.explain(obj.dep_):
                                source_target_list.append(("Source: " + " ".join(str(tok) for tok in sub_compound),
                                                           "Target: "))
                                break
                            else:
                                source_target_list.append(("Source: " + " ".join(str(tok) for tok in sub_compound),
                                                           "Target: " + " ".join(str(tok) for tok in obj_desc_tokens)))
                                break

                    else:
                        sub_compound = generate_sub_compound(sub)
                        if "passive" in spacy.explain(sub.dep_):
                            source_target_list.append(("Source: ",
                                                       "Target: " + " ".join(str(tok) for tok in sub_compound)))
                        else:
                            source_target_list.append(("Source: " + " ".join(str(tok) for tok in sub_compound),
                                                       "Target: "))
    return source_target_list


def generate_sub_compound(sub):
    sub_compunds = []
    for tok in sub.lefts:
        if tok.dep_ in COMPOUNDS or tok.pos_ == "DET" or tok.dep_ in "possession modifier":
            sub_compunds.extend(generate_sub_compound(tok))
    sub_compunds.append(sub)
    for tok in sub.rights:
        if tok.dep_ in COMPOUNDS:
            sub_compunds.extend(generate_sub_compound(tok))
    return sub_compunds


def generate_left_right_adjectives(obj):
    obj_desc_tokens = []
    for tok in obj.lefts:
        # if tok.pos_ == "DET" or tok.dep_ in "possession modifier":
        if tok.dep_ in ADJECTIVES or tok.pos_ == "DET" or tok.dep_ in "possession modifier":
            obj_desc_tokens.extend(generate_left_right_adjectives(tok))
    obj_desc_tokens.append(obj)

    for tok in obj.rights:
        # if tok.dep_ in ADJECTIVES:
        obj_desc_tokens.extend(generate_left_right_adjectives(tok))
    return obj_desc_tokens


def get_position(sentence, expression):
    length = len(expression)
    index = sentence.find(expression)
    if length != 0:
        return [f"{index}:{index + length}"]
    else:
        return []


def get_test_sentences(file):
    sent_array = []
    sentences_file = open(file, 'r')
    lines = sentences_file.readlines()
    for line in lines:
        sent_array.append(line[:-1])
    return sent_array


# sentences = get_test_sentences('sentences.txt')
# counter = 0
# parsed_sentences = []


def json_file_parser(file):
    with open(file) as f:
        load_file = json.load(f)
    texts_from_file = []
    for dic in load_file:
        texts_from_file.append(dic["text"])
    return texts_from_file


def write_list_into_file(list_of_sentences):
    textfile = open("sentences2.txt", "ab")
    for element in list_of_sentences:
        textfile.write(element.encode("UTF-8") + " ".encode("UTF-8") + '\n'.encode('UTF-8'))
    textfile.close()


# sentence_list = json_file_parser('./Training data/train1.json')
# write_list_into_file(sentence_list)


def return_output(sentence):
    p_sentence = nlp(sentence)
    # parsed_sentences.append(p_sentence)
    source_target = source_target_extraction(p_sentence)
    positions_list = []
    for item in source_target:
        source = item[0][8::]
        target = item[1][8::]
        positions_list.append(get_position(sentence, source))
        positions_list.append(get_position(sentence, target))
    return source_target, positions_list


def print_all_sentences(sentences_list):
    count = 0
    for sent in sentences_list:
        print(count)
        print(return_output(sent))
        print('\n')
        count += 1


# print(print_all_sentences(sentences))
# print(return_output("Donald Trump is the worst president of USA, but Hillary is better than him."))
