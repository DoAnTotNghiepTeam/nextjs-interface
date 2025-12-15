import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { locale } = await req.json();
    const store = await cookies();
    
    store.set("locale", locale, {
      maxAge: 60 * 60 * 24 * 365, 
      path: "/",
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });
    
    return Response.json({ success: true, locale });
  } catch {
    return Response.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}

export async function GET() {
  try {
    const store = await cookies();
    const locale = store.get("locale")?.value || "en";
    
    return Response.json({ locale });
  } catch {
    return Response.json({ locale: "en" });
  }
}