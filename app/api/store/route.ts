import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !(await isAdmin(user))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const features = formData.get('features') as string;
    const durations = formData.get('durations') as string;
    const image = formData.get('image') as File;

    if (!name || !description || !features || !durations) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let imageBuffer: Buffer | null = null;
    if (image) {
      const bytes = await image.arrayBuffer();
      imageBuffer = Buffer.from(bytes);
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        features,
        durations,
        image: imageBuffer,
      },
    });

    return NextResponse.json({ success: true, productId: newProduct.id }, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !(await isAdmin(user))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const productId = formData.get('id') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const features = formData.get('features') as string;
    const durations = formData.get('durations') as string;
    const image = formData.get('image') as File | null;

    if (!productId || !name || !description || !features || !durations) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let imageBuffer: Buffer | null = null;
    if (image) {
      const bytes = await image.arrayBuffer();
      imageBuffer = Buffer.from(bytes);
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        features,
        durations,
        ...(imageBuffer && { image: imageBuffer }),
      },
    });

    return NextResponse.json({ success: true, productId: updatedProduct.id }, { status: 200 });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}