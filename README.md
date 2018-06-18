# chat-app
This is a real-time chat app using sockets.

Server
=======

- set up virtual env
- install dependencies from requirements.txt
- set up db:
    - createDB chat-app
    - flask db upgrade

- to start server:
    - export FLASK_APP=app.py
    - flask run

Frontend
========

- set up app frontend:
    - npm install
- start app:
    - npm start
    - afterwards you can connect to it from any browser window @ localhost:3000