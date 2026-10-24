#!/usr/bin/env python3
"""Offline consistency checks for documentation-only RFT Handoff package.
This checks completeness and references; it does NOT test the downstream app.
"""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
EXPECTED_DIRS = ['01-context','02-product','03-design','04-engineering','05-codex','06-operations','07-validation','templates','scripts','references/source-documents']
REQUIRED = ['README.md','START-HERE.md','AGENTS.md','MANIFEST.md','01-context/requirements-ledger.md','03-design/assets-manifest.md','05-codex/execution-contract.md','05-codex/quality-gates.md','06-operations/zero-cost-policy.md','07-validation/release-checklist.md']

def main():
    problems=[]
    for dirname in EXPECTED_DIRS:
        if not (ROOT/dirname).is_dir(): problems.append('missing directory: '+dirname)
    for rel in REQUIRED:
        if not (ROOT/rel).is_file(): problems.append('missing file: '+rel)
    md=list(ROOT.rglob('*.md'))
    for path in md:
        content=path.read_text(encoding='utf-8')
        if not content.strip(): problems.append('empty Markdown: '+str(path.relative_to(ROOT)))
        for link in re.findall(r'\[[^\]]+\]\(([^)]+)\)', content):
            if link.startswith(('https://','http://','mailto:','#')): continue
            target=(path.parent/link.split('#')[0]).resolve()
            if not target.exists(): problems.append('broken local link: '+str(path.relative_to(ROOT))+' -> '+link)
    # Handoff must be non-executable until human-reviewed evidence exists.
    template=ROOT/'templates/release-evidence.example.json'
    if not template.exists() or '"not-run"' not in template.read_text(encoding='utf-8'):
        problems.append('missing fail-closed release example')
    combined='\n'.join((ROOT/name).read_text(encoding='utf-8') for name in REQUIRED if (ROOT/name).exists())
    for phrase in ['RM0','Lucide','.agents/skills','assets/','MFA','release']:
        if phrase not in combined: problems.append('missing protected requirement marker: '+phrase)
    if problems:
        print('HANDOFF STRUCTURE FAIL:')
        for p in problems: print(' -',p)
        return 1
    print(f'HANDOFF STRUCTURE PASS: {len(md)} Markdown files, {len(list(ROOT.rglob("*")))} total paths')
    print('This does not verify the application, provider configuration, skill execution or deployment.')
    return 0

if __name__=='__main__': sys.exit(main())
