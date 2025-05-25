
'use server';
/**
 * @fileOverview Generates dynamic computer science questions for AI suggestions,
 * including titles, subtitles, and icon keys.
 *
 * - generateCSQuestions - A function that generates a list of CS questions with details.
 * - GenerateCSQuestionsInput - The input type (empty).
 * - GenerateCSQuestionsOutput - The return type, containing an array of question objects.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCSQuestionsInputSchema = z.object({}).describe("No input required for generating CS questions.");
export type GenerateCSQuestionsInput = z.infer<typeof GenerateCSQuestionsInputSchema>;

const QuestionDetailSchema = z.object({
  title: z.string().describe("The computer science question itself."),
  subtitle: z.string().describe("A concise explanation or context for the question, typically 10-15 words."),
  iconKey: z.string().describe("An icon key from the predefined list: 'Code2', 'Lightbulb', 'Zap', 'Database', 'Brain', 'Terminal', 'Network', 'GitMerge', 'FileText', 'Layers'.")
});

const GenerateCSQuestionsOutputSchema = z.object({
  questions: z.array(QuestionDetailSchema).length(6).describe("An array of 6 computer science question objects, each with a title, subtitle, and iconKey."),
});
export type GenerateCSQuestionsOutput = z.infer<typeof GenerateCSQuestionsOutputSchema>;

export async function generateCSQuestions(input: GenerateCSQuestionsInput): Promise<GenerateCSQuestionsOutput> {
  return generateCSQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCSQuestionsPrompt',
  input: {schema: GenerateCSQuestionsInputSchema},
  output: {schema: GenerateCSQuestionsOutputSchema},
  prompt: `Generate a list of 6 diverse and thought-provoking computer science questions.
These questions will be used as suggestions for users.
Ensure the questions are suitable for a broad audience interested in CS, covering topics like algorithms, data structures, software design, AI, database concepts, version control, or cloud computing.

For each question, provide:
1.  A 'title': The question itself, as a concise string.
2.  A 'subtitle': A brief (10-15 words) explanation or context for the question.
3.  An 'iconKey': Choose an icon key from the following list that best represents the question's topic: 'Code2', 'Lightbulb', 'Zap', 'Database', 'Brain', 'Terminal', 'Network', 'GitMerge', 'FileText', 'Layers'. Ensure the 'iconKey' is one of these exact strings.

Provide exactly 6 question objects in the 'questions' array.`,
});

const generateCSQuestionsFlow = ai.defineFlow(
  {
    name: 'generateCSQuestionsFlow',
    inputSchema: GenerateCSQuestionsInputSchema,
    outputSchema: GenerateCSQuestionsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

