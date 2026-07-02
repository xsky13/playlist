export type PlaylistItemType = {
	id: string;
	title: string;
	duration: string;
	size: number | null;
	favorite: boolean;

	loading: boolean;
	percentage: number | null;
}
