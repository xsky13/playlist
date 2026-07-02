import type React from "react";
import { useContext, useState } from "react";
import { PlaylistContext } from "../../context/PlaylistContext";
import { saveFile } from "../../utils/saveFile";

type YtVideo = {
	id: string;
	title: string;
	thumbnail: string;
	channel: string;
	duration: string;
}

export default function AddFromVideo({ closeDialog }: { closeDialog: () => void }) {
	const [youtubeItems, setYoutubeItems] = useState<YtVideo[]>([]);
	const [queryLoading, setQueryLoading] = useState(false);
	const playlist = useContext(PlaylistContext)
	if (!playlist) {
		alert("Internal error");
		return;
	}


	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const searchTerm = formData.get("searchTerm");
		if (!searchTerm || searchTerm == "") {
			alert("Please enter a search term");
			return;
		}

		setYoutubeItems([]);
		setQueryLoading(true);
		try {
			const searchResult = await fetch("https://playlist-backend-a18f.onrender.com/search?term=" + searchTerm);
			const searchData = await searchResult.json();

			setYoutubeItems(searchData.results);
		} catch (err) {
			alert("Error searching YouTube");
			console.log(err);
		}
		setQueryLoading(false);
	}


	const downloadVideo = async (videoId: string, title: string) => {
		if (confirm(`Confirm adding ${title}?`)) {
			setYoutubeItems([]);
			setQueryLoading(true);

			// extract information
			const result = await fetch("https://playlist-backend-a18f.onrender.com/extract", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ url: "https://www.youtube.com/watch?v=" + videoId })
			})
				.then(res => res.json())
				.catch(err => {
					alert("Error getting video info")
					console.log(err)
					return;
				});

			if (!result) return;

			// close the dialog
			setYoutubeItems([]);
			setQueryLoading(false);
			closeDialog();
			playlist.addLoadingItem(result.id, result.title, result.duration);

			playlist.enqueueDownload(async () => {
				const returnedResult = await saveFile(result.id, result.title, result.duration, result.filesize, playlist.updatePercentage, playlist.finishLoading);
				if (returnedResult == null) {
					playlist.removeFailedListing(result.id);
					return;
				}
				await playlist.saveItem(returnedResult.item, returnedResult.blob);
			});
		}
	}

	return (
		<div id="searchYtSection" className="searchYtSection">
			<form onSubmit={handleSubmit} className="search-section-header">
				<input
					type="text"
					name="searchTerm"
					placeholder="Search..."
				/>
				<button
					type="submit"
					className="button url-button"
				>
					Search
				</button>
			</form>
			{
				queryLoading && <img src="/loader.svg" className="loading-img" width="60" />
			}
			{
				youtubeItems.length != 0 &&
				<div className="search-results">
					{
						youtubeItems.map(item => (
							<div className="playlist-item" onClick={() => downloadVideo(item.id, item.title)}>
								<div className="playlist-start search">
									<img src={item.thumbnail} className="search-img" width="75" />
									<div className="details">
										<h3>{item.title}</h3>
										<span className="subtitle">{item.channel}</span>
									</div>
								</div>
								<div>
									<span className="subtitle">{item.duration}</span>
								</div>
							</div>
						))
					}
				</div>
			}
		</div>
	);
}
