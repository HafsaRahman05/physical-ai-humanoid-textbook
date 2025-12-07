---
id: glossary
title: Glossary
sidebar_position: 7
description: Key terminology and definitions for Module 3 - The AI-Robot Brain (NVIDIA Isaac™)
tags: [glossary, terminology, definitions]
---

# Glossary

This glossary defines key terms used throughout Module 3. Terms are defined on first use in the module content, and this glossary serves as a reference for quick lookup.

## B

### Bipedal Movement Constraints

**Definition**: Limitations and requirements specific to two-legged humanoid movement that affect path planning and navigation. These constraints include balance requirements (center of mass must stay within support polygon), foot placement constraints (each step must land on flat, stable surfaces), terrain adaptation needs (maximum slope limits, surface detection), and stability considerations (maintaining balance throughout movement).

**Context**: Used in humanoid robotics to understand why path planning for bipedal robots differs from wheeled robots.

**Related**: [Path Planning](#path-planning), [Humanoid Navigation](#humanoid-navigation)

**Module Reference**: See [Nav2 Path Planning section](./nav2-path-planning.md) for detailed explanation.

## H

### Hardware Acceleration

**Definition**: Computation performed on specialized hardware (GPUs) instead of general-purpose processors (CPUs) to achieve improved performance. Hardware acceleration enables parallel processing that dramatically speeds up computationally intensive tasks like image processing and perception algorithms.

**Context**: Essential for enabling real-time VSLAM and perception processing in humanoid robots.

**Related**: [Visual SLAM (VSLAM)](#visual-slam-vslam), [Real-Time Navigation](#real-time-navigation)

**Module Reference**: See [Isaac ROS section](./isaac-ros.md) for detailed explanation.

### Humanoid Navigation

**Definition**: The process of humanoid robots moving through environments autonomously, accounting for bipedal movement constraints such as balance, foot placement, and terrain adaptation. Humanoid navigation requires path planning that differs from wheeled robots due to the need for discrete foot placements and balance maintenance.

**Context**: The goal of integrating perception and planning systems for autonomous humanoid robots.

**Related**: [Path Planning](#path-planning), [Bipedal Movement Constraints](#bipedal-movement-constraints)

## N

### Nav2 (Navigation2)

**Definition**: A ROS 2 navigation framework that provides path planning, obstacle avoidance, and navigation capabilities. Nav2 includes adaptations for bipedal humanoid robots that account for balance requirements, foot placement constraints, and terrain adaptation needs.

**Context**: Used for path planning in humanoid robots, computing safe and efficient routes that account for humanoid-specific movement constraints.

**Related**: [Path Planning](#path-planning), [Bipedal Movement Constraints](#bipedal-movement-constraints)

**Module Reference**: See [Nav2 Path Planning section](./nav2-path-planning.md) for detailed explanation.

## P

### Path Planning

**Definition**: The process of computing safe and efficient paths for robot movement from a start location to a goal location. For humanoid robots, path planning must consider humanoid-specific constraints including balance requirements, foot placement constraints, terrain adaptation needs, and obstacle avoidance.

**Context**: Essential for enabling autonomous navigation in humanoid robots.

**Related**: [Nav2](#nav2-navigation2), [Bipedal Movement Constraints](#bipedal-movement-constraints), [Humanoid Navigation](#humanoid-navigation)

**Module Reference**: See [Nav2 Path Planning section](./nav2-path-planning.md) for detailed explanation.

### Photorealistic Simulation

**Definition**: Virtual environments created with realistic lighting, textures, materials, and visual appearance that closely match real-world conditions. Photorealistic simulation emphasizes visual fidelity to generate training data that is visually indistinguishable from real-world images.

**Context**: Used in Isaac Sim to create synthetic training data for perception algorithms that matches real-world appearance.

**Related**: [Synthetic Training Data](#synthetic-training-data), [NVIDIA Isaac Sim](#nvidia-isaac-sim)

**Module Reference**: See [NVIDIA Isaac Sim section](./isaac-sim.md) for detailed explanation.

## R

### Real-Time Navigation

**Definition**: Robot navigation that processes sensor data and computes navigation decisions fast enough to enable smooth, responsive robot movement. Real-time navigation requires processing delays to be minimal (typically matching sensor frame rates) to avoid jerky motion or unsafe behavior.

**Context**: Essential for autonomous humanoid robots that must navigate dynamically through changing environments.

**Related**: [Hardware Acceleration](#hardware-acceleration), [Visual SLAM (VSLAM)](#visual-slam-vslam)

**Module Reference**: See [Isaac ROS section](./isaac-ros.md) for detailed explanation.

## S

### Synthetic Training Data

**Definition**: Data generated from simulation (rather than collected from physical systems) for training AI/ML algorithms. Synthetic training data includes images, depth maps, sensor readings, and ground truth annotations created programmatically in virtual environments. This data enables algorithm training without requiring physical data collection.

**Context**: Used in Isaac Sim to generate training datasets for perception algorithms, eliminating the need for massive real-world data collection.

**Related**: [Photorealistic Simulation](#photorealistic-simulation), [NVIDIA Isaac Sim](#nvidia-isaac-sim)

**Module Reference**: See [NVIDIA Isaac Sim section](./isaac-sim.md) for detailed explanation.

## V

### Visual SLAM (VSLAM)

**Definition**: A system that uses visual sensors (cameras) to simultaneously map environments and localize the robot within those maps. VSLAM processes camera images to extract visual features, track robot movement, build environment maps, and determine robot position—all in real-time.

**Context**: Enables humanoid robots to understand their environment and navigate using visual information alone.

**Related**: [Hardware Acceleration](#hardware-acceleration), [Isaac ROS](#isaac-ros), [Real-Time Navigation](#real-time-navigation)

**Module Reference**: See [Isaac ROS section](./isaac-ros.md) for detailed explanation.

## Key Tool Definitions

### Isaac ROS

**Definition**: A collection of hardware-accelerated ROS 2 packages that leverage GPU computing to process perception and navigation tasks in real-time. For humanoid robots, Isaac ROS primarily provides Visual SLAM (VSLAM) capabilities that enable real-time environmental understanding and robot localization.

**Context**: Provides the perception component of the AI-robot brain, enabling real-time visual understanding.

**Related**: [Visual SLAM (VSLAM)](#visual-slam-vslam), [Hardware Acceleration](#hardware-acceleration)

**Module Reference**: See [Isaac ROS section](./isaac-ros.md) for detailed explanation.

### NVIDIA Isaac Sim

**Definition**: A photorealistic simulation platform that creates highly realistic virtual environments with accurate lighting, textures, materials, and physics. Isaac Sim enables synthetic data generation for training perception algorithms, creating labeled training datasets programmatically without physical data collection.

**Context**: Provides the training component of the AI-robot brain, generating synthetic data for perception algorithm development.

**Related**: [Photorealistic Simulation](#photorealistic-simulation), [Synthetic Training Data](#synthetic-training-data)

**Module Reference**: See [NVIDIA Isaac Sim section](./isaac-sim.md) for detailed explanation.

---

*This glossary will be expanded as additional modules are added to the textbook.*

