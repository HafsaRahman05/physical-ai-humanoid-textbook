---
id: ros2-fundamentals
title: ROS 2 Fundamentals
sidebar_position: 2
description: Core ROS 2 concepts including nodes, topics, services, and actions with Python code examples.
tags: [ros2, nodes, topics, services, actions, fundamentals]
learning_objectives: [lo-001, lo-002]
---

# ROS 2 Fundamentals

Now that we understand ROS 2's role as the robotic nervous system, let's explore the fundamental building blocks that make this communication possible. These core concepts form the foundation for everything else you'll learn about ROS 2.

## What is ROS 2?

**ROS 2 (Robot Operating System 2)** is an open-source middleware framework that provides communication infrastructure for robotics applications. Unlike a traditional operating system, ROS 2 doesn't manage hardware directly. Instead, it provides:

- **Communication mechanisms** for distributed robotic systems
- **Standardized interfaces** for common robotic tasks
- **Tools and libraries** for building robot software
- **Language support** including Python, C++, and others

ROS 2 enables you to build complex robotic systems by connecting specialized components (nodes) that communicate through well-defined channels (topics, services, actions).

## Core Concepts

ROS 2 is built around four fundamental concepts that work together to create a distributed robotic system:

### Nodes

A **node** is a process in ROS 2 that performs computation. Think of a node as a specialized worker in your robot's "nervous system." Each node has a specific responsibility:

- A sensor node might read data from a camera
- A processing node might analyze that image data
- A control node might decide what action to take
- An actuator node might execute that action

Nodes are independent processes that can run on the same computer or be distributed across multiple computers in a robot system.

#### Example: Creating a ROS 2 Node

```python
# Example: Basic ROS 2 node structure
import rclpy
from rclpy.node import Node

class SensorNode(Node):
    def __init__(self):
        super().__init__('sensor_node')
        # Node initialization code
        self.get_logger().info('Sensor node started')

def main():
    rclpy.init()
    node = SensorNode()
    rclpy.spin(node)
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

This example shows the basic structure of a ROS 2 node in Python. The node is created, initialized, and then "spun" to keep it running and processing messages.

### Topics

A **topic** is a named communication channel that uses the **publish-subscribe pattern**. Topics enable one-to-many communication: one node publishes messages to a topic, and multiple nodes can subscribe to receive those messages.

Topics are ideal for:
- **Sensor data streaming** - Continuous data like camera images, IMU readings
- **State information** - Robot pose, battery level, system status
- **Commands** - Movement commands, mode changes

The publish-subscribe pattern is **asynchronous** and **decoupled**—publishers don't need to know who is subscribing, and subscribers don't need to know who is publishing.

#### Example: Publishing to a Topic

```python
# Example: Publishing sensor data to a topic
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32

class SensorPublisher(Node):
    def __init__(self):
        super().__init__('sensor_publisher')
        # Create a publisher for the 'sensor_data' topic
        self.publisher = self.create_publisher(Float32, 'sensor_data', 10)
        # Create a timer to publish data periodically
        self.timer = self.create_timer(0.1, self.publish_data)
    
    def publish_data(self):
        msg = Float32()
        msg.data = 42.0  # Example sensor reading
        self.publisher.publish(msg)
        self.get_logger().info(f'Published: {msg.data}')

def main():
    rclpy.init()
    node = SensorPublisher()
    rclpy.spin(node)
    rclpy.shutdown()
```

This example shows how a node publishes sensor data to a topic. Other nodes can subscribe to the 'sensor_data' topic to receive these readings.

### Services

A **service** provides **synchronous request-response communication**. Unlike topics (which are one-way), services allow a node to request an action or information from another node and wait for a response.

Services are ideal for:
- **On-demand actions** - "Turn on the camera," "Get current battery level"
- **Configuration changes** - "Set motor speed to 50%"
- **Query operations** - "What is the robot's current position?"

Services use a **client-server model**: one node provides the service (server), and other nodes call it (clients).

#### Example: Creating a Service

```python
# Example: Service server that provides robot status
import rclpy
from rclpy.node import Node
from example_interfaces.srv import Trigger

class StatusService(Node):
    def __init__(self):
        super().__init__('status_service')
        # Create a service server
        self.srv = self.create_service(
            Trigger, 
            'get_robot_status', 
            self.status_callback
        )
    
    def status_callback(self, request, response):
        # Process the request and provide response
        response.success = True
        response.message = "Robot is operational"
        self.get_logger().info('Status requested')
        return response

def main():
    rclpy.init()
    node = StatusService()
    rclpy.spin(node)
    rclpy.shutdown()
```

This example shows a service server that responds to status requests. Other nodes can call this service to get the robot's status.

### Actions

An **action** is designed for **long-running tasks that provide feedback**. Actions combine aspects of both topics and services:

- Like services, actions have a goal (request)
- Like topics, actions provide continuous feedback during execution
- Actions also provide a final result when complete

Actions are ideal for:
- **Navigation tasks** - Moving to a location with progress updates
- **Manipulation tasks** - Grasping an object with feedback on approach
- **Complex behaviors** - Multi-step processes that take time

#### Example: Action Server

```python
# Example: Action server for a long-running task
import rclpy
from rclpy.node import Node
from rclpy.action import ActionServer
from example_interfaces.action import Fibonacci

class TaskActionServer(Node):
    def __init__(self):
        super().__init__('task_action_server')
        # Create an action server
        self._action_server = ActionServer(
            self,
            Fibonacci,
            'execute_task',
            self.execute_callback
        )
    
    def execute_callback(self, goal_handle):
        # Execute the task with feedback
        feedback_msg = Fibonacci.Feedback()
        result = Fibonacci.Result()
        
        # Simulate task execution with feedback
        for i in range(goal_handle.request.order):
            feedback_msg.sequence = [0, 1, 1, 2, 3, 5]  # Example feedback
            goal_handle.publish_feedback(feedback_msg)
            # Simulate work
            self.get_logger().info(f'Task progress: {i+1}/{goal_handle.request.order}')
        
        goal_handle.succeed()
        result.sequence = feedback_msg.sequence
        return result

def main():
    rclpy.init()
    node = TaskActionServer()
    rclpy.spin(node)
    rclpy.shutdown()
```

This example shows an action server that executes a long-running task while providing periodic feedback to the client.

## Concept Relationships

These four concepts work together to create a complete ROS 2 system:

- **Nodes** are the workers that perform computation
- **Topics** enable asynchronous, one-to-many communication
- **Services** enable synchronous, request-response interactions
- **Actions** enable long-running tasks with feedback

In a humanoid robot, you might have:
- Sensor nodes publishing to topics (camera images, joint positions)
- Processing nodes subscribing to topics and publishing results
- Control nodes calling services to request specific actions
- Planning nodes using actions to execute complex behaviors like walking

## Key Takeaways

1. **ROS 2 is middleware** - It provides communication infrastructure, not direct hardware control
2. **Nodes are independent processes** - Each performs a specific function
3. **Topics enable decoupled communication** - Publishers and subscribers don't need to know about each other
4. **Services provide synchronous interactions** - For on-demand requests and responses
5. **Actions handle long-running tasks** - With continuous feedback during execution

## Next Steps

Now that you understand the core ROS 2 concepts, proceed to [Communication Patterns](./communication-patterns.md) to learn when and how to use each communication mechanism effectively.

