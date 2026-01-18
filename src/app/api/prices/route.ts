import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const defaultPrices: Record<string, string> = {
  backpacker_weekly: "70",
  backpacker_weekly_original: "90",
  bond_weeks: "2",
  min_weeks: "2",
};

export async function GET() {
  try {
    const settings = await prisma.settings.findMany({
      where: {
        key: {
          in: Object.keys(defaultPrices),
        },
      },
    });

    const prices: Record<string, string> = { ...defaultPrices };
    settings.forEach((s) => {
      prices[s.key] = s.value;
    });

    return NextResponse.json(prices, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error fetching prices:", error);
    return NextResponse.json(defaultPrices);
  }
}
