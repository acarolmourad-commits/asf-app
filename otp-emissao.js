(function(){
'use strict';
const form=document.getElementById('cadastro-form');
const section=document.getElementById('cadastro-section');
const otpSection=document.getElementById('otp-section');
const otpForm=document.getElementById('otp-form');
const otpInput=document.getElementById('otp-code');
const otpVerify=document.getElementById('otp-verify');
const otpResend=document.getElementById('otp-resend');
const otpBack=document.getElementById('otp-back');
const result=document.getElementById('resultado-section');
const status=document.getElementById('cadastro-status');
const button=document.getElementById('cad-submit');
let pendingPayload=null,verifiedAccessToken=null,currentCard=null,busy=false,resendTimer=null,resendSeconds=0;
const feedback=(message,error)=>{status.textContent=message;status.className=error?'error':'';};
if(typeof ASF_CARD==='undefined'){button.disabled=true;feedback('Não foi possível carregar a emissão. Atualize a página para tentar novamente.',true);return;}
const originalLoad=ASF_CARD.load.bind(ASF_CARD);
const originalSave=ASF_CARD.save.bind(ASF_CARD);
ASF_CARD.load=()=>currentCard;
ASF_CARD.save=function(d){currentCard=d;try{originalSave(d);}catch(e){showToast('Cadastro confirmado. Baixe o PNG: este navegador não permitiu salvar a cópia local.');}};
ASF_CARD.init=function(){if(currentCard)this.renderCard(document.getElementById('carteirinha-content'),currentCard);};
ASF_CARD.render=function(){this.init();};
ASF_CARD.editar=function(){result.hidden=true;section.hidden=false;otpSection.hidden=true;feedback('Confira seus dados e envie novamente.');document.getElementById('cad-nome').focus();};
const api=ASF_CARD.SUPABASE_URL;
const anon=ASF_CARD.SUPABASE_ANON_KEY;
async function authPost(path,body){
 const r=await fetch(api+'/auth/v1/'+path,{method:'POST',headers:{apikey:anon,'Content-Type':'application/json'},body:JSON.stringify(body)});
 const data=await r.json().catch(()=>({}));
 if(!r.ok)throw new Error(data.msg||data.message||data.error_description||'Não foi possível concluir a verificação.');
 return data;
}
function startCooldown(seconds){
 clearInterval(resendTimer);resendSeconds=seconds;otpResend.disabled=true;
 const tick=()=>{otpResend.textContent=resendSeconds>0?'Reenviar código ('+resendSeconds+'s)':'Reenviar código';otpResend.disabled=resendSeconds>0||busy;if(resendSeconds>0)resendSeconds--;else clearInterval(resendTimer);};
 tick();resendTimer=setInterval(tick,1000);
}
async function sendOtp(){
 if(!pendingPayload||busy)return;
 busy=true;otpResend.disabled=true;otpVerify.disabled=true;
 try{
  await authPost('otp',{email:pendingPayload.email,create_user:true});
  feedback('Se o endereço estiver correto, o Supabase enviará um código. Confira a caixa de entrada e o spam.');
  startCooldown(60);otpSection.hidden=false;section.hidden=true;otpInput.focus();
 }catch(e){feedback('Não foi possível enviar o código agora. Aguarde um pouco e tente novamente. '+String(e.message||''),true);otpResend.disabled=false;}
 finally{busy=false;otpVerify.disabled=false;}
}
async function issue(payload,accessToken){
 const args={p_numero:payload.numero,p_email_hash:payload.email_hash,p_nome:payload.nome,p_apelido:payload.apelido||null,p_nivel:payload.nivel||null,p_praia:payload.praia||null,p_cidade:payload.cidade||null,p_insta:payload.insta||null};
 const r=await fetch(api+'/rest/v1/rpc/emitir_carteirinha',{method:'POST',headers:{apikey:anon,Authorization:'Bearer '+accessToken,'Content-Type':'application/json'},body:JSON.stringify(args)});
 const data=await r.json().catch(()=>({}));
 if(!r.ok)throw new Error(data.message||'A confirmação foi concluída, mas a emissão não pôde ser finalizada.');
 const row=Array.isArray(data)?data[0]:data;
 if(!row||!/^ASF-[A-Z0-9]{6,12}$/.test(row.numero)||!/^\d{4}-\d{2}-\d{2}$/.test(row.validade))throw new Error('O servidor não retornou uma carteirinha válida.');
 return row;
}
form.addEventListener('submit',async event=>{
 event.preventDefault();if(busy||!form.reportValidity())return;
 const value=id=>document.getElementById(id).value.trim();
 const nome=value('cad-nome'),email=value('cad-email').toLowerCase(),nivel=value('cad-nivel');
 if(nome.length<2||!ASF_CARD.niveis.includes(nivel)){feedback('Confira seu nome e selecione seu nível.',true);return;}
 pendingPayload={nome,email,nivel,apelido:value('cad-apelido'),praia:value('cad-praia'),cidade:value('cad-cidade'),insta:value('cad-insta'),numero:ASF_CARD.gerarNumero()};
 await sendOtp();
});
otpForm.addEventListener('submit',async event=>{
 event.preventDefault();if(busy||!pendingPayload||!otpForm.reportValidity())return;
 const token=otpInput.value.trim();if(!/^\d{8}$/.test(token)){feedback('Digite os 8 números do código recebido.',true);return;}
 busy=true;otpVerify.disabled=true;otpResend.disabled=true;otpVerify.textContent='Validando código…';
 try{
  const verified=await authPost('verify',{email:pendingPayload.email,token,type:'email'});
  const accessToken=verified.access_token,user=verified.user||{};
  const verifiedEmail=String(user.email||'').trim().toLowerCase();
  if(!accessToken||!verifiedEmail||verifiedEmail!==pendingPayload.email||!user.email_confirmed_at)throw new Error('Não foi possível confirmar a titularidade deste e-mail. Solicite um novo código.');
  verifiedAccessToken=accessToken;
  const emailHash=await ASF_CARD.sha256(verifiedEmail);
  const payload={...pendingPayload,email_hash:emailHash};
  feedback('E-mail confirmado. Registrando sua carteirinha com segurança…');
  const row=await issue(payload,verifiedAccessToken);
  const old=originalLoad()||{},same=old.emailHash===emailHash&&old.numero===row.numero;
  const d={nome:payload.nome,nivel:payload.nivel,praia:payload.praia,apelido:payload.apelido,cidade:payload.cidade,insta:payload.insta,numero:row.numero,validade:row.validade.split('-').reverse().join('/'),desde:same&&old.desde?old.desde:new Date().toLocaleDateString('pt-BR'),foto:same?old.foto||null:null,emailHash,lgpdConsent:new Date().toISOString(),registrada:new Date().toISOString()};
  ASF_CARD.save(d);section.hidden=true;otpSection.hidden=true;result.hidden=false;ASF_CARD.init();
  feedback(row.status==='existente'?'Cadastro confirmado. Sua carteirinha permanece válida até '+d.validade+'.':row.status==='renovada'?'E-mail confirmado e carteirinha renovada até '+d.validade+'.':'E-mail confirmado e carteirinha emitida até '+d.validade+'.');
  result.scrollIntoView({behavior:'smooth',block:'start'});pendingPayload=null;verifiedAccessToken=null;otpForm.reset();
 }catch(e){feedback(String(e.message||'Não foi possível confirmar o código ou concluir a emissão.'),true);}
 finally{busy=false;otpVerify.disabled=false;otpVerify.textContent='Confirmar e emitir carteirinha';if(resendSeconds<=0)otpResend.disabled=false;}
});
otpResend.addEventListener('click',sendOtp);
otpBack.addEventListener('click',()=>{clearInterval(resendTimer);pendingPayload=null;otpForm.reset();otpSection.hidden=true;section.hidden=false;feedback('Confira o endereço de e-mail e envie o formulário novamente.');document.getElementById('cad-email').focus();});
document.getElementById('novo-cadastro').addEventListener('click',()=>{clearInterval(resendTimer);pendingPayload=null;verifiedAccessToken=null;currentCard=null;result.hidden=true;otpSection.hidden=true;section.hidden=false;form.reset();otpForm.reset();feedback('');document.getElementById('cad-nome').focus();});
})();