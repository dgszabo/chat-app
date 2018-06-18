# chat-app
This is a real-time chat app using websocket connection technology. To run the app, follow the installation, setup, and starting instructions below. If something doesn't work as intended or you have any comments, send me a message.

Installation, setup, and starting instructions
===============================================

First, download the app files from this repo in zip or (fork and) clone the repo to your local machinne.

### Server

In order to run the server. you need to setup a virtual environment. If you have trouble setting up a vistual environment, see https://www.rithmschool.com/courses/flask-fundamentals/introduction-to-flask.

Next, install the dependencies of the Flask server. While in the root of the server folder in terminal, type:
```sh
pip install -r requirements.txt
```
Afterwards you need to create and setup the database. To create the database, while in the root of the server folder in terminal, type:
```sh
createdb chat-app
flask db upgrade
```

To populate the database with data from a seed file for demonstrational purposes (this step may be skipped, but should not be done after using the app, because seeding should only be done using a clean, freshly created database), while in the root of the server folder in terminal, type:
```sh
psql chat-app < data.sql
```

Finally, to start the server, while in the root of the server folder in terminal, type:
```sh
export FLASK_APP=app.py
flask run
```

### Frontend

To setup the frontend react app, move to the chat-frontend folder in terminal. While in the root of the chat-frontend folder in terminal, type:
```sh
npm install
```

To start the app, while in the root of the chat-frontend folder in terminal, type:
```sh
npm start
```

After starting the react app you can connect to it at localhost:3000 from any browser window, even multiple browser windows at a time.

Enjoy the app!
Daniel