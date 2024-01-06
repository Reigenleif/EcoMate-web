import { RouterInputs, RouterOutputs, api } from "~/utils/api";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { AddItemModal } from "~/components/item-tooling/AddItemModal";
import { useUploader } from "~/utils/hooks/useUploader";
import { z } from "zod";
import { StringInput } from "~/components/form/StringInput";
import { env } from "process";
import { uuid } from "uuidv4";
import { ParagraphInput } from "~/components/form/ParagraphInput";
import { Button, Flex, FormControl, Text } from "@chakra-ui/react";
import { FileInput } from "~/components/form/FileInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditItemModal } from "~/components/item-tooling/EditItemModal";
import { AllowableFileTypeEnum } from "~/utils/file";

const schema = z.object({
  name: z.string().min(1),
  description: z.string(),
  price: z.string(),
});

type FormValues = z.infer<typeof schema>;

interface EditCategoryProps {
  item: RouterOutputs["admin"]["marketplace"]["getItemByCategoryId"][0];
  onUpdateItem: (data: RouterInputs["admin"]["marketplace"]["updateItem"]) => Promise<void>;
}

export const EditMarketplaceItem= ({ onUpdateItem, item }: EditCategoryProps) => {
  const { register, formState, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: item.name ?? "",
      description: item.description ?? "",
    },
  });

  const imageState = useState<File | null | undefined>(null);

  const { uploader } = useUploader();

  const onEditItem = handleSubmit(async (data) => {
    const Image = imageState[0];
    const filename = Image
      ? "Category/" + uuid() + "." + Image.name.split(".").pop()
      : "";

    let imageUrl: string | undefined;
    if (Image) {
      const res = await uploader(Image, filename, Image?.type);
      imageUrl = res?.url;
    }

    await onUpdateItem({
      id: item.id,
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      imageUrl,
    });
  });

  return (
    <EditItemModal title="Add Category" onEditItem={onEditItem}>
      <form>
        <FormControl>
        <Flex flexDir="column" gap="1em">
            <StringInput
              title="Name"
              field="name"
              register={register}
              error={formState.errors.name}
            />
            <ParagraphInput
              title="Description (Optional)"
              field="description"
              register={register}
              error={formState.errors.description}
            />
            <Text> Add Category icon</Text>
            <FileInput
              fileStateArr={imageState}
              allowed={[AllowableFileTypeEnum.PICTURES]}
            />
          </Flex>
        </FormControl>
      </form>
    </EditItemModal>
  );
};
