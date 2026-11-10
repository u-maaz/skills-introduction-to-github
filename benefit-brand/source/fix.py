import re, sys, zipfile, shutil
src, dst_docx, dst_dotx = sys.argv[1:4]
zin = zipfile.ZipFile(src); items = {n: zin.read(n) for n in zin.namelist()}; zin.close()
pat = re.compile(r'<w:r>(<w:rPr>(?:(?!</w:rPr>).)*</w:rPr>)<w:fldChar w:fldCharType="begin"/><w:instrText xml:space="preserve">(PAGE|NUMPAGES)</w:instrText><w:fldChar w:fldCharType="separate"/><w:fldChar w:fldCharType="end"/></w:r>')
def sub(m):
    rp, f = m.group(1), m.group(2)
    return (f'<w:r>{rp}<w:fldChar w:fldCharType="begin"/></w:r><w:r>{rp}<w:instrText xml:space="preserve"> {f} </w:instrText></w:r>'
            f'<w:r>{rp}<w:fldChar w:fldCharType="separate"/></w:r><w:r>{rp}<w:t>1</w:t></w:r><w:r>{rp}<w:fldChar w:fldCharType="end"/></w:r>')
for n in items:
    if n.startswith('word/footer'):
        s = items[n].decode(); s2, k = pat.subn(sub, s); print(n, 'fields fixed:', k); items[n] = s2.encode()
# ---- embed Rubik (regular + bold) so the template looks the same on machines without the font ----
import uuid, os
FD = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'fonts')
def obfuscate(data, guid):
    h = guid.strip('{}').replace('-', '')
    key = bytes(int(h[i:i+2], 16) for i in range(30, -1, -2))
    b = bytearray(data)
    for i in range(32): b[i] ^= key[i % 16]
    return bytes(b)
emb = []
for kind, fn in [('embedRegular', 'Rubik-Regular.ttf'), ('embedBold', 'Rubik-Bold.ttf')]:
    g = '{' + str(uuid.uuid4()).upper() + '}'
    n = len(emb) + 1
    items[f'word/fonts/font{n}.odttf'] = obfuscate(open(os.path.join(FD, fn), 'rb').read(), g)
    emb.append((kind, f'rIdF{n}', g, n))
items['word/_rels/fontTable.xml.rels'] = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    + ''.join(f'<Relationship Id="{r}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/font" Target="fonts/font{n}.odttf"/>' for _, r, _, n in emb)
    + '</Relationships>').encode()
fontxml = ('<w:font w:name="Rubik"><w:panose1 w:val="00000500000000000000"/><w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="variable"/>'
    + ''.join(f'<w:{k} r:id="{r}" w:fontKey="{g}"/>' for k, r, g, _ in emb) + '</w:font>')
ft = items['word/fontTable.xml'].decode()
ft = re.sub(r'(<w:fonts[^>]*?)\s*/>$', r'\1>' + fontxml + '</w:fonts>', ft.strip()) if ft.strip().endswith('/>') else ft.replace('</w:fonts>', fontxml + '</w:fonts>')
items['word/fontTable.xml'] = ft.encode()
st = items['word/settings.xml'].decode()
st = st.replace('<w:displayBackgroundShape/>', '<w:displayBackgroundShape/><w:embedTrueTypeFonts/>', 1)
items['word/settings.xml'] = st.encode()
ct = items['[Content_Types].xml'].decode()
if 'odttf' not in ct:
    ct = ct.replace('<Default ', '<Default Extension="odttf" ContentType="application/vnd.openxmlformats-officedocument.obfuscatedFont"/><Default ', 1)
items['[Content_Types].xml'] = ct.encode()

def write(path, ct_main):
    with zipfile.ZipFile(path, 'w', zipfile.ZIP_DEFLATED) as z:
        for n, b in items.items():
            if n.endswith('/'): continue
            if n == '[Content_Types].xml':
                b = re.sub(rb'application/vnd\.openxmlformats-officedocument\.wordprocessingml\.(document|template)\.main\+xml', ct_main, b)
            z.writestr(n, b)
write(dst_docx, b'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml')
write(dst_dotx, b'application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml')
