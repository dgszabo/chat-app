from flask import Flask, redirect
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

@app.route('/')
def root():
    return redirect('http://www.google.com')

if __name__ == '__main__':
    socketio.run(app)