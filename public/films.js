let films=[];
const filmDialog=document.querySelector('#filmDialog');
const filmPlayer=document.querySelector('#filmPlayer');
const featuredFilmButtons=document.querySelectorAll('[data-featured-film]');
const featuredFilmIds=new Set();
let filmIndex=0,filmOpener;
function durationLabel(seconds){return `${Math.floor(seconds/60)}:${String(Math.round(seconds%60)).padStart(2,'0')}`;}
function openFilm(index){const film=films[index];if(!film)return;filmIndex=index;document.querySelector('#filmTitle').textContent=film.title;document.querySelector('#filmSubtitle').textContent=film.subtitle;document.querySelector('#filmCount').textContent=`${String(index+1).padStart(2,'0')} / ${films.length}`;filmPlayer.pause();filmPlayer.poster=`assets/films/${film.poster}`;filmPlayer.src=`assets/films/${film.file}`;filmPlayer.style.aspectRatio=`${film.width} / ${film.height}`;if(!filmDialog.open){filmOpener=document.activeElement;filmDialog.showModal();document.body.style.overflow='hidden';}filmDialog.scrollTop=0;filmPlayer.play().catch(()=>{});}
featuredFilmButtons.forEach(button=>{
  const filmId=Number(button.dataset.featuredFilm);
  featuredFilmIds.add(filmId);
  button.addEventListener('click',()=>openFilm(films.findIndex(film=>film.id===filmId)));
});
document.querySelector('#closeFilm').addEventListener('click',()=>filmDialog.close());
document.querySelector('#nextFilm').addEventListener('click',()=>openFilm((filmIndex+1)%films.length));
document.querySelector('#prevFilm').addEventListener('click',()=>openFilm((filmIndex+films.length-1)%films.length));
filmDialog.addEventListener('close',()=>{filmPlayer.pause();filmPlayer.removeAttribute('src');filmPlayer.load();document.body.style.overflow='';filmOpener?.focus({preventScroll:true});});
filmDialog.addEventListener('click',e=>{if(e.target===filmDialog){const r=filmDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)filmDialog.close();}});
fetch('assets/films/films.json')
  .then(response=>{
    if(!response.ok)throw Error();
    return response.json();
  })
  .then(data=>{
    films=data;
    const filmGrid=document.querySelector('#filmGrid');
    films.forEach((film,index)=>{
      if(featuredFilmIds.has(film.id))return;
      const article=document.createElement('article');
      article.className='film-card';
      article.dataset.filmCategory=film.category;
      article.innerHTML=`<button aria-label="播放视频：${film.subtitle}"><div class="film-thumb ${film.height>film.width?'vertical-film':''}"><img src="assets/films/${film.poster}" alt="${film.subtitle}封面" loading="lazy" width="960" height="540"><span class="small-play"><ui-icon aria-hidden='true'>▶<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round' focusable='false'><path d='M8 5l11 7-11 7z' fill='currentColor' stroke='none'/></svg></ui-icon></span><span class="film-duration">${durationLabel(film.duration)}</span></div><div class="film-card-caption"><div><h4>${film.title}</h4><p>${film.subtitle}</p></div><span>${String(index+1).padStart(2,'0')} <ui-icon aria-hidden='true'>↗<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round' focusable='false'><path d='M5 19 19 5M5 5h14v14' /></svg></ui-icon></span></div></button>`;
      article.querySelector('button').addEventListener('click',()=>openFilm(index));
      filmGrid.append(article);
    });
  })
  .catch(()=>{document.querySelector('#filmGrid').textContent='视频列表暂时无法加载，请刷新重试。';});
document.querySelectorAll('[data-film-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-film-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});document.querySelectorAll('.film-card').forEach(card=>card.hidden=button.dataset.filmFilter!=='all'&&card.dataset.filmCategory!==button.dataset.filmFilter);}));
