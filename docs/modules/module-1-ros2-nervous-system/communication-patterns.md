---
id: communication-patterns
title: Communication Patterns
sidebar_position: 3
description: "Understanding ROS 2 communication patterns: publish-subscribe (topics), request-response (services), and action-based patterns."
tags: [ros2, communication-patterns, topics, services, actions, publish-subscribe]
learning_objectives: [lo-002]
---

# Communication Patterns

Now that you understand the core ROS 2 concepts, let's explore how these components communicate. ROS 2 provides three distinct communication patterns, each optimized for different types of interactions in robotic systems.

## Overview of Communication Patterns

ROS 2 offers three primary communication patterns:

1. **Publish-Subscribe (Topics)** - Asynchronous, one-to-many communication
2. **Request-Response (Services)** - Synchronous, one-to-one communication
3. **Action-Based** - Asynchronous, long-running tasks with feedback

Understanding when to use each pattern is crucial for designing effective robotic systems.

## Publish-Subscribe Pattern (Topics)

The **publish-subscribe pattern** is the most common communication mechanism in ROS 2. It enables **asynchronous, decoupled communication** where:

- **Publishers** send messages to a topic without knowing who receives them
- **Subscribers** receive messages from a topic without knowing who sends them
- Multiple publishers and subscribers can use the same topic
- Communication is **one-way** (publisher → subscriber)

### When to Use Topics

Topics are ideal for:

- **Continuous data streams** - Sensor data (camera images, IMU readings, joint positions)
- **State information** - Robot pose, battery level, system status
- **Commands** - Movement commands, mode changes
- **Broadcasting** - Information that multiple nodes need simultaneously

### Example: Publish-Subscribe Pattern

```python
# Publisher: Sending sensor data
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image

class CameraPublisher(Node):
    def __init__(self):
        super().__init__('camera_publisher')
        self.publisher = self.create_publisher(Image, 'camera/image', 10)
        self.timer = self.create_timer(0.033, self.publish_image)  # ~30 FPS
    
    def publish_image(self):
        # In a real implementation, this would capture an actual image
        msg = Image()
        # ... populate image data ...
        self.publisher.publish(msg)
        self.get_logger().info('Published camera image')

# Subscriber: Receiving sensor data
class ImageProcessor(Node):
    def __init__(self):
        super().__init__('image_processor')
        self.subscription = self.create_subscription(
            Image,
            'camera/image',
            self.image_callback,
            10
        )
    
    def image_callback(self, msg):
        # Process the received image
        self.get_logger().info('Received and processing image')
        # ... image processing logic ...
```

This example shows how a camera node publishes images to a topic, and an image processing node subscribes to receive and process those images. Multiple processing nodes could subscribe to the same topic if needed.

### Advantages of Publish-Subscribe

- **Decoupled** - Publishers and subscribers don't need to know about each other
- **Scalable** - Easy to add more subscribers without modifying publishers
- **Asynchronous** - No blocking, nodes continue their work independently
- **One-to-many** - One publisher can serve multiple subscribers

## Request-Response Pattern (Services)

The **request-response pattern** (services) provides **synchronous communication** where:

- A **client** node sends a request to a **server** node
- The client **waits** for a response
- Communication is **two-way** (request → response)
- The interaction is **blocking** - the client waits until the server responds

### When to Use Services

Services are ideal for:

- **On-demand actions** - "Turn on the camera," "Get current battery level"
- **Configuration changes** - "Set motor speed to 50%," "Change control mode"
- **Query operations** - "What is the robot's current position?"
- **Synchronous operations** - When you need an immediate response

### Example: Request-Response Pattern

```python
# Service Server: Providing robot status
import rclpy
from rclpy.node import Node
from example_interfaces.srv import Trigger

class RobotStatusService(Node):
    def __init__(self):
        super().__init__('robot_status_service')
        self.srv = self.create_service(
            Trigger,
            'get_robot_status',
            self.status_callback
        )
        self.is_operational = True
    
    def status_callback(self, request, response):
        response.success = self.is_operational
        response.message = "Robot is operational" if self.is_operational else "Robot is offline"
        return response

# Service Client: Requesting robot status
class StatusChecker(Node):
    def __init__(self):
        super().__init__('status_checker')
        self.client = self.create_client(Trigger, 'get_robot_status')
    
    def check_status(self):
        request = Trigger.Request()
        future = self.client.call_async(request)
        # Wait for response
        rclpy.spin_until_future_complete(self, future)
        if future.result() is not None:
            response = future.result()
            self.get_logger().info(f'Status: {response.message}')
        else:
            self.get_logger().error('Service call failed')
```

