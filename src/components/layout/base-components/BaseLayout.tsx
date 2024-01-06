import { Flex } from "@chakra-ui/react";
import { Navbar } from "./Navbar";
import { type Session } from "next-auth";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";

export interface LayoutProps {
  children: React.ReactNode;
  type?: "signin" | "signup";
  title?: string;
}

export interface ProtectedLayoutProps extends LayoutProps {
  session: Session | null;
}

export function BaseLayout({ children, type, title }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title ?? "EcoMate"}</title>
        <meta name="description" content="EcoMate web application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex flexDir="column" w="100vw" overflowX="hidden">
        <Navbar type={type} />
        {children}
      </Flex>
    </>
  );
}
