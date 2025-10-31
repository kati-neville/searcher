import { useEffect, useState } from "react";
import { RepoResult, ScanResult } from "../types";
import ModalWrapper from "./Modal";
import { buildIssueBody, getToken } from "../lib";
import { createIssue } from "../lib/github";
import { PAT_TOKEN } from "../lib/constants";

export default function ResultsList({
	results = [],
	selectedRepo,
	reset,
}: {
	results?: ScanResult[];
	selectedRepo: RepoResult | null;
	reset: () => void;
}) {
	const [open, setOpen] = useState(false);
	const [response, setResponse] = useState<{
		state: "success" | "error";
		message: string;
	}>();
	const [loading, setLoading] = useState(false);

	const token = getToken();

	async function handleCreateIssue() {
		if (!selectedRepo) return alert("No repo selected");
		if (!token) return setOpen(true);
		const body = buildIssueBody(results);

		setLoading(true);

		try {
			const resp = await createIssue({
				owner: selectedRepo?.owner.login,
				repo: selectedRepo?.name,
				token,
				title: "Potential secrets discovered (automated scan)",
				body,
			});

			setResponse({
				state: "success",
				message: resp?.html_url,
			});
		} catch (err: any) {
			setResponse({
				state: "error",
				message: "Failed to create issue: " + (err.message || String(err)),
			});
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		if (response) {
			setTimeout(() => {
				setResponse(undefined);
				reset();
			}, 1500);
		}
	}, [response]);

	if (!results || results.length === 0)
		return <div className="text-gray-500">No findings</div>;

	return (
		<>
			<AddToken open={open} setOpen={setOpen} />

			<div className="space-y-4">
				{results.map((r, i) => (
					<div key={i} className="p-3 border rounded">
						<div className="font-medium">{r.path}</div>
						<div className="text-sm mt-2">
							{r.matches.map((m, j) => {
								return (
									<div key={j} className="mb-2">
										<div className="text-xs text-gray-500">{m.patternName}</div>
										<pre className="bg-gray-100 p-2 overflow-x-auto text-sm">
											{m.match}
										</pre>
									</div>
								);
							})}
						</div>
					</div>
				))}
				<div>
					<button
						onClick={handleCreateIssue}
						className="px-3 py-1 bg-red-600 text-white rounded">
						{loading ? "Creating ... " : "Create Issue"}
					</button>

					{response?.state === "success" ? (
						<div className="bg-green-200 rounded-md p-2 mt-2">
							<p className="text-xs">
								Issue Created Successfully:{" "}
								<a
									href={response.message}
									target="_blank"
									className="underline">
									link
								</a>
							</p>
						</div>
					) : null}
					{response?.state === "error" ? (
						<div className="bg-red-200 rounded-md p-2 mt-2">
							<p className="text-xs">{response?.message}</p>
						</div>
					) : null}
				</div>
			</div>
		</>
	);
}

function AddToken({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
}) {
	const [val, setVal] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!val.trim()) return;
		sessionStorage.setItem(PAT_TOKEN, val.trim());
		setVal("");
		handleClose();
	};

	function handleClose() {
		setOpen(false);
	}

	return (
		<ModalWrapper
			isOpen={open}
			onClose={handleClose}
			title="Provide Personal Access Token (PAT)"
			size="md">
			<form onSubmit={handleSubmit} className="flex gap-2 items-end">
				<div className="w-full">
					<label htmlFor="pat" className="">
						Personal Access Token is required for creating an issue
					</label>
					<input
						type="text"
						value={val}
						id="pat"
						onChange={e => setVal(e.target.value)}
						className="border rounded p-1 mt-2 flex-1 w-full"
						placeholder="GitHub PAT"
					/>
				</div>
				<button
					type="submit"
					className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700">
					Save
				</button>
			</form>
		</ModalWrapper>
	);
}
