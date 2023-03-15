import json

from flask.templating import render_template
from flask import request, session, jsonify, redirect, flash

from app import app, user
from config import app_data, db
from rss_parser import parse
from ConnectDB import ConnectDB
#from database import RSS
# REST API
# See https://www.ibm.com/developerworks/library/ws-restful/index.html

ConnectDB=ConnectDB(db)
@app.route("/post_rss", methods= ['POST'])
def post_rss():
    """
    rss = RSS()
    rss.rss_url = request.form['feed_url']
    rss.published_by = request.form['feed_name']
    db.session.add(rss)
    db.session.commit()
    """
    return render_template('admin.html', app_data = app_data)

@app.route("/api")
def get_articles():
    articles = parse('https://www.vrt.be/vrtnws/en.rss.articles.xml') + \
               parse('https://www.gva.be/rss/section/ca750cdf-3d1e-4621-90ef-a3260118e21c') + \
               parse('https://www.nieuwsblad.be/rss/section/55178e67-15a8-4ddd-a3d8-bfe5708f8932') + \
               parse('https://www.demorgen.be/in-het-nieuws/rss.xml') + \
               parse('https://sporza.be/nl.rss.xml') + \
               parse('https://www.thebulletin.be/rss.xml') + \
               parse('https://www.standaard.be/rss/section/1f2838d4-99ea-49f0-9102-138784c7ea7c') + \
               parse('https://www.hln.be/home/rss.xml') + \
               parse('https://www.hbvl.be/rss/section/D1618839-F921-43CC-AF6A-A2B200A962DC')
    ConnectDB.addUser(205793,"history u1")
    ConnectDB.addRSS("rssfeed","10-10-2022")
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