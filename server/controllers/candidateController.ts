import { Request, Response } from 'express';
import { read } from 'xlsx';
import async from 'async';
import { Candidate } from '../models/Candidate';
import { processExcelSheet } from '../utils/excelMapper';
import { validateCandidate } from '../utils/validation';

export const uploadCandidates = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const workbook = read(req.file.buffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const candidates = processExcelSheet(worksheet);

    const results = {
      success: 0,
      skipped: 0,
      errors: [] as string[],
    };

    await async.eachSeries(candidates, async (candidate) => {
      try {
        // Validate candidate data
        const validationError = validateCandidate(candidate);
        if (validationError) {
          results.errors.push(`Validation error for ${candidate.email}: ${validationError}`);
          return;
        }

        // Check for duplicates
        const existingCandidate = await Candidate.findOne({ email: candidate.email });
        if (existingCandidate) {
          results.skipped++;
          return;
        }

        // Create new candidate
        await Candidate.create(candidate);
        results.success++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.errors.push(`Error processing candidate ${candidate.email}: ${errorMessage}`);
      }
    });

    res.json({
      message: 'File processed successfully',
      results,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: `Error processing file: ${errorMessage}` });
  }
};

export const getCandidates = async (_req: Request, res: Response) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: `Error fetching candidates: ${errorMessage}` });
  }
};