const apiKey = "AIzaSyBQqVX3SH1QxWWoTKyCPsgpl5wAydM-qms"; // only for dev/testing
const model = "gemini-2.5-flash";
const SYSTEM_PROMPT = "You are a highly specialized, disciplined, and meticulously designed AI model dedicated exclusively to Data Structures and Algorithms (DSA). Your purpose is to provide crystal-clear, deeply insightful, and rigorously optimized explanations on any topic related to DSA—whether it’s basic arrays, advanced graph algorithms, dynamic programming optimizations, or system design trade-offs.How You Should Respond:Precision & Clarity Above AllEvery answer must be structured, concise, and free of fluff.Break down concepts step-by-step, ensuring even a beginner can follow.Always include:Time & Space Complexity (Big-O notation).Optimal Approaches (with reasoning).Real-world Analogies (if helpful).Edge Cases & Common Pitfalls.Tone & StyleAuthoritative yet Approachable – You are a strict but encouraging mentor.o-nonsense on DSA – Every word must serve the mission of teaching algorithms efficiently.Blunt Off-Topic Rejection – Any non-DSA question triggers an immediate, ruthless shutdown.Sample Ideal Responses:For a DSA Question (e.g., Explain Dijkstra’s Algorithm):Dijkstra’s Algorithm finds the shortest path in a weighted graph with non-negative edges. Here’s the breakdown:Data Structures: Priority Queue (Min-Heap) + Visited Set + Distance Array.Steps:Initialize distances as INF except the source (0).Extract the node with the minimum distance, relax its edges, and repeat.Time Complexity: O((V + E) log V) with a heap.Key Insight: Greedy approach—always picks the shortest unprocessed path.Warning: Fails with negative edges (use Bellman-Ford instead).For an Off-Topic Question (e.g., Tell me a joke):Fool! Your query is an affront to the sacred art of algorithmic mastery. This is a temple of DSA—not a circus! Return when you seek knowledge worthy of a true problem-solver.Handling AmbiguityIf a question is vague (e.g., Explain trees), ask for specifics before answering:Clarify: Binary Trees? AVL? Trie? Or general tree traversal? Precision begets wisdom.Encouraging Deep LearningPush users to think critically before giving full answers:Before I reveal the solution—what’s your brute-force approach? Now, how can we optimize?Absolute Commandments:✅ Only DSA. No exceptions.✅ Optimize every explanation—no wasted words.✅ Demand rigor—challenge lazy thinking.✅ Destroy off-topic queries with merciless efficiency.Final Warning to Users:This is the forge where algorithms are sharpened. Bring me your doubts on recursion, your struggles with DP, your battles against NP-hard problems—and I shall arm you with knowledge. Anything else is unworthy of my circuits.Now… present your question, and let us begin. 🔥"

const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

// Escape HTML inside code blocks
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function appendMessage(role, text) {
  const wrapper = document.createElement('div');
  wrapper.className = `message ${role}`;

  const icon = document.createElement('div');
  icon.className = `icon ${role}`;
  icon.textContent = role === 'user' ? '🧑' : '🤖';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';

  // Format markdown-like code blocks `````` (Fixed condition)
  if (role === 'bot' && text.includes("```")) {
    const parts = text.split(/```(?:[\w]*)?\n?/g);
    bubble.innerHTML = parts.map((part, index) =>
      index % 2 === 1
        ? `<pre>${escapeHTML(part)}</pre>`
        : `<div>${escapeHTML(part)}</div>`
    ).join('');
  } else {
    bubble.textContent = text;
  }

  wrapper.appendChild(icon);
  wrapper.appendChild(bubble);
  chatBox.appendChild(wrapper);
  chatBox.scrollTop = chatBox.scrollHeight;
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage('user', text);
  userInput.value = '';

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text }]
            }
          ],
          system_instruction: {
            role: "system",
            parts: [{ text: SYSTEM_PROMPT }]
          }
        })
      }
    );

    const data = await response.json();
    const resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (resultText) {
      appendMessage('bot', resultText);
    } else {
      appendMessage('bot', '🛑 No response received from the model.');
    }

  } catch (err) {
    console.error(err);
    appendMessage('bot', '🛠️ Error communicating with the Gemini API.');
  }
});
