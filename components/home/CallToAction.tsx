// components/home/CallToAction.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="my-36 text-center">
      <div className="max-w-6xl py-16 mx-auto rounded-xl flex flex-col bg-gradient-to-b from-lienzo/20 via-lienzo/10 to-transparent">
        <h2 className="text-3xl font-bold mb-4">Take Control of Your Software <br /> Licenses with <span className="text-lienzo">Lienzo</span></h2>
        <p className="mb-8 max-w-2xl mx-auto text-lg text-[#AFAFAF]">
          It's time to say goodbye to the headaches of managing software licenses manually. 
          Simplify the process, reduce costs, and make managing licenses a breeze.
        </p>
        <Link href={"/api/auth/register"}>
          <Button className="bg-[#F26B60] hover:bg-[#F26B60]/90 text-white w-96 mx-auto" size="lg">+ Sign Up +</Button>
        </Link>
      </div>
    </section>
  );
}