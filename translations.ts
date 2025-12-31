
export type Language = 'en' | 'cn';

export const translations = {
  en: {
    nav: {
      home: 'Home',
      projects: 'Projects',
      camp: 'Winter Camp',
      training: 'Training',
      aiImage: 'AI Image',
      aiVideo: 'AI Video',
      about: 'About',
      apply: 'Signup',
      signin: 'Sign In'
    },
    hero: {
      tagline: 'Empowering the Next Generation',
      title: 'Master AI Skills. Create the Future',
      description: 'Master the power of the AI world. Use AI to understand, express, solve, and create the future.',
      cta: 'Start Your Journey'
    },
    coreValue: {
      title: 'Our Core Value',
      content: 'Empower students to thrive in the AI-driven future by using AI to understand the world, express ideas, solve problems, and create meaningful projects.',
      imageTagline: 'Creator Portfolio',
      imageCaption: 'A glimpse into student-made AI projects.',
      statLabel: 'Projects Built',
      statValue: '20+'
    },
    projects: {
      title: 'Real-World AI Projects',
      subtitle: 'Not just playing with tools, but creating with intelligence.',
      p1: {
        title: 'AI Poster for the Future',
        desc: 'Create a future-themed poster using AI image generation to express a real-world idea or viewpoint.'
      },
      p2: {
        title: 'AI Future Video',
        desc: 'Produce a 15–30 second AI-generated video to tell a future-focused story or innovative solution.'
      },
      p3: {
        title: 'AI Mini App',
        desc: 'Build a simple AI-powered web app to solve a small but real global problem through coding and logic.'
      }
    },
    camp: {
      title: 'Winter AI Creation Camp 2026',
      date: 'Jan 20 – Jan 24, 2026',
      format: '5-Day Offline Immersive Experience',
      benefits: {
        title: 'What You Will Achieve',
        items: [
          'Complete 1 Capstone AI Project',
          'Future AI Creator Professional Certificate',
          'Professional Portfolio of Your Work'
        ]
      },
      cta: 'Register for Winter Camp'
    },
    form: {
      title: 'Application Form',
      subtitle: 'Apply for the 2026 Winter AI Creation Camp',
      name: 'Student Name',
      age: 'Age',
      city: 'City',
      school: 'School',
      contactMobile: 'Parent Mobile / WeChat',
      contactEmail: 'Parent Email',
      contactEmailNote: '',
      interests: 'Areas of Interest',
      int1: 'AI Image',
      int2: 'AI Video',
      int3: 'AI App',
      submit: 'Submit Application',
      submitting: 'Submitting...',
      error: 'Submission failed. Please try again later.',
      success: 'Application Received! We will contact you soon.'
    },
    about: {
      title: 'About Us',
      vision: {
        title: 'Our Vision',
        desc: 'We believe AI is a fundamental capability of the future. Our goal is to shift students from passive consumers to active creators.'
      },
      method: {
        title: 'PBL Teaching',
        desc: 'Project-Based Learning. We focus on real-world problems and creative output, combining art, technology, and social impact.'
      }
    }
  },
  cn: {
    nav: {
      home: '首页',
      projects: '项目展示',
      camp: '寒假创作营',
      training: '训练课程',
      aiImage: 'AI 图像',
      aiVideo: 'AI 视频',
      about: '关于我们',
      apply: '注册',
      signin: '登录'
    },
    hero: {
      tagline: '赋能下一代创造者',
      title: '掌握 AI ，创造未来',
      description: '掌握面向未来 AI 世界的能力，用 AI 理解世界、表达观点、解决问题、创造未来。',
      cta: '开启探索之旅'
    },
    coreValue: {
      title: '核心理念',
      content: '让孩子掌握面向未来 AI 世界的能力，用 AI 理解世界、表达观点、解决问题、创造未来。',
      imageTagline: '创作作品集',
      imageCaption: '一览学生 AI 项目成果。',
      statLabel: '项目成果',
      statValue: '20+'
    },
    projects: {
      title: '真实 AI 项目展示',
      subtitle: '不仅是玩工具，更是用 AI 创造真实价值。',
      p1: {
        title: '未来主题 AI 海报',
        desc: '用 AI 生图设计一张面向全球的未来主题海报，表达一个真实问题或观点。'
      },
      p2: {
        title: 'AI 未来短视频',
        desc: '用 AI 生成 15–30 秒短视频，讲述一个关于未来社会的故事 or 解决方案。'
      },
      p3: {
        title: 'AI 微型应用',
        desc: '设计一个简单网页或 AI 应用，解决一个小而真实的全球问题。'
      }
    },
    camp: {
      title: '2026 冬季线下 AI 创作营',
      date: '2026 年 1 月 20 日 – 1 月 24 日',
      format: '线下 5 天沉浸式 AI 创作体验',
      benefits: {
        title: '活动收获',
        items: [
          '完成 1 个完整的 AI 作品集项目',
          '获得 AI 未来能力官方结业证书',
          '全方位的项目展示与成果产出'
        ]
      },
      cta: '预约寒假名额'
    },
    form: {
      title: '报名申请表',
      subtitle: '申请 2026 年寒假 AI 创作营席位',
      name: '学生姓名',
      age: '年龄',
      city: '城市',
      school: '学校',
      contactMobile: '家长手机 / 微信',
      contactEmail: '电子邮箱',
      contactEmailNote: '(选填)',
      interests: '感兴趣的方向',
      int1: 'AI 图像',
      int2: 'AI 视频',
      int3: 'AI 编程',
      submit: '提交申请',
      submitting: '提交中...',
      error: '提交失败，请稍后重试。',
      success: '申请已收到！我们会尽快与您取得联系。'
    },
    about: {
      title: '关于我们',
      vision: {
        title: '教育愿景',
        desc: '我们相信 AI 是未来的基础能力。我们的目标是让学生从技术的被动消费者转变为主动的创造者。'
      },
      method: {
        title: 'PBL 教学法',
        desc: '项目制教学模式。我们关注真实世界的问题和创意产出，融合艺术、技术与社会影响力。'
      }
    }
  }
};
