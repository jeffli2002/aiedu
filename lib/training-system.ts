export type VideoAccess = 'free' | 'preview';

interface BaseMaterial {
  id: string;
  title: string;
  mediaId: string; // maps to R2 path id, e.g., videos/{mediaId}/full.mp4 or docs/{mediaId}/full.pdf
  language?: 'zh' | 'en';
}

export interface VideoMaterial extends BaseMaterial {
  type: 'video';
  // Free access policy for training videos.
  access: VideoAccess;
}

export interface PdfMaterial extends BaseMaterial {
  type: 'pdf';
}

export type CourseMaterial = VideoMaterial | PdfMaterial;

export interface Module {
  id: string;
  title: string;
  duration: string;
  type: 'foundation' | 'creation' | 'vibe' | 'pbl' | 'efficiency';
  format: 'Online' | 'Offline' | 'Mixed';
  theoryDuration?: string;
  practiceDuration?: string;
  description: string;
  skills: string[];
  heroImage: string;
  syllabus: { title: string; description: string }[];
  projects: { title: string; goal: string; tools: string[]; outcome: string }[];
  materials?: CourseMaterial[]; // optional gated tutorial files (auth required)
}

export interface TrainingSystem {
  foundations: Module[];
  creation: Module[];
  efficiency: Module[];
  vibe: Module[];
}

const getCourseHero = (id: string) => `/training/heroes/${id}.jpg`;

