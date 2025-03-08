Requirements

1. Business Data and Chatbot Behavior
   - [x] Select a small-to-medium business (real or fictional) and load enough contextual information so the LLM can answer questions about that business.
   - [x] Chatbot must respond accurately to questions about the business using the data provided.
   - [x] Provide fallback answers if certain information is unknown or not in the dataset.
   - [x] If the business is real, please provide the website of the business you chose in the README.md file
2. UI/UX Requirements
   - [x] Use React as the frontend framework with Material UI for components and design.
   - [x] Design a chat interface that has:
         A message input box at the bottom.
         A scrollable conversation history above (messages from user, responses from the chatbot).
         Clear distinctions between user messages and chatbot responses (e.g., different background colors or styling).
         Looks good and is user-friendly following common UI for chatbots/messaging apps
   - [x] (Optional) Provide a basic metrics display somewhere on the UI—for example, to show:
         The number of messages sent in the session.
         Response latency or average response time.
         (If using a cost-based LLM) an estimate of tokens used or cost.
3. LLM Integration
   - [x] Creating a small function or service that sends user input to the LLM with business context.
   - [x] Handling the response and returning it to the frontend for display.
   - [x] Provide some form of context injection for the business details or relevant data so the LLM can accurately respond to user queries.
   - [x] (Optional) Streaming:
         If the chosen LLM provider supports streaming, implement a streaming response to show the chatbot’s reply as it arrives, rather than waiting for the entire response. This tests real-time data handling.
4. Public API Integration
   - [ ] Pick a public API that might be relevant or interesting. For instance:
   - [ ] Add a function within your code that:
         Makes a request to this public API.
         Incorporates the result into the chatbot’s response (e.g., If the user asks, what the weather is by the coffee shop, then it calls the API and responds with something like “It’s currently 75°F near our coffee shop.”)
         Decides whether to call the API based on the user’s question. This could be done by:
         Checking the user’s query for keywords (e.g., “weather”), or
         Letting the LLM decide based on instructions or custom prompt logic.
5. Architecture
   - [x] Preferred: Frontend and Node.js Backend: A minimal Node.js backend is highly recommended, but not required if time constraint requires everything to be in the frontend.
   - [x] A small Express (or similar) server that:
   - [x] Proxies requests to the LLM API (to avoid exposing API keys in the frontend).
   - [ ] Manages or logs conversation data in memory or a small database (like a JSON file, sqlite, or an in-memory store).
   - [x] Optionally, handles user metrics and analytics for each conversation.
   - **[ ] Frontend calls your Node.js backend endpoints for LLM queries, public API queries, metrics, etc.**
6. Metrics & Logging (Optional)
   - [ ] Usage Metrics: Keep track of:
         Number of queries made.
         Timestamps for each query/response.
         Potentially tokens or cost if you use an LLM with usage pricing.
         Application Logs:
         Record the questions asked and the responses given (anonymized if necessary).
         Log any errors from the LLM or the public API calls.
   - [ ] Reporting:
         Display these metrics in the UI or have an endpoint to fetch them from the backend.
7. Error Handling:
   - [ ] Show clear messages in the chat UI if the LLM call or public API call fails (e.g., “Could not fetch data, please try again.”) and handle network timeouts gracefully.
   8. Documentation:
   - [x] A short README describing:
         How to install and run the project (both frontend and backend if applicable).
         Any environment variables needed (keys for LLM or public APIs).
         The main architectural decisions (frontend-only vs. Node backend).
         The business that you are “supporting”
