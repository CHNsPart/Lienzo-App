import React from 'react'
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function page() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  console.log(user)
  return (
    <div>page</div>
  )
}
