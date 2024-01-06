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
import { AddCarbonFootprintAttribute } from "~/components/dashboard/carbon-footprint-calculator/AddCarbonFootprintAttribute";
import { EditCarbonFootprintAttribute } from "~/components/dashboard/carbon-footprint-calculator/EditCarbonFootprintAttribute";
import { AddItemModal } from "~/components/item-tooling/AddItemModal";
import { DeleteItemModal } from "~/components/item-tooling/DeleteItemModal";
import { AdminRoleLayout } from "~/components/layout/AdminRoleLayout";
import { RouterInputs, RouterOutputs, api } from "~/utils/api";

export default function CarbonFootprintAttributeDashboardPage() {
  const { data: session } = useSession();

  const getCarbonFootprintAttributesQuery =
    api.admin.carbonFootprintCalculator.getCarbonFootprintAttributes.useQuery();
  const createCarbonFootprintAttributeMutation =
    api.admin.carbonFootprintCalculator.createCarbonFootprintAttribute.useMutation();
  const updateCarbonFootprintAttributeMutation =
    api.admin.carbonFootprintCalculator.updateCarbonFootprintAttribute.useMutation();
  const deleteCarbonFootprintAttributeMutation =
    api.admin.carbonFootprintCalculator.deleteCarbonFootprintAttribute.useMutation();

  const onCreateItem = async (
    data: RouterInputs["admin"]["carbonFootprintCalculator"]["createCarbonFootprintAttribute"]
  ) => {
    await createCarbonFootprintAttributeMutation
      .mutateAsync(data)
      .then(() => getCarbonFootprintAttributesQuery.refetch());
    return;
  };

  const onUpdateItem = async (
    data: RouterInputs["admin"]["carbonFootprintCalculator"]["updateCarbonFootprintAttribute"]
  ) => {
    await updateCarbonFootprintAttributeMutation
      .mutateAsync(data)
      .then(() => getCarbonFootprintAttributesQuery.refetch());
    return;
  };

  const onDeleteItem = (id: string) => async () => {
    await deleteCarbonFootprintAttributeMutation
      .mutateAsync({ id })
      .then(() => getCarbonFootprintAttributesQuery.refetch());
    return;
  };

  const CarbonFootprintAttributeList = getCarbonFootprintAttributesQuery.data;

  return (
    <AdminRoleLayout session={session} title="EcoMate - Dashboard">
      <Flex>
        <DashboardSideNav />
        {!CarbonFootprintAttributeList ? (
          <Loading />
        ) : CarbonFootprintAttributeList?.length > 0 ? (
          <Flex flexDir="column" w="100%" p="1em" gap="1em">
            <Text textAlign="left" w="100%">
              Published CarbonFootprintAttribute :
            </Text>

            <Flex flexWrap="wrap" gap="1em">
              {CarbonFootprintAttributeList.map((item) => (
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
            No carbon footprint attribute added, click on the + button to add
            one
          </Text>
        )}
        <Box pos="fixed" left="calc(100vw - 8em)" top="calc(100vh - 8em)">
          <AddCarbonFootprintAttribute onCreateItem={onCreateItem} />
        </Box>
      </Flex>
    </AdminRoleLayout>
  );
}

interface ItemBoxProps {
  item: RouterOutputs["admin"]["carbonFootprintCalculator"]["getCarbonFootprintAttributes"][0];
  onUpdateItem: (
    data: RouterInputs["admin"]["carbonFootprintCalculator"]["updateCarbonFootprintAttribute"]
  ) => Promise<void>;
  onDeleteItem: () => Promise<void>;
}

const ItemBox = ({ item, onDeleteItem, onUpdateItem }: ItemBoxProps) => {
  return (
    <CustomCard gap="0.3em" h="3em" w="100%" flexDir="row" _hover={{}}>
      <Text w="25%" textAlign="left" noOfLines={1} fontSize="1.2em">
        {item.name}
      </Text>
      <Text w="25%" textAlign="left" noOfLines={2} fontSize="0.7em">
        {item.description}
      </Text>
      <Text w="25%" textAlign="left" noOfLines={1}>
        {item.coefficient}
      </Text>
      <Text w="10%" textAlign="left" noOfLines={1}>
        {item.unit}
      </Text>
      <Flex flexDir="row" gap="1em" alignItems="center">
        <EditCarbonFootprintAttribute onUpdateItem={onUpdateItem} item={item} />
        <DeleteItemModal
          onDeleteItem={onDeleteItem}
          title="Delete Attribute"
          displayText={`${item.name} Attribute`}
        />
      </Flex>
    </CustomCard>
  );
};
