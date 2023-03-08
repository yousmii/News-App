import json

from flask.templating import render_template
from flask import request, session, jsonify, redirect, flash

from app import app, user, app_data
from rss_parser import parse

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

@app.route("/data")
def get_articles():
    articles = parse('https://www.vrt.be/vrtnws/en.rss.articles.xml') + \
    parse('https://www.gva.be/rss/section/ca750cdf-3d1e-4621-90ef-a3260118e21c') + \
    parse('https://www.nieuwsblad.be/rss/section/55178e67-15a8-4ddd-a3d8-bfe5708f8932') + \
    parse('https://www.demorgen.be/in-het-nieuws/rss.xml') + \
    parse('https://sporza.be/nl.rss.xml')
    return json.dumps(articles)