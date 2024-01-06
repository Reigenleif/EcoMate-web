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
  const createFlashcardMutation =
    api.admin.flashcard.createFlashcard.useMutation();
  const updateFlashcardMutation =
    api.admin.flashcard.updateFlashcard.useMutation();
  const deleteFlashcardMutation =
    api.admin.flashcard.deleteFlashcard.useMutation();

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
      .mutateAsync({ id })
      .then(() => getFlashcardQuery.refetch());
    return;
  };

  const FlashcardList = getFlashcardQuery.data;

  return (
    <AdminRoleLayout session={session} title="EcoMate - Dashboard">
      <Flex>
        <DashboardSideNav />
        <Flex
          direction="column"
          w="full"
          p={8}
          justifyContent="center"
          h="full"
        >
          <Text fontWeight="bold">
            Air Qulaity Index is currently provided by external API, you cannot
            configure it.
          </Text>
        </Flex>
      </Flex>
    </AdminRoleLayout>
  );
}
