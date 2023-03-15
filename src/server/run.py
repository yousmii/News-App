from app import app
from config import run_app

if __name__ == '__main__':
    run_app()
    app.run(debug=True)
