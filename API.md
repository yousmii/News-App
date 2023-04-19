## Admins
**POST** /api/post_admin
> Adds admin. Returns status code and status message.
```
username            a string of X characters
password            a string of X characters
```

**GET** /api/admins
> Returns all admin's name, password and cookie_id in JSON format.

**GET** /api/delete_admin
> Delete an admin. Returns status code and status message.
```
delete_name         unique admin name
```

## Articles
**GET** /api/articles
> Returns _skip_*_i_ amount of articles in JSON format, where _i_ is the amount of articles shown by infinite scrolling.
```
skip                an integer representing the amount of infinite scrolling iterations that have passed
```

## RSS
**POST** /api/post_rss
> Adds RSS feed. Returns status code and status message.
```
feed_name           a string of X characters
feed_url            a string of X characters
```

**GET** /api/delete_feed
> Deletes a feed. Returns status code and status message.
```
delete_id           unique ID of the feed to be deleted
```

**GET** /api/rss
> Returns all RSS feed's id, url and name in JSON format.

## Account
**GET** /api/@me
> Returns the identity of the user.

**GET** /api/csrf_token
> Returns a CSRF token to prevent cross-site request forgery.

**GET, POST** /api/register
> Tries to add a new user. Returns a status message.
```
username            a string of X characters
email_address       a string of X characters
password            a string of X characters
```

**GET, POST** /api/login
> Adds user to session if username and password match a database entry. Returns a status message.
```
username            a string of X characters
password            a string of X characters
```

/api/logout
> Remove user from session. Also cleans up the remember-me cookie if it exists. Returns a status message.
