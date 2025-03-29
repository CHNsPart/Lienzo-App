// app/api/settings/product-versions/[productId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !(await isAdmin(user))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { version } = await request.json();
    const { productId } = params;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    try {
      // Parse existing versions and add new one
      const versions = JSON.parse(product.versions);
      if (!versions.includes(version)) {
        versions.push(version);
        versions.sort((a: string, b: string) => {
          const [aMajor, aMinor, aPatch] = a.split('.').map(Number);
          const [bMajor, bMinor, bPatch] = b.split('.').map(Number);
          
          if (aMajor !== bMajor) return aMajor - bMajor;
          if (aMinor !== bMinor) return aMinor - bMinor;
          return aPatch - bPatch;
        });

        await prisma.product.update({
          where: { id: productId },
          data: { versions: JSON.stringify(versions) },
        });
      }

      return NextResponse.json({ versions });
    } catch (error) {
      console.error("Error parsing versions:", error);
      // If there's an error parsing versions, initialize with the new version
      const versions = [version];
      await prisma.product.update({
        where: { id: productId },
        data: { versions: JSON.stringify(versions) },
      });
      return NextResponse.json({ versions });
    }
  } catch (error) {
    console.error("Failed to add version:", error);
    return NextResponse.json(
      { error: "Failed to add version" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !(await isAdmin(user))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = new URL(request.url).searchParams;
    const versionToDelete = searchParams.get('version');
    const { productId } = params;

    if (!versionToDelete) {
      return NextResponse.json({ error: "Version parameter is required" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    try {
      // Parse existing versions and remove the specified one
      const versions = JSON.parse(product.versions).filter(
        (v: string) => v !== versionToDelete
      );

      await prisma.product.update({
        where: { id: productId },
        data: { versions: JSON.stringify(versions) },
      });

      return NextResponse.json({ versions });
    } catch (error) {
      console.error("Error parsing versions:", error);
      return NextResponse.json({ error: "Failed to parse product versions" }, { status: 500 });
    }
  } catch (error) {
    console.error("Failed to delete version:", error);
    return NextResponse.json(
      { error: "Failed to delete version" },
      { status: 500 }
    );
  }
}