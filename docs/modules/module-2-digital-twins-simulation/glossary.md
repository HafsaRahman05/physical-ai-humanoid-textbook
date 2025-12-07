---
id: glossary
title: Glossary
sidebar_position: 7
description: Key terminology and definitions for Module 2 - Digital Twins, Simulation & Sensors
tags: [glossary, terminology, definitions]
---

# Glossary

This glossary defines key terms used throughout Module 2. Terms are defined on first use in the module content, and this glossary serves as a reference for quick lookup.

## Navigation

- [Digital Twins](#digital-twins) - Virtual replicas of physical systems
- [Simulation](#simulation) - Virtual environments for testing
- [Sensors](#sensor-types) - Devices for gathering information
- [Applications](#gait-optimization) - Practical use cases

## D

### Digital Twin
**Definition**: A virtual replica of a physical system that maintains a synchronized connection with its real-world counterpart. Digital twins go beyond simple simulations by providing continuous synchronization, real-time updates, and comprehensive system representation. They enable safe testing, optimization, and predictive maintenance.

**Context**: Used in humanoid robotics to enable safe testing and optimization without physical hardware.

**Related**: [Virtual Replica](#virtual-replica), [Simulation](#simulation), [Synchronization](#synchronization)

**Module Reference**: See [Digital Twins section](./digital-twins.md) for detailed explanation.
A virtual replica of a physical system that maintains a synchronized connection with its real-world counterpart. Digital twins go beyond simple simulations by providing continuous synchronization, real-time updates, and comprehensive system representation. They enable safe testing, optimization, and predictive maintenance.

**Context**: Used in humanoid robotics to enable safe testing and optimization without physical hardware.

**Related**: [Virtual Replica](#virtual-replica), [Simulation](#simulation), [Synchronization](#synchronization)

**Module Reference**: See [Digital Twins section](./digital-twins.md) for detailed explanation.

## E

### Environment Modeling
The process of creating 3D representations of the world where robots operate, including surfaces, objects, obstacles, and environmental conditions. Environment models define the geometry, materials, lighting, and dynamics of virtual spaces.

**Context**: Essential for creating realistic simulation environments where robots can be tested.

**Related**: [Simulation](#simulation), [Physics Engine](#physics-engine)

## P

### Physics Engine
A computational system that simulates physical laws (gravity, collisions, dynamics) in a virtual environment. Physics engines calculate how objects move, collide, and interact based on physics principles, enabling realistic robot behavior in simulation.

**Context**: Core component of simulation environments that computes robot dynamics and motion.

**Related**: [Simulation](#simulation), [Environment Modeling](#environment-modeling)

## G

### Gait Optimization
The process of finding optimal walking patterns for humanoid robots through systematic testing and evaluation. Digital twins enable safe, rapid testing of many gait configurations to find solutions that balance stability, speed, and energy efficiency.

**Context**: Essential for developing effective walking behaviors in humanoid robots.

**Related**: [Digital Twin](#digital-twin), [Simulation](#simulation)

## M

### Manipulation Planning
The process of determining how humanoid robots should grasp and manipulate objects, including grasp pose selection, trajectory planning, and force control. Digital twins enable testing manipulation strategies safely before physical implementation.

**Context**: Critical for enabling humanoid robots to interact with objects in their environment.

**Related**: [Digital Twin](#digital-twin), [Simulation](#simulation)

## S

### Safety Testing
The process of validating that humanoid robots operate safely, especially in scenarios involving humans or valuable equipment. Digital twins enable comprehensive safety testing without physical risk, including failure scenarios, emergency stops, and collision responses.

**Context**: Essential for ensuring safe deployment of humanoid robots.

**Related**: [Digital Twin](#digital-twin), [Simulation](#simulation)

### Sensor Simulation
The process of creating virtual sensors that replicate the behavior of physical sensors. Virtual sensors capture data from the simulation environment, apply sensor characteristics (noise, latency, resolution), and format data to match physical sensor output.

**Context**: Enables testing perception algorithms and generating training data without physical hardware.

**Related**: [Simulation](#simulation), [Physics Engine](#physics-engine)

### Simulation
A virtual environment where robots can operate with realistic physics, sensor models, and environmental conditions. Simulations enable testing scenarios without physical hardware, but differ from digital twins in that they are typically standalone and not continuously synchronized with physical systems.

**Context**: Used to test robot behavior in virtual environments before physical deployment.

**Related**: [Digital Twin](#digital-twin), [Physics Engine](#physics-engine), [Sensor Simulation](#sensor-simulation)

### Synchronization
The process of maintaining state alignment between a digital twin and its physical counterpart. Synchronization can be real-time or near-real-time, ensuring the digital twin accurately reflects the current state of the physical system.

**Context**: Critical for digital twins to maintain accurate representation of physical systems.

**Related**: [Digital Twin](#digital-twin)

## R

### ROS 2 Integration
The process of connecting sensors to ROS 2 communication framework, enabling sensor data to flow through topics for consumption by processing nodes. ROS 2 integration allows sensors to publish data that other nodes can subscribe to and process.

**Context**: Essential for sensor data to be used by robot perception and control systems.

**Module Reference**: See [Module 1's communication patterns](../module-1-ros2-nervous-system/communication-patterns.md) for ROS 2 fundamentals.

## S

### Sensor Data Flow
The path that sensor information takes through a robotic system, from sensor hardware through ROS 2 topics to processing nodes that use the data for perception and decision-making.

**Context**: Understanding sensor data flow is essential for building functional humanoid robots.

**Related**: [ROS 2 Integration](#ros-2-integration), [Sensor Types](#sensor-types)

### Sensor Types
Categories of sensors used in humanoid robots, including vision sensors (cameras), proprioceptive sensors (IMUs, joint encoders), and tactile sensors. Each sensor type provides different information for robot perception.

**Context**: Humanoid robots use multiple sensor types to gather comprehensive information about environment and internal state.

**Related**: [Sensor Data Flow](#sensor-data-flow), [ROS 2 Integration](#ros-2-integration)

## V

### Virtual Replica
A virtual representation of a physical system. In the context of digital twins, a virtual replica maintains synchronized state with the physical system, distinguishing it from standalone simulations.

**Context**: The core concept underlying digital twins.

**Related**: [Digital Twin](#digital-twin), [Simulation](#simulation)
