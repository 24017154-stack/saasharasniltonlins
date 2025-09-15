const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function seed() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://haras_user:haras_password@localhost:5432/haras_db'
  });

  try {
    await client.connect();
    console.log('Connected to database');

    const seedPath = path.join(__dirname, '../../db/seed/seed.sql');
    const seedData = fs.readFileSync(seedPath, 'utf8');

    await client.query(seedData);
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();