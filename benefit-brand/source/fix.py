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
def write(path, ct_main):
    with zipfile.ZipFile(path, 'w', zipfile.ZIP_DEFLATED) as z:
        for n, b in items.items():
            if n.endswith('/'): continue
            if n == '[Content_Types].xml':
                b = re.sub(rb'application/vnd\.openxmlformats-officedocument\.wordprocessingml\.(document|template)\.main\+xml', ct_main, b)
            z.writestr(n, b)
write(dst_docx, b'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml')
write(dst_dotx, b'application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml')
