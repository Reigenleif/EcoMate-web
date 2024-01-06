import { Flex, FlexProps } from "@chakra-ui/react";

interface CustomCardProps extends FlexProps{
    children?: React.ReactNode;
  }
  
export const CustomCard = ({ children, ...rest }: CustomCardProps) => {
    return (
      <Flex
        borderRadius="30px"
        background="#FFF"
        boxShadow="7px 12px 43px 0px rgba(0, 0, 0, 0.14)"
        p="1em"
        flexDir="column"
        alignItems="center"
        w="min(17em,100%)"
        h="19em"
        transition="transform 0.3s ease-in-out"
        cursor="pointer"
        _hover={{
          transform: "scale(1.05)",
        }}
        {...rest}
      >
        {children}
      </Flex>
    );
  };