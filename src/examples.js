/* 동현전 출전 예제. 동현랭 출력 정수: 명령 번호 뒤에 값. 1 지도 · 2 나의 지휘관 · 3 컴퓨터 지휘관 · 4 선공 · 5 시작 자금 · 7 난수 시드 · 6 출전 */
function expression(n){
  if(n===0)return '도옹ㅠ';
  if(n<0)return 'ㅠ '+expression(-n);
  if(n<=10)return '도'+'오'.repeat(n-1)+'옹';
  for(let a=10;a>=2;a--)if(n%a===0)return expression(a)+' '+expression(n/a);
  return '도'+'오'.repeat(n-1)+'옹';
}
const output=(...ns)=>ns.map(n=>'뿡뿡 '+expression(n)+'~뿡뿡뿡').join('~');
const block=(label,...ns)=>'ㅋㅋ '+label+'\n'+output(...ns);
const wrap=a=>['나는 동현이냐?',...a,'동현이구나'].join('\n');
const sortie=block('출전',6);
const examples=[
 {id:'practice',title:'01 · 작은 연습장 / 뭉치 대 뭉치',note:'12×8의 작은 지도에서 한 판을 빠르게 익힌다. 같은 지휘관끼리, 내가 먼저 움직인다.',
  code:wrap([block('지도 1 · 작은 연습장',1,1),block('나의 지휘관 1 · 뭉치',2,1),block('컴퓨터 지휘관 1 · 뭉치',3,1),block('선공 1 · 내가 먼저',4,1),sortie])},
 {id:'field',title:'02 · 첫 들판 / 뚱띠 대 포동이',note:'강과 다리가 있는 지상전. 뚱띠의 근접 전차로 다리를 먼저 차지해 보자.',
  code:wrap([block('지도 2 · 첫 들판',1,2),block('나의 지휘관 2 · 뚱띠',2,2),block('컴퓨터 지휘관 4 · 포동이',3,4),sortie])},
 {id:'strait',title:'03 · 푸른 해협 / 또치 대 뿡뿡',note:'바다·공항·항구가 모두 있는 지도. 시작 자금 5000으로 보병을 서둘러 내보내 거점을 넓힌다.',
  code:wrap([block('지도 3 · 푸른 해협',1,3),block('나의 지휘관 3 · 또치',2,3),block('컴퓨터 지휘관 5 · 뿡뿡',3,5),block('시작 자금 5000',5,5000),sortie])},
 {id:'ridge',title:'04 · 산맥 회랑 / 컴퓨터 선공',note:'산맥 사이 두 길을 두고 겨룬다. 이번에는 컴퓨터가 먼저 움직인다.',
  code:wrap([block('지도 4 · 산맥 회랑',1,4),block('나의 지휘관 5 · 뿡뿡',2,5),block('컴퓨터 지휘관 2 · 뚱띠',3,2),block('선공 2 · 컴퓨터가 먼저',4,2),sortie])},
 {id:'vars',title:'05 · 변수로 고르기 / 시드 고정',note:'동현에 지도 번호, 동동현에 지휘관 번호를 담아 출력한다. 시드를 고정하면 같은 선택에서 같은 운이 나온다.',
  code:wrap(['ㅋㅋ 동현 = 지도 번호, 동동현 = 지휘관 번호','동현아 '+expression(2),'동동현아 '+expression(4),
   'ㅋㅋ 지도와 나의 지휘관','뿡뿡 도옹~뿡뿡뿡~뿡뿡 동현~뿡뿡뿡','뿡뿡 도오옹~뿡뿡뿡~뿡뿡 동동현~뿡뿡뿡',
   'ㅋㅋ 컴퓨터 지휘관은 내 번호에서 하나 뺀 값','뿡뿡 도오오옹~뿡뿡뿡~뿡뿡 동동현ㅠ~뿡뿡뿡',
   block('난수 시드 2026',7,2026),sortie])},
 {id:'blank',title:'06 · 빈 코드 / 직접 작성',note:'시작·끝 선언만 있다. 출전 명령 6이 없으면 전장에 나가지 않는다. 나머지는 기본값(지도 1 · 뭉치 대 뭉치 · 나 선공 · 자금 0)이다.',code:wrap([])}
];
if(typeof module!=='undefined') module.exports={examples,expression};
