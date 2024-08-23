"use server";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { exchangeCodeForGrant } from "@/nylas/middleware";
import { GRANT_ID_COOKIE } from "@/constants";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get("code");

  if (code) {
    console.log(`Code received ${code}`);

    const grant = await exchangeCodeForGrant(code);

    console.log(`Grant is ${grant}`);

    url.searchParams.delete('code');

    const response = NextResponse.redirect(url);
    response.cookies.set(GRANT_ID_COOKIE, grant);

    return response;
  }
}