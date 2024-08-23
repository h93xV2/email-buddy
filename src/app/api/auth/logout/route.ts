import { GRANT_ID_COOKIE } from "@/constants";
import { cookies } from "next/headers";

export async function GET() {
  cookies().delete(GRANT_ID_COOKIE);

  return Response.redirect(process.env.NYLAS_REDIRECT_URI as string);
}