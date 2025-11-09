(function(){
  const AUTO_MS=6000;
  const TRANSITION=500;
  const cardsSource=document.querySelector('.cards-source');
  if(!cardsSource) return;
  const cardNodes=Array.from(cardsSource.querySelectorAll('.testimonial-card'));
  if(!cardNodes.length) return;
  const sliderRoot=document.querySelector('.slider-root');
  const dotsRoot=document.querySelector('.dots-root');
  const track=document.createElement('div');
  track.className='slider-track';
  const PALETTE=['#C8F7E0','#E6D8FF','#D7EAFE'];
  const MINT='#C8F7E0';
  cardNodes.forEach((card,i)=>{
    track.appendChild(card);
    const base=PALETTE[i%PALETTE.length];
    card.dataset.baseColor=base;
    card.style.background=base;
  });
  sliderRoot.appendChild(track);
  const dots=[];
  cardNodes.forEach((_,i)=>{
    const b=document.createElement('button');
    b.type='button';
    b.dataset.index=i;
    b.addEventListener('click',()=>{ goTo(i); restartAuto(); });
    dotsRoot.appendChild(b);
    dots.push(b);
  });
  dotsRoot.style.display='flex';
  const gap=parseInt(getComputedStyle(track).gap)||20;
  const cardRect=cardNodes[0].getBoundingClientRect();
  const cardW=Math.round(cardRect.width)||320;
  const sliderWidth=sliderRoot.clientWidth;
  const centerOffset=(sliderWidth/2)-(cardW/2);
  let index=0;
  const total=cardNodes.length;
  let autoTimer=null;
  function clampIdx(i){ return ((i%total)+total)%total; }
  function applyClasses(){
    cardNodes.forEach(c=>{ c.classList.remove('center','side','dim'); });
    const c=clampIdx(index);
    const left=clampIdx(index-1);
    const right=clampIdx(index+1);
    cardNodes[c].classList.add('center');
    cardNodes[c].style.background=MINT;
    if(cardNodes[left]){
      cardNodes[left].classList.add('side');
      cardNodes[left].style.background=cardNodes[left].dataset.baseColor;
    }
    if(cardNodes[right]){
      cardNodes[right].classList.add('side');
      cardNodes[right].style.background=cardNodes[right].dataset.baseColor;
    }
    cardNodes.forEach((card,idx)=>{
      if(idx!==c && idx!==left && idx!==right){
        card.classList.add('dim');
        card.style.background=card.dataset.baseColor;
      }
    });
    dots.forEach((d,i)=>d.classList.toggle('active',i===c));
  }
  function updatePosition(animate=true){
    const x=-(index*(cardW+gap))+centerOffset;
    if(!animate){
      track.style.transition='none';
      track.style.transform=`translateX(${x}px)`;
      void track.offsetWidth;
      track.style.transition=`transform ${TRANSITION}ms ease`;
    } else {
      track.style.transform=`translateX(${x}px)`;
    }
    applyClasses();
  }
  function goTo(i){ index=clampIdx(i); updatePosition(true); }
  function next(){ goTo(index+1); }
  function prev(){ goTo(index-1); }
  function startAuto(){ stopAuto(); autoTimer=setInterval(()=>{ next(); },AUTO_MS); }
  function stopAuto(){ if(autoTimer){ clearInterval(autoTimer); autoTimer=null; } }
  function restartAuto(){ stopAuto(); startAuto(); }
  sliderRoot.addEventListener('mouseenter',stopAuto);
  sliderRoot.addEventListener('mouseleave',startAuto);
  sliderRoot.addEventListener('focusin',stopAuto);
  sliderRoot.addEventListener('focusout',startAuto);
  window.addEventListener('keydown',(e)=>{ if(e.key==='ArrowLeft'){ prev(); restartAuto(); } if(e.key==='ArrowRight'){ next(); restartAuto(); } });
  track.addEventListener('click',(ev)=>{
    const card=ev.target.closest('.testimonial-card');
    if(!card) return;
    const i=cardNodes.indexOf(card);
    if(i===-1) return;
    if(i!==index){ goTo(i); restartAuto(); }
  });
  index=1<total?1:0;
  track.style.transition=`transform ${TRANSITION}ms ease`;
  updatePosition(false);
  startAuto();
  window.__testimonialSlider={ goTo, next, prev, startAuto, stopAuto };
})();