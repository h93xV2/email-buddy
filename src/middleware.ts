"use server";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { exchangeCodeForGrant } from "@/nylas/middleware";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get("code");

  if (code) {
    console.log(`Code received ${code}`);

    const grant = await exchangeCodeForGrant(code);

    console.log(`Grant is ${grant}`);

    url.searchParams.delete('code');

    const response = NextResponse.redirect(url);
    response.cookies.set('email-buddy-nylas-grant-id', grant);

    return response;
  }
}