import { NextResponse } from "next/server";

export const runtime = "nodejs";

let redisClient = null;
let redisInitPromise = null;

async function getRedisClient() {
  if (redisClient && redisClient.status === "ready") {
    return redisClient;
  }

  if (!redisInitPromise) {
    redisInitPromise = (async () => {
      const Redis = (await import("ioredis")).default;

      const client = new Redis({
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD,
        maxRetriesPerRequest: 1,
        enableOfflineQueue: false,
        connectTimeout: 5000,
        lazyConnect: true,
        retryStrategy(times) {
          if (times > 3) return null;
          return Math.min(times * 100, 3000);
        },
      });

      client.on("error", (err) => {
        console.error("Redis Client Error:", err.message);
      });

      await client.connect();
      return client;
    })();
  }

  redisClient = await redisInitPromise;
  return redisClient;
}

const SENSITIVE_PATTERNS = [
  { pattern: "^/api/auth/(login|register|getOtp|checkOtp)$", limit: 5 }, // 5/min
  {
    pattern: "^/api/auth/(changePassword|resetPassword|refresh|profile)$",
    limit: 10,
  },
  { pattern: "^/api/(managers|teachers|schools|students|classes)/", limit: 30 },
  { pattern: "^/api/(teachersAttendances|studentsAttendances)/", limit: 40 },
  { pattern: "^/api/messages/", limit: 50 },
];

function getLimitForPath(path) {
  for (const item of SENSITIVE_PATTERNS) {
    if (new RegExp(item.pattern).test(path)) {
      return item.limit;
    }
  }
  return null;
}

function getClientIP(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",").map((ip) => ip.trim());
    return ips[0];
  }

  if (request.ip) return request.ip;

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  return "unknown";
}

async function checkRateLimit(redis, key, limit, windowSeconds = 60) {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const windowStart = now - windowMs;

  const pipeline = redis.pipeline();

  pipeline.zremrangebyscore(key, 0, windowStart);

  pipeline.zcard(key);

  pipeline.zadd(key, now, `${now}:${Math.random()}`);

  pipeline.expire(key, windowSeconds + 10);

  const results = await pipeline.exec();
  const requestCount = results[1][1];

  return {
    allowed: requestCount <= limit,
    remaining: Math.max(0, limit - requestCount),
    count: requestCount,
  };
}

export async function middleware(request) {
  const { nextUrl } = request;
  const path = nextUrl.pathname;

  const limit = getLimitForPath(path);
  if (limit === null) {
    return NextResponse.next();
  }

  try {
    const redis = await getRedisClient();
    const clientIP = getClientIP(request);

    const userAgent = request.headers.get("user-agent") || "unknown";
    const key = `ratelimit:${clientIP}:${path}:${userAgent.substring(0, 50)}`;

    const result = await checkRateLimit(redis, key, limit, 60);

    if (!result.allowed) {
      return new Response(
        JSON.stringify({
          error:
            "تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً ۱ دقیقه دیگر تلاش کنید.",
          code: "RATE_LIMIT_EXCEEDED",
          retryAfter: 60,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "60",
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": "60",
          },
        },
      );
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", limit.toString());
    response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
    response.headers.set("X-RateLimit-Reset", "60");

    return response;
  } catch (error) {
    console.error("Rate limit middleware error:", error.message);
    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Status", "error");
    return response;
  }
}

export const config = {
  matcher: [
    "/api/auth/:path*",
    "/api/managers/:path*",
    "/api/teachers/:path*",
    "/api/schools/:path*",
    "/api/students/:path*",
    "/api/classes/:path*",
    "/api/teachersAttendances/:path*",
    "/api/studentsAttendances/:path*",
    "/api/messages/:path*",
  ],
};
