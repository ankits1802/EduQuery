// This file is machine-generated - do not edit!

'use server';

/**
 * @fileOverview Generates textbook-quality answers about database theory.
 *
 * - generateTextbookAnswer - A function that generates textbook-quality answers.
 * - GenerateTextbookAnswerInput - The input type for the generateTextbookAnswer function.
 * - GenerateTextbookAnswerOutput - The return type for the generateTextbookAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTextbookAnswerInputSchema = z.object({
  question: z.string().describe('The question about database theory.'),
});
export type GenerateTextbookAnswerInput = z.infer<
  typeof GenerateTextbookAnswerInputSchema
>;

const CitationSchema = z.object({
  source: z.string().describe('The source of the citation (e.g., textbook title).'),
  page: z.string().describe('The page number(s) where the information is found.'),
});

const GenerateTextbookAnswerOutputSchema = z.object({
  answer: z.string().describe('The textbook-quality answer to the question.'),
  citations: z.array(CitationSchema).describe('The citations for the answer.'),
});
export type GenerateTextbookAnswerOutput = z.infer<
  typeof GenerateTextbookAnswerOutputSchema
>;

export async function generateTextbookAnswer(
  input: GenerateTextbookAnswerInput
): Promise<GenerateTextbookAnswerOutput> {
  return generateTextbookAnswerFlow(input);
}

const citeTextbook = ai.defineTool(
  { // First argument: configuration object
    name: 'citeTextbook',
    description: 'Finds relevant citations in textbooks to support an answer.',
    inputSchema: z.object({
      question: z.string().describe('The question being answered.'),
      answer: z.string().describe('The answer generated.'),
    }),
    outputSchema: z.array(CitationSchema) // End of configuration object properties
  }, // Comma separating the configuration object from the handler function
  async (input) => { // Second argument: the handler function
    // TODO: Implement the logic to search textbooks and return citations.
    // For now, return a placeholder citation.
    return [
      {
        source: 'Database Systems: The Complete Book',
        page: '42-45',
      },
    ];
  } // End of the handler function
); // End of ai.defineTool call

const generateTextbookAnswerPrompt = ai.definePrompt({
  name: 'generateTextbookAnswerPrompt',
  input: {schema: GenerateTextbookAnswerInputSchema},
  output: {schema: GenerateTextbookAnswerOutputSchema},
  tools: [citeTextbook],
  prompt: `You are an AI assistant designed to provide textbook-quality answers about database theory, SQL, and database management systems.

  Answer the following question:
  {{question}}

  Be sure to use the citeTextbook tool to find relevant citations to support your answer. Return your answer and all citations.
  `,
});

const generateTextbookAnswerFlow = ai.defineFlow(
  {
    name: 'generateTextbookAnswerFlow',
    inputSchema: GenerateTextbookAnswerInputSchema,
    outputSchema: GenerateTextbookAnswerOutputSchema,
  },
  async input => {
    const {output} = await generateTextbookAnswerPrompt(input);
    return output!;
  }
);
