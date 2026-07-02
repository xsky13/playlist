import { useContext, useState } from "react";
import { saveFile } from "../../utils/saveFile";
import { PlaylistContext } from "../../context/PlaylistContext";

export default function AddFromUrl(props: { closeDialog: () => void }) {
	const [loading, setLoading] = useState(false);
	const playlist = useContext(PlaylistContext);
	if (!playlist) {
		alert("Internal error");
		return;
	}

	const getVideoId = (input: string) => {
		try {
			const url = new URL(input);
			if (url.hostname.includes("youtu.be")) {
				return url.pathname.slice(1);
			}
			return url.searchParams.get("v");
		} catch {
			return null;
		}
	};

	const handleFormSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const url = formData.get("url") as string;
		if (!url || url == "") {
			alert("Url is empty")
			return;
		}

		const videoId = getVideoId(url);
		if (!videoId) {
			alert("Couldn't read a video ID from that URL");
			return;
		}

		setLoading(true);
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

		setLoading(false);
		if (!result) return;
		props.closeDialog();
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


	return (
		<form onSubmit={handleFormSubmit} className="openUrlSection">
			<input type="text" name="url" placeholder="Video url..." />
			<button className="button url-button" id="submitUrlBtn" disabled={loading}>
				{
					loading ? <img src="/loader_white.svg" width={25} /> : "Submit"
				}
			</button>
		</form>
	);
}
