import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { CustomCard } from "~/components/common/CustomCard";
import { RouterInputs, RouterOutputs, api } from "~/utils/api";
import { EditMarketplaceItem } from "./EditItem";
import { DeleteItemModal } from "~/components/item-tooling/DeleteItemModal";
import { Loading } from "~/components/common/Loading";
import { AddMarketplaceItem } from "./AddItem";

interface CategoryAccordionPanelProps {
  category: RouterOutputs["admin"]["marketplace"]["getCategoryList"][0];
  onUpdateItem: (
    data: RouterInputs["admin"]["marketplace"]["updateItem"]
  ) => Promise<void>;
}

export const CategoryAccordionPanel = ({
  category,
  onUpdateItem,
}: CategoryAccordionPanelProps) => {
  const itemListQuery = api.admin.marketplace.getItemByCategoryId.useQuery({
    categoryId: category.id,
  });
  const createItemMutation = api.admin.marketplace.createItem.useMutation();
  const updateItemMutation = api.admin.marketplace.updateItem.useMutation();
  const deleteItemMutation = api.admin.marketplace.deleteItem.useMutation();

  const onCreateItem = async (
    data: RouterInputs["admin"]["marketplace"]["createItem"]
  ) => {
    await createItemMutation
      .mutateAsync(data)
      .then(() => itemListQuery.refetch());
    return;
  };

  const onUpdateMarketplaceItem = async (
    data: RouterInputs["admin"]["marketplace"]["updateItem"]
  ) => {
    await updateItemMutation
      .mutateAsync(data)
      .then(() => itemListQuery.refetch());
    return;
  };

  const onDeleteItem = (id: string) => async () => {
    await deleteItemMutation
      .mutateAsync({ id })
      .then(() => itemListQuery.refetch());
    return;
  };

  const itemList = itemListQuery.data;

  if (!itemList) {
    return <Loading />;
  }

  return (
    <AccordionItem
      boxShadow="2px 2px 2px 2px rgba(0,0,0,0.2)"
      borderRadius="10px"
    >
      <AccordionButton>
        <Box flex="1" textAlign="left" fontWeight="bold">
          {category.name}
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={4} boxShadow="1px 1px 1px 1px rgba(0,0,0,0.1)">
        <Flex flexDir="column" gap="1em">
            <Text textAlign="left" w="100%" fontWeight="bold"> 
                Description :
            </Text>
            <Text textAlign="left" w="100%" >
                {category.description}
            </Text>
          <Text textAlign="left" w="100%" fontWeight="bold"> 
            Published Items :
          </Text>
          <Flex flexWrap="wrap" gap="1em" flexDir="column">
            <CustomCard
              gap="0.3em"
              h="3em"
              w="100%"
              flexDir="row"
              _hover={{}}
              cursor="default"
              boxShadow="none"
            >
              <Text w="25%" textAlign="left" noOfLines={1} fontSize="1.2em">
                Name
              </Text>
              <Text w="25%" textAlign="left" noOfLines={2} fontSize="1.2em">
                Description
              </Text>
              <Text w="25%" textAlign="left" noOfLines={1} fontSize="1.2em">
                Price
              </Text>
              <Flex
                flexDir="row"
                gap="1em"
                alignItems="center"
                fontSize="1.2em"
              >
                Actions
              </Flex>
            </CustomCard>
            {itemList.map((item) => (
              <ItemBox
                key={item.id}
                item={item}
                onDeleteItem={onDeleteItem(item.id)}
                onUpdateItem={onUpdateMarketplaceItem}
              />
            ))}
          </Flex>
          <Flex justifyContent="center" w="100%">
            <AddMarketplaceItem
              categoryId={category.id}
              onCreateItem={onCreateItem}
            />
          </Flex>
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
};

interface ItemBoxProps {
  item: RouterOutputs["admin"]["marketplace"]["getItemByCategoryId"][0];
  onUpdateItem: (
    data: RouterInputs["admin"]["marketplace"]["updateItem"]
  ) => Promise<void>;
  onDeleteItem: () => Promise<void>;
}

const ItemBox = ({ item, onDeleteItem, onUpdateItem }: ItemBoxProps) => {
  return (
    <CustomCard
      gap="0.3em"
      h="3em"
      w="100%"
      flexDir="row"
      _hover={{}}
      cursor="default"
    >
      <Text w="25%" textAlign="left" noOfLines={1} fontSize="1.2em">
        {item.name}
      </Text>
      <Text w="25%" textAlign="left" noOfLines={2} fontSize="0.7em">
        {item.description}
      </Text>
      <Text w="25%" textAlign="left" noOfLines={1}>
        {item.price}
      </Text>
      <Flex flexDir="row" gap="1em" alignItems="center">
        <EditMarketplaceItem onUpdateItem={onUpdateItem} item={item} />
        <DeleteItemModal
          onDeleteItem={onDeleteItem}
          title="Delete Item"
          displayText={item.name}
        />
      </Flex>
    </CustomCard>
  );
};
