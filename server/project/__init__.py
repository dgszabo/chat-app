from flask import Flask, jsonify, request, redirect, session
import functools
from flask_socketio import SocketIO, send, emit, disconnect
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

def logged_in_only(func):
    @functools.wraps(func)
    def wrapped(*args, **kwargs):
        if not 'username' in session:
            disconnect()
        else:
            return func(*args, **kwargs)
    return wrapped

@socketio.on('login')
def handle_login(req):
    user = User.query.filter(User.username == req['username']).first()
    if(not user):
        new_user = User(username = req['username'])
        db.session.add(new_user)
        db.session.commit()
        user = User.query.filter(User.username == req['username']).first()
    session['user_id'] = user.id
    session['username'] = user.username
    result = { 'data': { 'username': session['username'] } }
    emit('logged-in', result)

@socketio.on('messages-request')
@logged_in_only
def handle_messages_request(req):
    if('only_new' in req and req['only_new'] == True):
        last_login_time = User.query.get(session['user_id']).last_login
        messages = Message.query.filter(Message.created > last_login_time)
        result = { 'data': { 'messages': [{ 'id': msg.id, 'author': msg.user.username, 'content': msg.content, 'date': msg.created.__str__() } for msg in messages ]}}
        emit('new-messages-to-front', result)
    else:
        offset = 0
        if('offset' in req and req['offset'] != '0'):
            offset = int(req['offset'])
        messages = Message.query.order_by(Message.id.desc()).offset(offset).limit(10)
        result = { 'data': { 'messages': [{ 'id': msg.id, 'author': msg.user.username, 'content': msg.content, 'date': msg.created.__str__() } for msg in messages ]}}
        emit('old-messages-to-front', result)

@socketio.on('message-to-back')
@logged_in_only
def handle_message(req):
    new_message = Message(content = req['message'], created = datetime.now(), user_id = session['user_id'])
    db.session.add(new_message)
    db.session.commit()
    messages = Message.query.filter_by( user_id = session['user_id'] ).order_by( Message.id.desc() ).limit(1)
    result = { 'data': { 'messages': [{ 'id': msg.id, 'author': msg.user.username, 'content': msg.content, 'date': msg.created.__str__() } for msg in messages ]}}
    emit('message-to-front', result, broadcast = True)

@socketio.on('disconnect')
def handle_disconnect():
    user = User.query.get(session['user_id'])
    user.last_login = datetime.now()
    db.session.add(user)
    db.session.commit()
    session.clear()

@socketio.on_error_default
def default_error_handler(error):
    print(f'The following error occured:\n{error}')

if __name__ == '__main__':
    socketio.run(app)