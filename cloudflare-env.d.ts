declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    OPENAI_API_KEY?: string;
    OPENAI_MODEL?: string;
    RATE_LIMIT_SALT?: string;
    ALLOWED_ORIGIN?: string;
  }
}
