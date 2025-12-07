---
id: glossary
title: Glossary
sidebar_position: 7
description: ماڈیول 2 - Digital Twins، Simulation & Sensors کے لیے کلیدی اصطلاحات اور تعریفیں
tags: [glossary, terminology, definitions]
---

# Glossary

یہ glossary ماڈیول 2 میں استعمال ہونے والی کلیدی اصطلاحات کی تعریف کرتا ہے۔ اصطلاحات ماڈیول content میں پہلی بار استعمال پر تعریف کی جاتی ہیں، اور یہ glossary quick lookup کے لیے reference کے طور پر کام کرتا ہے۔

## Navigation

- [Digital Twins](#digital-twins) - Physical systems کے virtual replicas
- [Simulation](#simulation) - Testing کے لیے virtual environments
- [Sensors](#sensor-types) - Information جمع کرنے کے لیے devices
- [Applications](#gait-optimization) - Practical use cases

## D

### Digital Twin
**Definition**: ایک physical system کا virtual replica جو اپنے real-world counterpart کے ساتھ synchronized connection برقرار رکھتا ہے۔ Digital twins simple simulations سے آگے جاتے ہیں continuous synchronization، real-time updates، اور comprehensive system representation فراہم کر کے۔ وہ safe testing، optimization، اور predictive maintenance کو ممکن بناتے ہیں۔

**Context**: Humanoid robotics میں استعمال ہوتا ہے safe testing اور optimization کو ممکن بنانے کے لیے physical hardware کے بغیر۔

**Related**: [Virtual Replica](#virtual-replica)، [Simulation](#simulation)، [Synchronization](#synchronization)

**Module Reference**: تفصیلی وضاحت کے لیے [Digital Twins section](/ur/modules/module-2-digital-twins-simulation/digital-twins) دیکھیں۔

## E

### Environment Modeling
دنیا کی 3D representations بنانے کا process جہاں robots operate کرتے ہیں، surfaces، objects، obstacles، اور environmental conditions شامل کرتے ہوئے۔ Environment models geometry، materials، lighting، اور dynamics define کرتے ہیں virtual spaces کی۔

**Context**: Realistic simulation environments بنانے کے لیے essential جہاں robots test کیے جا سکتے ہیں۔

**Related**: [Simulation](#simulation)، [Physics Engine](#physics-engine)

## P

### Physics Engine
ایک computational system جو virtual environment میں physical laws (gravity، collisions، dynamics) simulate کرتا ہے۔ Physics engines calculate کرتے ہیں کہ objects کیسے move، collide، اور interact کرتے ہیں physics principles کی بنیاد پر، simulation میں realistic robot behavior کو ممکن بناتے ہوئے۔

**Context**: Simulation environments کا core component جو robot dynamics اور motion compute کرتا ہے۔

**Related**: [Simulation](#simulation)، [Environment Modeling](#environment-modeling)

## G

### Gait Optimization
Systematic testing اور evaluation کے ذریعے humanoid robots کے لیے optimal walking patterns تلاش کرنے کا process۔ Digital twins safe، rapid testing کو ممکن بناتے ہیں many gait configurations کا solutions تلاش کرنے کے لیے جو stability، speed، اور energy efficiency balance کرتے ہیں۔

**Context**: Humanoid robots میں effective walking behaviors develop کرنے کے لیے essential۔

**Related**: [Digital Twin](#digital-twin)، [Simulation](#simulation)

## M

### Manipulation Planning
یہ determine کرنے کا process کہ humanoid robots objects کو کیسے grasp اور manipulate کریں، grasp pose selection، trajectory planning، اور force control شامل کرتے ہوئے۔ Digital twins manipulation strategies safely test کرنے کو ممکن بناتے ہیں physical implementation سے پہلے۔

**Context**: Humanoid robots کو اپنے environment میں objects کے ساتھ interact کرنے کے قابل بنانے کے لیے critical۔

**Related**: [Digital Twin](#digital-twin)، [Simulation](#simulation)

## S

### Safety Testing
یہ validate کرنے کا process کہ humanoid robots safely operate کرتے ہیں، خاص طور پر scenarios میں جو humans یا valuable equipment شامل کرتے ہیں۔ Digital twins comprehensive safety testing کو ممکن بناتے ہیں physical risk کے بغیر، failure scenarios، emergency stops، اور collision responses شامل کرتے ہوئے۔

**Context**: Humanoid robots کی safe deployment ensure کرنے کے لیے essential۔

**Related**: [Digital Twin](#digital-twin)، [Simulation](#simulation)

### Sensor Simulation
Virtual sensors بنانے کا process جو physical sensors کے behavior کو replicate کرتے ہیں۔ Virtual sensors simulation environment سے data capture کرتے ہیں، sensor characteristics apply کرتے ہیں (noise، latency، resolution)، اور data format کرتے ہیں physical sensor output سے match کرنے کے لیے۔

**Context**: Perception algorithms test کرنے اور training data generate کرنے کو ممکن بناتا ہے physical hardware کے بغیر۔

**Related**: [Simulation](#simulation)، [Physics Engine](#physics-engine)

### Simulation
ایک virtual environment جہاں robots realistic physics، sensor models، اور environmental conditions کے ساتھ operate کر سکتے ہیں۔ Simulations scenarios test کرنے کو ممکن بناتے ہیں physical hardware کے بغیر، لیکن digital twins سے مختلف ہیں اس میں کہ وہ typically standalone ہیں اور physical systems کے ساتھ continuously synchronized نہیں ہوتے۔

**Context**: Physical deployment سے پہلے virtual environments میں robot behavior test کرنے کے لیے استعمال ہوتا ہے۔

**Related**: [Digital Twin](#digital-twin)، [Physics Engine](#physics-engine)، [Sensor Simulation](#sensor-simulation)

### Synchronization
Digital twin اور اس کے physical counterpart کے درمیان state alignment برقرار رکھنے کا process۔ Synchronization real-time یا near-real-time ہو سکتا ہے، یقینی بناتے ہوئے کہ digital twin physical system کی current state accurately reflect کرتا ہے۔

**Context**: Digital twins کے لیے critical physical systems کی accurate representation برقرار رکھنے کے لیے۔

**Related**: [Digital Twin](#digital-twin)

## R

### ROS 2 Integration
Sensors کو ROS 2 communication framework سے connect کرنے کا process، sensor data کو topics کے ذریعے flow کرنے کے قابل بناتے ہوئے processing nodes کے لیے consumption کے لیے۔ ROS 2 integration sensors کو publish کرنے کی اجازت دیتا ہے data جو دوسرے nodes subscribe اور process کر سکتے ہیں۔

**Context**: Essential ہے sensor data کے لیے robot perception اور control systems کی طرف سے استعمال ہونے کے لیے۔

**Module Reference**: ROS 2 fundamentals کے لیے [ماڈیول 1 کے communication patterns](/ur/modules/module-1-ros2-nervous-system/communication-patterns) دیکھیں۔

## S

### Sensor Data Flow
وہ path جو sensor information robotic system کے ذریعے لیتی ہے، sensor hardware سے ROS 2 topics کے ذریعے processing nodes تک جو data استعمال کرتے ہیں perception اور decision-making کے لیے۔

**Context**: Sensor data flow کو سمجھنا functional humanoid robots بنانے کے لیے essential ہے۔

**Related**: [ROS 2 Integration](#ros-2-integration)، [Sensor Types](#sensor-types)

### Sensor Types
Humanoid robots میں استعمال ہونے والے sensors کی categories، vision sensors (cameras)، proprioceptive sensors (IMUs، joint encoders)، اور tactile sensors شامل کرتے ہوئے۔ ہر sensor type robot perception کے لیے different information فراہم کرتا ہے۔

**Context**: Humanoid robots multiple sensor types استعمال کرتے ہیں environment اور internal state کے بارے میں comprehensive information جمع کرنے کے لیے۔

**Related**: [Sensor Data Flow](#sensor-data-flow)، [ROS 2 Integration](#ros-2-integration)

## V

### Virtual Replica
ایک physical system کی virtual representation۔ Digital twins کے context میں، virtual replica physical system کے ساتھ synchronized state برقرار رکھتا ہے، اسے standalone simulations سے distinguish کرتے ہوئے۔

**Context**: Digital twins کے underlying core concept۔

**Related**: [Digital Twin](#digital-twin)، [Simulation](#simulation)
