import Redis from "ioredis";
import { z } from "zod";

const envSchema = z.object({
	REDIS_PORT: z.coerce.number(),
	REDIS_HOST: z.string(),
});

const env = envSchema.parse(process.env);

export const client = new Redis(env.REDIS_PORT, env.REDIS_HOST);
