---
id: sensor-integration
title: Sensor Integration
sidebar_position: 4
description: Sensor types and ROS 2 integration for humanoid robots, covering vision, proprioception, and tactile sensors.
tags: [sensors, ros2-integration, sensor-data-flow, vision, proprioception, tactile]
learning_objectives: [lo-006]
topic_category: sensor
---

# Sensor Integration

Sensors are the primary interface between humanoid robots and their environment. They provide the data that enables robots to perceive the world, understand their own state, and make decisions. Understanding how sensors integrate with ROS 2 is essential for building functional humanoid robots.

## Sensor Types in Humanoid Robots

Humanoid robots use multiple sensor types to gather information about their environment and internal state. Each sensor type provides different information that contributes to robot perception and decision-making.

### Vision Sensors (Cameras)

**Vision sensors** capture visual information from the environment, enabling robots to see and understand their surroundings.

#### How Vision Sensors Work

Cameras capture light and convert it into digital images:

- **Image capture**: Light enters through lens, hits image sensor
- **Digital conversion**: Sensor converts light to pixel values
- **Image processing**: Raw data processed into usable format
- **Data publishing**: Images published to ROS 2 topics

#### Humanoid Robotics Use Cases

Vision sensors enable humanoid robots to:

- **Navigate** by recognizing landmarks and obstacles
- **Manipulate objects** by identifying and locating items
- **Interact with humans** by recognizing faces and gestures
- **Understand scenes** by analyzing spatial relationships

#### Example: Camera Data Processing

```python
# Example: Processing camera data in humanoid robotics
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from cv_bridge import CvBridge
import cv2

class VisionProcessingNode(Node):
    """ROS 2 node for processing camera data in humanoid robot"""
    
    def __init__(self):
        super().__init__('vision_processing_node')
        
        # Subscribe to camera topic
        self.subscription = self.create_subscription(
            Image,
            '/camera/image_raw',  # Camera topic
            self.image_callback,
            10
        )
        
        # Publish processed results
        self.publisher = self.create_publisher(
            Image,
            '/vision/processed_image',
            10
        )
        
        self.bridge = CvBridge()
        
    def image_callback(self, msg):
        """Process incoming camera image"""
        # Convert ROS image message to OpenCV format
        cv_image = self.bridge.imgmsg_to_cv2(msg, 'bgr8')
        
        # Process image (e.g., object detection, edge detection)
        processed_image = self.process_image(cv_image)
        
        # Convert back to ROS message
        ros_image = self.bridge.cv2_to_imgmsg(processed_image, 'bgr8')
        
        # Publish processed image
        self.publisher.publish(ros_image)
        
    def process_image(self, image):
        """Process image for humanoid robot perception"""
        # Example: Edge detection for navigation
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 50, 150)
        return edges
```

This example shows how vision sensors integrate with ROS 2:
- **Subscribing** to camera topic (`/camera/image_raw`)
- **Processing** image data for perception
- **Publishing** results to other nodes

### Proprioceptive Sensors (IMUs, Joint Encoders)

**Proprioceptive sensors** measure the robot's internal state, providing information about body position, orientation, and movement.

#### Inertial Measurement Units (IMUs)

IMUs measure orientation and acceleration:

- **Gyroscopes**: Measure angular velocity (rotation rate)
- **Accelerometers**: Measure linear acceleration
- **Magnetometers**: Measure magnetic field (for heading)

IMUs provide critical information for:

- **Balance control**: Understanding robot orientation
- **Motion planning**: Tracking body movement
- **Fall detection**: Detecting when robot is falling

#### Joint Encoders

Joint encoders measure joint angles:

- **Position feedback**: Current angle of each joint
- **Velocity feedback**: Rate of joint movement
- **Torque feedback**: Force applied at joints

Joint encoders enable:

- **Precise control**: Knowing exact joint positions
- **Coordination**: Synchronizing multiple joints
- **Safety**: Detecting joint limits and collisions

#### Humanoid Robotics Use Cases

Proprioceptive sensors enable humanoid robots to:

- **Maintain balance** by sensing body orientation and joint positions
- **Coordinate movement** by tracking all joint states
- **Detect falls** by monitoring acceleration and orientation
- **Plan motions** by understanding current body configuration

### Tactile Sensors

**Tactile sensors** detect contact and force, enabling robots to sense touch and interaction with objects.

#### How Tactile Sensors Work

