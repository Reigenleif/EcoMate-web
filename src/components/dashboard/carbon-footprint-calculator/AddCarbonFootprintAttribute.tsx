import { RouterInputs } from "~/utils/api";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { AddItemModal } from "~/components/item-tooling/AddItemModal";
import { useUploader } from "~/utils/hooks/useUploader";
import { z } from "zod";
import { StringInput } from "~/components/form/StringInput";
import { uuid } from "uuidv4";
import { ParagraphInput } from "~/components/form/ParagraphInput";
import { Box, Button, Flex, FormControl, Text } from "@chakra-ui/react";
import { FileInput } from "~/components/form/FileInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { AllowableFileTypeEnum } from "~/utils/file";

const schema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  coefficient: z.string(),
  unit: z.string().nonempty(),
});

type FormValues = z.infer<typeof schema>;

interface AddCarbonFootprintAttributesProps {
  onCreateItem: (
    data: RouterInputs["admin"]["carbonFootprintCalculator"]["createCarbonFootprintAttribute"]
  ) => Promise<void>;
}

export const AddCarbonFootprintAttribute = ({
  onCreateItem,
}: AddCarbonFootprintAttributesProps) => {
  const { register, formState, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onAddItem = handleSubmit(async (data) => {
    const coefficient = parseFloat(data.coefficient);
    await onCreateItem({
      name: data.name,
      description: data.description,
      coefficient: coefficient,
      unit: data.unit,
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
              field="name"
              title="Name"
              register={register}
              error={formState.errors.name}
            />
            <ParagraphInput
              field="description"
              title="Description"
              register={register}
              error={formState.errors.description}
            />
            <Flex gap="1em">
              <Box w="70%">
                <StringInput
                  type="number"
                  field="coefficient"
                  title="Coefficient"
                  register={register}
                  error={formState.errors.coefficient}
                />
              </Box>
              <Box w="30%">
                <StringInput
                  field="unit"
                  title="Unit"
                  register={register}
                  error={formState.errors.unit}
                />
              </Box>
            </Flex>
          </Flex>
        </FormControl>
      </form>
    </AddItemModal>
  );
};
