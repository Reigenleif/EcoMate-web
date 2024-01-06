import { Input, Text, Textarea } from "@chakra-ui/react";
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { z } from "zod";

export const ParagraphInput = <FormValues extends FieldValues>({
  field,
  title,
  register,
  error,
  desc,
  isFrozen = false,
}: {
  field: Path<FormValues>;
  title: string | null;
  register: UseFormRegister<FormValues>;
  error: FieldErrors<FormValues>[Path<FormValues>];
  desc?: string | null;
  isFrozen?: boolean;
}) => (
  <>
    <Text color="blue.100" fontWeight="bold" fontSize="xl">
      {title}
    </Text>
    {desc && (
      <Text color="blue.100" fontWeight="bold" fontSize="md" my="0.5em">
        {desc}
      </Text>
    )}
    <Textarea
      rows={4}
      mx="auto"
      bg="white"
      {...register(field)}
      borderColor={error?.message ? "salmon" : undefined}
      isDisabled={isFrozen}
    />
    <Text color="salmon" h="1em">
      {error?.message ? (error.message as string) : ""}
    </Text>
  </>
);
