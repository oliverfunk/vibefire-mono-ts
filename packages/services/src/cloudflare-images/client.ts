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

  async _post(url: string, body: FormData) {
    return await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "multipart/form-data",
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
  }): Promise<Record<string, unknown>> {
    const { imageId, metadata } = p;

    const apiUrl = `${this.baseApiUrl}/images/v2/direct_upload`;

    const fd = this._formData(metadata);
    if (imageId) {
      fd.append("id", imageId);
    }

    const res = await this._post(apiUrl, fd);
    if (!res.ok) {
      throw new Error(
        `/images/v2/direct_upload POST failed: ${res.status} ${res.statusText}`,
      );
    }
    return (await res.json()) as Record<string, unknown>;
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
