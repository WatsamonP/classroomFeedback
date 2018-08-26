from flask import Flask, request
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
from json import dumps
from flask_jsonpify import jsonify
from firebase import firebase
from firebase import jsonutil
from firebase.firebase import FirebaseApplication, FirebaseAuthentication

new_user = 'WCXhpMdPLgWwAAji5oWMjLEnnVe2'

firebase = firebase.FirebaseApplication('https://classroomfeedback-57c36.firebaseio.com', None)
#firebase = firebase.FirebaseApplication('https://classroomfeedback-57c36.firebaseio.com', authentication=None)
#result = firebase.get('/users', None)
#result = firebase.get('/users', None)
#{'1': 'John Doe', '2': 'Jane Doe'}
result = firebase.get('/users', None,
                 params={'print': 'pretty'},
                 headers={'X_FANCY_HEADER': 'very fancy'})

app = Flask(__name__)
api = Api(app)

CORS(app)

@app.route("/")
def hello():
    return jsonify(result)

class Employees(Resource):
    def get(self):
        return {'employees': [{'id':1, 'name':'Balram'},{'id':2, 'name':'Tom'}]} 

class Employees_Name(Resource):
    def get(self, employee_id):
        print('Employee id:' + employee_id)
        result = {'data': {'id':1, 'name':'Balram'}}
        return jsonify(result)       


api.add_resource(Employees, '/employees') # Route_1
api.add_resource(Employees_Name, '/employees/<employee_id>') # Route_3


if __name__ == '__main__':
   app.run(port=5002)