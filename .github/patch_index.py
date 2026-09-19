import sys
p='index.html'
s=open(p,encoding='utf-8').read()
old1="if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){window.ASFAutoInit&&ASFAutoInit();window.updateXPBar&&updateXPBar();\n"
new1="if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){window.ASFAutoInit&&ASFAutoInit();window.updateXPBar&&updateXPBar();});}else{window.ASFAutoInit&&ASFAutoInit();window.updateXPBar&&updateXPBar();}\n"
old2="(function(){const saved=localStorage.getItem('asf-calendar-events');if(saved){try{ASF_CALENDAR.events=JSON.parse(saved)}catch(e){}}});"
new2="(function(){const saved=localStorage.getItem('asf-calendar-events');if(saved){try{ASF_CALENDAR.events=JSON.parse(saved)}catch(e){}}})();"
old3="\n})\nfunction asfSafeInit()"
new3="\nfunction asfSafeInit()"
changed=False
for o,n in [(old1,new1),(old2,new2),(old3,new3)]:
    if o in s:
        assert s.count(o)==1, 'pattern not unique'
        s=s.replace(o,n); changed=True
if changed:
    open(p,'w',encoding='utf-8').write(s)
    print('patched')
else:
    print('nothing to do')
