from flask import Flask, jsonify, request, redirect
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://localhost/chat-app'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = 'temporary dev key'

db = SQLAlchemy(app)
migrate = Migrate(app, db)

socketio = SocketIO(app)

from . import models
from project.models import User, Message

@app.route('/')
def root():
    return redirect('http://www.google.com')

@app.route('/login', methods = ['POST'])
def login():
    pass

@app.route('/messages')
def messages_index():
    if('only_new' in request.args and request.args['only_new'] == 'true'):
        last_login_time = User.query.get(1).last_login
        messages = Message.query.filter(Message.created > last_login_time)
        result = { 'data': { 'messages': [{ 'id': msg.id, 'content': msg.content, 'date': msg.created } for msg in messages ]}}
        return jsonify(result)
    
    offset = 0
    if('offset' in request.args and request.args['offset'] != '0'):
        offset = int(request.args['offset'])
    messages = Message.query.offset(offset).limit(10)
    result = { 'data': { 'messages': [{ 'id': msg.id, 'content': msg.content, 'date': msg.created } for msg in messages ]}}
    return jsonify(result)

if __name__ == '__main__':
    socketio.run(app)