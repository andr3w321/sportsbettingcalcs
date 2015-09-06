from bottle import route, run, template, static_file, url

@route('/')
def index():
    return static_file('index.html', root='./static')

@route('/static/<filename>')
def serve_static(filename):
    return static_file(filename, root='./static/')


run(host='localhost', port=8080)
