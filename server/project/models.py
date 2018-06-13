from datetime import datetime
from project import db
from flask_sqlalchemy import SQLAlchemy

class User(db.Model):
    
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.Text)
    last_login = db.Column(db.DateTime, default = datetime.now())
    messages = db.relationship('Message', backref = 'user', lazy = 'dynamic')

class Message(db.Model):
    
    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key = True)
    content = db.Column(db.Text)
    created = db.Column(db.DateTime, default = datetime.now())
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))