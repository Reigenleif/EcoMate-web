import { RouterInputs, RouterOutputs, api } from "~/utils/api";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { AddItemModal } from "~/components/item-tooling/AddItemModal";
import { useUploader } from "~/utils/hooks/useUploader";
import { z } from "zod";
import { StringInput } from "~/components/form/StringInput";
import { uuid } from "uuidv4";
import { ParagraphInput } from "~/components/form/ParagraphInput";
import { Button, Flex, FormControl, Text } from "@chakra-ui/react";
import { FileInput } from "~/components/form/FileInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { AllowableFileTypeEnum } from "~/utils/file";

const schema = z.object({
  name: z.string().min(1),
  description : z.string().optional()
});

type FormValues = z.infer<typeof schema>;

interface AddNewsProps {
  onCreateItem: (data: RouterInputs["admin"]["marketplace"]["createCategory"]) => Promise<void>;
}

export const AddCategory = ({ onCreateItem }: AddNewsProps) => {
  const { register, formState, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const imageState = useState<File | null | undefined>(null);

  const { uploader } = useUploader();

  const onAddItem = handleSubmit(async (data) => {
    const Image = imageState[0];
    const filename = Image
      ? "marketplace/category/" + uuid() + "." + Image.name.split(".").pop()
      : "";

    let imageUrl: string | undefined;
    if (Image) {
      const res = await uploader(Image, filename, Image?.type);
      imageUrl = res?.url;
    }

    await onCreateItem({
      name: data.name,
      description: data.description,
      imageUrl,
    }).then(() => {
      reset()
    });;
  });

  return (
    <AddItemModal title="Add News" onAddItem={onAddItem}>
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
    </AddItemModal>
  );
};
