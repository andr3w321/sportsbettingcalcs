from bottle import route, run, template, static_file, url
from scipy.stats import t

@route('/')
def index():
    return static_file('index.html', root='./static')

@route('/static/<filename>')
def serve_static(filename):
    return static_file(filename, root='./static/')

@route('/get_t_value/confidence_level=:confidence_level&n=:n')
def get_t_value(confidence_level, n):
    df = int(n) - 1
    q = 1 - (1 - float(confidence_level)) / 2
    return str(t.ppf(q, df))

run(host='localhost', port=8080)
