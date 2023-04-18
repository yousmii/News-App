import json

from flask.templating import render_template
from flask import request, session, jsonify, redirect, flash, json, make_response, request
from forms import RegisterForm, LoginForm
from flask_login import login_user, logout_user, current_user
from wtforms import Form, StringField, TextAreaField, validators
from flask_wtf import csrf
from werkzeug.datastructures import MultiDict

from app import app, user
from config import app_data, db
from ArticlesFetcher import fetch
from ConnectDB import ConnectDB
from database import User, RSS, Admin
from sqlalchemy import asc

# REST API
# See https://www.ibm.com/developerworks/library/ws-restful/index.html

ConnectDB = ConnectDB(db)


@app.route("/api/post_rss", methods=['POST'])
def post_rss():
    feed_data = request.get_json()

    success, message = ConnectDB.addRSS(feed_data['feed_name'], feed_data['feed_url'])

    return message, success


@app.route("/api/post_admin", methods=['POST'])
def post_admin():
    admin_data = request.get_json()
    success, message = ConnectDB.addAdmin(admin_data['admin_name'], admin_data['admin_password'])

    return message, success


@app.route("/api/delete_admin", methods=['GET'])
def delete_admin():
    delete_name = request.args.get('delete_name', type=str)
    success = Admin.query.filter(Admin.name == delete_name).delete()
    db.session.commit()
    return {'message': 'Admin deleted successfully', "status": 200} if success \
        else {'message': 'Could not delete admin', "status": 500}

@app.route("/api/delete_feed", methods=['GET'])
def delete_feed():
    delete_id = request.args.get('delete_id', type=int)
    success = RSS.query.filter(RSS.id == delete_id).delete()
    db.session.commit()
    return {'message': 'RSS Feed deleted successfully', "status": 200} if success \
        else {'message': 'Could not delete RSS Feed', "status": 500}


@app.route("/api/articles", methods=['GET'])
def get_articles():
    skip = request.args.get('offset', type=int)

    print("route received " + str(skip) + " as 'skip' argument")

    articles = fetch(skip)
    return json.dumps(articles)


@app.route("/api/rss", methods=['GET'])
def get_feeds():
    db_feeds = RSS.query.order_by(asc(RSS.id)).all()

    feeds = []

    for db_feed in db_feeds:
        feed = {
            "id": db_feed.id,
            "url": db_feed.rss_url,
            "name": db_feed.name
        }
        feeds.append(feed)

    return json.dumps(feeds)


@app.route("/api/admins", methods=['GET'])
def get_admins():
    db_admins = Admin.query.order_by(asc(Admin.name)).all()

    admins = []

    for db_admin in db_admins:
        admin = {
            "name": db_admin.name,
            "password": db_admin.password,
            "cookie_id": "None"
        }
        admins.append(admin)

    return json.dumps(admins)


@app.errorhandler(404)
def not_found_error(error):
    return jsonify({'error': 'Page not found'}), 404


@app.errorhandler(403)
def forbidden_error(error):
    return jsonify({'error': 'Forbidden'}), 403


@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({'error': 'Internal server error'}), 500


@app.route('/api/csrf_token', methods=['GET'])
def get_csrf_token():
    csrf_token = csrf.generate_csrf()
    return jsonify({'csrf_token': csrf_token})


@app.route("/api/@me", methods=['GET'])
def get_current_user():
    if not current_user.is_authenticated:
        return jsonify({"error": "Unauthorized"}), 401
    return jsonify({
        "username": current_user.username,
    }), 200


@app.route('/api/register', methods=['GET', 'POST'])
def register_page():
    form_data = MultiDict(request.get_json())
    form = RegisterForm(form_data)
    if form.validate():
        user_to_create = User(username=form.username.data,
                              email_address=form.email_address.data,
                              password=form.password1.data)
        db.session.add(user_to_create)
        db.session.commit()
        attempted_user = User.query.filter_by(username=form.username.data).first()
        login_user(attempted_user)
        if current_user.is_authenticated:
            return jsonify({'message': 'User created and logged in successfully'})
    if form.errors != {}:
        return jsonify({'errors': form.errors})


@app.route('/api/login', methods=['GET', 'POST'])
def login_page():
    form_data = MultiDict(request.get_json())
    form = LoginForm(form_data)
    if form.validate_on_submit():
        attempted_user = User.query.filter_by(username=form.username.data).first()
        if attempted_user and attempted_user.check_password_correction(attempted_password=form.password.data):
            login_user(attempted_user)
            return jsonify({'message': 'User logged in successfully'})
        else:
            return jsonify({'errors': 'Username and password do not match! Please try again'})


@app.route('/api/logout')
def logout_page():
    logout_user()
    return {'message': 'Logged out successfully'}
