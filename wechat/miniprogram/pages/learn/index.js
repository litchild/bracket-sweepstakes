const C=require('../../utils/catalog');
const S=require('../../utils/store');
const Camp=require('../../utils/camp');
const V=require('../../utils/view');
function miniTeam(id){const g=C.archive[2026].games.find(g=>g.round===1&&g.teams.some(t=>t.id===id));return V.historical(g.teams.find(t=>t.id===id));}
Page({
  data:{mode:'games',index:0,quizIndex:0,notice:'',quizFeedback:'',showRules:false},
  onLoad(query){if(query.practice!==undefined)this.setData({index:Math.max(0,Math.min(5,Number(query.practice)||0))});this.refresh();},
  onShow(){this.refresh();},
  refresh(){
    const state=S.load(),progress=Camp.campStats(state.practice,state.camp),def=C.practice[this.data.index];
    const answer=state.practice[this.data.index],winner=def.game.teams.find(t=>t.won);
    const practice=Object.assign({},def,{teams:def.game.teams.map(t=>Object.assign(V.historical(t),{picked:t.id===answer})),answer:answer||'',winner:winner.name});
    const mini=['a','b','final'].map((slot,i)=>{
      const ids=slot==='final'?(state.camp.mini.a&&state.camp.mini.b?[state.camp.mini.a,state.camp.mini.b]:[]):Camp.MINI_SIDES[slot];
      return {slot,label:i===2?'Championship':'Semifinal '+(i+1),teams:ids.map(id=>Object.assign(miniTeam(id),{picked:state.camp.mini[slot]===id}))};
    });
    const q=Camp.QUIZ_ITEMS[this.data.quizIndex],done=state.camp.quiz[q.id]===q.answer;
    this.setData({progress,practice,steps:C.practice.map((g,i)=>({index:i,label:state.practice[i]?'✓':String(i+1),active:i===this.data.index})),mini,miniDone:state.camp.miniDone,
      quiz:Object.assign({},q,{done,options:q.options.map((text,i)=>({index:i,text,correct:done&&i===q.answer}))}),quizSteps:Camp.QUIZ_ITEMS.map((q,i)=>({index:i,label:state.camp.quiz[q.id]===q.answer?'✓':String(i+1)}))});
  },
  mode(e){this.setData({mode:e.currentTarget.dataset.value,notice:''});},
  gameStep(e){this.setData({index:Number(e.currentTarget.dataset.index),notice:''});this.refresh();},
  pick(e){
    const before=S.stats().xp;S.practicePick(this.data.index,e.currentTarget.dataset.id);this.reward(before);this.refresh();
  },
  next(){this.setData(this.data.index<5?{index:this.data.index+1,notice:''}:{mode:'mini',notice:''});this.refresh();},
  miniPick(e){const before=S.stats().xp;S.miniPick(e.currentTarget.dataset.slot,e.currentTarget.dataset.id);this.reward(before);this.refresh();},
  replay(){S.change(s=>{s.camp.mini={};});this.setData({notice:'New mini bracket. Your earned XP stays.'});this.refresh();},
  reward(before){const earned=S.stats().xp-before;if(earned>0){this.setData({notice:'+'+earned+' practice XP'});wx.vibrateShort({type:'light'});}},
  quizStep(e){this.setData({quizIndex:Number(e.currentTarget.dataset.index),quizFeedback:''});this.refresh();},
  answer(e){
    const before=S.stats().xp,correct=S.quizPick(this.data.quiz.id,Number(e.currentTarget.dataset.index));
    this.setData({quizFeedback:correct?'That’s it! '+this.data.quiz.why:'Try again. '+this.data.quiz.why});this.reward(before);this.refresh();
  },
  rules(){this.setData({showRules:!this.data.showRules});},
  bracket(){V.go('bracket');},
  onShareAppMessage(){return V.share('Ten quick challenges. Get March ready.','/pages/learn/index');}
});
