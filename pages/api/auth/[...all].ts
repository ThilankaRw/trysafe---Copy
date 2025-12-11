import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const config = { api: { bodyParser: false } };

export default toNextJsHandler(auth.handler);
