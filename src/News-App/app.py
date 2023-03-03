from flask import Flask, url_for
from flask.templating import render_template
from flask import request, session, jsonify, redirect, flash

from sql.database import User
from sql.forms import RegisterForm, LoginForm
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, login_user, logout_user

from config import config_data
from quote_data_access import Quote, DBConnection, QuoteDataAccess



# TEST USER
user = {"username": "abc", "password": "xyz"}

# RUN DEV SERVER
# INITIALIZE SINGLETON SERVICES
app = Flask('News-App ')
app.secret_key = '*^*(*&)(*)(*afafafaSDD47j\3yX R~X@H!jmM]Lwf/,?KT'
app_data = dict()
app_data['app_name'] = config_data['app_name']

connection = DBConnection(dbname=config_data['dbname'], dbuser=config_data['dbuser'], password="password")
quote_data_access = QuoteDataAccess(connection)
bcrypt = Bcrypt(app)

login_manager = LoginManager(app)
login_manager.init_app(app)
login_manager.login_view = 'login'

DEBUG = False
HOST = "127.0.0.1" if DEBUG else "0.0.0.0"



# REST API
# See https://www.ibm.com/developerworks/library/ws-restful/index.html
@app.route('/quotes', methods=['GET'])
def get_quotes():
    # Lookup row in table Quote, e.g. 'SELECT ID,TEXT FROM Quote'
    quote_objects = quote_data_access.get_quotes()
    # Translate to json
    return jsonify([obj.to_dct() for obj in quote_objects])


@app.route('/quotes/<int:id>', methods=['GET'])
def get_quote(id):
    # ID of quote must be passed as parameter, e.g. http://localhost:5000/quotes?id=101
    # Lookup row in table Quote, e.g. 'SELECT ID,TEXT FROM Quote WHERE ID=?' and ?=101
    quote_obj = quote_data_access.get_quote(id)
    return jsonify(quote_obj.to_dct())


# To create resource use HTTP POST
@app.route('/quotes', methods=['POST'])
def add_quote():
    # Text value of <input type="text" id="text"> was posted by form.submit
    quote_text = request.form.get('text')
    quote_author = request.form.get('author')
    # Insert this value into table Quote(ID,TEXT)
    quote_obj = Quote(iden=None, text=quote_text, author=quote_author)
    print('Adding {}'.format(quote_obj.to_dct()))
    quote_obj = quote_data_access.add_quote(quote_obj)
    return jsonify(quote_obj.to_dct())


# Register
@app.route('/register', methods=['GET', 'POST'])
def register_page():
    form = RegisterForm()
    if form.validate_on_submit():
        user_to_create = User(username=form.username.data,
                              email_address=form.email_address.data,
                              password=form.password1.data)
        session.add(user_to_create)
        session.commit()
        return redirect(url_for('home'))
    if form.errors != {}:
        for err_msg in form.errors.values():
            flash(f'There was an error with creating a user {err_msg}', category='danger')
    return render_template('register.html', form=form)


# Login

@app.route('/login', methods=['GET', 'POST'])
def login_page():
    print("boop")
    form = LoginForm()
    if form.validate_on_submit():
        print("beep")
        attempted_user = User.query.filter_by(username=form.username.data).first()
        print("baap")
        if attempted_user and attempted_user.check_password_correction(attempted_password=form.password.data):
            login_user(attempted_user)
            flash(f'Success! You are logged in as: {attempted_user.username}', category='success')
            return redirect(url_for('home'))
        else:
            flash('Username and password do not match! Please try again', category='danger')
    return render_template('login.html', form=form)


# Logout

@app.route('/logout')
def logout_page():
    logout_user()
    return redirect(url_for('home'))


# VIEW
@app.route("/")
def main():
    return render_template('home.html', app_data=app_data)


@app.route("/show_quotes")
def show_quotes():
    quote_objects = quote_data_access.get_quotes()
    # Render quote_objects "server-side" using Jinja 2 template system
    return render_template('quotes.html', app_data=app_data, quote_objects=quote_objects)


@app.route("/show_quotes_ajax")
def show_quotes_ajax():
    # Render quote_objects "server-side" using Jinja 2 template system
    return render_template('quotes_ajax.html', app_data=app_data)


@app.route("/admin")
def show_admin():
    if 'user' in session and session['user'] == user['username']:
        return render_template('admin.html', app_data=app_data)
    return redirect('/login')


@app.route("/home")
def home():
    return render_template('home.html', app_data=app_data)


@app.login_manager.user_loader
def get_user(user_id):
    try:
        return User.query.get(int(user_id))
    except:
        return None


@app.login_manager.request_loader
def load_user_from_request(request):
    # load user from the request object
    user_id = request.headers.get('Authorization')
    if user_id:
        return User.get(user_id)
    return None


print("a")
app.run(HOST, debug=DEBUG, port="4040")
print("b")