export const DEFAULT_CATEGORY = "AI Engineering";
export const DEFAULT_EXPERIENCE_LEVEL = "2+ years";

export const JOB_TYPE_OPTIONS = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];

export const EXPERIENCE_LEVEL_SUGGESTIONS = [
  "Entry level (0-2 years)",
  "2+ years",
  "3+ years",
  "4+ years",
  "5+ years",
  "7+ years",
  "10+ years",
];

export const JOB_CATEGORIES = [
  "AI Engineering",
  "Machine Learning",
  "Deep Learning",
  "NLP",
  "Computer Vision",
  "Robotics Engineering",
  "Embedded Systems",
  "Control Systems",
  "Autonomous Systems",
  "SLAM & Navigation",
  "AI Research",
  "Robotics Research",
  "Data Science",
  "MLOps",
  "AI Product",
  "AI UX",
  "AI Solutions",
  "AI Safety",
];

const LEGACY_CATEGORY_MAP = {
  Robotics: "Robotics Engineering",
  Research: "AI Research",
  Remote: DEFAULT_CATEGORY,
  Global: DEFAULT_CATEGORY,
};

const LEGACY_EXPERIENCE_MAP = {
  "0-2": "Entry level (0-2 years)",
  "0-2 yrs": "Entry level (0-2 years)",
  "0-2 years": "Entry level (0-2 years)",
  "2-5": DEFAULT_EXPERIENCE_LEVEL,
  "2-5 yrs": DEFAULT_EXPERIENCE_LEVEL,
  "2-5 years": DEFAULT_EXPERIENCE_LEVEL,
  "5+": "5+ years",
  "5+ yrs": "5+ years",
};

const CATEGORY_META = {
  "AI Engineering": { icon: "⚡", color: "#8b5cf6" },
  "Machine Learning": { icon: "🧠", color: "#2563eb" },
  "Deep Learning": { icon: "🧬", color: "#0f766e" },
  "NLP": { icon: "💬", color: "#7c3aed" },
  "Computer Vision": { icon: "👁", color: "#059669" },
  "Robotics Engineering": { icon: "🤖", color: "#db2777" },
  "Embedded Systems": { icon: "🛠", color: "#ea580c" },
  "Control Systems": { icon: "🎛", color: "#0284c7" },
  "Autonomous Systems": { icon: "🚗", color: "#0891b2" },
  "SLAM & Navigation": { icon: "🧭", color: "#4f46e5" },
  "AI Research": { icon: "🔬", color: "#dc2626" },
  "Robotics Research": { icon: "🧪", color: "#9333ea" },
  "Data Science": { icon: "📊", color: "#0f766e" },
  "MLOps": { icon: "⚙", color: "#1d4ed8" },
  "AI Product": { icon: "📦", color: "#475569" },
  "AI UX": { icon: "✨", color: "#ca8a04" },
  "AI Solutions": { icon: "🧩", color: "#2563eb" },
  "AI Safety": { icon: "🛡", color: "#dc2626" },
};

export function normalizeJobCategory(category) {
  const raw = String(category || "").trim();
  if (!raw) return DEFAULT_CATEGORY;
  const normalized = LEGACY_CATEGORY_MAP[raw] || raw;
  return JOB_CATEGORIES.includes(normalized) ? normalized : DEFAULT_CATEGORY;
}

export function normalizeExperienceLevel(experienceLevel) {
  const raw = String(experienceLevel || "").trim();
  if (!raw) return DEFAULT_EXPERIENCE_LEVEL;
  const normalized = LEGACY_EXPERIENCE_MAP[raw.toLowerCase()] || raw;
  return normalized;
}

export const CATEGORY_OPTIONS = JOB_CATEGORIES.map((name) => ({
  name,
  icon: CATEGORY_META[name]?.icon || "•",
  color: CATEGORY_META[name]?.color || "#475569",
}));

export const CATEGORIES = CATEGORY_OPTIONS;