This example shows how a status checker node can request the robot's status from a service server and receive an immediate response.

### Advantages of Request-Response

- **Synchronous** - Guaranteed response before continuing
- **Reliable** - Client knows if the request succeeded or failed
- **Simple** - Straightforward request-response model
- **On-demand** - Only executed when explicitly requested

## Action-Based Pattern

The **action-based pattern** combines aspects of both topics and services:

- Like services, actions have a **goal** (request to start a task)
- Like topics, actions provide **continuous feedback** during execution
- Actions provide a **final result** when the task completes
- Communication is **asynchronous** - the client doesn't block waiting for completion

### When to Use Actions

Actions are ideal for:

- **Long-running tasks** - Navigation, manipulation, complex behaviors
- **Tasks requiring feedback** - Progress updates during execution
- **Cancellable operations** - Tasks that might need to be stopped
- **Complex behaviors** - Multi-step processes that take time

### Example: Action-Based Pattern

```python
# Action Server: Executing a navigation task
import rclpy
from rclpy.node import Node
from rclpy.action import ActionServer
from nav2_msgs.action import NavigateToPose

class NavigationActionServer(Node):
    def __init__(self):
        super().__init__('navigation_server')
        self._action_server = ActionServer(
            self,
            NavigateToPose,
            'navigate_to_pose',
            self.execute_callback
        )
    
    def execute_callback(self, goal_handle):
        goal = goal_handle.request
        feedback_msg = NavigateToPose.Feedback()
        result = NavigateToPose.Result()
        
        # Execute navigation with periodic feedback
        total_distance = self.calculate_distance(goal.pose)
        current_distance = 0
        
        while current_distance < total_distance:
            # Update progress
            current_distance += 0.1  # Simulate movement
            feedback_msg.distance_remaining = total_distance - current_distance
            goal_handle.publish_feedback(feedback_msg)
            
            # Check if goal was cancelled
            if goal_handle.is_cancel_requested:
                goal_handle.canceled()
                return result
            
            self.get_logger().info(f'Progress: {current_distance:.1f}/{total_distance:.1f}m')
        
        # Task complete
        goal_handle.succeed()
        result.pose = goal.pose
        return result
    
    def calculate_distance(self, pose):
        # Simplified distance calculation
        return 5.0  # meters
```

This example shows how a navigation action server executes a long-running task while providing continuous feedback on progress.

### Advantages of Action-Based

- **Feedback** - Continuous updates during long-running tasks
- **Cancellable** - Tasks can be stopped if needed
- **Asynchronous** - Client doesn't block during execution
- **Flexible** - Combines request-response with continuous updates

## Choosing the Right Pattern

Here's a decision guide for selecting the appropriate communication pattern:

| Scenario | Recommended Pattern | Reason |
|----------|-------------------|--------|
| Continuous sensor data | **Topic** | Asynchronous, multiple subscribers |
| On-demand status check | **Service** | Synchronous, immediate response needed |
| Navigation to location | **Action** | Long-running, needs progress feedback |
| Broadcasting commands | **Topic** | One-to-many, asynchronous |
| Configuration change | **Service** | Synchronous, need confirmation |
| Complex manipulation | **Action** | Long-running, needs feedback and cancellation |

### Key Decision Factors

1. **Do you need a response?** → Use Service or Action
2. **Is the task long-running?** → Use Action
3. **Do you need feedback during execution?** → Use Action
4. **Is it continuous data?** → Use Topic
5. **Do multiple nodes need the information?** → Use Topic

## Summary

- **Topics (Publish-Subscribe)**: Best for continuous, asynchronous data streams
- **Services (Request-Response)**: Best for on-demand, synchronous interactions
- **Actions**: Best for long-running tasks that need feedback

Understanding these patterns and when to use each one is essential for designing effective ROS 2 systems, especially in complex applications like humanoid robotics.

## Next Steps

Now that you understand ROS 2 communication patterns, proceed to [Humanoid Robotics Applications](./humanoid-applications.md) to see how these patterns are applied in real humanoid robot scenarios.

