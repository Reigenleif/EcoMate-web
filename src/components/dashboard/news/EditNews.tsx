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
  title: z.string().min(1),
  content: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

interface EditNewsProps {
  item: RouterOutputs["admin"]["news"]["getNews"][0];
  onUpdateItem: (data: RouterInputs["admin"]["news"]["updateNews"]) => Promise<void>;
}

export const EditNews = ({ onUpdateItem, item }: EditNewsProps) => {
  const { register, formState, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: item.title ?? "",
      content: item.content ?? "",
    },
  });

  const imageState = useState<File | null | undefined>(null);

  const { uploader } = useUploader();

  const onEditItem = handleSubmit(async (data) => {
    const Image = imageState[0];
    const filename = Image
      ? "news/" + uuid() + "." + Image.name.split(".").pop()
      : "";

    let imageUrl: string | undefined;
    if (Image) {
      const res = await uploader(Image, filename, Image?.type);
      imageUrl = res?.url;
    }

    await onUpdateItem({
      id: item.id,
      title: data.title,
      content: data.content,
      imageUrl,
    });
  });

  return (
    <EditItemModal title="Add News" onEditItem={onEditItem}>
      <form>
        <FormControl>
          <Flex flexDir="column" gap="1em">
            <StringInput
              title="Title"
              field="title"
              register={register}
              error={formState.errors.title}
            />
            <ParagraphInput
              title="Content"
              field="content"
              register={register}
              error={formState.errors.content}
            />
            <Text> Add Image</Text>
            <FileInput
              fileStateArr={imageState}
              imgUrl={item.imageUrl ?? undefined}
              allowed={[AllowableFileTypeEnum.PICTURES]}
            />
          </Flex>
        </FormControl>
      </form>
    </EditItemModal>
  );
};
