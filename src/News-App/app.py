import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask.templating import render_template
from flask import request, session, jsonify, redirect, flash, url_for

from config import config_data
#from DBConnection import DBConnection

#from database import *

from RSSCounter import RSSCounter


#from waitress import serve

#from src.ProgDBTutor.config import config_data

# INITIALIZE SINGLETON SERVICES
app = Flask('News-App ')
app.secret_key = '*^*(*&)(*)(*afafafaSDD47j\3yX R~X@H!jmM]Lwf/,?KT'
app_data = dict()
app_data['app_name'] = config_data['app_name']
#connection = DBConnection(dbname=config_data['dbname'], dbuser=config_data['dbuser'], password="")

#db = SQLAlchemy(app)

DEBUG = False
HOST = "127.0.0.1" if DEBUG else "0.0.0.0"

# TEST USER
user = {"username": "abc", "password": "xyz"}


#Counter for RSS_URL ID

count = RSSCounter()

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


@app.route("/post_rss", methods= ['POST'])
def post_rss():


    #rss = RSS()
    #rss.rss_url = request.form['feed_url']
    #rss.published_by = request.form['feed_name']

    #db.session.add(rss)
    #db.session.commit()

    return render_template('admin.html', app_data = app_data)

@app.errorhandler(404)
def page_not_found(e):
     return render_template('404.html', app_data = app_data)

@app.errorhandler(403)
def forbiden_access(e):
    return render_template('403.html', app_data = app_data)

# RUN DEV SERVER
if __name__ == "__main__":
    app.run(HOST, debug=DEBUG)
