from fugashi import Tagger

tagger = Tagger('-Owakati')

def segment_text(text):
    return tagger.parse(text).split()

if __name__ == '__main__':
    import sys
    text = sys.argv[1] if len(sys.argv) > 1 else ''
    segmented_text = segment_text(text)
    print(" ".join(segmented_text))