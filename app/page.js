'use client';
import {useState,useRef,useEffect} from 'react';
import {topics} from '../lib/settings.mjs';
export default function Home(){
 const [topic,setTopic]=useState('intro'),[level,setLevel]=useState('beginner'),[messages,setMessages]=useState([{role:'assistant',content:topics.intro.opening}]),[text,setText]=useState(''),[code,setCode]=useState(''),[busy,setBusy]=useState(false),[recording,setRecording]=useState(false),[error,setError]=useState(''),[help,setHelp]=useState(false),[feedback,setFeedback]=useState(''),[consent,setConsent]=useState(false),[audio,setAudio]=useState('');
 const recorder=useRef(null),stream=useRef(null),timer=useRef(null),end=useRef(null),cancelled=useRef(false);
 const count=messages.filter(m=>m.role==='user').length;
 useEffect(()=>{end.current?.scrollIntoView({behavior:'smooth',block:'nearest'});},[messages,busy]);
 useEffect(()=>()=>{cancelled.current=true;clearTimeout(timer.current);stream.current?.getTracks().forEach(t=>t.stop());},[]);
 function reset(t=topic,l=level){setTopic(t);setLevel(l);setMessages([{role:'assistant',content:topics[t].opening}]);setFeedback('');setError('');setAudio('');setText('');setHelp(false);}
 async function send(action='chat',blob=null){
  if(busy || (action==='chat'&&!blob&&!text.trim()))return;
  if(!consent){setError('Setujui pengiriman data latihan terlebih dahulu.');return;}
  setBusy(true);setError('');setAudio('');
  const data=new FormData();data.append('topic',topic);data.append('level',level);data.append('code',code);data.append('action',action);data.append('history',JSON.stringify(messages));
  if(blob)data.append('audio',blob,blob.type.includes('mp4')?'recording.mp4':blob.type.includes('ogg')?'recording.ogg':'recording.webm');else data.append('text',text);
  try{const res=await fetch('/api/practice',{method:'POST',body:data});const out=await res.json();if(!res.ok)throw new Error(out.error||'Layanan tidak tersedia.');
   if(action==='feedback')setFeedback(out.reply);else {setMessages(m=>[...m,{role:'user',content:out.transcript},{role:'assistant',content:out.reply}]);setText('');if(out.audio)setAudio(`data:audio/mp3;base64,${out.audio}`);if(out.audioWarning)setError(out.audioWarning);}
  }catch(e){setError(e.message||'Koneksi bermasalah. Coba lagi.');}finally{setBusy(false);}
 }
 async function toggleRecord(){
  if(recording){clearTimeout(timer.current);recorder.current?.stop();setRecording(false);return;}
  if(!consent){setError('Setujui pengiriman data latihan terlebih dahulu.');return;}
  setError('');setAudio('');
  try{
   if(!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder)throw new Error('Browser belum mendukung rekaman. Gunakan Chrome/Safari terbaru atau kirim teks.');
   stream.current=await navigator.mediaDevices.getUserMedia({audio:true});
   const mime=['audio/webm;codecs=opus','audio/mp4','audio/ogg;codecs=opus'].find(t=>MediaRecorder.isTypeSupported(t));
   const rec=new MediaRecorder(stream.current,mime?{mimeType:mime}:{});recorder.current=rec;const chunks=[];
   rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
   rec.onstop=()=>{clearTimeout(timer.current);stream.current?.getTracks().forEach(t=>t.stop());setRecording(false);if(!cancelled.current)send('chat',new Blob(chunks,{type:rec.mimeType}));};
   rec.onerror=()=>{clearTimeout(timer.current);stream.current?.getTracks().forEach(t=>t.stop());setRecording(false);setError('Rekaman gagal. Silakan coba lagi.');};
   rec.start();setRecording(true);timer.current=setTimeout(()=>{if(rec.state==='recording')rec.stop();},45000);
  }catch(e){stream.current?.getTracks().forEach(t=>t.stop());setError(e.name==='NotAllowedError'?'Izinkan akses mikrofon melalui pengaturan browser.':e.message);}
 }
 function download(){const content=messages.map(m=>`${m.role==='user'?'Siswa':'Kalam AI'}: ${m.content}`).join('\n\n')+(feedback?'\n\nUmpan balik:\n'+feedback:'');const url=URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='latihan-kalam-ai.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 return <main><header><a href="/" className="brand"><span className="logo">ك</span><span>Kalam<span className="accent">AI</span><small>TEMAN MUHADATSAH</small></span></a><span className="tag">Bahasa Arab · Fusha</span></header>
 <section className="hero"><div className="eyebrow">RUANG LATIHAN BERBICARA</div><h1>Berani bicara.<br/><em>Mulai satu percakapan.</em></h1><p>Latih bahasa Arabmu melalui obrolan singkat, tema sehari-hari, dan bantuan saat kamu membutuhkannya.</p></section>
 <div className="workspace"><aside><div className="section-label">01 / ATUR LATIHAN</div><h2>Mau ngobrol tentang apa?</h2><div className="topics">{Object.entries(topics).map(([key,t])=><button disabled={busy||recording} className={'topic '+(topic===key?'selected':'')} key={key} onClick={()=>reset(key)}><span lang="ar" dir="rtl">{t.arabic}</span><strong>{t.title}</strong></button>)}</div>
 <label className="field">Tingkat kemampuan<select value={level} disabled={busy||recording} onChange={e=>reset(topic,e.target.value)}><option value="beginner">Pemula · kalimat sederhana</option><option value="intermediate">Menengah · cerita lebih panjang</option></select></label>
 <label className="field">Kode kelas<input type="password" value={code} onChange={e=>setCode(e.target.value)} placeholder="Dari guru / pengelola" autoComplete="off"/></label>
 <div className="goal"><small>TARGET HARI INI</small><p>{topics[topic].goal}</p><span>{count} dari 8 giliran latihan</span><progress value={Math.min(count,8)} max="8"/></div>
 <p className="note">Mengganti tema atau tingkat akan memulai sesi baru. Unduh percakapan jika ingin menyimpannya.</p></aside>
 <section className="chat"><div className="chat-head"><div><span className="status-dot"/>Partner latihan<h2 lang="ar">هَيَّا نَتَكَلَّمُ</h2></div><button className="quiet" disabled={busy||recording} onClick={()=>reset()}>Sesi baru ↻</button></div>
 <div className="messages" aria-live="polite">{messages.map((m,i)=><article key={i} className={'bubble '+m.role}><small>{m.role==='user'?'KAMU':'KALAM AI'}</small><p lang="ar" dir="rtl">{m.content}</p></article>)}{busy&&<p className="thinking" role="status">Kalam AI sedang menyiapkan jawaban…</p>}<div ref={end}/></div>
 <div className="composer">{audio&&<div className="audio"><small>Jawaban suara AI</small><audio key={audio} controls autoPlay src={audio}/></div>}{help&&<div className="help"><small>KOSAKATA</small><p>{topics[topic].words}</p><p lang="ar" dir="rtl">{topics[topic].help}</p></div>}
 {error&&<p className="error" role="alert">{error}</p>}
 <label className="consent"><input type="checkbox" checked={consent} disabled={busy||recording} onChange={e=>setConsent(e.target.checked)}/>Saya setuju mengirim audio dan teks latihan ke layanan AI. Hindari nama lengkap dan data pribadi.</label>
 <div className="record-row"><button className={'mic '+(recording?'recording':'')} onClick={toggleRecord} disabled={busy||count>=10}>{recording?'■ Hentikan & kirim':'● Mulai bicara'}</button><span>{recording?'Sedang merekam · maksimal 45 detik':'Tekan, bicara bahasa Arab, lalu hentikan.'}</span></div>
 <form onSubmit={e=>{e.preventDefault();send();}}><input aria-label="Pesan bahasa Arab" lang="ar" dir="auto" placeholder="Atau ketik jawaban bahasa Arab…" value={text} maxLength={1200} disabled={busy||recording||count>=10} onChange={e=>setText(e.target.value)}/><button disabled={busy||recording||!text.trim()||count>=10}>Kirim ↑</button></form>
 <div className="tools"><button disabled={busy||recording} onClick={()=>setHelp(!help)}>{help?'Tutup bantuan':'Butuh bantuan?'}</button><button disabled={!count||busy||recording} onClick={()=>send('feedback')}>Evaluasi latihan</button><button disabled={busy||recording} onClick={download}>Unduh teks</button></div>{count>=10&&<p className="note">Sesi selesai. Lihat evaluasi, unduh hasil, lalu mulai sesi baru.</p>}</div></section></div>
 {feedback&&<section className="feedback"><div className="eyebrow">CATATAN LATIHANMU</div><h2>Satu langkah lebih baik</h2><p>{feedback}</p><small>AI meninjau teks percakapan. Catatan ini bukan penilaian pelafalan atau nilai resmi.</small></section>}
 <footer><strong>Kalam AI</strong><span>Latihan kecil, dilakukan secara rutin.</span><p>Suara berasal dari AI. Sistem mengirim rekaman untuk transkripsi dan tidak menyimpan sesi dalam database aplikasi. Penyedia AI memproses data sesuai kebijakannya. Latihan ini tidak menjamin peningkatan kemampuan tanpa evaluasi pembelajaran.</p></footer></main>;
}
