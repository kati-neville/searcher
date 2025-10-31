import { RepoResult } from "../types";

export default function RepoList({
	repos = [],
	onScan,
}: {
	repos?: RepoResult[];
	onScan: (r: RepoResult) => void;
}) {
	return (
		<div className="space-y-3">
			{repos.map(r => {
				return (
					<div
						key={r.id}
						className="p-3 grid grid-cols-6 border rounded justify-between items-center">
						<div className="text-wrap col-span-5">
							<div className="font-semibold flex items-center w-full">
								<a href={r?.html_url} target="_blank" className="underline">
									{r.full_name}
								</a>
							</div>
							<div className="text-sm mt-4 text-gray-500">
								{r.description?.substring(0, 200)}
							</div>
						</div>
						<div className="flex gap-2 col-span-1 justify-end">
							<button
								onClick={() => onScan(r)}
								className="px-3 py-1 bg-blue-600 text-white rounded">
								Scan
							</button>
						</div>
					</div>
				);
			})}
		</div>
	);
}
