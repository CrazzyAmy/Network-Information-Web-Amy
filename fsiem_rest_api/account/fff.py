from flask import Flask
from flask import render_template
from flask import request
app = Flask(__name__)
@app.route("/test", methods=['POST'])
def sendjs():
    data = json.loads(request.form.get('data'))
    return"can you see me?" 
@app.route("/")
def get():
    return"can you?" 
if __name__ == '__main__':
    app.run(host='10.141.51.153',port=80)