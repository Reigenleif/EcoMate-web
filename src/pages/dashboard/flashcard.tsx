import {
  Box,
  Flex,
  Img,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { MdCamera, MdPhoto } from "react-icons/md";
import { CustomCard } from "~/components/common/CustomCard";
import { Loading } from "~/components/common/Loading";
import { DashboardSideNav } from "~/components/dashboard/SideNav";
import { AddFlashcard } from "~/components/dashboard/flashcard/AddFlashcard";
import { EditFlashcard } from "~/components/dashboard/flashcard/EditFlashcard";
import { AddItemModal } from "~/components/item-tooling/AddItemModal";
import { DeleteItemModal } from "~/components/item-tooling/DeleteItemModal";
import { AdminRoleLayout } from "~/components/layout/AdminRoleLayout";
import { RouterInputs, RouterOutputs, api } from "~/utils/api";

export default function FlashcardDashboardPage() {
  const { data: session } = useSession();

  const getFlashcardQuery = api.admin.flashcard.getFlashcardList.useQuery();
  const createFlashcardMutation = api.admin.flashcard.createFlashcard.useMutation();
  const updateFlashcardMutation = api.admin.flashcard.updateFlashcard.useMutation();
  const deleteFlashcardMutation = api.admin.flashcard.deleteFlashcard.useMutation();

  const onCreateItem = async (
    data: RouterInputs["admin"]["flashcard"]["createFlashcard"]
  ) => {
    await createFlashcardMutation
      .mutateAsync(data)
      .then(() => getFlashcardQuery.refetch());
    return;
  };

  const onUpdateItem = async (
    data: RouterInputs["admin"]["flashcard"]["updateFlashcard"]
  ) => {
    await updateFlashcardMutation
      .mutateAsync(data)
      .then(() => getFlashcardQuery.refetch());
    return;
  };

  const onDeleteItem = (id: string) => async () => {
    await deleteFlashcardMutation
      .mutateAsync({id})
      .then(() => getFlashcardQuery.refetch());
    return;
  };

  const FlashcardList = getFlashcardQuery.data;

  return (
    <AdminRoleLayout session={session} title="EcoMate - Dashboard">
      <Flex>
        <DashboardSideNav />
        {!FlashcardList ? (
          <Loading />
        ) : FlashcardList?.length > 0 ? (
          <Flex flexDir="column" w="100%" p="1em" gap="1em">
            <Text textAlign="left" w="100%">
              Published Flashcard :
            </Text>

            <Flex flexWrap="wrap" gap="1em">
              {FlashcardList.map((item) => (
                <ItemBox
                  key={item.id}
                  item={item}
                  onDeleteItem={onDeleteItem(item.id)}
                  onUpdateItem={onUpdateItem}
                />
              ))}
            </Flex>
          </Flex>
        ) : (
          <Text mx="auto" mt="5em">
            No flashcard added, click on the + button to add one
          </Text>
        )}
        <Box pos="fixed" left="calc(100vw - 8em)" top="calc(100vh - 8em)">
          <AddFlashcard onCreateItem={onCreateItem} />
        </Box>
      </Flex>
    </AdminRoleLayout>
  );
}

interface ItemBoxProps {
  item: RouterOutputs["admin"]["flashcard"]["getFlashcardList"][0];
  onUpdateItem: (
    data: RouterInputs["admin"]["flashcard"]["updateFlashcard"]
  ) => Promise<void>;
  onDeleteItem: () => Promise<void>;
}

const ItemBox = ({ item, onDeleteItem, onUpdateItem }: ItemBoxProps) => {

  return (
    <CustomCard gap="0.3em">
      {item.imageUrl ? (
        <Img src={item.imageUrl} h="8em" w="8em" objectFit="cover" />
      ) : (
        <Flex justifyContent="center" alignItems="center" bg="gray" h="8em" w="8em">
          <MdPhoto />
        </Flex>
      )}
      <Text>{item.title}</Text>
      <Text fontSize="0.7em" textAlign="justify" noOfLines={3}>
        {item.description}
      </Text>
      <Flex flexDir="row" alignItems="center" gap="1em">
        <EditFlashcard item={item} onUpdateItem={onUpdateItem}/>
        <DeleteItemModal
          title="Delete flashcard"
          displayText={item.title ?? "This Item"}
          onDeleteItem={onDeleteItem}
        />
      </Flex>
    </CustomCard>
  );
};
