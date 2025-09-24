#!/usr/bin/env node
/*
Generates a CSV with fake book data (default 10000 rows).
Usage: node scripts/generate-books.js [count]
*/
import fs from 'fs'
import { faker } from '@faker-js/faker'

const count = Number(process.argv[2]) || 10000
const out = []
out.push('Title,Author,Genre,PublishedYear,ISBN')
const genres = ['Fiction','Nonfiction','Sci-Fi','Fantasy','Romance','Mystery','Biography','History','Children']
for (let i = 0; i < count; i++) {
  const title = faker.lorem.words({ min: 2, max: 6 }).replace(/,/g, '')
  const author = `${faker.name.firstName()} ${faker.name.lastName()}`.replace(/,/g, '')
  const genre = genres[Math.floor(Math.random() * genres.length)]
  const year = faker.datatype.number({ min: 1900, max: 2025 })
  const isbn = faker.datatype.number({ min: 1e12, max: 9e12 }).toString()
  out.push(`${title},${author},${genre},${year},${isbn}`)
}

const dest = './public/books-10000.csv'
fs.writeFileSync(dest, out.join('\n'))
console.log(`Wrote ${count} rows to ${dest}`)