export const TRAINING_SYSTEM: Record<'zh' | 'en', TrainingSystem> = {
  zh: {
    foundations: [
      { 
        id: 'f101', title: '大模型概论', duration: '45m', type: 'foundation', format: 'Online', 
        description: 'Gemini、GPT 等大模型的演进历程与底层核心原理。理解 AI 的"大脑"。', skills: ['AI 发展史', 'Token 原理', '神经网络'],
        heroImage: getCourseHero('f101'),
        syllabus: [
          { title: 'AI 的起源', description: '从基于规则的 AI 到深度学习与 Transformer 的飞跃。' },
          { title: '注意力机制', description: '模型如何从海量信息中"聚焦"关键上下文。' },
          { title: 'Token 经济学', description: '理解模型如何阅读、计算并预测下一个字。' }
        ],
        projects: [
          { 
            title: 'AI 幻觉侦探', 
            goal: '分析模型输出，识别其中的事实错误或潜在偏见。', 
            tools: ['Gemini', 'Google 搜索'], 
            outcome: '一份深度剖析 AI"幻觉"现象的核查报告。' 
          }
        ],
        materials: [
          {
            id: 'f101-lecture',
            title: '课程讲解视频',
            type: 'video',
            access: 'preview',
            mediaId: 'training/f101/zh/ai-llm-evolution_T01',
            language: 'zh',
          },
          {
            id: 'f101-ai-evolution-t1',
            title: 'AI 进化故事 T1（PDF）',
            type: 'pdf',
            mediaId: 'training/f101/zh/ai-evolution-story_T01',
            language: 'zh',
          },
        ]
      },
      { 
        id: 'f102', title: '提示词工程', duration: '60m', type: 'foundation', format: 'Online', 
        description: '系统化的 AI 沟通框架，实现精准任务指令与自动化。', skills: ['思维链', '少样本提示', '指令微调'],
        heroImage: getCourseHero('f102'),
        syllabus: [
          { title: '结构化提示词', description: '掌握上下文 (C)、任务 (T) 和约束 (C) 三位一体框架。' },
          { title: '逻辑推理链', description: '利用思维链 (CoT) 解决复杂的数学与逻辑难题。' },
          { title: '专家人格模拟', description: '通过系统提示词将 AI 转化为各领域的顶级专家。' }
        ],
        projects: [
          { 
            title: '无限文字冒险游戏', 
            goal: '设计一套系统提示词，运行一个持久化的文字 RPG 游戏。', 
            tools: ['Markdown', '系统指令'], 
            outcome: '一个能自主处理背包、对话和剧情分支的文字冒险游戏。' 
          }
        ],
        materials: [
          {
            id: 'f102-prompt-engineering-t01',
            title: '提示词工程精通 T01（PDF）',
            type: 'pdf',
            mediaId: 'training/f102/zh/prompt-engineering-mastery_T01',
            language: 'zh',
          },
          {
            id: 'f102-prompt-engineering-video-t01',
            title: '提示词工程精通 T01（视频）',
            type: 'video',
            access: 'preview',
            mediaId: 'training/f102/zh/prompt-engineering-mastery_T01',
            language: 'zh',
          },
        ]
      },
      { 
        id: 'f103', title: 'AI 安全与风险', duration: '60m', type: 'foundation', format: 'Online', 
        description: '应对 AI 时代的挑战：深度伪造、算法偏见、数据隐私与创作伦理。', skills: ['AI 安全', '批判性思维', '隐私保护'],
        heroImage: getCourseHero('f103'),
        syllabus: [
          { title: '深度伪造识别', description: '学习如何辨别 AI 生成的虚假信息与诈骗。' },
          { title: '算法偏见', description: '理解 AI 为何会产生不公，以及如何通过提示词缓解偏见。' },
          { title: '数据隐私边界', description: '与公开 AI 模型互动时的安全习惯。' }
        ],
        projects: [
          { 
            title: 'AI 校园伦理宪章', 
            goal: '为你的学校设计一套负责任使用 AI 的规则。', 
            tools: ['Claude', 'Canva'], 
            outcome: '一份面向同学的 AI 安全使用视觉指南。' 
          }
        ],
        materials: [
          {
            id: 'f103-safety-ethics-t01',
            title: 'AI 安全与风险 T01（PDF）',
            type: 'pdf',
            mediaId: 'training/f103/zh/ai-safety-ethics_T01',
            language: 'zh',
          },
          {
            id: 'f103-safety-ethics-video-t01',
            title: 'AI 安全与风险 T01（视频）',
            type: 'video',
            access: 'preview',
            mediaId: 'training/f103/zh/ai-safety-ethics_T01',
            language: 'zh',
          },
        ]
      },
      { 
        id: 'f104', title: 'AI 多模态基础', duration: '90m', type: 'foundation', format: 'Mixed', 
        description: '探索 AI 如何连接文本、视觉与音频，实现与真实世界的深度交互。', skills: ['视觉语言', '语音合成', '实时对话'],
        heroImage: getCourseHero('f104'),
        syllabus: [
          { title: '视觉智能', description: '模型如何"看懂"图像并描述视觉世界。' },
          { title: '语音技术', description: '类人语音生成与实时对话背后的技术。' },
          { title: '跨模态创作', description: '利用一种媒介驱动另一种媒介（如文生视频）。' }
        ],
        projects: [
          { 
            title: 'AI 视觉讲故事助手', 
            goal: '构建一个能根据你拍摄的照片自动生成故事的应用。', 
            tools: ['Gemini Vision', 'Streamlit'], 
            outcome: '一个能将现实环境叙事化的交互式演示原型。' 
          }
        ]
      }
    ],
    creation: [
      { 
        id: 'c201', title: 'AI 绘图创作', duration: '135m', type: 'creation', format: 'Mixed', 
        theoryDuration: '45m', practiceDuration: '90m', description: '扩散模型深度解析，掌握专业设计级的视觉提示词实操。', skills: ['Nano banana', 'Seeddreem', 'Midjourney', '构图美学'],
        heroImage: getCourseHero('c201'),
        syllabus: [
          { title: '扩散模型原理', description: '理解像素生成、潜空间与去噪的底层逻辑。' },
          { title: '审美掌控力', description: '利用提示词精准控制灯光、镜头、材质与画风。' },
          { title: '反向提示词技术', description: '通过负面提示词剔除画面瑕疵，提升出片质量。' }
        ],
        projects: [
          { 
            title: '未来城海报', 
            goal: '设计一张反映 2100 年可持续能源理念的城市海报。', 
            tools: ['Midjourney', 'Canva'], 
            outcome: '一张达到专业出版标准的电影感高清海报。' 
          }
        ],
        materials: [
          {
            id: 'c201-imagination-t01',
            title: 'AI 绘画解锁想象力 T01（PDF）',
            type: 'pdf',
            mediaId: 'training/c201/zh/ai-drawing-unlock-imagination_T01',
            language: 'zh',
          },
          {
            id: 'c201-video-analysis-t01',
            title: 'AI 图像生成解析 T01（视频）',
            type: 'video',
            access: 'preview',
            mediaId: 'training/c201/zh/ai-image-generation-analysis_T01',
            language: 'zh',
          },
        ]
      },
      { 
        id: 'c202', title: 'AI 视频创作', duration: '180m', type: 'creation', format: 'Mixed', 
        theoryDuration: '60m', practiceDuration: '120m', description: '运动控制、时序一致性与 AI 驱动的影视语言表达。', skills: ['SORA', 'VEO', 'Kling', 'WAN'],
        heroImage: getCourseHero('c202'),
        syllabus: [
          { title: '时序逻辑一致性', description: '保持生成的每一帧画面在角色和场景上高度统一。' },
          { title: '运镜导演思维', description: '利用镜头移动提示词引导 AI 实现专业的视听表达。' },
          { title: '视听艺术整合', description: '将 AI 画面与 Suno 生成的音轨进行深度后期匹配。' }
        ],
        projects: [
          { 
            title: '30秒未来预告片', 
            goal: '制作一部高保真电影级科幻创意预告片。', 
            tools: ['Veo', 'Suno', '剪映'], 
            outcome: '一部包含特效与配音的完整 30 秒科幻短片。' 
          }
        ],
        materials: [
          {
            id: 'c202-guide-t01',
            title: 'AI 视频创作 魔法学徒指南 T01（PDF）',
            type: 'pdf',
            mediaId: 'training/c202/zh/ai-video-synthesis-apprentice-guide_T01',
            language: 'zh',
          },
          {
            id: 'c202-video-magic-t01',
            title: '未来的导演：AI视频的魔法 T01（视频）',
            type: 'video',
            access: 'preview',
            mediaId: 'training/c202/zh/future-director-ai-video-magic_T01',
            language: 'zh',
          },
        ]
      },
      { 
        id: 'c203', title: 'AI 写作与叙事', duration: '120m', type: 'creation', format: 'Online', 
        description: '掌握创意写作与生成式文本智能体，打造高影响力的故事作品。', skills: ['叙事设计', '风格模拟', '协同创作'],
        heroImage: getCourseHero('c203'),
        syllabus: [
          { title: '英雄之旅 AI 建模', description: '利用大模型规划复杂的故事弧线与反转。' },
          { title: '风格与语调控制', description: '精准调优 AI 输出，使其符合特定的文学风格。' },
          { title: '迭代式编辑工作流', description: '从概念构思到成品润色的 AI 协作全过程。' }
        ],
        projects: [
          { 
            title: 'AI 共创中篇小说', 
            goal: '在 AI 辅助下完成一篇 3000 字的高质量短篇故事。', 
            tools: ['Claude', 'Sudowrite'], 
            outcome: '一本具备一致角色语调的数字化中篇小说。' 
          }
        ],
        materials: [
          {
            id: 'c203-hero-journey-t01-zh',
            title: 'AI写作英雄之旅 T01（PDF）',
            type: 'pdf',
            mediaId: 'training/c203/zh/ai-writing-hero-journey_T01',
            language: 'zh',
          },
          {
            id: 'c203-writing-evolution-video-t01-zh',
            title: 'AI写作进化论：从灵感到伦理合作 T01（视频）',
            type: 'video',
            access: 'preview',
            mediaId: 'training/c203/zh/ai-writing-evolution-inspiration-ethics_T01',
            language: 'zh',
          },
        ]
      },
      { 
        id: 'c204', title: 'AI 音频与播客', duration: '150m', type: 'creation', format: 'Mixed', 
        theoryDuration: '45m', practiceDuration: '105m', description: '声音克隆、音乐生成与自动化播客制作全流程。', skills: ['音频工程', '语音合成', '音效设计'],
        heroImage: getCourseHero('c204'),
        syllabus: [
          { title: '人声身份构建', description: '克隆并引导 AI 语音，赋予其情感与节奏感。' },
          { title: '音乐与氛围生成', description: '为作品创作专属的背景音轨与音效。' },
          { title: '播客自动化生产', description: '结合 NotebookLM 与 ElevenLabs 快速产出播客集。' }
        ],
        projects: [
          { 
            title: '每日科技资讯播客', 
            goal: '利用纯 AI 流程制作一个 5 分钟的每日新闻播客。', 
            tools: ['ElevenLabs', 'Suno', 'NotebookLM'], 
            outcome: '一集制作精良、可直接发布至播客平台的音频作品。' 
          }
        ]
      },
      { 
        id: 'c205', title: 'AI 数字人与虚拟形象', duration: '165m', type: 'creation', format: 'Mixed', 
        theoryDuration: '45m', practiceDuration: '120m', description: '构建高写实的数字人形象与虚拟分身，掌握视觉生成与语音同步的核心技术。', skills: ['HeyGen', 'D-ID', '唇形同步', '形象设计'],
        heroImage: getCourseHero('c205'),
        syllabus: [
          { title: '虚拟形象生成', description: '从提示词到高保真的数字人格：设计你的数字化身。' },
          { title: '唇形同步与表情', description: '将语音数据与面部肌肉运动进行精准匹配，实现逼真交互。' },
          { title: '交互式数字人', description: '结合大模型实现可实时对话的智能虚拟人。' }
        ],
        projects: [
          { 
            title: '虚拟品牌代言人', 
            goal: '制作一个 60 秒的数字人视频，介绍一款创意产品。', 
            tools: ['HeyGen', 'Midjourney', 'ChatGPT'], 
            outcome: '一个具备大厂质感的、能够流利讲解产品的数字人营销短片。' 
          }
        ]
      }
    ],
    efficiency: [
      { 
        id: 'e301', title: 'AI 阅读与写作', duration: '75m', type: 'efficiency', format: 'Online', 
        description: '利用 AI 搜索与大模型实现信息获取与创作的 10 倍提效。', skills: ['Perplexity', 'Claude', '知识管理'],
        heroImage: getCourseHero('e301'),
        syllabus: [
          { title: '实时搜索增强', description: '利用联网 AI 获取经核实的、最新的世界级信息。' },
          { title: '长文本浓缩', description: '将数百页的 PDF 文档快速提取为核心行动建议。' },
          { title: 'AI 协同写作', description: '在保持个人表达风格的前提下，与 AI 共创高质量文章。' }
        ],
        projects: [
          { 
            title: '全球议题简报', 
            goal: '针对某一复杂全球议题完成多源核实的深度综述。', 
            tools: ['Perplexity', 'Notion'], 
            outcome: '在 20 分钟内产出一份高质量的 3 页政策简报。' 
          }
        ]
      },
      { 
        id: 'e302', title: 'AI PPT 创作', duration: '90m', type: 'efficiency', format: 'Mixed', 
        theoryDuration: '45m', practiceDuration: '45m', description: '将创意笔记瞬间转化为高质量、具备商业说服力的演示文稿。', skills: ['信息设计', 'Gamma', '结构化思维'],
        heroImage: getCourseHero('e302'),
        syllabus: [
          { title: '大纲逻辑提取', description: '将原始笔记或文档转化为严密的演示逻辑流。' },
          { title: 'AI 视觉排版', description: '利用智能工具自动生成易读性极佳的图标与布局。' },
          { title: '说服力优化', description: '利用 AI 建议优化幻灯片的视觉重点与表达节奏。' }
        ],
        projects: [
          { 
            title: '创业路演幻灯片', 
            goal: '在 15 分钟内完成 10 页专业级路演 PPT。', 
            tools: ['Gamma', 'Claude'], 
            outcome: '一份具备真实投融资潜力的路演文稿。' 
          }
        ]
      },
      { 
        id: 'e303', title: 'AI 工作流 (n8n/Coze)', duration: '120m', type: 'efficiency', format: 'Mixed', 
        theoryDuration: '60m', practiceDuration: '60m', description: '构建自动化业务流程与多节点智能体，实现无人值守提效。', skills: ['自动化', '无代码', 'Coze', 'n8n'],
        heroImage: getCourseHero('e303'),
        syllabus: [
          { title: '智能体规划思维', description: '设计具备自我规划、推理与执行能力的 AI 助手。' },
          { title: '多节点管道构建', description: '连接搜索、LLM、数据库与通知终端的闭环逻辑。' },
          { title: '触发式自动化', description: '实现对邮件、消息或新闻快讯的实时自动响应。' }
        ],
        projects: [
          { 
            title: '每日科技头条助手', 
            goal: '构建一个自动汇总资讯并推送至社交终端的智能体。', 
            tools: ['Coze', 'Telegram API'], 
            outcome: '一个每天能为用户节省 30 分钟筛选资讯的工具。' 
          }
        ]
      }
    ],
    vibe: [
      { 
        id: 'v401', title: 'Vibe Principles', duration: 'Day 1', type: 'vibe', format: 'Offline', 
        description: '理解直觉驱动的自然语言编程、Bug 修复与云端发布全流程。', skills: ['工作流策略', 'Vibe 编程', '快速原型'],
        heroImage: getCourseHero('v401'),
        syllabus: [
          { title: 'Vibe 编程思维', description: '从"如何写代码"转向"要构建什么功能"的认知飞跃。' },
          { title: '对话式调试', description: '通过自然语言描述 Bug 并实现逻辑的持续进化。' },
          { title: '瞬时云端发布', description: '将全栈应用一键发布至全球可访问的生产环境。' }
        ],
        projects: [
          { 
            title: '个人全栈仪表盘', 
            goal: '利用提示词在 10 分钟内构建并上线一个 Web 应用。', 
            tools: ['Bolt.new', 'Supabase'], 
            outcome: '一个正式运行、具备云端存储能力的 Web 应用。' 
          }
        ]
      },
      { 
        id: 'v402', title: '工具与流程', duration: 'Day 2', type: 'vibe', format: 'Offline', 
        description: '深度掌握 AI 原生 IDE 与迭代反馈闭环，实现超高速开发。', skills: ['Cursor', 'Bolt.new', 'GitHub'],
        heroImage: getCourseHero('v402'),
        syllabus: [
          { title: 'AI 原生 IDE 实战', description: '利用 Cursor 实时生成代码、重构逻辑并进行全库搜索。' },
          { title: '迭代式提示词', description: '通过与代码库的对话，逐步添加复杂的交互功能。' },
          { title: 'AI 辅助版本管理', description: '利用 AI 编写提交信息、解释代码变更并处理合并冲突。' }
        ],
        projects: [
          { 
            title: '智能任务管理工具', 
            goal: '利用 Bolt 和 Cursor 在 60 分钟内构建一个多页面生产力工具。', 
            tools: ['Cursor', 'Tailwind CSS'], 
            outcome: '一个功能完备、设计精美的个人任务管理应用。' 
          }
        ]
      },
      { 
        id: 'v403', title: 'Config & Deployment', duration: 'Day 3', type: 'vibe', format: 'Offline', 
        description: '连接数据库、管理环境变量并实现专业的云端发布。', skills: ['Supabase', 'Vercel', 'Backend Logic'],
        heroImage: getCourseHero('v403'),
        syllabus: [
          { title: '人性化数据库', description: '利用自然语言查询在 Supabase 中创建表并管理数据。' },
          { title: '敏感信息管理', description: '安全处理 API 密钥与环境变量。' },
          { title: '持续集成与部署', description: '自动化从 GitHub 到 Vercel 的部署流程。' }
        ],
        projects: [
          { 
            title: 'AI 数据中心', 
            goal: '为你的 Web 应用连接一个持久化的云端数据库。', 
            tools: ['Supabase', 'Vercel'], 
            outcome: '一个具备数据存储与读取能力的生产级应用。' 
          }
        ]
      },
      { 
        id: 'v404', title: 'Demo & Sharing', duration: 'Day 4-5', type: 'vibe', format: 'Offline', 
        description: '打磨产品细节、记录创作历程并向全球观众进行演示。', skills: ['演讲技巧', '用户体验', '性能优化'],
        heroImage: getCourseHero('v404'),
        syllabus: [
          { title: '细节打磨与 UX', description: '微调动画与响应式设计，赋予产品"大厂级"质感。' },
          { title: '技术路演技巧', description: '学习如何清晰、生动地向非技术观众讲解 AI 创新。' },
          { title: '社区发布与反馈', description: '在 Product Hunt 等平台发布作品并建立用户反馈环。' }
        ],
        projects: [
          { 
            title: '全球 Demo Day', 
            goal: '正式发布你的应用并进行 3 分钟的线上/线下路演。', 
            tools: ['Loom', 'Product Hunt'], 
            outcome: '一个完整的个人作品集项目及对应的用户影响力记录。' 
          }
        ]
      }
    ]
  },
  en: {
    foundations: [
      { 
        id: 'f101', title: 'Large Models Intro', duration: '45m', type: 'foundation', format: 'Online', 
        description: 'Evolution and core principles of LLMs like Gemini and GPT. Understand the "brain" behind the AI.', skills: ['AI History', 'Tokenization', 'Neural Networks'],
        heroImage: getCourseHero('f101'),
        syllabus: [
          { title: 'The Genesis', description: 'Evolution from rule-based systems to deep learning and transformers.' },
          { title: 'Attention Mechanism', description: 'How AI "focuses" on important parts of your input.' },
          { title: 'The Token Economy', description: 'Understanding how AI calculates and predicts the next word.' }
        ],
        projects: [
          {
            title: 'AI Hallucination Detective',
            goal: 'Analyze a model output to find factual errors or biases.',
            tools: ['Gemini', 'Google Search'],
            outcome: 'A fact-checking report showing how models can "hallucinate".'
          }
        ],
        materials: [
          {
            id: 'f101-ai-evolution-story-t1-en',
            title: 'AI Evolution Story T01 (PDF)',
            type: 'pdf',
            mediaId: 'training/f101/en/ai-evolution-story_T01',
            language: 'en',
          },
          {
            id: 'f101-ai-llm-evolution-video-t1-en',
            title: 'AI LLM Evolution T01 (Video)',
            type: 'video',
            access: 'preview',
            mediaId: 'training/f101/en/ai-llm-evolution_T01',
            language: 'en',
          },
        ]
      },
      { 
        id: 'f102', title: 'Prompt Engineering', duration: '60m', type: 'foundation', format: 'Online', 
        description: 'Systematic frameworks for precise AI communication and task automation.', skills: ['CoT', 'Few-shot', 'Instruction Tuning'],
        heroImage: getCourseHero('f102'),
        syllabus: [
          { title: 'Structural Logic', description: 'Mastering Context, Task, and Constraint (CTC) frameworks.' },
          { title: 'Reasoning Chains', description: 'Using Chain-of-Thought (CoT) for complex math and logic solving.' },
          { title: 'Expert Simulation', description: 'Crafting system prompts that transform AI into domain experts.' }
        ],
        projects: [
          {
            title: 'The Infinite Adventure Game',
            goal: 'Design a system prompt that runs a persistent text-based RPG.',
            tools: ['Markdown', 'System Instructions'],
            outcome: 'A playable text adventure that handles inventory and dialogue autonomously.'
          }
        ],
        materials: [
          {
            id: 'f102-prompting-architecture-t01',
            title: 'Prompting is Architecture T01 (PDF)',
            type: 'pdf',
            mediaId: 'training/f102/en/prompting-is-architecture_T01',
            language: 'en',
          },
          {
            id: 'f102-prompt-engineering-video-t01-en',
            title: 'Mastering Prompt Engineering T01 (Video)',
            type: 'video',
            access: 'preview',
            mediaId: 'training/f102/en/mastering-prompt-engineering_T01',
            language: 'en',
          },
        ]
      },
      { 
        id: 'f103', title: 'AI Safety & Ethics', duration: '60m', type: 'foundation', format: 'Online', 
        description: 'Navigating the risks of AI: deepfakes, bias, data privacy, and ethical creation.', skills: ['AI Safety', 'Critical Thinking', 'Privacy'],
        heroImage: getCourseHero('f103'),
        syllabus: [
          { title: 'Deepfake Awareness', description: 'Learning how to spot AI-generated misinformation and fraud.' },
          { title: 'Algorithmic Bias', description: 'Understanding why AI can be unfair and how to mitigate it.' },
          { title: 'Data Privacy', description: 'Safe habits for interacting with public AI models.' }
        ],
        projects: [
          {
            title: 'AI Ethical Charter',
            goal: 'Create a set of rules for responsible AI use in your school.',
            tools: ['Claude', 'Canva'],
            outcome: 'A visual guide for peers on how to use AI safely and ethically.'
          }
        ],
        materials: [
          {
            id: 'f103-ai-safety-ethics-t01-en',
            title: 'The AI Rules of the Road T01 (PDF)',
            type: 'pdf',
            mediaId: 'training/f103/en/ai-safety-ethics_T01',
            language: 'en',
          },
          {
            id: 'f103-ai-safety-ethics-video-t01-en',
            title: 'Driving the Future T01 (Video)',
            type: 'video',
            access: 'preview',
            mediaId: 'training/f103/en/ai-safety-ethics_T01',
            language: 'en',
          },
        ]
      },
      { 
        id: 'f104', title: 'AI Multimodality', duration: '90m', type: 'foundation', format: 'Mixed', 
        description: 'Exploring how AI connects text, vision, and audio to interact with the real world.', skills: ['Vision-Language', 'Audio Synthesis', 'Gemini Live'],
        heroImage: getCourseHero('f104'),
        syllabus: [
          { title: 'Vision Intelligence', description: 'How models "see" images and describe the visual world.' },
          { title: 'Audio & Speech', description: 'The tech behind human-like voices and real-time conversation.' },
          { title: 'Cross-modal Creativity', description: 'Using one modality to drive another (e.g., text to video).' }
        ],
        projects: [
          {
            title: 'AI Visual Storyteller',
            goal: 'Build an app that tells a story based on photos you take.',
            tools: ['Gemini Vision', 'Streamlit'],
            outcome: 'An interactive demo that narratizes real-world surroundings.'
          }
        ]
      }
    ],
    creation: [
      { 
        id: 'c201', title: 'AI Image Artistry', duration: '135m', type: 'creation', format: 'Mixed', 
        theoryDuration: '45m', practiceDuration: '90m', description: 'Diffusion models and visual prompt mastery for professional-grade design.', skills: ['Nano banana', 'Seeddreem', 'Midjourney', 'Composition'],
        heroImage: getCourseHero('c201'),
        syllabus: [
          { title: 'Diffusion Mechanics', description: 'Mastering pixel generation and the latent space logic.' },
          { title: 'Aesthetic Control', description: 'Directing lighting, camera angles, and textures using language.' },
          { title: 'Negative Prompting', description: 'Filtering unwanted elements for perfect visual output.' }
        ],
        projects: [
          { 
            title: 'Future City Poster', 
            goal: 'Design a 2100 city poster reflecting sustainable energy.', 
            tools: ['Midjourney', 'Canva'], 
            outcome: 'A high-res cinematic poster ready for global publication.' 
          }
        ],
        materials: [
          {
            id: 'c201-imagination-t01-en',
            title: 'AI Spellbook: Digital Creation Quest T01 (PDF)',
            type: 'pdf',
            mediaId: 'training/c201/en/ai-spellbook-digital-creation-quest_T01',
            language: 'en',
          },
          {
            id: 'c201-video-analysis-t01-en',
            title: 'The Canvas of Algorithms T01 (Video)',
            type: 'video',
            access: 'preview',
            mediaId: 'training/c201/en/the-canvas-of-algorithms_T01',
            language: 'en',
          },
        ]
      },
      { 
        id: 'c202', title: 'AI Video Synthesis', duration: '180m', type: 'creation', format: 'Mixed', 
        theoryDuration: '60m', practiceDuration: '120m', description: 'Motion control, temporal consistency, and AI-driven cinematography.', skills: ['SORA', 'VEO', 'Kling', 'WAN'],
        heroImage: getCourseHero('c202'),
        syllabus: [
          { title: 'Temporal Logic', description: 'Maintaining character and object consistency across frames.' },
          { title: 'Motion Directing', description: 'Using camera movement prompts to guide AI cinematography.' },
          { title: 'Audio Integration', description: 'Syncing AI-generated visuals with Suno/Udio soundtracks.' }
        ],
        projects: [
          { 
            title: '30s Future Trailer', 
            goal: 'Produce a high-fidelity cinematic video trailer for a sci-fi idea.', 
            tools: ['Veo', 'Suno', 'CapCut'], 
            outcome: 'A complete 30-second sci-fi movie teaser with SFX.' 
          }
        ],
        materials: [
          {
            id: 'c202-words-into-worlds-t01-en',
            title: 'Words Into Worlds T01 (PDF)',
            type: 'pdf',
            mediaId: 'training/c202/en/words-into-worlds_T01',
            language: 'en',
          },
          {
            id: 'c202-future-director-video-t01-en',
            title: 'Future Director: The Magic of AI Video T01 (Video)',
            type: 'video',
            access: 'preview',
            mediaId: 'training/c202/en/future-director-ai-video-magic_T01',
            language: 'en',
          },
        ]
      },
      { 
        id: 'c203', title: 'AI Writing & Narrative', duration: '120m', type: 'creation', format: 'Online', 
        description: 'Mastering creative storytelling and high-impact writing with generative text agents.', skills: ['Narrative Design', 'Style Mimicry', 'Co-writing'],
        heroImage: getCourseHero('c203'),
        syllabus: [
          { title: 'The Hero\'s Journey AI', description: 'Using LLMs to map out complex story arcs and plot twists.' },
          { title: 'Style & Tone Control', description: 'Fine-tuning AI outputs to match specific literary styles.' },
          { title: 'Iterative Editing', description: 'Collaborative drafting: from concept to polished manuscript.' }
        ],
        projects: [
          { 
            title: 'AI Co-Authored Novella', 
            goal: 'Write a 3,000-word short story with AI assistance.', 
            tools: ['Claude', 'Sudowrite'], 
            outcome: 'A published digital novella with consistent character voices.' 
          }
        ],
        materials: [
          {
            id: 'c203-from-magic-to-mastery-t01-en',
            title: 'From Magic to Mastery T01 (PDF)',
            type: 'pdf',
            mediaId: 'training/c203/en/from-magic-to-mastery_T01',
            language: 'en',
          },
          {
            id: 'c203-writing-with-ai-video-t01-en',
            title: 'Writing with AI T01 (Video)',
            type: 'video',
            access: 'preview',
            mediaId: 'training/c203/en/writing-with-ai_T01',
            language: 'en',
          },
        ]
      },
      { 
        id: 'c204', title: 'AI Audio & Podcasts', duration: '150m', type: 'creation', format: 'Mixed', 
        theoryDuration: '45m', practiceDuration: '105m', description: 'Voice cloning, music generation, and automated podcast production.', skills: ['Audio Engineering', 'Voice Synthesis', 'Sound Design'],
        heroImage: getCourseHero('c204'),
        syllabus: [
          { title: 'Vocal Identity', description: 'Cloning and directing AI voices with emotion and cadence.' },
          { title: 'Music & Ambience', description: 'Generating custom background tracks and sound effects.' },
          { title: 'Podcast Automations', description: 'Using NotebookLM and ElevenLabs for rapid episode production.' }
        ],
        projects: [
          { 
            title: 'Daily Tech Podcast', 
            goal: 'Create a 5-minute daily news briefing podcast using AI only.', 
            tools: ['ElevenLabs', 'Suno', 'NotebookLM'], 
            outcome: 'A fully produced audio episode ready for Spotify/Apple.' 
          }
        ]
      },
      { 
        id: 'c205', title: 'AI Digital Humans & Avatars', duration: '165m', type: 'creation', format: 'Mixed', 
        theoryDuration: '45m', practiceDuration: '120m', description: 'Building hyper-realistic digital personas and lifelike avatars using generative visual and voice synchronization.', skills: ['HeyGen', 'D-ID', 'Lip Sync', 'Character Design'],
        heroImage: getCourseHero('c205'),
        syllabus: [
          { title: 'Avatar Generation', description: 'From prompt to high-fidelity persona: designing your digital self.' },
          { title: 'Lip-Sync & Expression', description: 'Synchronizing voice data with facial muscle movements for realism.' },
          { title: 'Interactive AI Humans', description: 'Connecting LLMs to avatars for real-time conversational agents.' }
        ],
        projects: [
          { 
            title: 'Virtual Brand Ambassador', 
            goal: 'Create a 60s video of a digital persona presenting a product idea.', 
            tools: ['HeyGen', 'Midjourney', 'ChatGPT'], 
            outcome: 'A professional-grade marketing video featuring a lifelike digital human.' 
          }
        ]
      }
    ],
    efficiency: [
      { 
        id: 'e301', title: 'AI Research & Writing', duration: '75m', type: 'efficiency', format: 'Online', 
        description: 'Accelerate reading and writing by 10x using research agents and LLMs.', skills: ['Perplexity', 'Claude', 'Note-taking'],
        heroImage: getCourseHero('e301'),
        syllabus: [
          { title: 'Search Grounding', description: 'Using search-enabled AI to find verified real-world data.' },
          { title: 'Synthesis Logic', description: 'Condensing 100+ pages of PDF into core actionable insights.' },
          { title: 'Creative Writing', description: 'Co-writing stories and essays with AI without losing your voice.' }
        ],
        projects: [
          { 
            title: 'Global Issue Briefing', 
            goal: 'Summarize a complex global issue with multi-source verification.', 
            tools: ['Perplexity', 'Notion'], 
            outcome: 'A comprehensive 3-page policy briefing created in 20 mins.' 
          }
        ]
      },
      { 
        id: 'e302', title: 'AI PPT Mastery', duration: '90m', type: 'efficiency', format: 'Mixed', 
        theoryDuration: '45m', practiceDuration: '45m', description: 'Transforming ideas into high-impact slide decks automatically.', skills: ['Information Design', 'Gamma', 'Structuring'],
        heroImage: getCourseHero('e302'),
        syllabus: [
          { title: 'Outline Extraction', description: 'Converting raw documents to logical presentation flows.' },
          { title: 'AI Visual Design', description: 'Auto-generating icons and layouts for readability.' },
          { title: 'Pitch Logic', description: 'Using AI to optimize the persuasive power of your slides.' }
        ],
        projects: [
          { 
            title: 'Startup Pitch Deck', 
            goal: 'Create a 10-slide high-end deck in under 15 minutes.', 
            tools: ['Gamma', 'Claude'], 
            outcome: 'A professional-grade investment pitch deck ready for demo.' 
          }
        ]
      },
      { 
        id: 'e303', title: 'AI Workflows (n8n/Coze)', duration: '120m', type: 'efficiency', format: 'Mixed', 
        theoryDuration: '60m', practiceDuration: '60m', description: 'Building automated processes and multi-node intelligent agents.', skills: ['Automation', 'No-code', 'Coze', 'n8n'],
        heroImage: getCourseHero('e303'),
        syllabus: [
          { title: 'Agentic Thinking', description: 'Designing bots that can plan, reason, and execute.' },
          { title: 'Data Pipelines', description: 'Connecting search, LLM, and output nodes together.' },
          { title: 'Trigger Logic', description: 'Automating responses to emails, messages, or news alerts.' }
        ],
        projects: [
          { 
            title: 'Daily News Summarizer', 
            goal: 'Build an agent that summarizes tech news to Telegram.', 
            tools: ['Coze', 'Telegram API'], 
            outcome: 'A working automation that saves users 30 mins daily.' 
          }
        ]
      }
    ],
    vibe: [
      { 
        id: 'v401', title: 'Vibe Principles', duration: 'Day 1', type: 'vibe', format: 'Offline', 
        description: 'The philosophy and practice of intuitive natural language coding and deployment.', skills: ['Workflow Strategy', 'Vibe Coding', 'Rapid Prototyping'],
        heroImage: getCourseHero('v401'),
        syllabus: [
          { title: 'The Vibe Mindset', description: 'Transitioning from "How to Code" to "What to Build".' },
          { title: 'Iterative Debugging', description: 'Fixing complex errors using conversation and intuition.' },
          { title: 'Cloud Instant-Launch', description: 'Deploying full-stack apps to the global cloud in seconds.' }
        ],
        projects: [
          { 
            title: 'Personal Dashboard', 
            goal: 'Build and launch a full-stack web app from a prompt.', 
            tools: ['Bolt.new', 'Supabase'], 
            outcome: 'A live, scalable web application running in production.' 
          }
        ]
      },
      { 
        id: 'v402', title: 'Vibe Tools & Workflows', duration: 'Day 2', type: 'vibe', format: 'Offline', 
        description: 'Mastering AI-native IDEs and the iterative feedback loop for high-speed creation.', skills: ['Cursor', 'Bolt.new', 'GitHub'],
        heroImage: getCourseHero('v402'),
        syllabus: [
          { title: 'AI-Native IDEs', description: 'Using Cursor to generate code and refactor logic in real-time.' },
          { title: 'Iterative Prompting', description: 'Conversing with your codebase to add complex features.' },
          { title: 'Version Control with AI', description: 'Using AI to write commits and manage merge conflicts.' }
        ],
        projects: [
          { 
            title: 'Smart Task Manager', 
            goal: 'Build a multi-page productivity tool using Bolt and Cursor.', 
            tools: ['Cursor', 'Tailwind CSS'], 
            outcome: 'A functional, stylish task app built in 60 minutes.' 
          }
        ]
      },
      { 
        id: 'v403', title: 'Config & Deployment', duration: 'Day 3', type: 'vibe', format: 'Offline', 
        description: 'Connecting to databases, managing environment variables, and professional hosting.', skills: ['Supabase', 'Vercel', 'Backend Logic'],
        heroImage: getCourseHero('v403'),
        syllabus: [
          { title: 'Database for Humans', description: 'Setting up Supabase tables using natural language queries.' },
          { title: 'Secrets Management', description: 'Handling API keys and environment variables securely.' },
          { title: 'CI/CD Pipelines', description: 'Automating your deployment flow from GitHub to Vercel.' }
        ],
        projects: [
          { 
            title: 'AI Data Hub', 
            goal: 'Connect a persistent database to your web application.', 
            tools: ['Supabase', 'Vercel'], 
            outcome: 'A production-ready app that stores and retrieves data.' 
          }
        ]
      },
      { 
        id: 'v404', title: 'Demo & Sharing', duration: 'Day 4-5', type: 'vibe', format: 'Offline', 
        description: 'Polishing your project, documenting the journey, and presenting to a global audience.', skills: ['Storytelling', 'UX Design', 'Performance'],
        heroImage: getCourseHero('v404'),
        syllabus: [
          { title: 'Polish & UX', description: 'Fine-tuning animations and responsive design for a premium feel.' },
          { title: 'The Tech Pitch', description: 'Storytelling techniques for explaining your AI innovation.' },
          { title: 'Community Launch', description: 'Publishing your project and handling user feedback loops.' }
        ],
        projects: [
          { 
            title: 'Global Demo Day', 
            goal: 'Publicly launch your app and deliver a 3-minute pitch.', 
            tools: ['Loom', 'Product Hunt'], 
            outcome: 'A live project portfolio item with documented user impact.' 
          }
        ]
      }
    ]
  }
};

const trainingVideoAccessByMediaId = (() => {
  const map = new Map<string, VideoAccess>();
  const addModule = (module: Module) => {
    (module.materials || []).forEach((material) => {
      if (material.type !== 'video') return;
      map.set(material.mediaId, material.access);
    });
  };
  const addSystem = (system: TrainingSystem) => {
    [...system.foundations, ...system.creation, ...system.efficiency, ...system.vibe].forEach(addModule);
  };

  addSystem(TRAINING_SYSTEM.zh);
  addSystem(TRAINING_SYSTEM.en);

  return map;
})();

export function getTrainingVideoAccess(mediaId: string): VideoAccess | null {
  return trainingVideoAccessByMediaId.get(mediaId) ?? null;
}

export function getTrainingCourseIdFromMediaId(mediaId: string): string | null {
  const match = mediaId.match(/^training\/([^/]+)\//);
  return match ? match[1] : null;
}
