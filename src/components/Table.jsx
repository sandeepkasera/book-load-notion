import React from "react";

const COLUMNS = ["Title", "Author", "Genre", "PublishedYear", "ISBN"];

export default function Table({
  rows,
  onCellChange,
  editedMap,
  sortConfig,
  onSort,
}) {
  return (
    <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
      <table className="w-full text-sm text-left border-collapse">
        {/* Header */}
        <thead className="bg-gray-400 text-white uppercase text-xs font-semibold tracking-wide">
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col}
                className="px-5 py-3 border-b border-gray-300 cursor-pointer hover:bg-gray-600 transition-colors"
                onClick={() => onSort(col)}
              >
                <div className="flex items-center justify-between">
                  <span>{col}</span>
                  {sortConfig?.key === col && (
                    <span className="ml-2 text-xs">
                      {sortConfig.direction === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {rows.map((row, rIdx) => (
            <tr
              key={rIdx}
              className={`${
                editedMap.has(rIdx)
                  ? "bg-yellow-50"
                  : rIdx % 2 === 0
                  ? "bg-white"
                  : "bg-gray-50"
              } hover:bg-blue-50 transition-colors`}
            >
              {COLUMNS.map((col) => {
                const val = row[col] ?? "";
                const isEdited = editedMap.get(rIdx)?.has(col);
                return (
                  <td
                    key={col}
                    className={`px-5 py-3 border-b border-gray-200 align-middle ${
                      isEdited ? "bg-yellow-100" : ""
                    }`}
                  >
                    <input
                      className="w-full bg-transparent px-2 py-1 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none border rounded"
                      value={val}
                      onChange={(e) => onCellChange(rIdx, col, e.target.value)}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
