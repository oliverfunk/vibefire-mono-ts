import { type VibefireEventT } from "@vibefire/models";
import { type ImageTypes } from "@vibefire/utils";

const getUploadUrl = async (
  accountId: string,
  apiKey: string,
  imageId?: string,
  metadata?: Record<string, string>,
) => {
  const apiUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v2/direct_upload`;

  const formData = new FormData();

  if (imageId) {
    formData.append("id", imageId);
  }
  if (metadata) {
    formData.append("metadata", JSON.stringify(metadata, null, 0));
  }

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(
      `Failed to get image upload url: ${res.status} ${res.statusText}`,
    );
  }

  const d = (await res.json()) as Record<string, unknown>;
  return d;
};

export const getUploadUrlForEventImage = async (
  accountId: string,
  apiKey: string,
  eventId: VibefireEventT["id"],
  organiserId: VibefireEventT["organiserId"],
  type: ImageTypes,
) => {
  const metadata = {
    eventId,
    owner: organiserId,
    type,
  };

  return await getUploadUrl(accountId, apiKey, undefined, metadata);
};

export const deleteImage = async (
  accountId: string,
  apiKey: string,
  imageId: string,
) => {
  const apiUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1/${imageId}`;

  const res = await fetch(apiUrl, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to delete image: ${res.status} ${res.statusText}`);
  }
};
