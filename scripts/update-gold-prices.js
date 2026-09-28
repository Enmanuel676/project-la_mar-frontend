#!/usr/bin / env node
// Corre en paralelo a `npm run dev` (en otra terminal: `npm run gold:update`) y escribe

// (mismo origen que el frontend, sin problema de CORS con Alpha Vantage).
// Cuando el proyecto se aloje en el servidor permanente con Nginx, este mismo cálculo
// se moverá a un cron del sistema allá; por ahora hace una sola petición diaria a las 9:00 a.m.
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'gold-prices.json')
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'DA3MM4ZAJDRESJYI'

const GRAMS_PER_TROY_OUNCE = 31.1034768
const BUY_DISCOUNT_USD = 5

const GOLD_PRICES = [
  { karat: '10k', purity: '417‰' },
  { karat: '14k', purity: '585‰' },
  { karat: '18k', purity: '750‰' },
  { karat: '22k', purity: '916‰' },
  { karat: '24k', purity: '999‰' },
]

const SCRAP_PRICES = [
  { karat: '10k', purity: '417‰' },
  { karat: '12k', purity: '500‰' },
  { karat: '14k', purity: '585‰' },
  { karat: '18k', purity: '750‰' },
  { karat: '22k', purity: '916‰' },
  { karat: '24k', purity: '999‰' },
]

function purityToFraction(purity) {
  return parseInt(purity, 10) / 1000
}

function round2(value) {
  return Math.round(value * 100) / 100
}

async function fetchGoldSpotPriceUSD() {
  const url = `https://www.alphavantage.co/query?function=GOLD_SILVER_SPOT&symbol=GOLD&apikey=${ALPHA_VANTAGE_API_KEY}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Alpha Vantage respondió ${response.status}`)
  }

  const data = await response.json()
  const spotPriceUSD = Number(data?.price)
  if (!data?.price || Number.isNaN(spotPriceUSD)) {
    throw new Error(`Respuesta inesperada de Alpha Vantage: ${JSON.stringify(data)}`)
  }

  return spotPriceUSD
}

function buildGoldRows(rows, pricePerGramPure) {
  return rows.map((row) => {
    const sellUSD = round2(pricePerGramPure * purityToFraction(row.purity))
    const buyUSD = Math.max(round2(sellUSD - BUY_DISCOUNT_USD), 0)
    return { ...row, buyUSD, sellUSD }
  })
}

function buildScrapRows(rows, pricePerGramPure) {
  return rows.map((row) => {
    const sellUSD = pricePerGramPure * purityToFraction(row.purity)
    const buyUSD = Math.max(round2(sellUSD - BUY_DISCOUNT_USD), 0)
    return { ...row, buyUSD }
  })
}

async function updateGoldPrices() {
  try {
    const spotPriceUSD = await fetchGoldSpotPriceUSD()
    const pricePerGramPure = spotPriceUSD / GRAMS_PER_TROY_OUNCE

    const payload = {
      updatedAt: new Date().toISOString(),
      spotPriceUSD,
      rows: buildGoldRows(GOLD_PRICES, pricePerGramPure),
      scrapRows: buildScrapRows(SCRAP_PRICES, pricePerGramPure),
    }

    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(payload, null, 2))
    console.log(`[${payload.updatedAt}] Precio del oro actualizado: $${spotPriceUSD}/oz`)
  } catch (error) {
    console.error('No se pudo actualizar el precio del oro:', error.message)
  }
}

function msUntilNext9AM() {
  const now = new Date()
  const next = new Date(now)
  next.setHours(9, 0, 0, 0)
  if (next <= now) next.setDate(next.getDate() + 1)
  return next - now
}

function scheduleDaily() {
  const delay = msUntilNext9AM()
  console.log(`Próxima actualización programada: ${new Date(Date.now() + delay).toLocaleString('es-ES')}`)
  setTimeout(() => {
    updateGoldPrices()
    setInterval(updateGoldPrices, 24 * 60 * 60 * 1000)
  }, delay)
}

// Petición inicial para tener datos de inmediato durante el desarrollo local,
// y luego una sola petición diaria a las 9:00 a.m.
updateGoldPrices()
scheduleDaily()