Tactile sensors measure:

- **Contact detection**: Whether robot is touching something
- **Force magnitude**: How hard the contact is
- **Force direction**: Direction of applied force
- **Contact location**: Where on the robot contact occurs

#### Humanoid Robotics Use Cases

Tactile sensors enable humanoid robots to:

- **Grasp objects** by sensing contact and adjusting grip force
- **Detect collisions** by sensing unexpected contact
- **Interact safely** with humans by sensing touch
- **Manipulate objects** by feeling contact forces

## Sensor Data Flow Through ROS 2

Sensor data flows through ROS 2 using the **publish-subscribe pattern**, as discussed in [Module 1's communication patterns](../module-1-ros2-nervous-system/communication-patterns.md#publish-subscribe-pattern). This enables decoupled, asynchronous communication between sensors and processing nodes.

### Sensor Data Flow Architecture

```mermaid
graph LR
    A[Vision Sensor] -->|Publish| B[/camera/image_raw]
    C[IMU Sensor] -->|Publish| D[/imu/data]
    E[Joint Encoder] -->|Publish| F[/joint_states]
    G[Tactile Sensor] -->|Publish| H[/tactile/contact]
    
    B --> I[Vision Processing Node]
    D --> J[Balance Control Node]
    F --> K[Motion Planning Node]
    H --> L[Grasp Control Node]
    
    I --> M[Perception System]
    J --> M
    K --> M
    L --> M
    M --> N[Decision Making]
    
    style A fill:#e1f5ff
    style C fill:#fff4e1
    style E fill:#e8f5e9
    style G fill:#fce4ec
    style M fill:#f3e5f5
    style N fill:#e0f2f1
```

*Figure 1: Sensor data flow through ROS 2 topics, showing how different sensor types publish data that processing nodes consume for perception and decision-making.*

### How Sensors Publish Data to Topics

Sensors publish data to ROS 2 topics using the following pattern:

1. **Sensor node** captures data from hardware
2. **Data formatting** converts sensor data to ROS 2 message format
3. **Topic publishing** sends message to topic
4. **Subscriber nodes** receive and process data

### Example: Sensor Data Publishing

```python
# Example: Publishing sensor data to ROS 2 topics
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Imu, JointState
from geometry_msgs.msg import Vector3
import math

class SensorNode(Node):
    """ROS 2 node for publishing sensor data from humanoid robot"""
    
    def __init__(self):
        super().__init__('sensor_node')
        
        # Create publishers for different sensor types
        self.imu_publisher = self.create_publisher(
            Imu,
            '/imu/data',
            10
        )
        
        self.joint_publisher = self.create_publisher(
            JointState,
            '/joint_states',
            10
        )
        
        # Timer to publish sensor data at regular intervals
        self.timer = self.create_timer(0.01, self.publish_sensor_data)  # 100 Hz
        
    def publish_sensor_data(self):
        """Publish sensor data from humanoid robot"""
        # Publish IMU data
        imu_msg = Imu()
        imu_msg.linear_acceleration.x = self.read_accelerometer_x()
        imu_msg.linear_acceleration.y = self.read_accelerometer_y()
        imu_msg.linear_acceleration.z = self.read_accelerometer_z()
        imu_msg.angular_velocity.x = self.read_gyroscope_x()
        imu_msg.angular_velocity.y = self.read_gyroscope_y()
        imu_msg.angular_velocity.z = self.read_gyroscope_z()
        self.imu_publisher.publish(imu_msg)
        
        # Publish joint encoder data
        joint_msg = JointState()
        joint_msg.name = ['shoulder', 'elbow', 'hip', 'knee', 'ankle']
        joint_msg.position = [
            self.read_joint_angle('shoulder'),
            self.read_joint_angle('elbow'),
            self.read_joint_angle('hip'),
            self.read_joint_angle('knee'),
            self.read_joint_angle('ankle')
        ]
        joint_msg.velocity = [0.0] * 5  # Joint velocities
        joint_msg.effort = [0.0] * 5    # Joint torques
        self.joint_publisher.publish(joint_msg)
        
    def read_accelerometer_x(self):
        """Read accelerometer X value (example)"""
        # In real implementation, this would read from hardware
        return 0.0
        
    def read_joint_angle(self, joint_name):
        """Read joint angle from encoder (example)"""
        # In real implementation, this would read from hardware
        return 0.0
```

This example demonstrates:
- **Creating publishers** for different sensor types
- **Formatting data** as ROS 2 messages
- **Publishing at regular intervals** (100 Hz for proprioceptive sensors)
- **Multiple sensor types** publishing to different topics

## How Sensors Enable Robot Perception and Decision-Making

Sensors provide the raw data that enables robots to:

1. **Perceive the environment** through vision and tactile sensors
2. **Understand internal state** through proprioceptive sensors
3. **Make decisions** based on combined sensor information
4. **Execute actions** informed by sensor feedback

### Perception Pipeline

The perception pipeline processes sensor data:

1. **Raw sensor data** → Individual sensor readings
2. **Sensor fusion** → Combining data from multiple sensors
3. **Feature extraction** → Identifying relevant information
4. **State estimation** → Understanding current situation
5. **Decision making** → Choosing appropriate actions

### Example: Multi-Sensor Perception

```python
# Example: Using multiple sensors for perception and decision-making
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image, Imu, JointState

class PerceptionNode(Node):
    """ROS 2 node that fuses sensor data for perception"""
    
    def __init__(self):
        super().__init__('perception_node')
        
        # Subscribe to multiple sensor topics
        self.create_subscription(Image, '/camera/image_raw', self.vision_callback, 10)
        self.create_subscription(Imu, '/imu/data', self.imu_callback, 10)
        self.create_subscription(JointState, '/joint_states', self.joint_callback, 10)
        
        # Store latest sensor data
        self.latest_image = None
        self.latest_imu = None
        self.latest_joints = None
        
    def vision_callback(self, msg):
        """Process vision data"""
        self.latest_image = msg
        self.update_perception()
        
    def imu_callback(self, msg):
        """Process IMU data"""
        self.latest_imu = msg
        self.update_perception()
        
    def joint_callback(self, msg):
        """Process joint encoder data"""
        self.latest_joints = msg
        self.update_perception()
        
    def update_perception(self):
        """Fuse sensor data for perception and decision-making"""
        if not all([self.latest_image, self.latest_imu, self.latest_joints]):
            return
            
        # Fuse sensor data
        robot_state = self.estimate_robot_state()
        environment_state = self.analyze_environment()
        
        # Make decision based on perception
        action = self.decide_action(robot_state, environment_state)
        self.execute_action(action)
        
    def estimate_robot_state(self):
        """Estimate robot state from proprioceptive sensors"""
        # Use IMU for orientation
        orientation = self.latest_imu.orientation
        
        # Use joint encoders for body configuration
        joint_positions = self.latest_joints.position
        
        return {
            'orientation': orientation,
            'joint_positions': joint_positions
        }
        
    def analyze_environment(self):
        """Analyze environment from vision sensor"""
        # Process image to understand environment
        # (object detection, obstacle identification, etc.)
        return {'obstacles': [], 'objects': []}
        
    def decide_action(self, robot_state, environment_state):
        """Make decision based on perception"""
        # Decision-making logic using sensor data
        return 'move_forward'
        
    def execute_action(self, action):
        """Execute decided action"""
        self.get_logger().info(f'Executing action: {action}')
```

This example shows how:
- **Multiple sensors** provide different types of information
- **Sensor fusion** combines data for comprehensive understanding
- **Perception** extracts meaningful information from raw data
- **Decision-making** uses perception to choose actions

## Summary

Humanoid robots use multiple sensor types: vision sensors (cameras) for visual perception, proprioceptive sensors (IMUs, joint encoders) for internal state, and tactile sensors for contact detection. Sensor data flows through ROS 2 topics using the publish-subscribe pattern, enabling decoupled communication between sensors and processing nodes. Sensors enable robot perception by providing raw data that is fused, processed, and used for decision-making. Understanding sensor integration with ROS 2 is essential for building functional humanoid robots.

## Next Steps

Now that you understand sensor integration, proceed to [Humanoid Applications](./humanoid-applications.md) to learn how digital twins are applied in practice for humanoid robotics development.

## Related Content

- **[Module 1: ROS 2 Topics](../module-1-ros2-nervous-system/communication-patterns.md#publish-subscribe-pattern)** - Detailed explanation of publish-subscribe pattern used for sensor data
- **[Module 1: ROS 2 Nodes](../module-1-ros2-nervous-system/ros2-fundamentals.md#nodes)** - Understanding how sensor nodes work
