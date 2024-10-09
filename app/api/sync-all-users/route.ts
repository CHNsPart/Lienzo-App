import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma";

async function getKindeAccessToken() {
  const clientId = process.env.KINDE_CLIENT_ID;
  const clientSecret = process.env.KINDE_CLIENT_SECRET;
  const audience = process.env.KINDE_AUDIENCE || process.env.KINDE_ISSUER_URL;
  const tokenEndpoint = process.env.KINDE_TOKEN_ENDPOINT;

  if (!clientId || !clientSecret || !audience || !tokenEndpoint) {
    throw new Error("Kinde credentials are not properly set in environment variables");
  }

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      audience: audience,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get Kinde access token: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function fetchAllKindeUsers(accessToken: string) {
  const audience = process.env.KINDE_ISSUER_URL;
  if (!audience) {
    throw new Error("Kinde issuer URL is not set");
  }

  let allUsers:any = [];
  let nextToken = null;

  do {
    const url = new URL(`${audience}/api/v1/users`);
    if (nextToken) {
      url.searchParams.append('page_token', nextToken);
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch users from Kinde: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    allUsers = allUsers.concat(data.users);
    nextToken = data.next_token;
  } while (nextToken);

  return allUsers;
}

export async function POST() {
  const { getUser } = getKindeServerSession();
  const currentUser:any = await getUser();

  if (!currentUser || (currentUser.email !== 'imchn24@gmail.com' && !currentUser.roles?.includes('ADMIN'))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const accessToken = await getKindeAccessToken();
    const kindeUsers = await fetchAllKindeUsers(accessToken);
    console.log("Fetched users from Kinde:", kindeUsers.length);

    for (const user of kindeUsers) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {
          firstName: user.given_name || '',
          lastName: user.family_name || '',
        },
        create: {
          id: user.id,
          email: user.email,
          firstName: user.given_name || '',
          lastName: user.family_name || '',
          role: 'USER',
        },
      });
    }

    console.log("All users synced successfully");
    return NextResponse.json({ message: "All users synced successfully" });
  } catch (error:any) {
    console.error("Error syncing users:", error);
    return NextResponse.json({ error: "Failed to sync users", details: error.message }, { status: 500 });
  }
}