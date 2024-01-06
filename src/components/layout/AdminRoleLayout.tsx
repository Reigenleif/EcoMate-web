import { useRouter } from "next/router";
import { BaseLayout, ProtectedLayoutProps } from "./base-components/BaseLayout";
import { useEffect, useState } from "react";
import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";

export const AdminRoleLayout = ({
  children,
  type,
  title,
}: ProtectedLayoutProps) => {
  const router = useRouter();

  const {data: session, status} = useSession()

  useEffect(() => {
    const authCheck = () => {
      if (status === "loading") return;

      if (!session) {
        void router.push("/");
      }
      if (session?.user.role !== UserRole.ADMIN) {
        void router.push("/");
      }
    };

    authCheck();
  },[status, session, router]);

  return <BaseLayout title={title}>{children}</BaseLayout>;
};
