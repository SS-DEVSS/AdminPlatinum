import { AxiosInstance } from "axios";

const DELETE_BATCH_SIZE = 50;
const DELETE_TIMEOUT_MS = 120_000;

type SyncProductReferenceDeletionsParams = {
  client: AxiosInstance;
  referenceIdsToDelete: string[];
};

export async function syncProductReferenceDeletions({
  client,
  referenceIdsToDelete,
}: SyncProductReferenceDeletionsParams): Promise<void> {
  if (referenceIdsToDelete.length === 0) return;

  for (let index = 0; index < referenceIdsToDelete.length; index += DELETE_BATCH_SIZE) {
    const batch = referenceIdsToDelete.slice(index, index + DELETE_BATCH_SIZE);
    await Promise.all(
      batch.map((referenceId) =>
        client.delete(`/references/${referenceId}`, {
          timeout: DELETE_TIMEOUT_MS,
        })
      )
    );
  }
}
