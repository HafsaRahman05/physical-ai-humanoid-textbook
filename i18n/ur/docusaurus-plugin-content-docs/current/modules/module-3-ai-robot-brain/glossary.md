---
id: glossary
title: Glossary
sidebar_position: 7
description: ماڈیول 3 - The AI-Robot Brain (NVIDIA Isaac™) کے لیے کلیدی اصطلاحات اور تعریفیں
tags: [glossary, terminology, definitions]
---

# Glossary

یہ glossary ماڈیول 3 میں استعمال ہونے والی کلیدی اصطلاحات کی تعریف کرتا ہے۔ اصطلاحات ماڈیول content میں پہلی بار استعمال پر تعریف کی جاتی ہیں، اور یہ glossary quick lookup کے لیے reference کے طور پر کام کرتا ہے۔

## B

### Bipedal Movement Constraints

**Definition**: Limitations اور requirements specific to two-legged humanoid movement جو path planning اور navigation affect کرتے ہیں۔ یہ constraints شامل کرتے ہیں balance requirements (center of mass support polygon کے اندر رہنا چاہیے)، foot placement constraints (ہر step flat، stable surfaces پر land ہونا چاہیے)، terrain adaptation needs (maximum slope limits، surface detection)، اور stability considerations (movement کے دوران balance برقرار رکھنا)۔

**Context**: Humanoid robotics میں استعمال ہوتا ہے سمجھنے کے لیے کہ کیوں path planning bipedal robots کے لیے wheeled robots سے مختلف ہے۔

