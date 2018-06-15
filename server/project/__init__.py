from flask import Flask, jsonify, request, redirect
from flask_socketio import SocketIO, send, emit
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime

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

# @app.route('/messages')
# def messages_index():
#     if('only_new' in request.args and request.args['only_new'] == 'true'):
#         last_login_time = User.query.get(1).last_login
#         messages = Message.query.filter(Message.created > last_login_time)
#         result = { 'data': { 'messages': [{ 'id': msg.id, 'author': msg.user.username, 'content': msg.content, 'date': msg.created.__str__() } for msg in messages ]}}
#         return jsonify(result)
    
#     offset = 0
#     if('offset' in request.args and request.args['offset'] != '0'):
#         offset = int(request.args['offset'])
#     messages = Message.query.offset(offset).limit(10)
#     result = { 'data': { 'messages': [{ 'id': msg.id, 'author': msg.user.username, 'content': msg.content, 'date': msg.created.__str__() } for msg in messages ]}}
#     return jsonify(result)

@socketio.on('connect')
def handle_connect():
    messages = Message.query.order_by( Message.id.desc() ).limit(10)[::-1]
    result = { 'data': { 'messages': [{ 'id': msg.id, 'author': msg.user.username, 'content': msg.content, 'date': msg.created.__str__() } for msg in messages ]}}
    emit('connected', result)

@socketio.on('messages-request')
def handle_messages_request(req, user):
    if('only_new' in req and req['only_new'] == True):
        from IPython import embed; embed()
        last_login_time = User.query.filter_by(username = user).first().last_login
        messages = Message.query.filter(Message.created > last_login_time)
        result = { 'data': { 'messages': [{ 'id': msg.id, 'author': msg.user.username, 'content': msg.content, 'date': msg.created.__str__() } for msg in messages ]}}
        from IPython import embed; embed()
        emit('new-messages-to-front', result)
    
    offset = 0
    if('offset' in req and req['offset'] != '0'):
        offset = int(req['offset'])
    messages = Message.query.offset(offset).limit(10)[::-1]
    result = { 'data': { 'messages': [{ 'id': msg.id, 'author': msg.user.username, 'content': msg.content, 'date': msg.created.__str__() } for msg in messages ]}}
    emit('old-messages-to-front', result)

@socketio.on('message-to-back')
def handle_message(msg, user):
    user_id = User.query.filter(User.username == user).first().id
    new_message = Message(content = msg, user_id = user_id)
    db.session.add(new_message)
    db.session.commit()
    messages = Message.query.filter_by( user_id = user_id ).order_by( Message.id.desc() ).limit(1)
    result = { 'data': { 'messages': [{ 'id': msg.id, 'author': msg.user.username, 'content': msg.content, 'date': msg.created.__str__() } for msg in messages ]}}
    emit('message-to-front', result, broadcast = True)

@socketio.on('post_message')
def handle_message():
    pass
    # if a message comes in & it is from a valid user
    # query the db for the userId and write the msg in the db 
    # broadcast the message to all the users connected to the socket server

@socketio.on('disconnect')
def handle_disconnect():
    user = User.query.get(1)
    user.last_login = datetime.now()
    db.session.add(user)
    db.session.commit()

if __name__ == '__main__':
    socketio.run(app)