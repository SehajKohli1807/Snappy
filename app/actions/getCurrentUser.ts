import prisma from "@/app/libs/prismadb";
import getSession from "./getSession";

export default async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const CurrentUser = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!CurrentUser) {
      return null;
    }

    return CurrentUser;
  } catch (error: any) {
    return null;
  }
}
