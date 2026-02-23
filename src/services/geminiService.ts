import { GoogleGenAI, Type } from '@google/genai';

export const getAIClient = () => {
  const customKey = localStorage.getItem('nekonihongo_api_key');
  const apiKey = customKey || process.env.GEMINI_API_KEY;
  return new GoogleGenAI({ apiKey: apiKey as string });
};

export async function analyzeSentence(sentence: string) {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Analyze the following Japanese sentence for an intermediate learner.
    Skip very basic grammar (like は, です, ます) and basic vocabulary.
    Provide the translation, the words, and the grammar points included.
    For words, provide the reading (kana), meaning, and a detailed part of speech (e.g., Transitive Ichidan verb, NA-adj., Godan verb).
    Also, provide one example sentence for each vocabulary word.
    For grammar, provide the pattern, meaning, a brief explanation, and 2 example sentences.
    
    Sentence: ${sentence}`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          translation: { type: Type.STRING },
          words: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                reading: { type: Type.STRING },
                meaning: { type: Type.STRING },
                pos: { type: Type.STRING },
                example: {
                  type: Type.OBJECT,
                  properties: {
                    jp: { type: Type.STRING },
                    en: { type: Type.STRING },
                  },
                  required: ['jp', 'en'],
                },
              },
              required: ['word', 'reading', 'meaning', 'pos', 'example'],
            },
          },
          grammar: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                pattern: { type: Type.STRING },
                meaning: { type: Type.STRING },
                explanation: { type: Type.STRING },
                examples: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      jp: { type: Type.STRING },
                      en: { type: Type.STRING },
                    },
                    required: ['jp', 'en'],
                  },
                },
              },
              required: ['pattern', 'meaning', 'explanation', 'examples'],
            },
          },
        },
        required: ['original', 'translation', 'words', 'grammar'],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error('Failed to generate analysis');
  return JSON.parse(text);
}

export async function getMoreDetails(item: string, type: 'word' | 'grammar') {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Provide more detailed explanation and 3 more example sentences for the following Japanese ${type}: ${item}.
    Assume the user is an intermediate learner.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          explanation: { type: Type.STRING },
          examples: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                jp: { type: Type.STRING },
                en: { type: Type.STRING },
              },
              required: ['jp', 'en'],
            },
          },
        },
        required: ['explanation', 'examples'],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error('Failed to generate details');
  return JSON.parse(text);
}