export const SAMPLE_JOBS = [
  {
    id: 1, title: "Senior LLM Engineer", company: "DeepMind", companyLogo: "DM",
    location: "London / Remote", salary_min: 180000, salary_max: 260000,
    job_type: "Full-time", experience_level: "5+ years", remote: true, hybrid: false,
    skills: ["PyTorch", "LLM", "Python", "RLHF", "Transformers"],
    description: "Join DeepMind's frontier LLM team to push the boundaries of language understanding. You'll work on pre-training, fine-tuning, and aligning large language models at scale. We use cutting-edge research to develop the next generation of AI systems.",
    posted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), featured: true,
    apply_url: "https://deepmind.com/careers", category: "AI Engineering",
  },
  {
    id: 2, title: "ML Engineer – Computer Vision", company: "Waymo", companyLogo: "WY",
    location: "San Francisco, CA", salary_min: 200000, salary_max: 300000,
    job_type: "Full-time", experience_level: "5+ years", remote: false, hybrid: false,
    skills: ["Computer Vision", "PyTorch", "CUDA", "Python", "C++"],
    description: "Waymo is hiring ML engineers to build perception systems for our autonomous vehicles. You'll work on 3D object detection, sensor fusion, and real-time inference pipelines. Your work directly impacts the safety of millions of future riders.",
    posted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), featured: true,
    apply_url: "https://waymo.com/careers", category: "Computer Vision",
  },
  {
    id: 3, title: "Robotics Software Engineer", company: "Boston Dynamics", companyLogo: "BD",
    location: "Waltham, MA / Hybrid", salary_min: 150000, salary_max: 220000,
    job_type: "Full-time", experience_level: "2+ years", remote: false, hybrid: true,
    skills: ["ROS", "Python", "C++", "Motion Planning", "SLAM"],
    description: "Design and implement software for our next-generation robot platforms. You'll collaborate with mechanical and electrical teams to develop locomotion algorithms, perception systems, and manipulation capabilities.",
    posted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), featured: false,
    apply_url: "https://bostondynamics.com/careers", category: "Robotics Engineering",
  },
  {
    id: 4, title: "AI Research Scientist", company: "OpenAI", companyLogo: "OA",
    location: "Remote – Global", salary_min: 150000, salary_max: 230000,
    job_type: "Full-time", experience_level: "5+ years", remote: true, hybrid: false,
    skills: ["LLM", "Research", "Python", "JAX", "RLHF"],
    description: "Join our distributed research team to work on frontier questions in AI alignment, capability evaluations, and novel training paradigms. Publish in top venues and collaborate with researchers across multiple regions.",
    posted_at: new Date(Date.now() - 5 * 60 * 60 * 1000), featured: true,
    apply_url: "https://openai.com/careers", category: "AI Research",
  },
  {
    id: 5, title: "MLOps Engineer", company: "Shopify", companyLogo: "SH",
    location: "Toronto, Canada", salary_min: 110000, salary_max: 170000, currency: "USD",
    job_type: "Full-time", experience_level: "2+ years", remote: false, hybrid: false,
    skills: ["Python", "Kubernetes", "MLflow", "AWS", "Docker"],
    description: "Build and maintain ML infrastructure for a global commerce platform. Own model deployment pipelines, monitoring systems, and feature stores serving high-volume production traffic.",
    posted_at: new Date(Date.now() - 18 * 60 * 60 * 1000), featured: false,
    apply_url: "https://shopify.com/careers", category: "MLOps",
  },
  {
    id: 6, title: "AI Architect – Generative AI", company: "Accenture", companyLogo: "AC",
    location: "Dublin, Ireland / Remote", salary_min: 130000, salary_max: 210000, currency: "EUR",
    job_type: "Full-time", experience_level: "5+ years", remote: true, hybrid: false,
    skills: ["LLM", "Architecture", "Python", "Azure", "RAG"],
    description: "Lead architectural decisions for enterprise Generative AI deployments across Fortune 500 clients. Define RAG pipelines, fine-tuning strategies, and responsible AI frameworks. Mentor a team of 15+ engineers.",
    posted_at: new Date(Date.now() - 30 * 60 * 60 * 1000), featured: false,
    apply_url: "https://accenture.com/careers", category: "AI Solutions",
  },
  {
    id: 7, title: "Computer Vision Engineer", company: "Tesla", companyLogo: "TS",
    location: "Austin, TX", salary_min: 140000, salary_max: 220000, currency: "USD",
    job_type: "Full-time", experience_level: "2+ years", remote: false, hybrid: false,
    skills: ["Computer Vision", "OpenCV", "Python", "TensorRT", "CUDA"],
    description: "Build perception systems for next-generation electric scooters and autonomous mobility solutions. Work on real-time object detection, lane tracking, and driver assistance features.",
    posted_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), featured: false,
    apply_url: "https://tesla.com/careers", category: "Computer Vision",
  },
  {
    id: 8, title: "Robotics Engineer – Manipulation", company: "Agility Robotics", companyLogo: "AR",
    location: "Remote – Global", salary_min: 130000, salary_max: 190000,
    job_type: "Full-time", experience_level: "2+ years", remote: true, hybrid: false,
    skills: ["ROS2", "Python", "MoveIt", "Gazebo", "C++"],
    description: "Work on humanoid robot manipulation for real-world logistics applications. Implement grasp planning, force control, and learning from demonstration algorithms that run on our Digit robot platform.",
    posted_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), featured: false,
    apply_url: "https://agilityrobotics.com/careers", category: "Robotics Engineering",
  },
  {
    id: 9, title: "LLM Fine-tuning Engineer", company: "Anthropic", companyLogo: "AN",
    location: "Remote – Americas & Europe", salary_min: 170000, salary_max: 260000, currency: "USD",
    job_type: "Full-time", experience_level: "2+ years", remote: true, hybrid: false,
    skills: ["LLM", "PyTorch", "LoRA", "PEFT", "Python"],
    description: "Fine-tune and align production LLMs for multilingual and domain-specific use cases. Work on instruction tuning, preference optimization, and evaluation pipelines at scale.",
    posted_at: new Date(Date.now() - 8 * 60 * 60 * 1000), featured: true,
    apply_url: "https://anthropic.com/careers", category: "NLP",
  },
  {
    id: 10, title: "AI Research Engineer", company: "Microsoft Research", companyLogo: "MS",
    location: "Cambridge, UK", salary_min: 90000, salary_max: 150000, currency: "GBP",
    job_type: "Full-time", experience_level: "5+ years", remote: false, hybrid: false,
    skills: ["Research", "Python", "PyTorch", "LLM", "Mathematics"],
    description: "Microsoft Research is looking for AI researchers to work on fundamental and applied problems in machine learning, natural language processing, and responsible AI. Collaborate with global research teams.",
    posted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), featured: false,
    apply_url: "https://microsoft.com/careers", category: "AI Research",
  },
];

export const ALL_SKILLS = [
  "Python", "PyTorch", "ROS", "LLM", "Computer Vision",
  "C++", "JAX", "CUDA", "TensorFlow", "Kubernetes",
];
