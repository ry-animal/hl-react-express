Introduction
The app is designed as an inclusive platform for viewing a business and it's information, providing them with a detailed and eye-pleasing information. The frontend plays a crucial role in crafting a smooth and inviting user experience, bolstering the effectiveness of this app. By ensuring an intuitive and accessible interface, the frontend is pivotal in retaining

Frontend Architecture
The core of our frontend architecture is built using React for its component-based structure and efficient UI updates. We leverage Vite as our build tool, known for its speed and optimized development experience. To ensure a robust and scalable UI, we integrate Material UI for its comprehensive suite of pre-built components and adherence to Material Design principles. We also incorporate TypeScript for enhanced type safety and improved code maintainability. This architecture is designed to prioritize performance, developer productivity, and a consistent, user-friendly interface that scales effectively.

Design Principles
Usability, accessibility, and responsiveness are central to our design philosophy. We aim to create an interface that is not only clean and minimalistic but also functional and easy to navigate. To achieve this, we prioritize designing with a focus on user-friendly interfaces, clear typographic hierarchy, and consistent color schemes that make the platform intuitive for all users. Accessibility is integral, ensuring that the platform is usable by individuals with differing abilities by conforming to web standards such as WCAG.

Styling and Theming
Our styling approach is anchored in the use of Material UI's theming capabilities. This allows for customization of the application's look and feel while maintaining consistency with Material Design guidelines. We leverage Material UI's styling solutions to create responsive and consistent interfaces. Theming is seamlessly managed by adhering to a defined color palette and typography, ensuring a consistent and visually appealing user interface across the entire platform.

Component Structure
The application's frontend is organized around a component-based architecture, reflecting our commitment to reusability and scalability. By using React's component model within our Vite project, we structure the UI into self-contained units, each responsible for a specific part of the interface (e.g., navigation bars, listing cards, chat windows). Material UI components are leveraged extensively to provide consistent styling and behavior, reducing the need for custom implementations of common UI elements. This approach promotes modularity, making it easier to develop, test, and maintain individual parts of the application. Components are designed to be composable, allowing us to build complex interfaces by combining simpler ones. This modularity ensures that the codebase remains organized and adaptable as new features are added or existing ones are modified, supporting long-term project growth.

Assignment Guidelines
All calls to the LLM and the public API happen directly from the browser.
Use environment variables or a config file for any API keys/secrets (not best practice for production, but acceptable for a quick prototype).
Keep all chatbot logic in the frontend.
