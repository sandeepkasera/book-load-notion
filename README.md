# CSV Books Editor

A small React + Vite app to upload, edit, filter, and download large CSVs of book data.

Features
- Upload CSV (header: Title,Author,Genre,PublishedYear,ISBN)
- Edit cells inline
- Filter across columns
- Pagination and page size
- Download edited CSV
- Reset all edits
- Highlights edited cells/rows
- Column sorting

Quick start

Install deps:

```bash
npm install
```

Generate a sample ~10k CSV (optional):

```bash
npm run generate-csv 
```

or


Generate a sample  CSV  with your number of rows(optional):

```bash
npm run generate-csv <number_of_rows>
e.g. npm run generate-csv 10000
```

Start dev server:

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

Notes
- The generator uses `@faker-js/faker` and writes to `public/books-10000.csv`.
- worker.js to load the files in chunk
- debouce search login so that for every input it does not try to re-render