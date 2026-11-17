(() => {
 const C=window.birthdayContent, $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 const scenes=$$('.scene'), audio=$('#bgMusic'), overlay=$('#overlay'), modal=$('#modalContent'); let scene=1, collected=new Set(), currentItem=null, musicStarted=false;
 audio.src=new URL(C.global.music, document.baseURI).href; audio.autoplay=true; const tryStartMusic=()=>audio.play().then(()=>{musicStarted=true;musicLabel()}).catch(()=>{musicStarted=false;musicLabel()}); tryStartMusic(); document.addEventListener('pointerdown',()=>{if(audio.paused)tryStartMusic()},{once:true}); $('#sender').textContent=`From ${C.global.sender}`; $('#crownPhoto').src=C.scene1.crownPhoto;
 function go(n){scenes.forEach(x=>x.classList.remove('active'));$('#scene'+n).classList.add('active');scene=n;if(n===1&&!musicStarted){tryStartMusic()}if(n===3)renderCollection();}
 function musicLabel(){ $('#musicToggle span').textContent=audio.paused?'开启音乐':'暂停音乐'}
 $('#musicToggle').onclick=()=>{if(audio.paused){audio.play().then(()=>{musicStarted=true;musicLabel()}).catch(()=>toast('请再次点击开启音乐'))}else{audio.pause();musicLabel()}};
 function toast(t){let el=$('#toast');el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2200)}
 function sparkle(x=innerWidth/2,y=innerHeight/2){for(let i=0;i<12;i++){let p=document.createElement('i');p.textContent=['✦','✧','·'][i%3];p.style.cssText=`position:fixed;z-index:25;left:${x}px;top:${y}px;color:${['#fff1bf','#e7a97e','#fff'][i%3]};pointer-events:none;font-size:${10+Math.random()*16}px;transition:all .8s;`;document.body.append(p);requestAnimationFrame(()=>{p.style.transform=`translate(${(Math.random()-.5)*180}px,${(Math.random()-.5)*140}px) rotate(90deg)`;p.style.opacity=0});setTimeout(()=>p.remove(),900)}}
 $('#lightCandle').onclick=e=>{e.currentTarget.style.display='none';$('#greeting').classList.add('show');$('#polaroid').classList.add('show');$('#candle').classList.add('lit');$('#crownBtn').classList.add('show');sparkle()};
 $('#crownBtn').onclick=()=>{$('#crown').classList.add('crowned');$('#crownBtn').style.display='none';$('#toRoom').classList.add('show');sparkle(innerWidth*.78,innerHeight*.3)};
 $('#toRoom').onclick=()=>go(2);$('#backOne').onclick=()=>go(1);$('#backRoom').onclick=()=>go(2);$('#door').onclick=()=>go(4);
 function openModal(html){modal.innerHTML=html;overlay.classList.add('show')};function closeModal(){overlay.classList.remove('show');modal.innerHTML='';if(currentItem){currentItem=null;if(collected.size===6)finishGacha()}}$('#closeModal').onclick=closeModal;overlay.addEventListener('click',e=>{if(e.target===overlay)closeModal()});
 $('#vanity').onclick=()=>openModal(`<div class="tiny">A LITTLE THROWBACK</div><img src="${C.scene2.memoryPhoto}"><p>${C.scene2.memoryText}</p>`);
 function renderCollection(){let el=$('#collection');el.innerHTML='';C.scene3.items.forEach((it,i)=>{let d=document.createElement('button');d.className='slot-card'+(collected.has(it.id)?' filled':'');d.setAttribute('aria-label',`回忆 ${i+1}`);if(collected.has(it.id))d.innerHTML=`<img src="${it.image}">`;else d.textContent=`${String(i+1).padStart(2,'0')}`;d.onclick=()=>{if(collected.has(it.id))showItem(it);else toast('先转动扭蛋机，收集这枚回忆')};el.appendChild(d)});$('#progress').textContent=`已收集 ${collected.size} / 6`}
 $('#gachaEntry').onclick=()=>go(3);$('#turnKnob').onclick=()=>{if(collected.size===6){finishGacha();return}let b=$('.gacha-big');b.classList.add('shake');setTimeout(()=>b.classList.remove('shake'),550);let remain=C.scene3.items.filter(i=>!collected.has(i.id));let item=remain[Math.floor(Math.random()*remain.length)];collected.add(item.id);currentItem=item;renderCollection();sparkle();setTimeout(()=>openModal(`<div class="tiny">A MEMORY JUST FOR YOU</div><div class="open-capsule">✦　胶囊打开了　✦</div><img src="${item.image}"><p>${item.text}</p><button class="pill" id="itemClose" style="position:static;margin-top:8px">收好这枚回忆</button>`),500);setTimeout(()=>{let b=$('#itemClose');if(b)b.onclick=closeModal},550)};
 function showItem(it){currentItem=it;openModal(`<div class="tiny">YOUR COLLECTED MEMORY</div><img src="${it.image}"><p>${it.text}</p>`)}
 function finishGacha(){if(collected.size<6)return;openModal(`<div class="tiny">ALL MEMORIES COLLECTED</div><div style="font-size:42px;color:#c6a65f">✦ ✧ ✦</div><p>恭喜你，集齐了所有回忆！</p><button class="pill" id="goBeach" style="position:static">前往最后的惊喜 →</button>`);setTimeout(()=>{let b=$('#goBeach');if(b)b.onclick=()=>{closeModal();go(4)}},20)}
 $('#bottle').onclick=()=>{let b=$('#bottle');b.style.animation='shake .6s';setTimeout(()=>{b.style.opacity='.25';$('#finalNote').innerHTML=`<div class="tiny">A LETTER FROM THE SEA</div><p>${C.scene4.letterText}</p>${C.scene4.finalText?`<p>${C.scene4.finalText}</p>`:''}`;$('#finalNote').classList.add('show');$('#replay').classList.add('show');sparkle(innerWidth*.63,innerHeight*.72)},650)};
 $('#backGacha').onclick=()=>go(2);$('#replay').onclick=()=>{$('#finalNote').classList.remove('show');$('#replay').classList.remove('show');$('#bottle').style.opacity='1';$('#bottle').style.animation=''};
 let start=null, roomDrag=false;$('#roomArt').addEventListener('pointerdown',e=>{start={x:e.clientX,tx:parseFloat($('#roomArt').dataset.tx||0)}});$('#roomArt').addEventListener('pointermove',e=>{if(!start||innerWidth<650)return;let dx=e.clientX-start.x;let tx=Math.max(-70,Math.min(70,start.tx+dx*.35));$('#roomArt').dataset.tx=tx;$('#roomArt').style.transform=`translateX(${tx}px)`});window.addEventListener('pointerup',()=>start=null);
 // Small mechanical sound generated locally; no external dependencies.
 $('#turnKnob').addEventListener('pointerdown',()=>{try{let a=new AudioContext(),o=a.createOscillator(),g=a.createGain();o.type='triangle';o.frequency.setValueAtTime(180,a.currentTime);o.frequency.exponentialRampToValueAtTime(75,a.currentTime+.22);g.gain.setValueAtTime(.08,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.25);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+.26);o.onended=()=>a.close()}catch{}});
})();