**Related**: [Path Planning](#path-planning)، [Humanoid Navigation](#humanoid-navigation)

**Module Reference**: تفصیلی وضاحت کے لیے [Nav2 Path Planning section](/ur/modules/module-3-ai-robot-brain/nav2-path-planning) دیکھیں۔

## H

### Hardware Acceleration

**Definition**: Computation specialized hardware (GPUs) پر performed general-purpose processors (CPUs) کے بجائے improved performance achieve کرنے کے لیے۔ Hardware acceleration parallel processing کو ممکن بناتا ہے جو dramatically computationally intensive tasks کو speed up کرتا ہے جیسے image processing اور perception algorithms۔

**Context**: Essential ہے real-time VSLAM اور perception processing enable کرنے کے لیے humanoid robots میں۔

**Related**: [Visual SLAM (VSLAM)](#visual-slam-vslam)، [Real-Time Navigation](#real-time-navigation)

**Module Reference**: تفصیلی وضاحت کے لیے [Isaac ROS section](/ur/modules/module-3-ai-robot-brain/isaac-ros) دیکھیں۔

### Humanoid Navigation

**Definition**: Humanoid robots کا process environments کے ذریعے autonomously move کرنے کا، bipedal movement constraints account کرتے ہوئے جیسے balance، foot placement، اور terrain adaptation۔ Humanoid navigation path planning درکار کرتا ہے جو wheeled robots سے مختلف ہے discrete foot placements اور balance maintenance کی ضرورت کی وجہ سے۔

**Context**: Autonomous humanoid robots کے لیے perception اور planning systems integrate کرنے کا goal۔

**Related**: [Path Planning](#path-planning)، [Bipedal Movement Constraints](#bipedal-movement-constraints)

## N

### Nav2 (Navigation2)

**Definition**: ایک ROS 2 navigation framework جو path planning، obstacle avoidance، اور navigation capabilities فراہم کرتا ہے۔ Nav2 bipedal humanoid robots کے لیے adaptations شامل کرتا ہے جو balance requirements، foot placement constraints، اور terrain adaptation needs account کرتے ہیں۔

**Context**: Humanoid robots میں path planning کے لیے استعمال ہوتا ہے، safe اور efficient routes compute کرتے ہوئے جو humanoid-specific movement constraints account کرتے ہیں۔

**Related**: [Path Planning](#path-planning)، [Bipedal Movement Constraints](#bipedal-movement-constraints)

**Module Reference**: تفصیلی وضاحت کے لیے [Nav2 Path Planning section](/ur/modules/module-3-ai-robot-brain/nav2-path-planning) دیکھیں۔

## P

### Path Planning

**Definition**: Robot movement کے لیے safe اور efficient paths compute کرنے کا process start location سے goal location تک۔ Humanoid robots کے لیے، path planning humanoid-specific constraints consider کرنا چاہیے including balance requirements، foot placement constraints، terrain adaptation needs، اور obstacle avoidance۔

**Context**: Essential ہے autonomous navigation enable کرنے کے لیے humanoid robots میں۔

**Related**: [Nav2](#nav2-navigation2)، [Bipedal Movement Constraints](#bipedal-movement-constraints)، [Humanoid Navigation](#humanoid-navigation)

**Module Reference**: تفصیلی وضاحت کے لیے [Nav2 Path Planning section](/ur/modules/module-3-ai-robot-brain/nav2-path-planning) دیکھیں۔

### Photorealistic Simulation

**Definition**: Virtual environments realistic lighting، textures، materials، اور visual appearance کے ساتھ created جو closely real-world conditions سے match کرتے ہیں۔ Photorealistic simulation visual fidelity emphasize کرتا ہے training data generate کرنے کے لیے جو visually indistinguishable ہے real-world images سے۔

**Context**: Isaac Sim میں استعمال ہوتا ہے synthetic training data create کرنے کے لیے perception algorithms کے لیے جو real-world appearance سے match کرتا ہے۔

**Related**: [Synthetic Training Data](#synthetic-training-data)، [NVIDIA Isaac Sim](#nvidia-isaac-sim)

**Module Reference**: تفصیلی وضاحت کے لیے [NVIDIA Isaac Sim section](/ur/modules/module-3-ai-robot-brain/isaac-sim) دیکھیں۔

## R

### Real-Time Navigation

**Definition**: Robot navigation جو sensor data process کرتا ہے اور navigation decisions compute کرتا ہے fast enough smooth، responsive robot movement enable کرنے کے لیے۔ Real-time navigation processing delays کو minimal درکار کرتا ہے (typically sensor frame rates سے match کرتے ہوئے) jerky motion یا unsafe behavior avoid کرنے کے لیے۔

**Context**: Essential ہے autonomous humanoid robots کے لیے جو dynamically navigate کرنا چاہیے changing environments کے ذریعے۔

**Related**: [Hardware Acceleration](#hardware-acceleration)، [Visual SLAM (VSLAM)](#visual-slam-vslam)

**Module Reference**: تفصیلی وضاحت کے لیے [Isaac ROS section](/ur/modules/module-3-ai-robot-brain/isaac-ros) دیکھیں۔

## S

### Synthetic Training Data

**Definition**: Data simulation سے generated (physical systems سے collected کے بجائے) training کے لیے AI/ML algorithms کے لیے۔ Synthetic training data شامل کرتا ہے images، depth maps، sensor readings، اور ground truth annotations programmatically created virtual environments میں۔ یہ data algorithm training کو ممکن بناتا ہے physical data collection درکار کیے بغیر۔

**Context**: Isaac Sim میں استعمال ہوتا ہے training datasets generate کرنے کے لیے perception algorithms کے لیے، massive real-world data collection کی ضرورت eliminate کرتے ہوئے۔

**Related**: [Photorealistic Simulation](#photorealistic-simulation)، [NVIDIA Isaac Sim](#nvidia-isaac-sim)

**Module Reference**: تفصیلی وضاحت کے لیے [NVIDIA Isaac Sim section](/ur/modules/module-3-ai-robot-brain/isaac-sim) دیکھیں۔

## V

### Visual SLAM (VSLAM)

**Definition**: ایک system جو visual sensors (cameras) استعمال کرتا ہے simultaneously environments map کرنے اور robot localize کرنے کے لیے ان maps میں۔ VSLAM camera images process کرتا ہے visual features extract کرنے، robot movement track کرنے، environment maps build کرنے، اور robot position determine کرنے کے لیے—all in real-time۔

**Context**: Humanoid robots کو enable کرتا ہے اپنے environment سمجھنے اور visual information alone استعمال کرتے ہوئے navigate کرنے کے لیے۔

**Related**: [Hardware Acceleration](#hardware-acceleration)، [Isaac ROS](#isaac-ros)، [Real-Time Navigation](#real-time-navigation)

**Module Reference**: تفصیلی وضاحت کے لیے [Isaac ROS section](/ur/modules/module-3-ai-robot-brain/isaac-ros) دیکھیں۔

## Key Tool Definitions

### Isaac ROS

**Definition**: Hardware-accelerated ROS 2 packages کا collection جو GPU computing leverage کرتا ہے perception اور navigation tasks process کرنے کے لیے real-time میں۔ Humanoid robots کے لیے، Isaac ROS primarily Visual SLAM (VSLAM) capabilities فراہم کرتا ہے جو real-time environmental understanding اور robot localization کو ممکن بناتے ہیں۔

**Context**: AI-robot brain کا perception component فراہم کرتا ہے، real-time visual understanding enable کرتے ہوئے۔

**Related**: [Visual SLAM (VSLAM)](#visual-slam-vslam)، [Hardware Acceleration](#hardware-acceleration)

**Module Reference**: تفصیلی وضاحت کے لیے [Isaac ROS section](/ur/modules/module-3-ai-robot-brain/isaac-ros) دیکھیں۔

### NVIDIA Isaac Sim

**Definition**: ایک photorealistic simulation platform جو highly realistic virtual environments create کرتا ہے accurate lighting، textures، materials، اور physics کے ساتھ۔ Isaac Sim synthetic data generation enable کرتا ہے training کے لیے perception algorithms کے لیے، labeled training datasets programmatically create کرتے ہوئے physical data collection کے بغیر۔

**Context**: AI-robot brain کا training component فراہم کرتا ہے، synthetic data generate کرتے ہوئے perception algorithm development کے لیے۔

**Related**: [Photorealistic Simulation](#photorealistic-simulation)، [Synthetic Training Data](#synthetic-training-data)

**Module Reference**: تفصیلی وضاحت کے لیے [NVIDIA Isaac Sim section](/ur/modules/module-3-ai-robot-brain/isaac-sim) دیکھیں۔

---

*یہ glossary expand ہوگا جیسے additional modules textbook میں شامل کیے جائیں گے۔*
