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
import { MdAdd, MdDelete } from "react-icons/md";

interface DeleteItemModalProps {
  title: string;
  onDeleteItem: () => Promise<void>;
  displayText: string;
}

export function DeleteItemModal({
  title,
  onDeleteItem,
  displayText,
}: DeleteItemModalProps) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        h="2em"
        borderRadius="1.5em"
        transition="all 0.2s ease-out"
        bg="salmon"
        w="fit-content"
        color="white"
        onClick={onOpen}
        border="none"
        _hover={{
          bg: "red",
        }}
      >
        <MdDelete size="1.5em" />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="min(95%, 40em)">
          <ModalCloseButton />
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>
            Are you sure you want to delete <b>{displayText}</b> ?
          </ModalBody>
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
                bg="salmon"
                onClick={() =>
                  onDeleteItem()
                    .then(() => {
                      toast({
                        title: "Item Deleted",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                      });
                    })
                    .finally(onClose)
                }
                w="40%"
                border="none"
                _hover={{
                  bg: "red",
                }}
              >
                Delete
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
