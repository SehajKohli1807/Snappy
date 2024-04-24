import EmptyState from "@/components/EmptyState";
import { signOut } from "next-auth/react";

export default function Users() {
  return (
    <>
      <div className="hidden lg:block lg:pl-80 h-full">
        <EmptyState />
      </div>
    </>
  );
}
