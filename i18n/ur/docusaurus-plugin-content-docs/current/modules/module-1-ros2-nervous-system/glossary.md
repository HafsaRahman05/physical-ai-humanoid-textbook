---
id: glossary
title: Glossary
sidebar_position: 6
description: ماڈیول 1 - روبوٹک اعصابی نظام (ROS 2) کے لیے کلیدی اصطلاحات اور تعریفیں
tags: [glossary, terminology, definitions]
---

# Glossary

یہ glossary ماڈیول 1 میں استعمال ہونے والی کلیدی اصطلاحات کی تعریف کرتا ہے۔ اصطلاحات ماڈیول content میں پہلی بار استعمال پر تعریف کی جاتی ہیں، اور یہ glossary quick lookup کے لیے reference کے طور پر کام کرتا ہے۔

## A

### Action
Long-running tasks کے لیے ایک ROS 2 communication pattern جنہیں feedback کی ضرورت ہے۔ Actions asynchronous ہیں اور execution کے دوران status updates فراہم کرتے ہیں، انہیں navigation یا manipulation جیسے tasks کے لیے ideal بناتے ہیں جو complete ہونے میں وقت لیتے ہیں۔

**Related**: [Service](/ur/modules/module-1-ros2-nervous-system/ros2-fundamentals#services)، [Topic](/ur/modules/module-1-ros2-nervous-system/ros2-fundamentals#topics)

## N

### Node
ROS 2 میں ایک process جو computation انجام دیتا ہے۔ Nodes ایک ROS 2 system کے fundamental building blocks ہیں، ہر ایک ایک specific function کے لیے ذمہ دار ہے (مثلاً، sensor data processing، actuators controlling، motion planning)۔

**Related**: [Topic](/ur/modules/module-1-ros2-nervous-system/ros2-fundamentals#topics)، [Service](/ur/modules/module-1-ros2-nervous-system/ros2-fundamentals#services)

## P

### Publish-Subscribe Pattern
ایک communication pattern جہاں nodes topics پر messages publish کرتے ہیں، اور دوسرے nodes subscribe کرتے ہیں ان messages کو receive کرنے کے لیے۔ یہ robot components کے درمیان decoupled، asynchronous communication کو ممکن بناتا ہے۔

**Related**: [Topic](/ur/modules/module-1-ros2-nervous-system/ros2-fundamentals#topics)

## R

### ROS 2 (Robot Operating System 2)
Robotics کے لیے ایک middleware framework جو communication infrastructure، tools، اور libraries فراہم کرتا ہے distributed robotic systems بنانے کے لیے۔ ROS 2 روبوٹ کے مختلف components کو effectively communicate اور coordinate کرنے کے قابل بناتا ہے۔

**Related**: [Node](/ur/modules/module-1-ros2-nervous-system/ros2-fundamentals#nodes)، [Topic](/ur/modules/module-1-ros2-nervous-system/ros2-fundamentals#topics)

## S

### Service
Synchronous request-response interactions کے لیے ایک ROS 2 communication pattern۔ Services اس وقت استعمال ہوتے ہیں جب ایک node کو دوسرے node سے specific action یا information request کرنے اور response کا انتظار کرنے کی ضرورت ہو۔

**Related**: [Action](/ur/modules/module-1-ros2-nervous-system/ros2-fundamentals#actions)، [Topic](/ur/modules/module-1-ros2-nervous-system/ros2-fundamentals#topics)

## T

### Topic
ROS 2 میں ایک named communication channel جو publish-subscribe pattern استعمال کرتا ہے۔ Topics nodes کو multiple subscribers کو messages بھیجنے کے قابل بناتے ہیں بغیر جانے کہ کون information receive کر رہا ہے۔

**Related**: [Publish-Subscribe Pattern](/ur/modules/module-1-ros2-nervous-system/communication-patterns#publish-subscribe-pattern-topics)، [Node](/ur/modules/module-1-ros2-nervous-system/ros2-fundamentals#nodes)

---

*یہ glossary expand ہوگا جیسے جیسے textbook میں additional modules شامل کیے جائیں گے۔*
