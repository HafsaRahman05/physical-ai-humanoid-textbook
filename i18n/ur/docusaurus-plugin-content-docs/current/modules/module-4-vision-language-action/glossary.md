---
id: glossary
title: Glossary - Key Terminology
sidebar_position: 8
description: "ماڈیول 4: Vision-Language-Action (VLA) کے لیے کلیدی اصطلاحات کی تعریفیں، VLA، voice-to-action، cognitive planning، اور related concepts شامل کرتے ہوئے۔"
tags: [vla, glossary, terminology, definitions]
---

# Glossary: Key Terminology

یہ glossary ماڈیول 4: Vision-Language-Action (VLA) میں استعمال ہونے والی کلیدی اصطلاحات کی تعریف کرتا ہے۔

## Vision-Language-Action (VLA)

**Definition**: ایک unified framework جو vision، language processing، اور action execution combine کرتا ہے natural language interaction enable کرنے کے لیے robots کے ساتھ۔

**Context**: VLA systems robots کو enable کرتے ہیں spoken یا written commands سمجھنے، اپنے environment perceive کرنے، اور language instructions کی بنیاد پر physical actions execute کرنے کے لیے۔

**Related Terms**: Cognitive planning، voice-to-action، natural language processing

**Example**: ایک VLA system user کو allow کرتا ہے کہ "سرخ کپ اٹھاؤ" کہے اور robot command سمجھتا ہے، cup identify کرتا ہے، اور اسے اٹھاتا ہے۔

## Voice-to-Action

**Definition**: Capability جو robots کو enable کرتی ہے spoken commands کو robot actions میں convert کرنے کے لیے speech recognition اور cognitive planning کے ذریعے۔

**Context**: Voice-to-action systems speech recognition استعمال کرتے ہیں (جیسے OpenAI Whisper) spoken commands transcribe کرنے کے لیے، جو پھر cognitive planning systems کی طرف سے process ہوتے ہیں robot actions generate کرنے کے لیے۔

**Related Terms**: Speech recognition، cognitive planning، natural language processing

**Example**: جب user "کمرہ صاف کرو" کہتا ہے، voice-to-action system speech transcribe کرتا ہے اور task accomplish کرنے کے لیے robot actions کی sequence generate کرتا ہے۔

## Cognitive Planning

**Definition**: Process جس کے ذریعے Large Language Models (LLMs) natural language commands translate کرتے ہیں executable robot actions کی sequences میں۔

**Context**: Cognitive planning high-level natural language instructions decompose کرتی ہے structured action plans میں جو robots execute کر سکتے ہیں ROS 2 actions کے ذریعے۔

**Related Terms**: LLM، natural language processing، action sequence، ROS 2

**Example**: Cognitive planning "کمرہ صاف کرو" کو navigation، perception، اور manipulation actions کی sequence میں translate کرتی ہے۔

## Natural Language Intent

**Definition**: Semantic meaning اور goal extracted voice command یا text instruction سے۔

**Context**: Natural language intent represent کرتا ہے کہ user کیا چاہتا ہے robot accomplish کرے، goal، required capabilities، constraints، اور context شامل کرتے ہوئے۔

**Related Terms**: Intent understanding، goal decomposition، cognitive planning

**Example**: "سرخ کپ اٹھاؤ" کا natural language intent شامل کرتا ہے goal (pick up)، target (red cup)، اور implicit constraints (appropriate grasp استعمال کریں)۔

## Action Sequence

**Definition**: ROS 2 actions کی ordered list جو cognitive plan implement کرتی ہے۔

**Context**: Action sequences executable robot behaviors represent کرتے ہیں cognitive planning سے generated، individual actions، action parameters، dependencies، اور execution order شامل کرتے ہوئے۔

**Related Terms**: ROS 2 actions، cognitive plan، action execution

**Example**: "کپ اٹھاؤ" کے لیے action sequence شامل کر سکتی ہے: table پر navigate، objects detect، cup identify، grasp plan، grasp execute۔

## VLA Pipeline

**Definition**: Complete flow voice input سے physical action تک VLA systems میں۔

**Context**: VLA pipeline شامل کرتا ہے voice capture، speech recognition، text transcription، cognitive planning، action generation، perception، navigation، اور manipulation stages۔

**Related Terms**: Voice-to-action، cognitive planning، action execution

**Example**: VLA pipeline flow کرتا ہے: Voice command → Whisper transcription → Cognitive planning → ROS 2 actions → Robot execution۔

## Cognitive Plan

**Definition**: Robot actions کی structured sequence generated LLM سے natural language input سے۔

**Context**: Cognitive plans bridge natural language intent سے executable robot behaviors تک، high-level goals، decomposed sub-tasks، action sequences، اور execution parameters contain کرتے ہوئے۔

**Related Terms**: Cognitive planning، action sequence، natural language intent

**Example**: "کمرہ صاف کرو" کے لیے cognitive plan شامل کرتی ہے sub-tasks جیسے navigate، objects identify، objects pick up، اور objects place، ہر ایک associated ROS 2 actions کے ساتھ۔

## Voice Command

**Definition**: ایک spoken instruction دی گئی humanoid robot کو۔

**Context**: Voice commands contain کرتے ہیں audio waveform data، transcribed text، semantic meaning، اور intent، natural language human-robot interaction enable کرتے ہوئے۔

**Related Terms**: Voice-to-action، speech recognition، natural language intent

**Example**: "table سے سرخ کپ اٹھاؤ" ایک voice command ہے جو VLA pipeline initiate کرتی ہے۔

## Action Sequence

**Definition**: ROS 2 actions کی ordered list جو cognitive plan implement کرتی ہے۔

**Context**: Action sequences contain کرتے ہیں individual actions (navigation، manipulation، perception)، action parameters، actions کے درمیان dependencies، اور execution order۔

**Related Terms**: ROS 2 actions، cognitive plan، action execution

**Example**: Action sequence شامل کر سکتی ہے: NavigateToPose، DetectObjects، PickPlace actions specific order میں۔

## Capstone Project Scenario

**Definition**: ایک complete autonomous behavior demonstration integrating تمام VLA components۔

**Context**: Capstone project scenarios demonstrate کرتے ہیں VLA concepts کی practical application، voice command input، planning phase، navigation phase، object identification phase، اور manipulation phase شامل کرتے ہوئے۔

**Related Terms**: VLA pipeline، autonomous behavior، integration

**Example**: Capstone project demonstrate کرتا ہے complete scenario جہاں robot voice command receive کرتا ہے، path plan کرتا ہے، obstacles navigate کرتا ہے، objects identify کرتا ہے، اور انہیں manipulate کرتا ہے۔
