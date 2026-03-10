# BALIK System: Capstone Defense Q&A Preparation

## 🧠 Technical & Architecture Questions

**Q1: Why did you choose a "Serverless" architecture with Supabase instead of a traditional backend like Node.js or PHP?**
> **Answer:** We chose a serverless architecture for three main reasons:
> 1.  **scalability**: Supabase handles database scaling automatically, so we don't have to manage server infrastructure.
> 2.  **Real-time Capabilities**: It provides built-in real-time subscriptions, which are essential for immediate notifications when an item is matched.
> 3.  **Security**: We leverage **Row-Level Security (RLS)** within the PostgreSQL database itself, which is more secure than writing custom API middleware security layers.

**Q2: How does your specific "Smart Matching" algorithm work? Is it just comparing text?**
> **Answer:** No, it’s not just simple text comparison. We implemented a **Multi-Factor Weighted Scoring System**. It calculates a match score (0-100%) based on four factors:
> 1.  **Semantic NLP Similarity (50% weight)**: Uses vector embeddings to understand context (e.g., "Phone" ≈ "Mobile").
> 2.  **Color Match (20% weight)**: Checks for exact or partial color matches.
> 3.  **Location Proximity (15% weight)**: Matches the reported location.
> 4.  **Time Proximity (15% weight)**: Gives higher scores to items reported within 24-72 hours.
> A match is only flagged if the total weighted score exceeds our threshold of 50%.

**Q3: You mentioned "Client-Side AI". Doesn't that make the app slow?**
> **Answer:** Actually, it makes the app more efficient after the initial load. We use **Transformers.js** to run the NLP model directly in the user's browser via WebAssembly.
> *   **Advantage 1**: Privacy. The raw text description is processed on the user's device; only the mathematical vector is sent to the database.
> *   **Advantage 2**: Cost. We don't need expensive GPU servers to run the AI model.
> *   **Performance**: The model is cached, so subsequent matches take only milliseconds.

**Q4: How do you handle "fuzzy" searches? If I search for "wallet", will it find "purse"?**
> **Answer:** Yes. This is handled by our **Vector Embeddings**. We use the `all-MiniLM-L6-v2` model which converts text into 384-dimensional vectors. "Wallet" and "Purse" have very similar vector definitions in this mathematical space, so the Close Vector Similarity search (using Cosine Similarity) will detect them as a match even if the words are different.

---

## 🔐 Security & Privacy Questions

**Q5: How do you prevent users from viewing or deleting other people's reports?**
> **Answer:** We use **Row-Level Security (RLS)** policies in PostgreSQL.
> *   For **viewing**: Public items are viewable by everyone, but sensitive contact info is restricted.
> *   For **modifying**: The database enforces a rule: `auth.uid() = user_id`. This means a DELETE or UPDATE operation is physically impossible unless the requester's JWT (JSON Web Token) matches the owner ID of the record.

**Q6: You allow anonymous reporting. How do you prevent spam or fake reports?**
> **Answer:** While we allow anonymous reporting to encourage Good Samaritans, we have safeguards:
> 1.  **Admin Verification**: Anonymous items are flagged as "Pending" and must be verified by an admin before appearing in the public feed.
> 2.  **Recaptcha**: (If applicable) We can use rate limiting.
> 3.  **No Claims**: Anonymous users contribute data but cannot *claim* items; claiming requires a verified account.

**Q7: Is user data safe during the AI processing?**
> **Answer:** Yes. Since we use **Client-Side AI**, the text processing happens in the user V8 JavaScript engine (their browser). We do not send their raw text to third-party AI APIs like OpenAI or Google Gemini. Only the vector numbers (embeddings) are stored in our database.

---

## 📱 Functionality & User Experience

**Q8: What happens if the AI suggests a match, but it's wrong?**
> **Answer:** The AI provides *suggestions*, not decisions. The user sees a "Potential Match" card with a percentage score (e.g., "85% Match"). The final verification is manual: the user must click "View Details" and then "Claim" or "Reject". If rejected, the system hides that specific match for that user.

**Q9: How accurate is the matching?**
> **Answer:** Our testing shows a high accuracy rate because we don't rely on just one factor. If the NLP is unsure (e.g., vague description), the **Time** and **Location** factors help boost the score of relevant items. The 50% threshold was tuned to balance "Recall" (finding all possibilities) vs. "Precision" (avoiding bad matches).

**Q10: Can the system handle local languages or Tagalog descriptions?**
> **Answer:** Yes! The model we use (`multilingual-MiniLM`) is pre-trained on over 50 languages, including Tagalog. So a description like *"Nawala ang aking pitaka"* will statistically match with *"Lost my wallet"*.

---

## 💼 Feasibility & Future

**Q11: Is this system expensive to host?**
> **Answer:** It is extremely cost-effective.
> *   **Hosting**: Vercel (Frontend) is free for reasonable usage.
> *   **Database**: Supabase provides a generous free tier (500MB).
> *   **AI Processing**: Free, because it utilizes the user's hardware (client-side).
> *   **Maintenance**: Minimal, as there are no backend servers to patch or maintain.

**Q12: What is the most challenging part of developing this system?**
> **Answer:** Integrating the **pgvector** extension with the real-time React frontend was the most complex part. Ensuring that the vector embeddings generated in the browser matched the format required by the PostgreSQL database, and tuning the weights (50/20/15/15) to get accurate results, required significant testing and iteration.

---

## ⚡ Quick-Fire Technical Stats (Memorize These!)

*   **Tech Stack**: React, Vite, Tailwind CSS, Supabase.
*   **Database**: PostgreSQL 15 with `pgvector` extension.
*   **AI Model**: `Xenova/paraphrase-multilingual-MiniLM-L12-v2`.
*   **Vector Dimensions**: 384 dimensions.
*   **Similarity Metric**: Cosine Similarity (1 - Cosine Distance).
*   **Matching Threshold**: 0.5 (or 50%).
