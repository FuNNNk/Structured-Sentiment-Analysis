from Singleton import Singleton


# Singleton
class PreProcessor(metaclass=Singleton):

    def __init__(self, text=None):
        if text != None:
           self.text = self.pre_process_input(text)
        else:
            self.text = None

    def pre_process_input(self, text):
        text = self._tokenize(text)
        text = self._to_lowercase(text)
        text = self._remove_stop_words(text)
        text = self._stem_text(text)
        return text

    def _tokenize(self, text):
        return None

    def _to_lowercase(self, text):
        return None

    def _remove_stop_words(self, text):
        return None

    def _stem_text(self, text):
        return None