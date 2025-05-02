import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import Setting from "./Setting";
import { auth } from "@/lib/auth";

export default async function PrivateHeader() {
  const session = await auth();
  if (!session) {
    throw new Error("不正なリクエストです。");
  }

  return (
    <header className="border-b bg-blue-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink className="font-bold text-xl" asChild>
                <Link href="/dashboard">管理ページ</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Setting session={session} />
      </div>
    </header>
  );
}
