"use client";
import {useEffect,useState} from "react";
import {BookOpen,CalendarDays,ChevronDown} from "lucide-react";
import {schedule,weeks,koreaDate,formatDay} from "../lib/reading-schedule";

export default function ReadingSchedule(){
  const [today,setToday]=useState("");
  useEffect(()=>{const refresh=()=>setToday(koreaDate());refresh();const timer=setInterval(refresh,60_000);return()=>clearInterval(timer);},[]);
  const todayIndex=schedule.findIndex(day=>day.date===today);
  const before=!today||today<schedule[0].date;
  const current=schedule[todayIndex>=0?todayIndex:before?0:schedule.length-1];
  const weekIndex=Math.floor((current.day-1)/7);
  const week=weeks[weekIndex];
  const first=week[0].chapters[0],last=week.at(-1)!.chapters.at(-1)!;
  const weekPassage=first.book===last.book?`${first.book} ${first.chapter}–${last.chapter}장`:`${first.book} ${first.chapter}장 – ${last.book} ${last.chapter}장`;
  return <div className="schedule-section">
    <section className="reading" aria-label="신약성경 통독 일정">
      <div className="reading-heading"><span className="overline">{todayIndex>=0?"오늘 함께 읽을 말씀":before?"첫날 함께 읽을 말씀":"마지막 날 읽을 말씀"}<span className="sample-tag">{current.day}일차 / 65일</span></span><h2>{current.passage}</h2><p>{formatDay(current.date)} · 하루 4장</p></div>
      <div className="reading-rule"/>
      <div className="reading-info"><div><CalendarDays size={19}/><span>{todayIndex>=0?"이번 주 진도":"주간 진도"} · {weekIndex+1}주차</span></div><p className="week-passage">{weekPassage}</p><span className="week-dates">{formatDay(week[0].date)} – {formatDay(week.at(-1)!.date)}<br/>목요일부터 수요일까지 함께 읽습니다.</span></div>
      <BookOpen className="reading-book" size={116} strokeWidth={.8}/>
    </section>
    <details className="schedule-all"><summary><span><CalendarDays size={18}/><strong>신약 65일 통독 일정</strong><span className="schedule-period">2026. 9. 10. – 11. 13.</span></span><span className="schedule-toggle">전체 일정<ChevronDown size={18}/></span></summary>
      <div className="schedule-content"><p className="schedule-intro">마태복음부터 요한계시록까지, 신약 27권 260장을 매일 4장씩 읽습니다. 주말에도 이어서 읽으며, 책이 끝나면 다음 책으로 넘어갑니다.</p>
      {weeks.map((days,i)=><details key={i} className="schedule-week" open={i===weekIndex}><summary><span>{i+1}주차 <small>{formatDay(days[0].date)} – {formatDay(days.at(-1)!.date)}</small></span><ChevronDown size={17}/></summary><ol>{days.map(day=><li key={day.date} className={day.date===today?"is-today":""} aria-current={day.date===today?"date":undefined}><div className="schedule-day"><span>{day.day}일차</span><time dateTime={day.date}>{formatDay(day.date)}</time>{day.date===today&&<b>오늘</b>}</div><strong>{day.passage}</strong></li>)}</ol></details>)}
      <p className="schedule-note">날짜는 한국 시간 기준입니다. ‘오늘’ 표시는 일정상의 진도이며 개인의 읽기 완료 기록은 아닙니다.</p></div>
    </details>
  </div>;
}

