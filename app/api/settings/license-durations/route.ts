// app/api/settings/license-durations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import fs from 'fs/promises';
import path from 'path';
import { isAdmin } from "@/lib/auth";

const dataFilePath = path.join(process.cwd(), 'data', 'licenseDurations.json');

async function readDurations() {
  const data = await fs.readFile(dataFilePath, 'utf-8');
  return JSON.parse(data);
}

async function writeDurations(durations: number[]) {
  await fs.writeFile(dataFilePath, JSON.stringify({ durations }, null, 2));
}

export async function GET() {
  try {
    const data = await readDurations();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to read license durations:", error);
    return NextResponse.json({ error: "Failed to read license durations" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !(await isAdmin(user))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { duration } = await request.json();
    const data = await readDurations();
    if (!data.durations.includes(duration)) {
      data.durations.push(duration);
      data.durations.sort((a: number, b: number) => a - b);
      await writeDurations(data.durations);
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to add license duration:", error);
    return NextResponse.json({ error: "Failed to add license duration" }, { status: 500 });
  }
}