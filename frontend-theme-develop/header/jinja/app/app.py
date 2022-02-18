from flask import Flask, render_template
from flask_cors import CORS

import header

app = Flask(__name__, template_folder='templates')

# enable  Cross Origin Resource Sharing for use by materials cloud
#TODO: restrict this at some point
CORS(app)

# Support also routes with trailing slashes
app.url_map.strict_slashes = False

@app.route('/')
def index():
    tvars = header.template_vars
    return render_template('header.html', **tvars)

if __name__ == '__main__':
    app.run(debug=True)
