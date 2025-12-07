---
id: glossary
title: Glossary
sidebar_position: 6
description: Key terminology and definitions for Module 1 - The Robotic Nervous System (ROS 2)
tags: [glossary, terminology, definitions]
---

# Glossary

This glossary defines key terms used throughout Module 1. Terms are defined on first use in the module content, and this glossary serves as a reference for quick lookup.

## A

### Action
A ROS 2 communication pattern for long-running tasks that require feedback. Actions are asynchronous and provide status updates during execution, making them ideal for tasks like navigation or manipulation that take time to complete.

**Related**: [Service](./ros2-fundamentals.md#services), [Topic](./ros2-fundamentals.md#topics)

## N

### Node
A process in ROS 2 that performs computation. Nodes are the fundamental building blocks of a ROS 2 system, each responsible for a specific function (e.g., processing sensor data, controlling actuators, planning motion).

**Related**: [Topic](./ros2-fundamentals.md#topics), [Service](./ros2-fundamentals.md#services)

## P

### Publish-Subscribe Pattern
A communication pattern where nodes publish messages to topics, and other nodes subscribe to receive those messages. This enables decoupled, asynchronous communication between robot components.

**Related**: [Topic](./ros2-fundamentals.md#topics)

## R

### ROS 2 (Robot Operating System 2)
A middleware framework for robotics that provides communication infrastructure, tools, and libraries for building distributed robotic systems. ROS 2 enables different components of a robot to communicate and coordinate effectively.

**Related**: [Node](./ros2-fundamentals.md#nodes), [Topic](./ros2-fundamentals.md#topics)

## S

### Service
A ROS 2 communication pattern for synchronous request-response interactions. Services are used when a node needs to request a specific action or information from another node and wait for a response.

**Related**: [Action](./ros2-fundamentals.md#actions), [Topic](./ros2-fundamentals.md#topics)

## T

### Topic
A named communication channel in ROS 2 that uses the publish-subscribe pattern. Topics enable nodes to send messages to multiple subscribers without knowing who is receiving the information.

**Related**: [Publish-Subscribe Pattern](./communication-patterns.md#publish-subscribe-pattern), [Node](./ros2-fundamentals.md#nodes)

---

*This glossary will be expanded as additional modules are added to the textbook.*

