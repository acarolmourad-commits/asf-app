function closeAllModals(){
  {const m=document.getElementById('premium-modal');if(m)m.style.display='none';}
  {const m2=document.getElementById('pix-modal');if(m2)m2.style.display='none';}
  {const m3=document.getElementById('referral-modal');if(m3)m3.style.display='none';}
  {const m4=document.getElementById('brand-support');if(m4)m4.style.display='none';}
  const campaign = document.getElementById('campaign-modal');
  if(campaign) campaign.style.display='none';
  document.body.style.overflow='';
}
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape'){
    closeAllModals();
  }
});
