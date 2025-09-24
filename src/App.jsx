import React, { useState, useMemo, useRef } from "react";
import { saveAs } from "file-saver";
import Header from "./components/Header";
import Controls from "./components/Controls";
import Status from "./components/Status";
import Table from "./components/Table";
import Pagination from "./components/Pagination";
import { useDebounce } from "./utils/useDebounce"; 
import jsonToCSV from "./utils/json2CSV";
import "./index.css";

const COLUMNS = ["Title", "Author", "Genre", "PublishedYear", "ISBN"];

function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filterText, setFilterText] = useState("");
  const debouncedFilter = useDebounce(filterText, 400);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [sortConfig, setSortConfig] = useState(null);

  // Store only edits using unique row IDs
  const editsRef = useRef(new Map());
  const [, forceRerender] = useState(0);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));

  const displayed = useMemo(() => {
    let data = rows;

    if (debouncedFilter) {
      const q = debouncedFilter.toLowerCase();
      data = data.filter((r) =>
        COLUMNS.some((c) => (r[c] || "").toString().toLowerCase().includes(q))
      );
    }

    if (sortConfig) {
      data = [...data].sort((a, b) => {
        const A = a[sortConfig.key] || "";
        const B = b[sortConfig.key] || "";
        return sortConfig.direction === "asc"
          ? A.toString().localeCompare(B.toString(), undefined, { numeric: true })
          : B.toString().localeCompare(A.toString(), undefined, { numeric: true });
      });
    }

    return data.slice(page * pageSize, (page + 1) * pageSize)
      .map((r) => ({ ...r })); // shallow copy to avoid mutation
  }, [rows, debouncedFilter, page, pageSize, sortConfig]);

  function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setProgress(0);

    const worker = new Worker(new URL("./utils/worker.js", import.meta.url));
    worker.postMessage({ file });

    worker.onmessage = (event) => {
      if (event.data.type === "progress") setProgress(event.data.progress);
      if (event.data.type === "done") {
        const data = event.data.rows.map((r, idx) => ({ ...r, _uid: idx }));
        setRows(data);
        editsRef.current = new Map();
        setLoading(false);
        setProgress(100);
        setPage(0);
        forceRerender((n) => n + 1);
        worker.terminate();
      }
    };
  }

  function handleCellChange(rIdx, col, value, uid) {
    setRows((prev) => {
      const next = [...prev];
      const rowIndex = next.findIndex(r => r._uid === uid);
      if (rowIndex !== -1) next[rowIndex] = { ...next[rowIndex], [col]: value };
      return next;
    });

    if (!editsRef.current.has(uid)) editsRef.current.set(uid, new Set());
    editsRef.current.get(uid).add(col);
    forceRerender((n) => n + 1);
  }

  function handleDownload() {
    const csv = jsonToCSV(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "books-edited.csv");
  }

  function handleReset() {
    // Clear edits only
    editsRef.current = new Map();
    forceRerender((n) => n + 1);
  }

  function handleSort(col) {
    // Clear highlights on sorting
    editsRef.current = new Map();
    setSortConfig((prev) => {
      if (prev?.key === col) return { key: col, direction: prev.direction === "asc" ? "desc" : "asc" };
      return { key: col, direction: "asc" };
    });
    forceRerender((n) => n + 1);
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Header />

      <Controls
        handleUpload={handleUpload}
        handleDownload={handleDownload}
        handleReset={handleReset}
        filterText={filterText}
        setFilterText={setFilterText}
        setPage={setPage}
        rows={rows}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />

      <Status
        rows={rows}
        page={page}
        totalPages={totalPages}
        loading={loading}
        progress={progress}
      />

      <main className="flex-1 overflow-auto p-4">
        <Table
          rows={displayed}
          onCellChange={handleCellChange}
          editedMap={editsRef.current}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      </main>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}

export default App;
