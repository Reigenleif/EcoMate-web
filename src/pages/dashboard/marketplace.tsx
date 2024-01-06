import {
  Accordion,
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
import { AddCategory } from "~/components/dashboard/marketplace/AddCategory";
import { CategoryAccordionPanel } from "~/components/dashboard/marketplace/CategoryAccordionPanel";
import { AddItemModal } from "~/components/item-tooling/AddItemModal";
import { DeleteItemModal } from "~/components/item-tooling/DeleteItemModal";
import { AdminRoleLayout } from "~/components/layout/AdminRoleLayout";
import { RouterInputs, RouterOutputs, api } from "~/utils/api";

export default function MarketplaceDashboardPage() {
  const { data: session } = useSession();

  const getCategoryQuery = api.admin.marketplace.getCategoryList.useQuery();
  const createCategoryMutation =
    api.admin.marketplace.createCategory.useMutation();
  const updateCategoryMutation =
    api.admin.marketplace.updateCategory.useMutation();

  const onCreateItem = async (
    data: RouterInputs["admin"]["marketplace"]["createCategory"]
  ) => {
    await createCategoryMutation
      .mutateAsync(data)
      .then(() => getCategoryQuery.refetch());
    return;
  };

  const onUpdateItem = async (
    data: RouterInputs["admin"]["marketplace"]["updateCategory"]
  ) => {
    await updateCategoryMutation
      .mutateAsync(data)
      .then(() => getCategoryQuery.refetch());
    return;
  };

  const CategoryList = getCategoryQuery.data;

  return (
    <AdminRoleLayout session={session} title="EcoMate - Dashboard">
      <Flex>
        <DashboardSideNav />
        {!CategoryList ? (
          <Loading />
        ) : CategoryList?.length > 0 ? (
          <Flex flexDir="column" w="100%" p="1em" gap="1em">
            <Text textAlign="left" w="100%" fontWeight="bold">
              Published Category :
            </Text>

            <Flex flexWrap="wrap" gap="1em" w="100%"> 
              <Accordion w="100%" allowMultiple>
                {CategoryList.map((item) => (
                  <CategoryAccordionPanel
                    key={item.id}
                    onUpdateItem={onUpdateItem}
                    category={item}
                  />
                ))}
              </Accordion>
            </Flex>
          </Flex>
        ) : (
          <Text mx="auto" mt="5em">
            No Category added, click on the + button to add one
          </Text>
        )}
        <Box pos="fixed" left="calc(100vw - 8em)" top="calc(100vh - 8em)">
          <AddCategory onCreateItem={onCreateItem} />
        </Box>
      </Flex>
    </AdminRoleLayout>
  );
}
