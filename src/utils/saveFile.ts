import type { PlaylistItemType } from "../types/PlaylistItemType";

export const saveFile = async (
	id: string,
	title: string,
	duration: string,
	filesize: number,
	updatePercentage: (id: string, percentage: number) => void,
    finishLoading: (id: string, size: number) => void
): Promise<{ blob: Blob, item: PlaylistItemType } | null> => {

	const response = await fetch(`https://playlist-backend-a18f.onrender.com/extract/${id}`).catch(() => null);
	if (!response || !response.ok) {
		alert("Error downloading file");
		return null
	}

	const reader = response.body!.getReader();
	const chunks = [];
	let received = 0;
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			chunks.push(value);
			received += value.length;

			const percent = filesize ? Math.min(100, Math.round(received / filesize * 100)) : null;
			updatePercentage(id, percent ?? 0)
		}
	} catch {
		return null;
	}

	finishLoading(id, Math.round((received / 1024 / 1024) * 10) / 10)

	const finishedPlaylistItem = {
		id, title, duration, loading: false, percentage: 100, favorite: false, size: Math.round((received / 1024 / 1024) * 10) / 10
	}

	const blob = new Blob(chunks, { type: "audio/mpeg" });
	return { blob, item: finishedPlaylistItem };
}
