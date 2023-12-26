 
import flask
from flask import jsonify
from flask import request
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
app = flask.Flask(__name__)
app.config["DEBUG"] = False
app.config["JSON_AS_ASCII"] = False
cors = CORS(app, resources={r"/*": {"origins": "*"}})
def yahoo_stock_crawler(stock):
    #怕被阻擋，所以假裝是遊覽器
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) \
                           ApplWebKit/537.36 (KHTML, like Gecko) \
                           Chrome/102.0.0.0 Safari/537.36'}
    url=f'https://tw.stock.yahoo.com/quote/{stock}'
    r=requests.get(url, headers=headers)
    soup=BeautifulSoup(r.text, 'lxml')
    #股票成交
    if soup.find('span', {'class': 'Fz(32px) Fw(b) Lh(1) Mend(4px) D(f) Ai(c) C($c-trend-up)'}) is not None:
            price = soup.find('span', {'class': 'Fz(32px) Fw(b) Lh(1) Mend(4px) D(f) Ai(c) C($c-trend-up)'})
    elif soup.find('span', {'class': 'Fz(32px) Fw(b) Lh(1) Mend(4px) D(f) Ai(c) C($c-trend-down)'}) is not None:
            price = soup.find('span', {'class': 'Fz(32px) Fw(b) Lh(1) Mend(4px) D(f) Ai(c) C($c-trend-down)'})  
    elif soup.find('span', {'class': 'Fz(32px) Fw(b) Lh(1) Mend(4px) D(f) Ai(c)'}) is not None:
            price = soup.find('span', {'class': 'Fz(32px) Fw(b) Lh(1) Mend(4px) D(f) Ai(c)'})  


    if soup.find('span', {'class': 'Fz(32px) Fw(b) Lh(1) Mend(16px) D(f) Ai(c) C($c-trend-up)'}) is not None:
            price = soup.find('span', {'class': 'Fz(32px) Fw(b) Lh(1) Mend(16px) D(f) Ai(c) C($c-trend-up)'})
    elif soup.find('span', {'class': 'Fz(32px) Fw(b) Lh(1) Mend(16px) D(f) Ai(c) C($c-trend-down)'}) is not None:
            price = soup.find('span', {'class': 'Fz(32px) Fw(b) Lh(1) Mend(16px) D(f) Ai(c) C($c-trend-down)'})
    elif soup.find('span', {'class': 'Fz(32px) Fw(b) Lh(1) Mend(16px) D(f) Ai(c)'}) is not None:
            price = soup.find('span', {'class': 'Fz(32px) Fw(b) Lh(1) Mend(16px) D(f) Ai(c)'})  
    #是否開盤跟時間
    if soup.find('span', {'class': 'C(#6e7780) Fz(12px) Fw(b) Fw(400)!'}) is not None:
        price1 = soup.find('span', {'class': 'C(#6e7780) Fz(12px) Fw(b) Fw(400)!'})
    elif soup.find('span', {'class': 'C(#6e7780) Fz(12px) Fw(b)'}) is not None:
        price1 = soup.find('span', {'class': 'C(#6e7780) Fz(12px) Fw(b)'})

    s = ''                              
    # 漲或跌的狀態跟漲跌
    if soup.find('span', {'class': 'Fz(20px) Fw(b) Lh(1.2) Mend(4px) D(f) Ai(c) C($c-trend-down)'}):# 表示狀態為下跌
        ss =soup.find('span', {'class': 'Fz(20px) Fw(b) Lh(1.2) Mend(4px) D(f) Ai(c) C($c-trend-down)'})
        s = '-'+ss.text
    elif soup.find('span', {'class': 'Fz(20px) Fw(b) Lh(1.2) Mend(4px) D(f) Ai(c) C($c-trend-up)'}):# 表示狀態為上漲
        ss =soup.find('span', {'class': 'Fz(20px) Fw(b) Lh(1.2) Mend(4px) D(f) Ai(c) C($c-trend-up)'})
        s = '+'+ss.text
    else:
        ss =soup.find('span', {'class': 'Fz(20px) Fw(b) Lh(1.2) Mend(4px) D(f) Ai(c)'})
        s = '--'+ss.text
    transformed_float=price.text.replace(",","")
    ans ={'股票成交':transformed_float,
            '開盤':price1.text,
            '漲跌':s}
    return ans


@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/EIXIC')
def get_EIXIC_info():
    price=yahoo_stock_crawler('%5EIXIC')
    print(price)
    return jsonify(price)
@app.route('/TWII')
def get_TWII_info():
    price=yahoo_stock_crawler('%5ETWII')
    print(price)
    return jsonify(price)
@app.route('/N225')
def get_N225_info():
    price=yahoo_stock_crawler('%5EN225')
    print(price)
    return jsonify(price)  

app.run(host='0.0.0.0', port='8888')


