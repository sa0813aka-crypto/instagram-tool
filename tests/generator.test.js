import test from 'node:test';
import assert from 'node:assert/strict';
import {generatePlan} from '../generator.js';
const base={theme:'朝のスキンケア',target:'美容初心者',purpose:'保存して試す'};
test('フィードに全ページ・CTA・キャプションと入力内容が含まれる',()=>{const p=generatePlan({...base,format:'feed'});assert.equal(p.pages.length,5);assert.ok(p.pages.every(x=>x.heading&&x.body));assert.ok(p.pages.at(-1).cta.includes('保存'));assert.ok(p.title.includes(base.theme));assert.ok(!p.title.includes(base.target));assert.ok(p.caption.includes(base.target));assert.ok(!p.caption.includes("この投稿の目的"));assert.ok(p.caption);});
test('リールにフック・5シーン・素材・30秒の構成・CTAが含まれる',()=>{const p=generatePlan({...base,format:'reel',purpose:'フォローを増やす'});assert.ok(p.hook.includes(base.theme));assert.equal(p.scenes.length,5);assert.ok(p.scenes.every(x=>x.time&&x.text&&x.visual));assert.ok(p.scenes.at(-1).time.includes('30秒'));assert.ok(p.cta.includes('フォロー'));assert.ok(p.caption);});
test('空白の入力と不正な形式を拒否する',()=>{for(const key of ['theme','target','purpose'])assert.throws(()=>generatePlan({...base,format:'feed',[key]:'  '}));assert.throws(()=>generatePlan({...base,format:'invalid'}));});

test('選択された目的に合うCTAと共感の構成を作る',()=>{
 for(const [purpose,word] of [['知ってもらいたい','気になった'],['保存してもらいたい','保存'],['共感してもらいたい','私も'],['フォローにつなげたい','フォロー'],['問い合わせ・申込みにつなげたい','お問い合わせ']]){
 const p=generatePlan({...base,format:'feed',purpose});assert.ok(p.cta.includes(word));if(purpose.includes('共感'))assert.ok(p.pages[1].heading.includes('うまくいかない'));
 }
});
test('その他は自由入力から生成し、空白は拒否する',()=>{
 assert.ok(generatePlan({...base,format:'reel',purpose:'other',purposeOther:'シェアしてほしい'}).cta.includes('シェア'));
 assert.throws(()=>generatePlan({...base,format:'feed',purpose:'other',purposeOther:'  '}));
});
