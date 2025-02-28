from fugashi import Tagger
import pykakasi

tagger = Tagger('-Owakati')
kks = pykakasi.kakasi()

def segmentText(text):
    tokenList = []
    for token in tagger(text):
        pronunciation = token.feature.pron
        if pronunciation:
            pronunciation = kks.convert(token.feature.pron)[0]['hira']
        tokenList.append([token.surface, pronunciation])

    return tokenList

if __name__ == '__main__':
    import sys
    text = sys.argv[1] if len(sys.argv) > 1 else 'no text passed'
    # text = "私はPythonが好きです。"
    segmentedText = segmentText(text)
    print(segmentedText)

