/** KEEPUP case study — docs template (single-flow workflow project) */
export const KEEPUP_CASE_STUDY = {
  slug: "keepup",
  layout: "docs",
  docsAsset: "/assets/projects/case-study/keepup/figma",
  title: "KEEPUP",
  eyebrow: "Case Study",
  tagline: "One connected workflow from material intake to task completion.",
  intro: [
    "KEEPUP is a workforce and operations management platform designed to simplify how materials, tasks, workers, and supervisors interact throughout a project's lifecycle. Instead of managing disconnected processes across multiple systems, the platform brings every operational step into one connected workflow.",
    "From receiving materials and assigning Genesis IDs to task execution, supervisor reviews, and project completion, every stage is linked to improve visibility, accountability, and operational efficiency. The experience was shaped around a single end-to-end flow rather than isolated feature modules, making complex field operations easier to understand, execute, and oversee.",
  ],
  meta: [
    { label: "Role", value: "UI/UX Designer" },
    { label: "Timeline", value: "03 Days" },
    { label: "Platform", value: "Web Application" },
    { label: "Industry", value: "Workforce & Operations Management" },
    { label: "Team", value: "--------------" },
    { label: "Tools", value: "Figma, FigJam, Claude AI" },
  ],
  blocks: [
    {
      type: "overview",
      title: "Project Overview",
      paragraphs: [
        "Managing field operations involves much more than assigning tasks. Materials need to be received, identified, stored, assigned to the right teams, validated before use, and tracked throughout execution. At the same time, supervisors need visibility into progress while administrators manage resources, planning, and overall operations.",
        "KEEPUP was designed to solve this challenge by connecting every operational stage into one continuous process. Rather than forcing teams to coordinate across spreadsheets, messaging tools, and separate inventory systems, the platform provides a structured lifecycle where materials, tasks, and people stay synchronised from intake to completion.",
        "As the Product Designer, my focus was on workflow architecture, UX strategy, and operational process design. The goal was to reduce manual coordination, improve traceability, and ensure workers, supervisors, and administrators always have the right information at the right time.",
      ],
    },
    {
      type: "approach",
      title: "Design Approach",
      intro:
        "The project was driven by the need to create clarity across a complex operational environment. Every design decision prioritised traceability, role-based visibility, and predictable handoffs so field teams could execute work confidently while supervisors and administrators maintained control over the broader project lifecycle.",
      cards: [
        {
          title: "Workflow-First Thinking",
          body: "Mapped the full operational journey before designing individual screens, ensuring materials, tasks, and approvals follow a logical sequence from intake to completion.",
        },
        {
          title: "Role-Based Visibility",
          body: "Structured experiences around Worker, Supervisor, and Administrator needs so each role sees the information relevant to their responsibilities without unnecessary complexity.",
        },
        {
          title: "Traceability by Design",
          body: "Introduced Genesis IDs and stage-based status tracking so every material and task remains identifiable and auditable throughout the execution lifecycle.",
        },
        {
          title: "Operational Clarity",
          body: "Used predictable sequences, clear status indicators, and structured review steps to reduce cognitive load for teams working in fast-moving field environments.",
        },
      ],
    },
    {
      type: "feature",
      title: "Connected Workflow Architecture",
      paragraphs: [
        "Rather than treating each module as an independent feature, the workflow was designed as a connected lifecycle. Every material, task, and user moves through a structured process that keeps information synchronised across the platform.",
        "This approach improves operational visibility, reduces unnecessary handoffs, and helps teams complete work more efficiently. Administrators can plan and allocate resources with confidence, workers receive actionable tasks with the context they need, and supervisors can review outcomes without losing sight of project progress.",
      ],
    },
    {
      type: "feature",
      title: "End-to-End Operational Flow",
      paragraphs: [
        "The workflow begins when materials enter the system and receive a unique Genesis ID. Once verified, they move into storage before becoming available for planning and task allocation. Workers receive assigned tasks, validate materials before execution, and complete work following structured operational steps.",
        "Supervisors review completed tasks, approve successful work, or return tasks for correction when necessary. Finally, completed work contributes to analytics and continuous operational improvement. Each transition is designed to be explicit, traceable, and easy to follow across roles.",
        "Key interaction states such as Task Assigned, Material Verified, Work In Progress, Supervisor Approval, Task Rejected, Task Completed, and Analytics Updated provide consistent feedback throughout the journey, helping every stakeholder understand where work stands at any moment.",
      ],
      showcase: "workflow",
    },
    {
      type: "approach",
      title: "User Roles",
      intro:
        "KEEPUP supports three primary roles within the same connected workflow. Each role interacts with different stages of the process while remaining aligned to a shared operational model.",
      cards: [
        {
          title: "Worker",
          body: "Executes assigned tasks, validates materials before use, and completes field operations with clear instructions and status feedback at every step.",
        },
        {
          title: "Supervisor",
          body: "Reviews completed work, approves execution quality, returns tasks for correction when needed, and maintains visibility into project progress.",
        },
        {
          title: "Administrator",
          body: "Manages operational planning, materials, workflows, resources, and system configuration to keep projects running efficiently from start to finish.",
        },
      ],
    },
    {
      type: "benefits",
      title: "Key Benefits",
      intro:
        "KEEPUP is designed to replace fragmented operational tools with one connected system that improves accountability, reduces manual coordination, and gives every role clearer visibility into project execution.",
      cards: [
        {
          title: "Core Benefits",
          intro:
            "Every stage of the workflow is built to keep materials, tasks, and teams aligned while reducing operational friction.",
          items: [
            {
              title: "End-to-End Traceability",
              body: "Track materials from intake and Genesis ID assignment through storage, task allocation, execution, and supervisor review within one connected lifecycle.",
            },
            {
              title: "Reduced Manual Coordination",
              body: "Replace disconnected spreadsheets and handoffs with a structured workflow that keeps workers, supervisors, and administrators synchronised.",
            },
            {
              title: "Stronger Operational Visibility",
              body: "Surface project status, task progress, and review outcomes in a predictable sequence so teams can act quickly with shared context.",
            },
            {
              title: "Scalable Process Foundation",
              body: "Establish a workflow model that can support additional modules, reporting, and operational improvements without breaking the core user journey.",
            },
          ],
        },
        {
          title: "User Benefits",
          intro:
            "The experience was designed to make complex operations feel structured and manageable for every role involved in project execution.",
          items: [
            {
              title: "Clear Task Execution for Workers",
              body: "Workers receive focused assignments with material validation steps and explicit status updates, reducing ambiguity in the field.",
            },
            {
              title: "Efficient Review for Supervisors",
              body: "Supervisors can approve, reject, or return work through a structured review flow that keeps quality control visible and accountable.",
            },
            {
              title: "Centralised Control for Administrators",
              body: "Administrators manage planning, resources, and workflow configuration from one operational model instead of juggling separate tools.",
            },
            {
              title: "Predictable Interaction Patterns",
              body: "Consistent status states and stage transitions help all users understand progress without needing to reconstruct context manually.",
            },
          ],
        },
      ],
    },
    {
      type: "note",
      text: "The workflow was designed with clarity and simplicity in mind. Each operational stage follows a predictable sequence, reducing cognitive load for workers in the field while helping supervisors and administrators quickly understand project status and operational progress.",
    },
    {
      type: "closing",
      title: "Final Outcome",
      paragraphs: [
        "KEEPUP evolved into a connected operational platform that unifies material intake, task execution, supervisor review, and project completion within one traceable workflow. By focusing on lifecycle design rather than isolated features, the system supports stronger collaboration across workers, supervisors, and administrators.",
        "Throughout the design process, the emphasis remained on creating clarity across a complex operational environment. Every stage was structured to improve accountability, reduce unnecessary handoffs, and give teams a shared understanding of project progress from start to finish.",
      ],
    },
    {
      type: "takeaways",
      title: "Key Design Takeaways",
      intro:
        "Designing KEEPUP reinforced the importance of thinking beyond individual screens and mapping the full operational journey first. When materials, people, and approvals stay connected, teams can move faster with fewer errors and greater confidence.",
      lead: "The design process emphasized:",
      items: [
        "Designing connected workflows before defining isolated product modules.",
        "Creating role-based experiences that share one operational source of truth.",
        "Using traceability and status states to make complex field work easier to follow.",
        "Building a scalable workflow foundation that supports long-term operational growth.",
      ],
    },
    {
      type: "closing",
      title: "Looking Ahead",
      paragraphs: [
        "KEEPUP was designed with future expansion in mind. The workflow foundation can support deeper analytics, resource forecasting, mobile field execution, automated notifications, and integrations with inventory or ERP systems while preserving the same clear operational journey.",
      ],
    },
    {
      type: "closing",
      title: "Final Note",
      paragraphs: [
        "KEEPUP reflects my approach to designing operational products that prioritise clarity, traceability, and collaboration. By structuring complex workforce processes into a single connected flow, the platform helps teams execute work with greater visibility, accountability, and confidence across the entire project lifecycle.",
      ],
    },
  ],
  footer: "🎉 You've reached the end of this case study.",
};
