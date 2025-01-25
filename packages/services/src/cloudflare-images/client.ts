type CloudFlareImagesResponse<T> = {
  errors: string[];
  messages: string[];
  result: T;
  success: boolean;
};

export class CloudFlareImagesClient {
  private readonly baseApiUrl: string;

  constructor(
    accountId: string,
    private readonly apiKey: string,
  ) {
    this.baseApiUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}`;
  }

  _formData(metadata?: Record<string, string>) {
    const formData = new FormData();
    if (metadata) {
      formData.append("metadata", JSON.stringify(metadata, null, 0));
    }
    return formData;
  }

  _post(url: string, body: FormData) {
    return fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body,
    });
  }

  async _delete(url: string) {
    return await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });
  }

  /**
   * Direct uploads allow users to upload images without API keys.
   * A common use case are web apps, client-side applications, or mobile devices
   * where users upload content directly to Cloudflare Images.
   * This method creates a draft record for a future image.
   * It returns an upload URL and an image identifier.
   * To verify if the image itself has been uploaded, send an image details
   * request (accounts/:account_identifier/images/v1/:identifier),
   * and check that the draft: true property is not present.
   *
   * @param {string} [p.imageId] - Optional ID for the image to be uploaded.
   * @param {string} [p.expiry] - Optional expiry date for the upload.
   * The date after which the upload will not be accepted. Minimum: Now + 2 minutes. Maximum: Now + 6 hours.
   * @param [p.metadata] - Optional metadata to be included with the upload.
   * @returns {Promise<Record<string, unknown>>} - A promise that resolves to the response from the Cloudflare Images service.
   * @throws {Error} - Throws an error if the POST request fails.
   */
  async directUpload(p: {
    imageId?: string;
    expiry?: string;
    metadata?: Record<string, string>;
  }): Promise<{
    id: string;
    uploadURL: string;
  }> {
    const { imageId, metadata, expiry } = p;

    const apiUrl = `${this.baseApiUrl}/images/v2/direct_upload`;

    const fd = this._formData(metadata);
    if (imageId) {
      fd.append("id", imageId);
    }
    if (expiry) {
      fd.append("expiry", expiry);
    }

    const resJson = await this._post(apiUrl, fd).then<
      CloudFlareImagesResponse<{
        id: string;
        uploadURL: string;
      }>
    >((response) => response.json());

    if (!resJson.success) {
      console.error("directUpload", JSON.stringify(resJson, null, 2));
      throw new Error(`/images/v2/direct_upload POST failed`);
    }

    return {
      id: resJson.result.id,
      uploadURL: resJson.result.uploadURL,
    };
  }

  async deleteImage(imageId: string) {
    const apiUrl = `${this.baseApiUrl}/images/v1/${imageId}`;

    const res = await this._delete(apiUrl);
    if (!res.ok) {
      throw new Error(
        `/images/v1/${imageId} DELETE failed: ${res.status} ${res.statusText}`,
      );
    }
  }
}
