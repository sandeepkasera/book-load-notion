import React from 'react'

export default function Status({ rows, page, totalPages, loading, progress }) {
  return (
    <div className="flex flex-wrap justify-between p-3 text-sm border-b border-gray-300">
      <div>Rows: {rows.length}</div>
      <div>Page: {page + 1} / {totalPages}</div>
      {loading && <div>Loading... ({progress} bytes)</div>}
    </div>
  )
}
