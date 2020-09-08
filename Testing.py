import os
import pandas as pd
import re
import numpy as np
from flask import Flask, render_template, jsonify, request

file = 'D:/Study/Tomatz/allergyBoundelss.csv'
df = pd.read_csv(file)
df = df[df.plottype.eq('histogram')]
df = df.sort_values('id')


def getHistData(index):
    index_no = index
    try:
        dfDup = df.iloc[int(index_no)]
    except IndexError:
        dfDup = df.iloc[1]
    str = dfDup['data']
    str = re.findall(r"(\[(?:\[??[^\[]*?\]))", str)
    str = str[0].replace('[', '').replace(']', '').split(',')
    str = np.array(str).astype(np.float)
    hist, bins = np.histogram(str, bins=10)
    hist = hist.tolist()
    bins = bins.tolist()
    bins = ['%.2f' % elem for elem in bins]
    outPut = []
    for index, obj in enumerate(hist):
        eachData = {}
        eachData['category'] = bins[index] + ' to '+ bins[index+1]
        eachData['value'] = hist[index]
        outPut.append(eachData)
    print('')


getHistData(2)
