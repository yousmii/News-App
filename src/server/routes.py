import json

from flask.templating import render_template
from flask import request, session, jsonify, redirect, flash, json, make_response, request
from forms import RegisterForm, LoginForm
from flask_login import login_user, logout_user
from wtforms import Form, StringField, TextAreaField, validators

from src.server.app import app, user
from src.server.config import app_data, db
from src.server.ArticlesFetcher import fetch
from src.server.ConnectDB import ConnectDB
from src.server.database import User, RSS, Admin

# from database import RSS
# REST API
# See https://www.ibm.com/developerworks/library/ws-restful/index.html

ConnectDB = ConnectDB(db)


@app.route("/api/post_rss", methods=['POST'])
def post_rss():
    feed_data = request.get_json()
    ConnectDB.addRSS(feed_data['feed_url'],feed_data['feed_name'])
    return "Done", 201


@app.route("/api/post_admin", methods=['POST'])
def post_admin():
    admin_data = request.get_json()
    ConnectDB.addAdmin(admin_data['admin_name'],admin_data['admin_password'])
    return "Done", 201


@app.route("/api/articles")
def get_articles():
    articles = fetch()
    return json.dumps(articles)


@app.errorhandler(404)
def not_found_error(error):
    return jsonify({'error': 'Page not found'}), 404


@app.errorhandler(403)
def forbidden_error(error):
    return jsonify({'error': 'Forbidden'}), 403


@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({'error': 'Internal server error'}), 500


@app.route('/api/register', methods=['GET', 'POST'])
def register_page():
    form = RegisterForm(request.form)
    if form.validate_on_submit():
        user_to_create = User(username=form.username.data,
                              email_address=form.email_address.data,
                              password=form.password1.data)
        db.session.add(user_to_create)
        db.session.commit()
        return {'message': 'User created successfully'}
    if form.errors != {}:
        return {'errors': form.errors}


@app.route('/api/Login', methods=['GET', 'POST'])
def login_page():
    form = LoginForm(request.form)
    if form.validate_on_submit():
        attempted_user = User.query.filter_by(username=form.username.data).first()
        if attempted_user and attempted_user.check_password_correction(attempted_password=form.password.data):
            login_user(attempted_user)
            return {'message': 'User logged in successfully'}
        else:
            return {'errors': 'Username and password do not match! Please try again'}


@app.route('/api/Logout')
def logout_page():
    logout_user()
    return {'message': 'Logged out successfully'}
