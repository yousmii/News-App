import os

from flask import Flask
from flask.templating import render_template
from flask import request, session, jsonify, redirect, flash

from config import config_data
from DBConnection import DBConnection

from waitress import serve

#from src.ProgDBTutor.config import config_data

# INITIALIZE SINGLETON SERVICES
app = Flask('News-App ')
app.secret_key = '*^*(*&)(*)(*afafafaSDD47j\3yX R~X@H!jmM]Lwf/,?KT'
app_data = dict()
app_data['app_name'] = config_data['app_name']
connection = DBConnection(dbname=config_data['dbname'], dbuser=config_data['dbuser'], password="")

DEBUG = False
HOST = "127.0.0.1" if DEBUG else "0.0.0.0"

# TEST USE
user = {"username": "abc", "password": "xyz"}


# REST API
# See https://www.ibm.com/developerworks/library/ws-restful/index.html

# Login
@app.route('/login', methods = ['POST', 'GET'])
def login():
    if(request.method == 'POST'):
        username = request.form.get('username')
        password = request.form.get('password')
        if username == user['username'] and password == user['password']:

            session['user'] = username
            return redirect('/admin')

        flash('Wrong password', 'error')
        #return "<h1>Wrong username or password</h1>"    #if the username or password does not matches

    return render_template("login.html")

#Logout
@app.route('/logout')
def logout():
    session.pop('user')
    return redirect('/')

# VIEW
@app.route("/")
def main():
    return render_template('home.html', app_data=app_data)

@app.route("/admin")
def show_admin():
    if 'user' in session and session['user'] == user['username']:
        return render_template('admin.html', app_data=app_data)
    return redirect('/login')

@app.route("/home")
def home():
    return render_template('home.html', app_data=app_data)

# RUN DEV SERVER
if __name__ == "__main__":
    #app.run(HOST, debug=DEBUG)
    serve(app, host="0.0.0.0", port=8080)