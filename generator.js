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
 const title=`${theme}｜企業の取り組みを実例で紹介`;
 const steps=[
 {heading:'取り組みの背景',body:'［企業名・事業内容と、取り組み前に抱えていた課題を入力してください］'},
 {heading:'実際に行ったこと',body:'［企業が実施した施策と、現場で工夫した点を入力してください］'},
 {heading:'結果と、実例からわかったこと',body:'［確認できた結果や担当者の声を入力してください。数値は根拠があるものだけを使います］'}
 ];
 if(details.length){for(let i=0;i<3;i++){const chunk=details.filter((_,index)=>index%3===i);if(chunk.length)steps[i]={heading:steps[i].heading,body:chunk.join('\n')};}}
 const caption=`今回は「${theme}」の実例をご紹介します。\n\n${target}に向けて、取り組みの背景、実際に行ったこと、結果をまとめました。\n\n${steps.map((s,i)=>`${i+1}. ${s.heading}\n${s.body}`).join('\n\n')}\n\n${cta}`;
 if(format==='feed')return {format,title,designGuide,pages:[
 {heading:title,body:'企業がどのような課題に向き合い、何を実践したのか。取り組みの背景から結果までをご紹介します。'},
 ...steps,
 {heading:'実例のポイントを振り返る',body:'背景・取り組み・結果を振り返ると、企業ならではの工夫が見えてきます。気になった点を、ぜひお聞かせください。',cta}
 ].map((page,i)=>({...page,image:imageFor(page.heading,i)})),cta,caption};
 const hook=`「${theme}」。企業の現場では、どのような工夫があったのでしょうか？`;
 return {format,title,hook,designGuide,scenes:[
 {time:'0〜3秒（3秒）',text:hook,visual:'テーマに合った日常の場面や、カメラに向かって問いかける映像。文字は短く、大きく表示します。'},
 {time:'3〜9秒（6秒）',text:`① ${steps[0].heading}`,visual:'企業の外観や職場の写真と、課題を短くまとめた図解。'},
 {time:'9〜16秒（7秒）',text:`② ${steps[1].heading}`,visual:`「${theme}」に合った、身近な場面や実際に試している様子。`},
 {time:'16〜24秒（8秒）',text:`③ ${steps[2].heading}`,visual:'確認できた結果の図表や担当者のインタビュー。掲載許可を確認して使います。'},
 {time:'24〜30秒（6秒）',text:cta,visual:'最後の呼びかけを、読みやすい大きさの文字で表示します。'}
 ].map((scene,i)=>({...scene,image:imageFor(scene.text,i)})),cta,caption};
}
