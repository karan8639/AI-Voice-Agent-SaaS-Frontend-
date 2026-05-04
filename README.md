🎙️ SoviaAI: Agentic Voice & CRM Automation
The Bridge Between Voice Interactions and Automated Business Intelligence
SoviaAI is a B2B Multi-tenant SaaS platform designed to automate high-volume voice interactions and integrate them directly into a CRM workflow. Built for modern enterprises (like educational institutes and service providers), it uses "Agentic AI" to handle calls, train on custom knowledge bases, and perform automated follow-ups via WhatsApp.

💎 The Aesthetic: "Glassmorphism Enterprise"
The UI is designed to feel premium and technical.

Theme: Deep Charcoal backgrounds with Cyber Blue & Electric Emerald accents.

Visuals: Semi-transparent "Glass" panels with subtle blurs and metallic borders.

Typography: Modern Sans-serif (Inter) for high-density data readability.

🚀 Key Modules
Command Center (Admin Dashboard): Real-time analytics on AI performance, "Minutes Saved," and sentiment trends.

Knowledge Forge (AI Training): A RAG (Retrieval-Augmented Generation) interface where admins upload PDFs/CSVs to ground the AI in factual data.

Call Intelligence Log: Detailed transcripts, 3-sentence AI summaries, and "Manual Handoff" triggers for human intervention.

Agentic Handoff: Automated post-call triggers that send course details or brochures via WhatsApp.

🛠️ Tech Stack
Frontend
Framework: React 18 (Vite) — For high-speed performance and modern DX.

Styling: Tailwind CSS — Utility-first CSS for complex Glassmorphic UI.

Icons: Lucide-React — Clean, minimal vector iconography.

Routing: React Router 6.

Backend (Spring Boot)
Architecture: Multi-tenant Shared Database with Discriminator Columns.

Security: Spring Security + JWT (JSON Web Tokens) for secure, tenant-isolated sessions.

Data: Spring Data JPA + PostgreSQL.

Integrations: Planned support for Twilio (Voice) and Meta Graph API (WhatsApp).

🏗️ Technical Architecture
SoviaAI is built with Multi-tenant Isolation at its core.

Identity Management: Each request is filtered by a tenantId extracted from the JWT.

Data Privacy: The Spring Boot backend uses logic-level filtering to ensure Company A can never access Company B’s call logs or knowledge base.

Agentic Logic: The system doesn't just "talk"; it performs actions (sending messages, updating CRM statuses) based on call outcomes.
