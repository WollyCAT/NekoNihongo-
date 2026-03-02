import { GoogleGenAI, Type } from '@google/genai';

export const getAIClient = () => {
  const customKey = localStorage.getItem('nekonihongo_api_key');
  const apiKey = customKey || process.env.GEMINI_API_KEY;
  return new GoogleGenAI({ apiKey: apiKey as string });
};

const parseJSONResponse = (text: string) => {
  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse JSON:", text);
    throw new Error("Invalid JSON response from API");
  }
};

async function fetchOpenAI(systemPrompt: string, userPrompt: string) {
  const url = localStorage.getItem('nekonihongo_openai_url') || 'https://openrouter.ai/api/v1';
  const key = localStorage.getItem('nekonihongo_openai_key') || '';
  const model = localStorage.getItem('nekonihongo_openai_model') || 'google/gemini-2.5-flash';

  const response = await fetch(`${url.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API Error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  if (!data.choices || data.choices.length === 0) {
    throw new Error("Invalid response format from provider");
  }
  return parseJSONResponse(data.choices[0].message.content);
}

export async function analyzeSentence(sentence: string) {
  const provider = localStorage.getItem('nekonihongo_provider') || 'gemini';

  if (provider === 'openai') {
    const systemPrompt = `You are a Japanese language tutor for an intermediate learner.
You must output ONLY valid JSON matching this exact structure:
{
  "original": "Original Japanese sentence",
  "translation": "English translation",
  "words": [
    {
      "word": "vocabulary word",
      "reading": "kana reading",
      "meaning": "English meaning",
      "pos": "Detailed part of speech (e.g., Transitive Ichidan verb, NA-adj.)",
      "example": { "jp": "Japanese example sentence", "en": "English translation" }
    }
  ],
  "grammar": [
    {
      "pattern": "grammar pattern",
      "meaning": "English meaning",
      "explanation": "Brief explanation",
      "examples": [
        { "jp": "Japanese example sentence", "en": "English translation" }
      ]
    }
  ]
}
Skip very basic grammar (like は, です, ます) and basic vocabulary.`;
    return fetchOpenAI(systemPrompt, `Analyze the following Japanese sentence:\n\n${sentence}`);
  }

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
  const provider = localStorage.getItem('nekonihongo_provider') || 'gemini';

  if (provider === 'openai') {
    const systemPrompt = `You are a Japanese language tutor for an intermediate learner.
You must output ONLY valid JSON matching this exact structure:
{
  "explanation": "Detailed explanation",
  "examples": [
    { "jp": "Japanese example sentence", "en": "English translation" }
  ]
}`;
    return fetchOpenAI(systemPrompt, `Provide more detailed explanation and 3 more example sentences for the following Japanese ${type}: ${item}.`);
  }

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
