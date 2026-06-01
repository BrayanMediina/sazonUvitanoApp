import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Ejecutando seed...')

  // Admin por defecto
  const adminExists = await prisma.user.findUnique({ where: { document: '123456789' } })
  if (!adminExists) {
    await prisma.user.create({
      data: {
        name:     'Administrador Sazón',
        document: '123456789',
        email:    'admin@sazonuvitano.com',
        password: await bcrypt.hash('admin123', 12),
        role:     'administrador',
        isActive: true,
      },
    })
    console.log('Admin creado: doc=123456789 pass=admin123')
  }

  // Mesero demo
  const meseroExists = await prisma.user.findUnique({ where: { document: '987654321' } })
  if (!meseroExists) {
    await prisma.user.create({
      data: { name: 'Mesero Demo', document: '987654321', password: await bcrypt.hash('mesero123', 12), role: 'mesero' },
    })
    console.log('Mesero creado: doc=987654321 pass=mesero123')
  }

  // Cajero demo
  const cajeroExists = await prisma.user.findUnique({ where: { document: '111222333' } })
  if (!cajeroExists) {
    await prisma.user.create({
      data: { name: 'Cajero Demo', document: '111222333', password: await bcrypt.hash('cajero123', 12), role: 'cajero' },
    })
    console.log('Cajero creado: doc=111222333 pass=cajero123')
  }

  // Domiciliario demo
  const domiciExists = await prisma.user.findUnique({ where: { document: '444555666' } })
  if (!domiciExists) {
    await prisma.user.create({
      data: { name: 'Repartidor Demo', document: '444555666', password: await bcrypt.hash('domicilio123', 12), role: 'domiciliario' },
    })
    console.log('Domiciliario creado: doc=444555666 pass=domicilio123')
  }

  // Mesas
  const MESAS = [
    { number: 1, capacity: 4, zone: 'Salón principal' },
    { number: 2, capacity: 2, zone: 'Salón principal' },
    { number: 3, capacity: 6, zone: 'Terraza' },
    { number: 4, capacity: 4, zone: 'Terraza' },
    { number: 5, capacity: 8, zone: 'Privado' },
    { number: 6, capacity: 2, zone: 'Barra' },
  ]
  for (const mesa of MESAS) {
    const exists = await prisma.table.findUnique({ where: { number: mesa.number } })
    if (!exists) await prisma.table.create({ data: mesa })
  }
  console.log('Mesas creadas')

  // Productos
  const PRODUCTS = [
    // Entradas
    { name: 'Patacones con hogao',   category: 'entrada',        price: 12000, description: 'Patacones fritos con hogao casero', isAvailable: true },
    { name: 'Yuca frita',            category: 'entrada',        price: 10000, description: 'Yuca frita crujiente con ají', isAvailable: true },
    { name: 'Ceviche de camarón',    category: 'entrada',        price: 22000, description: 'Camarón fresco marinado en limón', isAvailable: true },
    // Platos principales
    { name: 'Bandeja paisa',         category: 'plato_principal', price: 35000, description: 'Frijoles, arroz, chicharrón, carne, chorizo, arepa y huevo', isAvailable: true },
    { name: 'Sancocho de gallina',   category: 'plato_principal', price: 28000, description: 'Sancocho tradicional con papa, yuca y mazorca', isAvailable: true },
    { name: 'Ajiaco bogotano',       category: 'plato_principal', price: 26000, description: 'Ajiaco con pollo, tres tipos de papa y guascas', isAvailable: true },
    { name: 'Pollo asado',           category: 'plato_principal', price: 24000, description: 'Pollo asado al carbón con ensalada', isAvailable: true },
    { name: 'Trucha a la plancha',   category: 'plato_principal', price: 32000, description: 'Trucha fresca a la plancha con papas', isAvailable: true },
    // Bebidas
    { name: 'Limonada de coco',      category: 'bebida',         price: 9000,  description: 'Limonada natural con coco rallado', isAvailable: true },
    { name: 'Jugo natural',          category: 'bebida',         price: 7000,  description: 'Jugo de fruta de temporada', isAvailable: true },
    { name: 'Gaseosa',               category: 'bebida',         price: 5000,  description: 'Bebida gaseosa 350ml', isAvailable: true },
    { name: 'Agua mineral',          category: 'bebida',         price: 4000,  description: 'Agua mineral 500ml', isAvailable: true },
    // Postres
    { name: 'Tres leches',           category: 'postre',         price: 12000, description: 'Torta tres leches con crema chantilly', isAvailable: true },
    { name: 'Arroz con leche',       category: 'postre',         price: 8000,  description: 'Arroz con leche canela y uvas pasas', isAvailable: true },
    // Especiales
    { name: 'Plato del día',         category: 'especial',       price: 18000, description: 'Sopa + seco + bebida', isAvailable: true },
    // Solo domicilio
    { name: 'Combo familiar',        category: 'domicilio',      price: 65000, description: 'Para 4 personas: 4 platos + 4 bebidas', isAvailable: true },
  ]

  for (const prod of PRODUCTS) {
    const exists = await prisma.product.findFirst({ where: { name: prod.name } })
    if (!exists) await prisma.product.create({ data: { ...prod, isActive: true, category: prod.category as any } })
  }
  console.log('Productos creados')

  console.log('Seed completado exitosamente')
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
