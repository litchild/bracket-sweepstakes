"""Package a self-contained Developer Tools project, excluding private local state."""
from pathlib import Path
import argparse, zipfile
ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser()
parser.add_argument('output',type=Path)
args=parser.parse_args()
args.output.parent.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(args.output,'w',zipfile.ZIP_DEFLATED) as archive:
    for file in sorted(ROOT.rglob('*')):
        rel=file.relative_to(ROOT)
        if not file.is_file() or any(part in ('node_modules','.preview-cache','__pycache__','.git') for part in rel.parts):continue
        if file.name in ('project.private.config.json','.DS_Store'):continue
        archive.write(file,'wechat/'+str(rel))
    for name in ('history-sources.md','team-sources.md'):
        archive.write(ROOT.parent/'docs'/name,'wechat/reference/'+name)
size=sum(file.stat().st_size for file in (ROOT/'miniprogram').rglob('*') if file.is_file())
print('Created',args.output)
print('Native source package:',size,'bytes')
