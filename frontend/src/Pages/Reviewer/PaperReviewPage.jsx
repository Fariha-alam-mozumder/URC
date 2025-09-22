// src/Pages/Reviewer/PaperReviewPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { resolveApiUrl } from "../../config/api";
import {
  ArrowLeft,
  Download,
  FileText,
  Send,
  Loader2,
  Star,
  Clock,
  User,
  Users,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";

const USE_CODE_ENDPOINT = true;

const PaperReviewPage = () => {
  const { paperId } = useParams(); // 'paperId' here is actually the code e.g. P001 / PR001
  // Normalize: remove any dashes/spaces so PR-002 -> PR002
  const normalizedCode = useMemo(
    () => (paperId || "").toUpperCase().replace(/[-\s]/g, ""),
    [paperId]
  );
  const navigate = useNavigate();
  const location = useLocation();

  // Try to infer proposal/paper from route path (fallback if not using code endpoint)
  const isProposalPath = useMemo(() => {
    const p = location.pathname.toLowerCase();
    return p.includes("proposal") || p.includes("research");
  }, [location.pathname]);

  // Local state for item metadata
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [meta, setMeta] = useState({
    code: "", // P001 / PR001, etc.
    type: "", // 'paper' or 'proposal'
    title: "",
    abstract: "",
    status: "",
    submittedAt: "",
    teamName: "",
    submitterName: "",
  });

  // Review form state
  const [form, setForm] = useState({
    originality: "",
    methodology: "",
    clarity: "",
    relevance: "",
    presentation: "",
    feedback: "",
    decision: "", // Accept / Minor Revisions / Major Revisions / Reject
    file: null, // Optional annotated file
  });

  const buildEndpoint = (suffix = "") => {
    if (USE_CODE_ENDPOINT) {
      return resolveApiUrl(`/reviewer/review/${normalizedCode}${suffix}`);
    }
    return resolveApiUrl(
      `/reviewer/${isProposalPath ? "proposal" : "paper"}/${paperId}${suffix}`
    );
  };

  const authHeader = useMemo(
    () => ({
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    }),
    []
  );

  // Fetch item details
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const resp = await axios.get(buildEndpoint(""), {
          headers: authHeader,
        });
        const dto = resp.data?.data || {};
        const type = dto?.type || (isProposalPath ? "proposal" : "paper");

        setMeta({
          code: dto?.code || paperId || "",
          type,
          title: dto?.title || "Untitled",
          abstract: dto?.abstract || "",
          status: dto?.status || "PENDING",
          submittedAt: dto?.submittedAt || "",
          teamName: dto?.teamName || "",
          submitterName: dto?.submittedBy || "",
        });
      } catch (e) {
        console.error("Fetch review item error:", e);
        const msg =
          e.response?.data?.error ||
          e.response?.data?.message ||
          e.message ||
          "Failed to load item";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paperId]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const url = buildEndpoint("/download");
      const res = await axios.get(url, {
        responseType: "blob",
        headers: authHeader,
      });

      // Try to infer a filename
      const filename = `${meta.code || paperId}.pdf`;
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("Download error:", e);
      alert("Failed to download PDF");
    } finally {
      setDownloading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "review_file") {
      setForm((prev) => ({ ...prev, file: files?.[0] || null }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setSubmitting(true);
    setError("");

    try {
      // Basic client-side validation
      const numericFields = [
        "originality",
        "methodology",
        "clarity",
        "relevance",
        "presentation",
      ];
      for (const f of numericFields) {
        if (form[f] === "") {
          throw new Error(`Please provide a score for "${f}".`);
        }
        const n = Number(form[f]);
        if (Number.isNaN(n) || n < 0 || n > 10) {
          throw new Error(`"${f}" must be a number between 0 and 10.`);
        }
      }
      if (!form.decision) {
        throw new Error("Please choose a decision.");
      }

      const payload = new FormData();
      payload.append("originality", form.originality);
      payload.append("methodology", form.methodology);
      payload.append("clarity", form.clarity);
      payload.append("relevance", form.relevance);
      payload.append("presentation", form.presentation);
      payload.append("feedback", form.feedback || "");
      payload.append("decision", form.decision);
      if (form.file) payload.append("review_file", form.file);

      const { data } = await axios.post(buildEndpoint(""), payload, {
        headers: {
          ...authHeader,
          "Content-Type": "multipart/form-data",
        },
      });

      alert(data?.message || "Review submitted successfully");
      // If you want to show the change before leaving:
      if (data?.new_status) {
        setMeta((prev) => ({ ...prev, status: data.new_status }));
      }
      // Optional: short delay so users see the updated badge, then go back
      setTimeout(() => navigate(-1), 300);
    } catch (e) {
      console.error("Server says:", e.response?.data);
      const msg =
        e.response?.data?.error ||
        e.response?.data?.message ||
        e.message ||
        "Failed to submit review";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const avgScore = useMemo(() => {
    const vals = [
      Number(form.originality || 0),
      Number(form.methodology || 0),
      Number(form.clarity || 0),
      Number(form.relevance || 0),
      Number(form.presentation || 0),
    ];
    const valid = vals.filter((v) => !Number.isNaN(v));
    if (!valid.length) return 0;
    const sum = valid.reduce((s, v) => s + v, 0);
    return (sum / valid.length).toFixed(1);
  }, [form]);

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "accepted":
      case "accept":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "rejected":
      case "reject":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  const formatPaperStatus = (s) =>
    typeof s === "string" && s.length
      ? s
          .replace(/_/g, " ") // remove underscores
          .toLowerCase() // make lowercase
          .replace(/\b\w/g, (c) => c.toUpperCase()) // Capitalize first letter of each word
      : s;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "accepted":
      case "accept":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
      case "reject":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getScoreColor = (score) => {
    const num = Number(score);
    if (num >= 8) return "text-green-600";
    if (num >= 6) return "text-yellow-600";
    if (num >= 4) return "text-orange-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-gray-600">
            <div className="relative">
              <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
              <div className="absolute inset-0 w-8 h-8 border-2 border-blue-200 rounded-full animate-ping" />
            </div>
            <span className="text-lg font-medium">
              Loading {meta.type || (isProposalPath ? "proposal" : "paper")}…
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                title="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-black">
                    {meta.type === "proposal" || isProposalPath
                      ? "Research Proposal Review"
                      : "Paper Review"}
                  </h1>
                  <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold">
                    {meta.code || normalizedCode}
                  </div>
                </div>
                <p className="text-gray-600">
                  Submit your comprehensive review and assessment
                </p>
              </div>
            </div>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-60 shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
            >
              <Download size={20} />
              {downloading ? "Downloading…" : "Download PDF"}
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Paper Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 sticky top-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {meta.title || "Untitled"}
                  </h2>
                  <div className="flex items-center gap-2 mb-3">
                    {getStatusIcon(meta.status)}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        meta.status
                      )}`}
                    >
                      {formatPaperStatus(meta.status) || "Pending"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {meta.teamName && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Users className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Team</p>
                      <p className="text-gray-900">{meta.teamName}</p>
                    </div>
                  </div>
                )}

                {meta.submitterName && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Submitted by
                      </p>
                      <p className="text-gray-900">{meta.submitterName}</p>
                    </div>
                  </div>
                )}

                {meta.submittedAt && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Submitted
                      </p>
                      <p className="text-gray-900">
                        {new Date(meta.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {meta.abstract && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Abstract
                  </h3>
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {meta.abstract}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Review Form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Review Assessment
                  </h2>
                  <p className="text-gray-600">
                    Evaluate each criterion on a scale of 0-10
                  </p>
                </div>
              </div>

              {/* Scoring Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {[
                  {
                    name: "originality",
                    label: "Originality",
                    desc: "Novelty and innovation",
                  },
                  {
                    name: "methodology",
                    label: "Methodology",
                    desc: "Research approach",
                  },
                  {
                    name: "clarity",
                    label: "Clarity",
                    desc: "Writing and presentation",
                  },
                  {
                    name: "relevance",
                    label: "Relevance",
                    desc: "Significance to field",
                  },
                  {
                    name: "presentation",
                    label: "Presentation",
                    desc: "Overall quality",
                  },
                ].map((f, idx) => (
                  <div key={f.name} className="group">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      {f.label}
                      <span className="block text-xs font-normal text-gray-500">
                        {f.desc}
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name={f.name}
                        min={0}
                        max={10}
                        step={1}
                        value={form[f.name]}
                        onChange={handleChange}
                        className="w-full h-12 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 px-4 text-lg font-medium group-hover:border-gray-300"
                        placeholder="0-10"
                        required
                      />
                      {form[f.name] && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <span
                            className={`text-lg font-bold ${getScoreColor(
                              form[f.name]
                            )}`}
                          >
                            {form[f.name]}/10
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Average Score Display */}
                <div className="md:col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Overall Score
                      </h3>
                      <p className="text-sm text-gray-600">
                        Average of all criteria
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-3xl font-bold ${getScoreColor(
                          avgScore
                        )}`}
                      >
                        {avgScore}
                      </div>
                      <div className="text-gray-500 text-sm">out of 10</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decision */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Recommendation
                  <span className="block text-xs font-normal text-gray-500">
                    Final decision for this submission
                  </span>
                </label>
                <select
                  name="decision"
                  value={form.decision}
                  onChange={handleChange}
                  className="w-full h-12 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 px-4 text-lg font-medium bg-white"
                  required
                >
                  <option value="">Select your recommendation</option>
                  <option value="ACCEPT">Accept</option>
                  <option value="MINOR_REVISIONS">Minor Revisions</option>
                  <option value="MAJOR_REVISIONS">Major Revisions</option>
                  <option value="REJECT">Reject</option>
                </select>
              </div>

              {/* Feedback */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Detailed Feedback
                  <span className="block text-xs font-normal text-gray-500">
                    Constructive comments for the authors
                  </span>
                </label>
                <textarea
                  name="feedback"
                  rows={6}
                  value={form.feedback}
                  onChange={handleChange}
                  className="w-full rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 p-4 text-gray-700 resize-none"
                  placeholder="Provide detailed feedback on strengths, weaknesses, and suggestions for improvement..."
                />
              </div>

              {/* File Upload */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Annotated Review File
                  <span className="block text-xs font-normal text-gray-500">
                    Optional: Upload your detailed review document
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="review_file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleChange}
                    className="block w-full text-sm text-gray-600
                               file:mr-4 file:py-3 file:px-6
                               file:rounded-xl file:border-0
                               file:text-sm file:font-semibold
                               file:bg-blue-50 file:text-blue-700
                               hover:file:bg-blue-100 file:transition-all file:duration-200
                               border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-400 transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Supported formats: PDF, DOC, DOCX (Max 10MB)
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  Ready to submit your comprehensive review
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-60 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-lg min-w-[180px] justify-center"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Submit Review
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperReviewPage;
