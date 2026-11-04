(()=>{
const totals=[...document.querySelectorAll('[data-view-total]')];
if(!totals.length)return;
const badges=[...document.querySelectorAll('[data-view-counter]')];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let displayed=null,lastTotal=null,busy=false,frame=0;
const formatter=new Intl.NumberFormat('en-US');
function write(value){displayed=value;totals.forEach(el=>el.textContent=formatter.format(value));}
function show(total,added=false){
 if(!Number.isSafeInteger(total)||total<0)return;
 const changed=lastTotal!==null&&total>lastTotal;
 if(lastTotal!==null&&total<lastTotal)return;
 const start=displayed??Math.max(2000,total-12);
 lastTotal=total;const status=document.querySelector('#viewStatus');if(status&&(changed||displayed===null))status.textContent='累计浏览量 '+formatter.format(total)+' 次';cancelAnimationFrame(frame);
 if(reduced.matches||start===total)write(total);
 else {const begin=performance.now();const tick=now=>{const t=Math.min(1,(now-begin)/850);write(Math.round(start+(total-start)*(1-Math.pow(1-t,3))));if(t<1)frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);}
 badges.forEach(b=>{b.classList.remove('views-offline');b.title='同一浏览器每天首次访问计一次，含已有的 2000 次历史浏览';});
 if(changed||added){badges.forEach(b=>{const delta=b.querySelector('.views-delta');if(delta)delta.textContent='+'+(changed?total-start:1);b.classList.remove('views-updated');void b.offsetWidth;b.classList.add('views-updated');});}
}
async function sync(register=false){if(busy||document.hidden)return;busy=true;try{
 const response=await fetch('/api/views',{method:register?'POST':'GET',credentials:'same-origin',cache:'no-store'});
 if(!response.ok)throw Error();const data=await response.json();show(data.total,register&&data.added);
 }catch{badges.forEach(b=>{b.classList.add('views-offline');b.title='浏览量暂时无法更新，稍后自动重试';});}finally{busy=false;}}
sync(true);
setInterval(()=>sync(),5000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync();});
window.addEventListener('online',()=>sync());
})();
