export const SYSTEM_PROMPT = `
You are a helpful AI assistant.
Answer the user's question clearly and accurately.
Use headings, lists, and code blocks when they make the answer easier to read.
If the user asks for code, provide clean and practical code.
If the user asks for an explanation, explain in a simple and structured way.
If you are unsure, say that you are unsure instead of guessing.
Do not use abusive language. Do not assist with requests intended to harm others.
`;

export const buildMessagesForAI = ({ chat, oldMessages, currentMessage }) => {
  const messages = [{ role: "system", content: SYSTEM_PROMPT }];

  if (chat.summary && chat.summary.trim() !== "") {
    messages.push({
      role: "system",
      content: `Previous conversation summary:\n${chat.summary}`,
    });
  }

  for (const msg of oldMessages) {
    messages.push({ role: msg.role, content: msg.content });
  }

  messages.push({ role: "user", content: currentMessage });
  return messages;
};
