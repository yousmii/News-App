## Admins
**GET** /api/admins
> Returns all admin names in JSON format.

**GET** /api/delete_admin
> Delete an admin. Returns status code and status message.
```
delete_name         unique admin name
```

**GET, POST** /api/registerAdmin
> Tries to add a new Admin (user with is_admin set to true). Returns a status message.
```
username            a string of 3-30 characters
email_address       a valid email
password            a string of 6-30 characters
```


## Articles
**GET** /api/articles
> Returns _skip_*_i_ amount of articles in JSON format, where _i_ is the amount of articles shown by infinite scrolling.
```
skip                an integer representing the amount of infinite scrolling iterations that have passed
```

**GET** /api/search
> Returns all articles that match the query string.
```
q                   query string
```

**GET** /api/similarity
> Returns a list of articles that were matched using TF_IDF.
```
article_link       a link to the article that we want the similar articles of
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
> Returns the identity of the user and tells us if he is an admin.

**GET** /api/csrf_token
> Returns a CSRF token to prevent cross-site request forgery.

**GET, POST** /api/register
> Tries to add a new user. Returns a status message.
```
username            a string of 3-30 characters
email_address       a valid email
password            a string of 6-30 characters
```

**GET, POST** /api/login
> Adds user to session if username and password match a database entry. Returns a status message.
```
username            a string of 3-30 characters
password            a string of 6-30 characters
```

/api/logout
> Remove user from session. Also cleans up the remember-me cookie if it exists. Returns a status message.
