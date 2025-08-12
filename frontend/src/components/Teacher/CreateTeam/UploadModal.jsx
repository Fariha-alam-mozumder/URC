import React, { useEffect, useMemo, useRef, useState } from "react";

const countWords = (text) =>
  (text || "").trim().replace(/\s+/g, " ").split(" ").filter(Boolean).length;

const UploadDocModal = ({
  open,
  onClose,
  onSubmit, // function called with { title, abstract, file, kind }
  kind = "paper", // "paper" | "proposal"
}) => {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [file, setFile] = useState(null);
  const fileRef = useRef(null);

  const words = useMemo(() => countWords(abstract), [abstract]);
  const overLimit = words > 200;

  useEffect(() => {
    if (!open) {
      // reset form when modal closes
      setTitle("");
      setAbstract("");
      setFile(null);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Please enter a title.");
    if (!abstract.trim()) return alert("Please write an abstract.");
    if (overLimit) return alert("Abstract must be 200 words or fewer.");
    if (!file) return alert("Please attach a document.");

    console.log("Modal submitting:", { title, abstract, file, kind });
    onSubmit?.({ title: title.trim(), abstract: abstract.trim(), file, kind });
    onClose?.();
  }; 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-lg">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">
            {kind === "paper" ? "Upload New Paper" : "Upload New Proposal"}
          </h3>
          <button
            onClick={onClose}
            className="px-2 py-1 rounded hover:bg-gray-100 text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Abstract (≤ 200 words)
              </label>
              <span
                className={`text-xs ${
                  overLimit ? "text-red-600" : "text-gray-500"
                }`}
              >
                {words}/200
              </span>
            </div>
            <textarea
              className={`mt-1 w-full border rounded px-3 py-2 min-h-[120px] ${
                overLimit ? "border-red-400" : ""
              }`}
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Write a concise abstract…"
            />
            {overLimit && (
              <p className="text-xs text-red-600 mt-1">
                Please reduce the abstract to 200 words or fewer.
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Attach document</label>
            <div className="mt-1 flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="px-3 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Choose File
              </button>
              <span className="text-sm text-gray-600">
                {file ? file.name : "No file selected"}
              </span>
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              disabled={overLimit}
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadDocModal;
