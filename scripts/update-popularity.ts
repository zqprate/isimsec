/**
 * İsimSeç — Update name popularity rankings
 *
 * search_count verisine göre popülerlik sıralamasını günceller.
 * Çalıştırma: npx tsx scripts/update-popularity.ts
 */

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Updating popularity rankings...");

  // Fetch all names ordered by search count descending
  const names = await prisma.name.findMany({
    orderBy: { searchCount: "desc" },
    select: { id: true, slug: true, searchCount: true },
  });

  // Update rankings
  let rank = 1;
  for (const name of names) {
    await prisma.name.update({
      where: { id: name.id },
      data: {
        popularityRank: rank,
        isPopular: rank <= 100, // Top 100 = popular
      },
    });
    rank++;
  }

  console.log(`✅ Updated popularity for ${names.length} names.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
