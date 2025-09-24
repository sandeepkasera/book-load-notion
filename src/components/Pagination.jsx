import React from 'react'

export default function Pagination({ page, totalPages, setPage }) {
  return (
    <div className="flex justify-center gap-2 p-3">
      <button
        onClick={() => setPage(0)}
        disabled={page === 0}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        First
      </button>
      <button
        onClick={() => setPage((p) => Math.max(0, p - 1))}
        disabled={page === 0}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>
      <button
        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
        disabled={page >= totalPages - 1}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
      <button
        onClick={() => setPage(totalPages - 1)}
        disabled={page >= totalPages - 1}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Last
      </button>
    </div>
  )
}
