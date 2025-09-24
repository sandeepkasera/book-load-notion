// Convert JSON -> CSV
export default function jsonToCSV(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = rows.map((r) =>
    headers.map((h) => `"${(r[h] || "").toString().replace(/"/g, '""')}"`).join(",")
  );
  return [headers.join(","), ...lines].join("\n");
}