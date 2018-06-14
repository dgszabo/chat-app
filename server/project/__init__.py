from flask import Flask, jsonify, request, redirect
from flask_socketio import SocketIO, send, emit
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

@app.route('/login', methods = ['POST'])
def login():
    pass
    # may need flask-login for this
    # may have to add rolled auth wrapper instead of @login_required to the socketio routes
    # read in the username from the form sent by JS
    # if not in DB, add to DB, otherwise read from DB

@app.route('/messages')
def messages_index():
    if('only_new' in request.args and request.args['only_new'] == 'true'):
        last_login_time = User.query.get(1).last_login
        messages = Message.query.filter(Message.created > last_login_time)
        result = { 'data': { 'messages': [{ 'id': msg.id, 'author': msg.user.username, 'content': msg.content, 'date': msg.created } for msg in messages ]}}
        return jsonify(result)
    
    offset = 0
    if('offset' in request.args and request.args['offset'] != '0'):
        offset = int(request.args['offset'])
    messages = Message.query.offset(offset).limit(10)
    result = { 'data': { 'messages': [{ 'id': msg.id, 'author': msg.user.username, 'content': msg.content, 'date': msg.created } for msg in messages ]}}
    return jsonify(result)

@socketio.on('connect')
def handle_connect():
    messages = Message.query.all()
    result = { 'data': { 'messages': [{ 'id': msg.id, 'author': msg.user.username, 'content': msg.content } for msg in messages ]}}
    emit('connected', result)

@socketio.on('ping-push')
def handle_ping():
    messages = Message.query.limit(1)
    result = { 'data': { 'messages': [{ 'id': msg.id, 'author': msg.user.username, 'content': msg.content } for msg in messages ]}}
    emit('message_received', result, broadcast = True)

@socketio.on('post_message')
def handle_message():
    pass
    # if a message comes in & it is from a valid user
    # query the db for the userId and write the msg in the db 
    # broadcast the message to all the users connected to the socket server

@socketio.on('disconnect')
def handle_disconnect():
    pass

if __name__ == '__main__':
    socketio.run(app)