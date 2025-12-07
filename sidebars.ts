import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  textbookSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Modules',
      items: [
        {
          type: 'category',
          label: 'Module 1: The Robotic Nervous System (ROS 2)',
          items: [
            'modules/module-1-ros2-nervous-system/module-1-ros2-nervous-system',
            'modules/module-1-ros2-nervous-system/introduction',
            'modules/module-1-ros2-nervous-system/ros2-fundamentals',
            'modules/module-1-ros2-nervous-system/communication-patterns',
            'modules/module-1-ros2-nervous-system/humanoid-applications',
            'modules/module-1-ros2-nervous-system/workspace-overview',
            'modules/module-1-ros2-nervous-system/glossary',
          ],
        },
        {
          type: 'category',
          label: 'Module 2: Digital Twins - Simulation & Sensors',
          items: [
            'modules/module-2-digital-twins-simulation/module-2-digital-twins-simulation',
            'modules/module-2-digital-twins-simulation/introduction',
            'modules/module-2-digital-twins-simulation/digital-twins',
            'modules/module-2-digital-twins-simulation/simulation-fundamentals',
            'modules/module-2-digital-twins-simulation/sensor-integration',
            'modules/module-2-digital-twins-simulation/humanoid-applications',
            'modules/module-2-digital-twins-simulation/simulation-to-deployment',
            'modules/module-2-digital-twins-simulation/glossary',
          ],
        },
        {
          type: 'category',
          label: 'Module 3: The AI-Robot Brain (NVIDIA Isaac™)',
          items: [
            'modules/module-3-ai-robot-brain/module-3-ai-robot-brain',
            'modules/module-3-ai-robot-brain/introduction',
            'modules/module-3-ai-robot-brain/ai-robot-brain-concept',
            'modules/module-3-ai-robot-brain/isaac-sim',
            'modules/module-3-ai-robot-brain/isaac-ros',
            'modules/module-3-ai-robot-brain/nav2-path-planning',
            'modules/module-3-ai-robot-brain/integrated-applications',
            'modules/module-3-ai-robot-brain/glossary',
          ],
        },
        {
          type: 'category',
          label: 'Module 4: Vision-Language-Action (VLA)',
          items: [
            'modules/module-4-vision-language-action/module-4-vision-language-action',
            'modules/module-4-vision-language-action/introduction',
            'modules/module-4-vision-language-action/llm-robotics-convergence',
            'modules/module-4-vision-language-action/voice-to-action',
            'modules/module-4-vision-language-action/cognitive-planning',
            'modules/module-4-vision-language-action/safety-validation',
            'modules/module-4-vision-language-action/capstone-project',
            'modules/module-4-vision-language-action/module-integration',
            'modules/module-4-vision-language-action/glossary',
          ],
        },
      ],
    },
  ],
};

export default sidebars;

