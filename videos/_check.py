import json, sys
raw = open(sys.argv[1], encoding='utf-8', errors='ignore').read()
d = json.loads(raw[raw.index('{'):])
print('OK' if d.get('ok') else 'NOT OK')
for sec in ('lint', 'runtime', 'layout', 'motion', 'contrast', 'craft'):
    v = d.get(sec) or {}
    fs = [f for f in (v.get('findings') or []) if f.get('severity') in ('error', 'warning')]
    print('==', sec, 'errors', v.get('errorCount'), 'warn', v.get('warningCount'))
    seen = set()
    for it in fs:
        key = (it.get('code'), it.get('selector'))
        if key in seen: continue
        seen.add(key)
        if len(seen) > 12: break
        print('   -', it.get('severity'), it.get('code'), '|', it.get('time'), '|', it.get('selector'), '|', (it.get('message') or '')[:140])
