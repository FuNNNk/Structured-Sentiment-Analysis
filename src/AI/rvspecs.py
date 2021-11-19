from pythonrv import rv
from PreProcessor import PreProcessor
import mop_valid
import os


@rv.monitor(clean=mop_valid.clean_wrong_rows, validate=mop_valid.validate_json)
def spec_try_cleaning(event):
    if event.called_function == event.fn.validate:
        if len([old_ev for old_ev in event.history if old_ev.called_function == old_ev.fn.clean]) == 0:
            print("Starting clean from monitoring")
            df = mop_valid.clean_wrong_rows(event.fn.validate.args[0])
        assert len([old_ev for old_ev in event.history if old_ev.called_function == old_ev.fn.clean]) > 0


if __name__ == '__main__':
    df = mop_valid.read_df_from_json("Training data/train1.json")

    mop_valid.validate_json(df)
