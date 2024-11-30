import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";


// dotenv.config({ path: "./../../.env" });
dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN;
const ENDPOINT = process.env.MAILTRAP_ENDPOINT

export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
  endpoint: ENDPOINT, // optional if provided in your Mailtrap account settings,
  secure: true, // optional, default is true
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Auth Verification",
};
