import React from 'react'

export default function Controls({
  handleUpload,
  handleDownload,
  handleReset,
  filterText,
  setFilterText,
  setPage,
  rows,
  pageSize,
  setPageSize,
}) {
  return (
    <div className="flex flex-wrap gap-3 justify-center items-center p-3 border-b border-gray-300 bg-white">
      <input
        type="file"
        accept="text/csv"
        onChange={handleUpload}
        className="border p-2 rounded cursor-pointer"
      />

      <button
        onClick={handleDownload}
        disabled={rows.length === 0}
        className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
      >
        Download CSV
      </button>

      <button
        onClick={handleReset}
        disabled={rows.length === 0}
        className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
      >
        Reset All Edits
      </button>

      <input
        placeholder="Filter (any column)"
        value={filterText}
        onChange={(e) => {
          setFilterText(e.target.value)
          setPage(0)
        }}
        className="border p-2 rounded w-48"
      />

      <label className="flex items-center gap-2">
        Page size:
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
            setPage(0)
          }}
          className="border p-2 rounded"
        >
          {[25, 50, 100, 200].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
