import { generateResponse } from '../logics/geminiAPI.js';

const getAiResponse = async (req, res) => {
  const { prompt } = req.body;

  let message;

  try {
    message = await Promise.race([
      generateResponse(prompt),
      new Promise((resolve, reject) => {
        setTimeout(
          () =>
            resolve(
              'The user is unavailable, please try again later. (LLM took too long to respond)'
            ),
          10000
        ); // 10 seconds timeout
      }),
    ]);
  } catch (error) {
    console.error('Error generating response:', error);
    message =
      'The user is unavailable, please try again later. (LLM took too long to respond)';
  }

  console.log(message);
  res.json({ message });
};

export default getAiResponse;
