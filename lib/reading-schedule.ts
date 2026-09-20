export const books = [
  ["마태복음",28],["마가복음",16],["누가복음",24],["요한복음",21],
  ["사도행전",28],["로마서",16],["고린도전서",16],["고린도후서",13],
  ["갈라디아서",6],["에베소서",6],["빌립보서",4],["골로새서",4],
  ["데살로니가전서",5],["데살로니가후서",3],["디모데전서",6],["디모데후서",4],
  ["디도서",3],["빌레몬서",1],["히브리서",13],["야고보서",5],
  ["베드로전서",5],["베드로후서",3],["요한일서",5],["요한이서",1],
  ["요한삼서",1],["유다서",1],["요한계시록",22],
] as const;
const chapters = books.flatMap(([book,count])=>Array.from({length:count},(_,i)=>({book,chapter:i+1})));
export function passageLabel(items:typeof chapters){
  const groups:{book:string;first:number;last:number}[]=[];
  for(const item of items){const group=groups.at(-1);if(group?.book===item.book)group.last=item.chapter;else groups.push({book:item.book,first:item.chapter,last:item.chapter});}
  return groups.map(g=>`${g.book} ${g.first===g.last?g.first:`${g.first}–${g.last}`}장`).join(" · ");
}
export const schedule = Array.from({length:Math.ceil(chapters.length/4)},(_,i)=>{
  const dayChapters=chapters.slice(i*4,i*4+4);
  return {day:i+1,date:new Date(Date.UTC(2026,8,10+i)).toISOString().slice(0,10),chapters:dayChapters,passage:passageLabel(dayChapters)};
});
export const weeks=Array.from({length:Math.ceil(schedule.length/7)},(_,i)=>schedule.slice(i*7,i*7+7));
export function koreaDate(now=new Date()){return new Intl.DateTimeFormat("sv-SE",{timeZone:"Asia/Seoul",year:"numeric",month:"2-digit",day:"2-digit"}).format(now);}
export function formatDay(date:string){return new Intl.DateTimeFormat("ko-KR",{timeZone:"UTC",month:"numeric",day:"numeric",weekday:"short"}).format(new Date(date+"T00:00:00Z"));}
