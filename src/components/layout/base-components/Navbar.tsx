import { Box, Button, Flex, Menu, MenuButton, MenuList, Text } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface NavbarProps {
  type?: "signin" | "signup";
}

export const Navbar = ({ type }: NavbarProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <Flex
      justifyContent="space-between"
      px="2em"
      py="0.5em"
      minH="3em"
      alignItems="center"
      boxShadow="3px 3px 0px 0px rgba(0,0,0,0.2)"
    >
      <Text onClick={() => router.push("/")}> EcoMate - Sustainabiliy App</Text>
      {!!session ? (
        <Menu>
            <MenuButton>{session.user.name ? `Hello, ${session.user.name.split(' ')[0]}` : "Hello" }</MenuButton>
            <MenuList>
                <Button variant="ghost" onClick={() => router.push('/profile')}>Profile</Button>
                <Button variant="ghost" onClick={() => router.push('/api/auth/signout')}>Sign Out</Button>
            </MenuList>
        </Menu>
      ) : type !== "signin" ? (
        <Button onClick={() => signIn()} variant="ghost"> Sign In </Button>
      ) : (
        <Box />
      )}
    </Flex>
  );
};
