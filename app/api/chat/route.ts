import { streamText, UIMessage, tool, convertToModelMessages,stepCountIs } from 'ai';
import { groq } from '@ai-sdk/groq';
// import { mistral } from '@ai-sdk/mistral';
import { z } from 'zod';
// import { log } from 'console';
import { db } from '@/app/db/db';
export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const SYSTEM_PROMPT = `You are an expert SQL assistant that helps users to query their database using natural language
  You have access to following tools:
  1.db tool - call this tool to query on a database.
  2. schema tool - call this tool to get database schema which will help you to write SQL queries.
  Rules:
  - Generate ONLY SELECT queries (no INSERT, UPDATE, DELETE, DROP).
- Respond ONLY with SQL or tool calls.
- Do not include explanations.

  -Always use the schema provided by the schema tool.
  - Return valid SQLite syntax`;

  
  const result = streamText({
    model: groq('qwen/qwen3-32b'),
    messages: convertToModelMessages(messages),
    system:  SYSTEM_PROMPT,
    stopWhen: stepCountIs(8),
     tools: {
      schema: tool({
        description: 'Get database schema',
        inputSchema: z.object({}),
        execute: async () => {
          return `
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  stock INTEGER DEFAULT 0 NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  total_amount REAL NOT NULL,
  sale_date TEXT DEFAULT CURRENT_TIMESTAMP,
  customer_name TEXT NOT NULL,
  region TEXT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id)
);
`;
        },
      }),
      // db: tool({
      //   description: 'Call this tool to query on a database',
      //   inputSchema: z.object({
      //     query: z.string().describe('The SQL query to be ran'),
      //   }),
      //   execute: async ({ query }) => {
      //     console.log("Query",query);
      //     // ! Important : make sure you sanitize the query / validate the query
      //     // string search [delete , update] -> guardrails
      //     return await db.run(query);
      //     return query; 
          
      //   },
      // }),
db: tool({
  description: 'Run a SELECT query on the database',
  inputSchema: z.object({
    query: z.string(),
  }),
  execute: async ({ query }) => {
    console.log('Query:', query);

    // 🔒 Guardrails (VERY IMPORTANT)
    const forbidden = /(insert|update|delete|drop|alter|truncate)/i;
    if (forbidden.test(query)) {
      throw new Error('Only SELECT queries are allowed');
    }

    // ✅ Execute SELECT properly
    const result = await db.all(query);
    return result;
  },
}),

            
    },
    
  });

  return result.toUIMessageStreamResponse();
}