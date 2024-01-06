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
import { AddNews } from "~/components/dashboard/news/AddNews";
import { EditNews } from "~/components/dashboard/news/EditNews";
import { AddItemModal } from "~/components/item-tooling/AddItemModal";
import { DeleteItemModal } from "~/components/item-tooling/DeleteItemModal";
import { AdminRoleLayout } from "~/components/layout/AdminRoleLayout";
import { RouterInputs, RouterOutputs, api } from "~/utils/api";

export default function NewsDashboardPage() {
  const { data: session } = useSession();

  const getNewsQuery = api.admin.news.getNews.useQuery();
  const createNewsMutation = api.admin.news.createNews.useMutation();
  const updateNewsMutation = api.admin.news.updateNews.useMutation();
  const deleteNewsMutation = api.admin.news.deleteNews.useMutation();

  const onCreateItem = async (
    data: RouterInputs["admin"]["news"]["createNews"]
  ) => {
    await createNewsMutation
      .mutateAsync(data)
      .then(() => getNewsQuery.refetch());
    return;
  };

  const onUpdateItem = async (
    data: RouterInputs["admin"]["news"]["updateNews"]
  ) => {
    await updateNewsMutation
      .mutateAsync(data)
      .then(() => getNewsQuery.refetch());
    return;
  };

  const onDeleteItem = (id: string) => async () => {
    await deleteNewsMutation
      .mutateAsync({id})
      .then(() => getNewsQuery.refetch());
    return;
  };

  const newsList = getNewsQuery.data;

  return (
    <AdminRoleLayout session={session} title="EcoMate - Dashboard">
      <Flex>
        <DashboardSideNav />
        {!newsList ? (
          <Loading />
        ) : newsList?.length > 0 ? (
          <Flex flexDir="column" w="100%" p="1em" gap="1em">
            <Text textAlign="left" w="100%" fontWeight="bold">
              Published News :
            </Text>

            <Flex flexWrap="wrap" gap="1em">
              {newsList.map((item) => (
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
            No News added, click on the + button to add one
          </Text>
        )}
        <Box pos="fixed" left="calc(100vw - 8em)" top="calc(100vh - 8em)">
          <AddNews onCreateItem={onCreateItem} />
        </Box>
      </Flex>
    </AdminRoleLayout>
  );
}

interface ItemBoxProps {
  item: RouterOutputs["admin"]["news"]["getNews"][0];
  onUpdateItem: (
    data: RouterInputs["admin"]["news"]["updateNews"]
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
        {item.content}
      </Text>
      <Flex flexDir="row" alignItems="center" gap="1em">
        <EditNews item={item} onUpdateItem={onUpdateItem}/>
        <DeleteItemModal
          title="Delete News"
          displayText={item.title ?? "This Item"}
          onDeleteItem={onDeleteItem}
        />
      </Flex>
    </CustomCard>
  );
};
