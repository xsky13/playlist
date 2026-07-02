import type { PlaylistItemType } from "./PlaylistItemType"

export type PlaylistContextType = {
	items: PlaylistItemType[],
	saveItem: (item: PlaylistItemType, blob: Blob) => Promise<void>;
	addLoadingItem: (id: string, title: string, duration: string) => void;
	updatePercentage: (id: string, percentage: number) => void;
	finishLoading: (id: string, size: number) => void;
	removeItem: (id: string) => Promise<void>;
	toggleFavorite: (id: string) => Promise<void>;
	removeFailedListing: (id: string) => void;

	enqueueDownload: (task: () => Promise<void>) => Promise<void>;
}
