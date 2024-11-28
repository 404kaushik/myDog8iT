// pages/api/generate-excuse.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { GroqProvider, useGroq } from '@/context/GroqContext';
import { ExcuseTone } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { context, tone }: { context: string; tone: ExcuseTone } = req.body;

  try {
    // Use the GroqProvider to access the `generateExcuse` function
    const { generateExcuse } = useGroq();
    const excuse = await generateExcuse(context, tone);

    if (excuse) {
      res.status(200).json({ excuse });
    } else {
      res.status(500).json({ message: 'Failed to generate excuse' });
    }
  } catch (error) {
    console.error('Error generating excuse:', error);
    res.status(500).json({
      message: 'Failed to generate excuse',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}