import os
import uuid

from flask import Flask
from flask.templating import render_template
from flask import request, session, jsonify, redirect, flash
from config import config_data
from sql.config import engine
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

##############################################################################
#### NIEMAND RAAKT DIT AAN AUB!!!!!!###########################################
# create the extension                                                       ##
db = SQLAlchemy()                                                            ##
# INITIALIZE SINGLETON SERVICES                                              ##
app = Flask('News-App')                                                      ##
app.secret_key = '*^*(*&)(*)(*afafafaSDD47j\3yX R~X@H!jmM]Lwf/,?KT'          ##
app_data = dict()                                                            ##
app_data['app_name'] = config_data['app_name']                               ##
                                                                             ##
# INITIALIZE SINGLETON SERVICES                                              ##
# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"             ##
app.config["SQLALCHEMY_DATABASE_URI"] = engine.url                           ##
db.init_app(app)
from database import *
###############################################################################
###############################################################################


# TEST USER
user = {"username": "abc", "password": "xyz"}
dbConnection=ConnectDB()
# REST API
# See https://www.ibm.com/developerworks/library/ws-restful/index.html

# get feed
"""
@app.route("/admin", methods=["GET", "POST"])
def get_feed():
    if request.method == "POST":
        user = User()
        user.add(3,request.form["feed_url"])
        db.session.add(user)
        db.session.commit()
        return redirect('/admin')

    return render_template("admin.html")
"""


# Login
@app.route('/login', methods=['POST', 'GET'])
def login():
    if (request.method == 'POST'):
        username = request.form.get('username')
        password = request.form.get('password')
        if username == user['username'] and password == user['password']:
            session['user'] = username
            return redirect('/admin')

        flash('Wrong password', 'error')
        # return "<h1>Wrong username or password</h1>"    #if the username or password does not matches

    return render_template("login.html")


# Logout
@app.route('/logout')
def logout():
    session.pop('user')
    return redirect('/')


# VIEW
@app.route("/")
def main():
    """"
    user = User(cookie=4001, history="hi")
    # demo of adding to db
    db.session.add(user)
    db.session.commit()
    """
    dbConnection.add_user(4003,"BLA")
    print(User.query.all())
    print("hello")
    return render_template('home.html', app_data=app_data)


@app.route("/admin")
def show_admin():
    if 'user' in session and session['user'] == user['username']:
        return render_template('admin.html', app_data=app_data)
    return redirect('/login')


@app.route("/home")
def home():
    return render_template('home.html', app_data=app_data)
