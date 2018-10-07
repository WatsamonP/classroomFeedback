from flask import Flask, request
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
from json import dumps
from flask_jsonpify import jsonify
import json
import pyrebase
import deepcut
import stop


app = Flask(__name__)
api = Api(app)
CORS(app)

configfeed = {
    "apiKey": "AIzaSyCjWxtto3yAfu_OoM7RLBCH9i-SJt76lLM",
    "authDomain": "sut-feedback.firebaseapp.com",
    "databaseURL": "https://sut-feedback.firebaseio.com",
    "storageBucket": "sut-feedback.appspot.com",
}

configclass = {
  "apiKey": "AIzaSyB2dzuzgKVykU54B6ODJnqWCuRNdoENzkk",
  "authDomain": "sut-classroom.firebaseapp.com",
  "databaseURL": "https://sut-classroom.firebaseio.com",
  "storageBucket": "sut-classroom.appspot.com"
  #"apiKey": "AIzaSyB5M0bxNI8kj3enMyPAgaksUVXU8qrNa4M",
  #"authDomain": "classattendence-c4e10.firebaseapp.com",
  #"databaseURL": "https://classattendence-c4e10.firebaseio.com",
  #"storageBucket": "classattendence-c4e10.appspot.com"
}
test = {
  "apiKey": "AIzaSyASoxK5tz7VudMnMd9FL89841FxncG8pHA",
  "authDomain": "aaaaaaa-afb80.firebaseapp.com",
  "databaseURL": "https://aaaaaaa-afb80.firebaseio.com",
  "storageBucket": "aaaaaaa-afb80.appspot.com"
}
positive_word = ['สอนเข้าใจ','ไม่ยาก','ชอบ','สอนดี','น่าสนใจ','สอนสนุก','สนุก'
                 ,'เยี่ยม','ดี','เข้าใจ','เข้าใจดี']
negative_word = ['ง่วง','สอนเร็ว','สอบยาก','ข้อสอบยาก','เสียงเบา','พูดเสียงเบา','จดไม่ทัน'
                 ,'พูดเร็ว','ไม่ค่อยเข้าใจ','งานเยอะ','ปล่อยช้า','ไม่เข้าใจ','ยาก']

@app.route("/")
def hello():
    return jsonify({'text':'Hello World!'})

@app.route('/start', methods=['POST'])
def getrequest():
    data = json.loads(request.data.decode())
    print(data)
    #firebase = pyrebase.initialize_app(configfeed)
    #db = firebase.database()
    firebase2 = pyrebase.initialize_app(configclass)
    db2 = firebase2.database()
    word = deepcut.tokenize(data["comment"], custom_dict='C:/custom_dict.txt')
    cut = [w for w in word if not w in stop.stopword]
    
    poscount = 0
    negcount = 0
    for y in cut:
        for pos in positive_word:
            if y == pos:
                poscount += 1
        for neg in negative_word:
            if y == neg:
                negcount += 1
                

    if(poscount > negcount):
        label = "positive"
    elif(negcount > poscount):
        label = "negative"
    else:
        label = "neutral"
        

    length = db2.child("users").child(data["uid"]).child("course").child(data["cid"]).child("Feedback").child(data["attendanceId"]).get()
    insert = json.dumps({'date': data["date"], 'comment': data["comment"], 'feeling': data["feeling"], 'classLabel': label, 'cut': cut}, ensure_ascii=False)
    if length.val() == None:
        pointer = 0
    else:
        pointer = len(length.val())
    print(json.loads(insert))
    db2.child("users").child(data["uid"]).child("course").child(data["cid"]).child("Feedback").child(data["attendanceId"]).child(pointer).set(json.loads(insert))
    return 'ok'


if __name__ == '__main__':
    app.run()



