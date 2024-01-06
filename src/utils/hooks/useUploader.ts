import { useState } from "react";
import { AllowableFileTypeEnum, FolderEnum } from "../file";
import { api } from "../api";
import { uploadFile } from "../file";
import { env } from "process";

const BUCKET_NAME = "ecomate-storage"

export const useUploader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const generateURLForUpload = api.storage.generateURLForUpload.useMutation();
  const generateURLForDownload =
    api.storage.generateURLForDownload.useMutation();

  const uploader = async (
    file: File,
    filename: string,
    fileType: (AllowableFileTypeEnum | string)
  ) => {
    if (!file || !filename) return;
    setIsLoading(true);

    const { url: uploadUrl, sanitizedFilename } =
      await generateURLForUpload.mutateAsync({
        filename,
        contentType: fileType as AllowableFileTypeEnum,
      });

    await uploadFile(uploadUrl, file, fileType as AllowableFileTypeEnum);

    setIsLoading(false);

    return {
      url: `https://${BUCKET_NAME}.storage.googleapis.com/${filename}`,
      filename: sanitizedFilename,
    };
  };

  return { uploader, isUploading: isLoading };
};
