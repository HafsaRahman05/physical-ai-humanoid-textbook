---
id: module-2-digital-twins-simulation
title: ماڈیول 2 - Digital Twins - Simulation & Sensors
sidebar_position: 2
description: Digital twins، simulation environments، اور sensor integration کا تعارف humanoid robotics کے لیے، covering کہ virtual replicas کیسے safe testing اور optimization کو ممکن بناتے ہیں۔
tags: [digital-twins, simulation, sensors, humanoid-robotics, ros2-integration]
learning_objectives: [lo-004, lo-005, lo-006]
topic_category: digital-twin
---

# ماڈیول 2: Digital Twins - Simulation & Sensors

جسمانی مصنوعی ذہانت اور انسانی روبوٹکس کی درسی کتاب کے ماڈیول 2 میں خوش آمدید۔ یہ ماڈیول explore کرتا ہے کہ digital twins، simulation environments، اور sensors کیسے مل کر safe، efficient development کو ممکن بناتے ہیں humanoid robots کا۔

## Overview

Modern humanoid robotics development virtual representations پر rely کرتا ہے physical systems کی safe testing، optimization، اور validation کے لیے physical deployment سے پہلے۔ یہ ماڈیول آپ کو سمجھنے میں مدد کرے گا:

- Digital twins کیا ہیں اور وہ traditional simulations سے کیسے مختلف ہیں
- Simulation environments کیسے physics، sensors، اور environments model کرتے ہیں
- مختلف types کے sensors کیسے ROS 2 کے ساتھ integrate ہوتے ہیں robot perception فراہم کرنے کے لیے
- Digital twins کے practical applications humanoid robotics development میں

## Learning Objectives

اس ماڈیول کے آخر تک، آپ قابل ہوں گے:

1. **Digital twins کی وضاحت** اور physical robots کے ساتھ ان کا relationship، انہیں traditional simulations سے distinguish کرتے ہوئے
2. **Key components کی شناخت** simulation environments کے (physics engines، sensor models، environments) اور explain کریں کہ وہ safe testing کو کیسے ممکن بناتے ہیں
3. **Sensor integration describe کریں** ROS 2 کے ساتھ، including کہ مختلف sensor types (vision، proprioception، tactile) کیسے data فراہم کرتے ہیں robot perception اور decision-making کے لیے
4. **Digital twin concepts apply کریں** humanoid robotics use cases پر جیسے gait optimization، manipulation planning، اور safety testing
5. **ماڈیول 2 content navigate کریں** اور cross-references استعمال کریں ماڈیول 1 پر ROS 2 context کے لیے

## پیشگی ضروریات

اس ماڈیول کو شروع کرنے سے پہلے، آپ کے پاس ہونا چاہیے:

- **ماڈیول 1 مکمل (ROS 2 fundamentals)** - ROS 2 concepts کی سمجھ including nodes، topics، services، اور actions
- **Python programming knowledge** - Python syntax، functions، classes، اور basic programming concepts سے واقفیت
- **بنیادی روبوٹکس کے تصورات** - سمجھنا کہ روبوٹس کیا ہیں، basic components جیسے sensors اور actuators

## ماڈیول کی ساخت

یہ ماڈیول درج ذیل sections میں منظم ہے:

1. **[تعارف](/ur/modules/module-2-digital-twins-simulation/introduction)** - Digital twins، simulation، اور sensors کا overview
2. **[Digital Twins](/ur/modules/module-2-digital-twins-simulation/digital-twins)** - Digital twins کو سمجھنا اور ان کے applications
3. **[Simulation Fundamentals](/ur/modules/module-2-digital-twins-simulation/simulation-fundamentals)** - Simulation environments کیسے کام کرتے ہیں
4. **[Sensor Integration](/ur/modules/module-2-digital-twins-simulation/sensor-integration)** - Sensor types اور ROS 2 data flow
5. **[Humanoid Applications](/ur/modules/module-2-digital-twins-simulation/humanoid-applications)** - Digital twins کے لیے practical use cases
6. **[Simulation to Deployment](/ur/modules/module-2-digital-twins-simulation/simulation-to-deployment)** - Virtual testing سے physical deployment تک workflow
7. **[Glossary](/ur/modules/module-2-digital-twins-simulation/glossary)** - کلیدی اصطلاحات کی تعریفیں

## Estimated Reading Time

یہ ماڈیول **1-2 گھنٹے** میں مکمل کرنے کے لیے ڈیزائن کیا گیا ہے average reader کے لیے۔

## Next Steps

[تعارف](/ur/modules/module-2-digital-twins-simulation/introduction) سے شروع کریں تاکہ سمجھیں کہ digital twins، simulation، اور sensors کیسے مل کر کام کرتے ہیں humanoid robotics development میں۔

## Related Modules

- **[ماڈیول 1: روبوٹک اعصابی نظام (ROS 2)](/ur/modules/module-1-ros2-nervous-system/)** - Prerequisite knowledge ROS 2 communication patterns پر جو sensor integration کے لیے استعمال ہوتے ہیں
