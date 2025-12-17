import 'dotenv/config';

import { db } from './db';

import { productsTable, salesTable } from './schema';

export async function seed() {
  console.log('🌱 Seeding database...');

  const today = new Date().toISOString();

  // Insert products
  await db.insert(productsTable).values([
    { name: 'Laptop', category: 'Electronics', price: 999.99, stock: 50 },
    { name: 'Mouse', category: 'Electronics', price: 25.99, stock: 200 },
    { name: 'Keyboard', category: 'Electronics', price: 75.0, stock: 150 },
    { name: 'Monitor', category: 'Electronics', price: 299.99, stock: 75 },
    { name: 'Desk Chair', category: 'Furniture', price: 199.99, stock: 40 },
    { name: 'Desk', category: 'Furniture', price: 399.99, stock: 30 },
    { name: 'Notebook', category: 'Stationery', price: 5.99, stock: 500 },
    { name: 'Pen Set', category: 'Stationery', price: 12.99, stock: 300 },
    { name: 'USB Hub', category: 'Electronics', price: 49.99, stock: 120 },
    { name: 'Webcam', category: 'Electronics', price: 89.99, stock: 60 },
    { name: 'Headphones', category: 'Electronics', price: 149.99, stock: 80 },
    { name: 'Whiteboard', category: 'Office Supplies', price: 129.99, stock: 25 },
  ]);

  // Insert sales (some with today's date)
  await db.insert(salesTable).values([
    { product_id: 1, quantity: 2, total_amount: 1999.98, customer_name: 'Grace Kim', region: 'North', sale_date: today },
    { product_id: 2, quantity: 3, total_amount: 77.97, customer_name: 'Henry Chen', region: 'South', sale_date: today },
    { product_id: 3, quantity: 2, total_amount: 150.0, customer_name: 'Ivy Wang', region: 'East' },

    { product_id: 4, quantity: 2, total_amount: 599.98, customer_name: 'Aarav Mehta', region: 'North', sale_date: today },
    { product_id: 5, quantity: 1, total_amount: 199.99, customer_name: 'Riya Sharma', region: 'East' },

    { product_id: 6, quantity: 1, total_amount: 399.99, customer_name: 'Kabir Singh', region: 'West' },
    { product_id: 7, quantity: 10, total_amount: 59.9, customer_name: 'Neha Gupta', region: 'South' },

    { product_id: 8, quantity: 4, total_amount: 51.96, customer_name: 'Vikram Rao', region: 'North', sale_date: today },
    { product_id: 9, quantity: 2, total_amount: 99.98, customer_name: 'Sofia Martinez', region: 'East' },

    { product_id: 1, quantity: 3, total_amount: 2999.97, customer_name: 'Arjun Patel', region: 'West', sale_date: today },
    { product_id: 11, quantity: 1, total_amount: 149.99, customer_name: 'Sara Ahmed', region: 'North' },
  ]);

  console.log('✅ Database seeded successfully!');
}

seed();
