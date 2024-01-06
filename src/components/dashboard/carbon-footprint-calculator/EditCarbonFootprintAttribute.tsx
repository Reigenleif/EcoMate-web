import { RouterInputs, RouterOutputs, api } from "~/utils/api";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { AddItemModal } from "~/components/item-tooling/AddItemModal";
import { useUploader } from "~/utils/hooks/useUploader";
import { z } from "zod";
import { StringInput } from "~/components/form/StringInput";
import { ParagraphInput } from "~/components/form/ParagraphInput";
import { Box, Button, Flex, FormControl, Text } from "@chakra-ui/react";
import { FileInput } from "~/components/form/FileInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditItemModal } from "~/components/item-tooling/EditItemModal";
import { AllowableFileTypeEnum } from "~/utils/file";

const schema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  coefficient: z.number(),
  unit: z.string().nonempty(),
});
type FormValues = z.infer<typeof schema>;

interface EditCarbonFootprintAttributeProps {
  item: RouterOutputs["admin"]["carbonFootprintCalculator"]["getCarbonFootprintAttributes"][0];
  onUpdateItem: (
    data: RouterInputs["admin"]["carbonFootprintCalculator"]["updateCarbonFootprintAttribute"]
  ) => Promise<void>;
}

export const EditCarbonFootprintAttribute = ({ onUpdateItem, item }: EditCarbonFootprintAttributeProps) => {
  const { register, formState, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: item.name,
      description: item.description,
      coefficient: item.coefficient,
      unit: item.unit,
    },
  });

  const onEditItem = handleSubmit(async (data) => {

    await onUpdateItem({
      id: item.id,
      name: data.name,
      description: data.description,
      coefficient: data.coefficient,
      unit: data.unit,
    });
  });

  return (
    <EditItemModal title="Add CarbonFootprintAttribute" onEditItem={onEditItem}>
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
    </EditItemModal>
  );
};
