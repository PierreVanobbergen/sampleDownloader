from os import path, listdir, remove, sep, getcwd
import pydub
import sys
import re

dirPath = sys.argv[1]
files = listdir(dirPath)

for f in files:
    dst = f[0:-4] + '.wav'
    sound = pydub.AudioSegment.from_mp3(getcwd() + sep + dirPath + sep + f)
    sound.export(dirPath + sep + dst, format="wav")
    remove(dirPath + sep + f)
