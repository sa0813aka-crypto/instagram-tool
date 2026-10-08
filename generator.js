export function generatePlan({theme,target,format,purpose,purposeOther,designStyle,designColors,designReference}) {
 if(purpose==='other')purpose=purposeOther;
 const values=[theme,target,purpose];
 if(values.some(v=>typeof v!=='string'||!v.trim())) throw new Error('投稿テーマ・ターゲット・投稿の目的を入力してください。');
 if(!['feed','reel'].includes(format)) throw new Error('投稿形式を選んでください。');
 [theme,target,purpose]=values.map(v=>v.trim());
 const lines=theme.split(/\r?\n/).map(line=>line.trim()).filter(Boolean);
 theme=lines[0];
 const details=lines.slice(1);
 const design={style:designStyle?.trim()||'やさしくシンプル',colors:designColors?.trim()||'白をベースに、くすみグリーンをアクセントに',reference:designReference?.trim()||''};
 const designGuide=`雰囲気：${design.style}\n色：${design.colors}\n文字は大きめにし、背景と文字の色に差をつけます。ページごとに色と書体をそろえましょう。${design.reference?'\n見本・希望に合わせるポイント：'+design.reference:''}`;
 const imageSubjects=['テーマに関連する小物や日常の場面の写真。タイトルを上半分に大きく配置。','伝えたい内容がわかる写真やアイコンを一つ配置。','実際の手順や使う道具がわかる手元の写真。','大切なポイントを整理したチェックリストや図解。','3つのポイントを並べたまとめカード。下部にCTAを配置。'];
 const imageFor=(heading,i)=>`「${heading}」を伝える画像：${imageSubjects[i]}\n雰囲気：${design.style}。色：${design.colors}。${design.reference?'\nデザインの希望：'+design.reference:''}`;
 const empathy=/共感/.test(purpose);
 const cta=/保存|見返/.test(purpose)?'あとで見返せるように、この投稿を保存しておいてください。':/フォロー/.test(purpose)?'これからも役立つヒントをお届けします。続きが気になる方は、ぜひフォローしてください。':/問い合わせ|申込|購入|販売|予約/.test(purpose)?'詳しく知りたい方は、プロフィールの案内からお問い合わせ・お申込みください。':empathy?'「私もそうかも」と思ったら、コメントで教えてください。':/知って/.test(purpose)?'気になったことがあれば、コメントで教えてください。':/シェア|共有/.test(purpose)?'役に立ちそうな人がいたら、この投稿をシェアしてください。':'あなたならどうしますか？ コメントで聞かせてください。';
 const title=empathy?`${theme}、こんなふうに感じたことはありませんか？`:`何から始める？ ${theme}の3つのヒント`;
 const steps=empathy?[
 {heading:'うまくいかない日もあります',body:`「${theme}」について、周りと比べて焦ってしまうことはありませんか？ いつも思いどおりに進まなくても大丈夫です。`},
 {heading:'自分のペースで大丈夫',body:'できないことより、今できていることに目を向けてみましょう。小さな一歩にも意味があります。'},
 {heading:'一人で抱え込まなくて大丈夫',body:'気持ちを言葉にしてみると、少し整理できるかもしれません。話せそうな相手がいたら、今の気持ちを伝えてみましょう。'}
 ]:[
 {heading:'まずは気になることを一つ選ぼう',body:`「${theme}」について知りたいことを、一つだけ選んでみましょう。あれもこれも一度に考えるより、最初の一歩が見つけやすくなります。`},
 {heading:'無理なくできることから始めよう',body:'時間や手間をかけすぎず、今の生活に取り入れられることから始めてみましょう。全部を完璧にする必要はありません。'},
 {heading:'試したあとは、少し振り返ろう',body:'やってみてよかったことや、難しかったことを一つメモしてみましょう。自分に合う方法を見つけるヒントになります。'}
 ];
 if(details.length){for(let i=0;i<3;i++){const chunk=details.filter((_,index)=>index%3===i);if(chunk.length)steps[i]={heading:`ポイント${i+1}｜${chunk[0].length>30?chunk[0].slice(0,30)+'…':chunk[0]}`,body:chunk.join('\n')};}}
 const caption=`「${theme}」、何から考えればいいか迷うことはありませんか？\n\n${target}に向けて、${empathy?'気持ちが少し軽くなるヒント':'取り入れやすいヒント'}をまとめました。\n\n${steps.map((s,i)=>`${i+1}. ${details.length?s.body:s.heading}`).join('\n')}\n\n焦らず、自分のペースで進めていきましょう。\n${cta}`;
 if(format==='feed')return {format,title,designGuide,pages:[
 {heading:title,body:empathy?'同じように感じているのは、あなただけではないかもしれません。一緒に考えてみましょう。':'まずは一つだけで大丈夫。今日から考えられるヒントを3つ紹介します。'},
 ...steps,
 {heading:empathy?'あなたの気持ちも聞かせてください':'まずは一つ、できそうなことから',body:empathy?'焦らず、自分のペースを大切にしていきましょう。':'気になることを選ぶ → 小さく始める → 振り返る。できそうなところから試してみてください。',cta}
 ].map((page,i)=>({...page,image:imageFor(page.heading,i)})),cta,caption};
 const hook=empathy?`「${theme}」、こんなふうに感じたことはありませんか？`:`「${theme}」、何から始めたらいいか迷っていませんか？`;
 return {format,title,hook,designGuide,scenes:[
 {time:'0〜3秒（3秒）',text:hook,visual:'テーマに合った日常の場面や、カメラに向かって問いかける映像。文字は短く、大きく表示します。'},
 {time:'3〜9秒（6秒）',text:`① ${steps[0].heading}`,visual:empathy?'少し困った表情や、立ち止まって考える場面。':'ノートに気になることを一つ書く手元の映像。'},
 {time:'9〜16秒（7秒）',text:`② ${steps[1].heading}`,visual:`「${theme}」に合った、身近な場面や実際に試している様子。`},
 {time:'16〜24秒（8秒）',text:`③ ${steps[2].heading}`,visual:empathy?'誰かと話す様子や、気持ちをノートに書く手元の映像。':'試した感想を短くメモする映像。'},
 {time:'24〜30秒（6秒）',text:cta,visual:'最後の呼びかけを、読みやすい大きさの文字で表示します。'}
 ].map((scene,i)=>({...scene,image:imageFor(scene.text,i)})),cta,caption};
}
