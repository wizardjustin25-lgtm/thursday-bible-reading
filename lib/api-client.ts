declare global {interface Window { BIBLE_API_BASE?:string; BIBLE_DEMO?:boolean; }}
export function questionEndpoint(){return `${typeof window!=="undefined"?window.BIBLE_API_BASE||"":""}/api/questions`;}
