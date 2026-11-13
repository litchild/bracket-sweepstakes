// Build small PNGs from the project's vector drawings. Not needed to run the app.
const fs=require('node:fs');
const path=require('node:path');
const sharp=require('sharp');
const mini=path.resolve(__dirname,'../miniprogram');
const icons={
  home:'<path d="m3 11 9-8 9 8M5 10v11h5v-7h4v7h5V10"/>',
  explore:'<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6Z"/>',
  bracket:'<path d="M3 3v6h5v6H3v6M21 3v6h-5v6h5v6M8 12h8"/>',
  crowd:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M18 15a5 5 0 0 1 3 5"/>',
  standings:'<path d="M5 21V11h5v10M10 21V4h5v17M15 21V8h5v13"/>'
};
async function main(){
  fs.mkdirSync(path.join(mini,'assets/nav'),{recursive:true});
  for(const [name,art] of Object.entries(icons))for(const active of [false,true]){
    const svg='<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="'+(active?'#CF2632':'#60636B')+'" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+art+'</svg>';
    await sharp(Buffer.from(svg)).png().toFile(path.join(mini,'assets/nav',name+(active?'-active':'')+'.png'));
  }
  for(const name of ['your-turn','trophy'])await sharp(path.join(mini,'assets',name+'.svg')).resize({width:name==='your-turn'?600:240}).png({palette:true}).toFile(path.join(mini,'assets',name+'.png'));
  const titles={home:'Bracket Sweepstakes',explore:'Teams & regions',bracket:'My bracket',crowd:'Crowd',standings:'Standings',learn:'Fan camp',profile:'Team profile',archive:'Past brackets',clip:'NCAA moments'};
  for(const [page,title] of Object.entries(titles))fs.writeFileSync(path.join(mini,'pages',page,'index.json'),JSON.stringify({navigationBarTitleText:title},null,2)+'\n');
  console.log('Prepared native PNG artwork, tab icons and page configuration.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
