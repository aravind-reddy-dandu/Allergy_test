import os
import pandas as pd
import re
from flask import Flask, render_template, jsonify, request
import numpy as np

app = Flask(__name__)

file = os.path.join(app.root_path, 'static', 'allergyBoundelss.csv')
df = pd.read_csv(file)


@app.route('/')
def index():
    return render_template('Overview.html')


@app.route('/get_map_data/<index>', methods=['GET', 'POST'])
def getPlotData(index):
    index_no = index
    dfBar = df[df.plottype.eq('bargraph')]
    dfBar = dfBar.sort_values('id')
    try:
        dfDup = dfBar.iloc[int(index_no)]
    except IndexError:
        dfDup = dfBar.iloc[1]
    str = dfDup['data']
    str = dict(re.findall(r"\[(\S+)\s+\[*(.*?)\]+", str))
    new_str = []
    for i in str:
        each_data = {}
        each_data['heading'] = dfDup['first_attr']
        each_data['indexNo'] = int(dfDup['id'])
        each_data['slice'] = re.sub('\W+', ' ', dfDup['slice'])
        each_data['Attribute'] = i.replace('"', '').replace('[', '').replace(',', '').replace(']', '')
        each_data['value'] = str[i]
        new_str.append(each_data)
    return jsonify(new_str)


@app.route('/get_hist_data/<index>', methods=['GET', 'POST'])
def getHistData(index):
    index_no = index
    dfHist = df[df.plottype.eq('histogram')]
    dfHist = dfHist.sort_values('id')
    try:
        dfDup = dfHist.iloc[int(index_no)]
    except IndexError:
        dfDup = dfHist.iloc[1]
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
        eachData['heading'] = dfDup['first_attr']
        eachData['indexNo'] = int(dfDup['id'])
        eachData['slice'] = re.sub('\W+', ' ', dfDup['slice'])
        eachData['category'] = bins[index] + ' - \n' + bins[index + 1]
        eachData['value'] = hist[index]
        outPut.append(eachData)
    return jsonify(outPut)


if __name__ == '__main__':
    app.run(debug=True)
