from src.server.app import app
from src.server.config import run_app

if __name__ == '__main__':
    run_app()
    # test_db.main()
    app.run(debug=True)
