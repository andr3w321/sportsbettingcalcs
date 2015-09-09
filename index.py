from bottle import route, run, template, static_file, url, get
from scipy.stats import t
from scipy.stats import ttest_1samp

@route('/')
def index():
    return static_file('index.html', root='./static')

@get('/static/js/<filename:re:.*\.js>')
def javascripts(filename):
    return static_file(filename, root='static/js')

@get('/static/css/<filename:re:.*\.css>')
def stylesheets(filename):
    return static_file(filename, root='./static/css')

@route('/get_t_value/confidence_level=:confidence_level&n=:n')
def get_t_value(confidence_level, n):
    df = int(n) - 1
    q = 1 - (1 - float(confidence_level)) / 2
    return str(t.ppf(q, df))

@route('/t_test/wins=:wins&losses=:losses&pop_mean=:pop_mean')
def t_test(wins, losses, pop_mean):
    wins = int(wins)
    losses = int(losses)
    results = [1] * wins + [0] * losses
    t_val, p_val = ttest_1samp(results, float(pop_mean))
    # usually testing whether winrate is > a threshold
    # one sided ttest
    # looking for a p_val < ~0.05
    p_val = p_val / 2.0
    if t_val < 0:
        p_val = 1 - p_val
    #return "Result is a t-value of %.3f standard deviations away from the mean with a p-value of %.4f" %  (t_val, p_val)
    return "%.3f,%.4f" %  (t_val, p_val)

run(host='localhost', port=8080)
