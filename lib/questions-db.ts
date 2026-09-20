import { env } from "cloudflare:workers";
export function questionsDb(){if(!env.DB)throw new Error("Questions database unavailable");return env.DB;}
