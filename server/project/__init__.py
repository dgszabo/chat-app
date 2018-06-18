from flask import Flask, session
import functools
import os
from flask_socketio import SocketIO, emit, disconnect
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime

app = Flask(__name__)

if os.environ.get('ENV') == 'production':
    app.config['DEBUG'] = False
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
    app.config['SQLALCHEMY_ECHO'] = False
else:
    app.config['DEBUG'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://localhost/chat-app'
    app.config['SQLALCHEMY_ECHO'] = True

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or 'temporary dev key'

db = SQLAlchemy(app)
migrate = Migrate(app, db)
socketio = SocketIO(app)

from project.models import User, Message


def logged_in_only(func):
    @functools.wraps(func)
    def wrapped(*args, **kwargs):
        if 'username' not in session:
            disconnect()
        else:
            return func(*args, **kwargs)
    return wrapped

@socketio.on('login')
def handle_login(req):
    try:
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
    except:
        result = { 'error': { 'type': 'login error', 'message': 'something went wrong with logging you in to the chat app. try reloading the webpage and logging in later!' } }
        emit('logged-in', result)

@socketio.on('messages-request')
@logged_in_only
def handle_messages_request(req):
    
    if('only_new' in req and req['only_new'] == True):
        try:
            last_login_time = User.query.get(session['user_id']).last_login
            messages = Message.query.filter(Message.created > last_login_time).order_by(Message.created.desc())
            result = { 'data': { 'messages': [{ 'id': msg.id, 'author': msg.user.username, 'content': msg.content, 'date': str(msg.created) } for msg in messages ]}}
            emit('new-messages-to-front', result)
        except:
            result = { 'error': { 'type': 'message loading error', 'message': 'something went wrong with loading the latest messages. try reloading the webpage and loading the messages later!' } }
            emit('new-messages-to-front', result)
    else:
        try:
            offset = 0
            if('offset' in req and req['offset'] != '0'):
                offset = int(req['offset'])
            messages = Message.query.order_by(Message.created.desc()).offset(offset).limit(10)
            result = { 'data': { 'messages': [{ 'id': msg.id, 'author': msg.user.username, 'content': msg.content, 'date': str(msg.created) } for msg in messages ]}}
            emit('old-messages-to-front', result)
        except:
            result = { 'error': { 'type': 'message loading error', 'message': 'something went wrong with loading the earlier messages. try reloading the webpage and loading the messages later!' } }
            emit('old-messages-to-front', result)

@socketio.on('message-to-back')
@logged_in_only
def handle_message(req):
    try:
        new_message = Message(content = req['message'], created = datetime.now(), user_id = session['user_id'])
        db.session.add(new_message)
        db.session.commit()
        messages = Message.query.filter_by( user_id = session['user_id'] ).order_by( Message.id.desc() ).limit(1)
        result = { 'data': { 'messages': [{ 'id': msg.id, 'author': msg.user.username, 'content': msg.content, 'date': str(msg.created) } for msg in messages ]}}
        emit('message-to-front', result, broadcast = True)
    except:
        result = { 'error': { 'type': 'message sending error', 'message': 'something went wrong with sending your message to the message board. try reloading the webpage and sending your message again later!' } }
        emit('message-to-front', result)

@socketio.on('logout')
@logged_in_only
def handle_logout():
    try:
        user = User.query.get(session['user_id'])
        user.last_login = datetime.now()
        db.session.add(user)
        db.session.commit()
        session.clear()
        emit('logged-out')
    except:
        result = { 'error': { 'type': 'logout error', 'message': 'something went wrong while logging you out from the chat app. try closing or reloading the webpage to login again!' } }
        emit('logged-out', result)

@socketio.on('disconnect')
def handle_disconnect():
    try:
        user = User.query.get(session['user_id'])
        user.last_login = datetime.now()
        db.session.add(user)
        db.session.commit()
        session.clear()
    except:
        print('ERROR: Something went wrong while adding logout time to the database or no user was logged in when disconnecting.')

@socketio.on_error_default
def default_error_handler(error):
    print(f'The following error occured:\n{error}')


if __name__ == '__main__':
    socketio.run(app)