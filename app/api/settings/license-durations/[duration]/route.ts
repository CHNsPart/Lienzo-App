// app/api/settings/license-durations/[duration]/route.ts
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

export async function PUT(request: NextRequest, { params }: { params: { duration: string } }) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !(await isAdmin(user))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const oldDuration = parseInt(params.duration);
    const { duration: newDuration } = await request.json();
    const data = await readDurations();
    const index = data.durations.indexOf(oldDuration);
    if (index !== -1) {
      data.durations[index] = newDuration;
      data.durations.sort((a: number, b: number) => a - b);
      await writeDurations(data.durations);
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to update license duration:", error);
    return NextResponse.json({ error: "Failed to update license duration" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { duration: string } }) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !(await isAdmin(user))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const durationToDelete = parseInt(params.duration);
    const data = await readDurations();
    data.durations = data.durations.filter((d: number) => d !== durationToDelete);
    await writeDurations(data.durations);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to delete license duration:", error);
    return NextResponse.json({ error: "Failed to delete license duration" }, { status: 500 });
  }
}