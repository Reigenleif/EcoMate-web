import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";



interface AddItemModalProps {
  title: string;
  onAddItem: () => Promise<void>;
  children: React.ReactNode;
}

export function AddItemModal({
  title,
  onAddItem,
  children,
}: AddItemModalProps) {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        h="3.5em"
        borderRadius="1.5em"
        transition="all 0.2s ease-out"
        bg="blue.100"
        w="fit-content"
        px="2em"
        color="white"
        onClick={onOpen}
        border="none"
        _hover={{
          bg: "blue.200",
        }}
      >
        <MdAdd size="2em" />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="min(95%, 40em)">
          <ModalCloseButton />
          <ModalHeader fontWeight="bold">{title}</ModalHeader>
          <ModalBody>{children}</ModalBody>
          <ModalFooter>
            <Flex alignItems="center" justifyContent="right" gap="1em" w="100%">
              <Button
                variant="ghost"
                color="black"
                onClick={onClose}
                w="40%"
                mr="1em"
                borderRadius="20px"
              >
                Cancel
              </Button>
              <Button
                variant="solid"
                color="white"
                bg="blue.100"
                onClick={() => onAddItem().then(() => {
                  toast({
                    title: "Item added",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                  })
                }).finally(onClose)}
                w="40%"
                border="none"
                _hover={{
                  bg: "blue.200",
                }}
              >
                Add
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
