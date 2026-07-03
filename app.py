from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    # This automatically looks inside the 'templates' folder for index.html
    return render_template('index.html')

if __name__ == '__main__':
    # Runs the local development server
    app.run(debug=True, port=5500)