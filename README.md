# A news aggregator

A React webapp that combines news sources, using their RSS feeds. It fetches the data from an API made with Flask. It bases the recommended contents on the user's visits to the site, creating a personalized experience.

# Quick start

Copy the repository to your local machine, and run the following commands:

### 1. Postgres database, Python interface and dependency manager

```bash
sudo apt install python3 python3-pip nodejs npm libpq-dev python-dev postgresql
sudo pip install python-psycopg2
```

### 2. Create the database

First configure the database with `postgres` user:

```bash
sudo su postgres
psql
```

Then create a role 'app' that will create the database and be used by the application:

```sql
CREATE ROLE app WITH LOGIN CREATEDB;
CREATE DATABASE newsapp OWNER app;
```

You need to 'trust' the role to be able to login. Add the following line to `/etc/postgresql/9.6/main/pg_hba.conf` (you need root access, version may vary). **It needs to be the first rule (above local all all peer)**.

```
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# app
local   dbtutor         app                                     trust
```

and restart the service. Then initialize the database:

```bash
sudo systemctl restart postgresql

psql newsapp -U app -f sql/schema.sql
```

### 3. Download Dependencies

We shall first install the dependencies for the API:

```bash
virtualenv -p python3 env
source env/bin/activate
pip3 install -r requirements.txt
```

Then, we shall install the dependencies for the webapp:

```bash
npm install
// or if you have yarn installed
yarn
```

### 4. Run development server

```bash
cd src/server
python run.py
```

Then visit http://localhost:8080

### 5. Run the frontend

```bash
cd src/client
npm start
// or if you have yarn installed
yarn start
```

Then visit http://localhost:3000

## Run on GCP using nginx and gunicorn

### 1. Install nginx and gunicorn

```bash
sudo apt install nginx gunicorn
```

### INCOMPLETE
