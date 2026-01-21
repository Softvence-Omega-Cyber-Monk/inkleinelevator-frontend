import { FileText, Download } from "lucide-react"; // Import icons

interface DetailsFileTabProps {
  singleJobData?: any;
  isLoading?: boolean;
}

export default function DetailsFileTab({
  singleJobData,
  isLoading = false,
}: DetailsFileTabProps) {
  function getFileName(url: string) {
    try {
      const parts = url.split("/");
      return decodeURIComponent(parts[parts.length - 1]);
    } catch {
      return "Unknown File";
    }
  }

  function timeAgo(dateString: string) {
    const now = new Date().getTime();
    const past = new Date(dateString).getTime();
    const diff = Math.floor((now - past) / 1000);

    if (diff < 60) return "Recently";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  }

  if (isLoading) {
    return (
      <div className="p-8 bg-white rounded-lg shadow-md min-h-52 animate-pulse">
        <div className="h-6 w-1/3 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  const handleDownload = (url: string, fileName: string) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch((error) => {
        console.error("Download failed:", error);
        // Fallback: open in new tab
        window.open(url, "_blank");
      });
  };
  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Documents</h2>

      {singleJobData?.documents?.length > 0 ? (
        <ul className="space-y-3">
          {singleJobData.documents.map((doc: string, index: number) => {
            const fileName = getFileName(doc);
            const uploadedTime = timeAgo(singleJobData.createdAt);

            return (
              <li key={index} className="">
                <div className="flex justify-between items-center mb-4 bg-white px-4 py-6 rounded-lg hover:bg-gray-100 transition">
                  {/* Left: File icon + name + uploaded time */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-[#2B7FFF]" />
                        <span className="text-gray-900 font-medium">
                          {fileName}
                        </span>
                      </div>
                      <span className="text-gray-500 text-sm ml-6">
                        {uploadedTime} • 3.2 MB
                      </span>
                    </div>
                  </div>

                  {/* Right: Download icon */}
                  <button onClick={() => handleDownload(doc, fileName)}>
                    <Download className="h-5 w-5 text-gray-500 mr-6 hover:text-[#2B7FFF] cursor-pointer" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500">No documents available</p>
      )}
    </div>
  );
}
