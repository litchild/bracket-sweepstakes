"""Review the actual WXML and page controllers in a browser. Not a WeChat simulator."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from html.parser import HTMLParser
from pathlib import Path
import json, re, sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
MINI = ROOT / 'miniprogram'

class Wxml(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root={'tag':'root','attrs':{},'children':[]}
        self.stack=[self.root]
    def handle_starttag(self,tag,attrs):
        node={'tag':tag,'attrs':dict(attrs),'children':[]}
        self.stack[-1]['children'].append(node)
        if tag not in ('image','input','include','import'):
            self.stack.append(node)
    def handle_startendtag(self,tag,attrs):
        self.stack[-1]['children'].append({'tag':tag,'attrs':dict(attrs),'children':[]})
    def handle_endtag(self,tag):
        if len(self.stack)<2 or self.stack[-1]['tag']!=tag:
            raise ValueError('Unbalanced WXML tag: '+tag)
        self.stack.pop()
    def handle_data(self,text):
        self.stack[-1]['children'].append({'text':text})

def tree(file):
    source=file.read_text()
    strict=re.sub(r'\bwx:else(?=\s|>)','wx:else=""',source)
    ET.fromstring('<root xmlns:wx="urn:wechat">'+strict+'</root>')
    p=Wxml();p.feed(source)
    if len(p.stack)!=1: raise ValueError('Unclosed WXML in '+str(file))
    def includes(node):
        out=[]
        for child in node.get('children',[]):
            if child.get('tag')=='include': out.extend(tree((file.parent/child['attrs']['src']).resolve())['children'])
            else: includes(child);out.append(child)
        node['children']=out
    includes(p.root)
    return p.root

def css(text):
    text=re.sub(r'(-?\d*\.?\d+)rpx',r'calc(\1 * var(--rpx))',text)
    text=re.sub(r'(?<![\w.\-])page(?=[\s{.:>#+~,])','.mini-page',text)
    for old,new in [('view','div'),('text','span'),('image','img')]: text=re.sub(r'(?<![\w.\-])'+old+r'(?=[\s{.:>#+~,])',new,text)
    return text

def bundle():
    return {'config':json.loads((MINI/'app.json').read_text()),
        'modules':{str(p.relative_to(MINI)):p.read_text() for p in MINI.rglob('*.js')},
        'templates':{str(p.relative_to(MINI)):tree(p) for p in MINI.glob('pages/*/*.wxml')},
        'globalCss':css((MINI/'app.wxss').read_text()),
        'styles':{str(p.relative_to(MINI)):css(p.read_text()) for p in MINI.glob('pages/*/*.wxss')}}

class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(ROOT),**kwargs)
    def do_GET(self):
        if self.path.split('?')[0]=='/bundle.json':
            try: data=json.dumps(bundle()).encode()
            except Exception as e:
                self.send_error(500,str(e));return
            self.send_response(200);self.send_header('Content-Type','application/json');self.send_header('Cache-Control','no-store');self.end_headers();self.wfile.write(data)
        elif self.path.split('?')[0]=='/':self.path='/preview/index.html';super().do_GET()
        elif self.path.startswith('/mini/'):
            self.path='/miniprogram/'+self.path[len('/mini/'):];super().do_GET()
        else:super().do_GET()
    def log_message(self,*args):pass

if __name__=='__main__':
    if '--check' in sys.argv:
        data=bundle();print('Validated WXML structure for',len(data['templates']),'native pages.')
    else:
        print('Development browser preview: http://127.0.0.1:8766/',flush=True)
        ThreadingHTTPServer(('127.0.0.1',8766),Handler).serve_forever()
