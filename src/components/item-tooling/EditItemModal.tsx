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
import { MdAdd, MdEdit } from "react-icons/md";

interface EditItemModalProps {
  title: string;
  onEditItem: () => Promise<void>;
  children: React.ReactNode;
}

export function EditItemModal({
  title,
  onEditItem,
  children,
}: EditItemModalProps) {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        h="2em"
        borderRadius="1.5em"
        transition="all 0.2s ease-out"
        py="0.1em"
        w="fit-content"
        variant="ghost"
        onClick={onOpen}
        border="none"
      >
        <MdEdit size="1.5em" />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="min(95%, 40em)">
          <ModalCloseButton />
          <ModalHeader>{title}</ModalHeader>
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
                onClick={() => onEditItem().then(() => {
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
                Save
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
