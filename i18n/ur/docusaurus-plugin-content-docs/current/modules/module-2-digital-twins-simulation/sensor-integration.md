---
id: sensor-integration
title: Sensor Integration
sidebar_position: 4
description: Sensor types اور ROS 2 integration humanoid robots کے لیے، vision، proprioception، اور tactile sensors کا احاطہ کرتے ہوئے۔
tags: [sensors, ros2-integration, sensor-data-flow, vision, proprioception, tactile]
learning_objectives: [lo-006]
topic_category: sensor
---

# Sensor Integration

Sensors primary interface ہیں humanoid robots اور ان کے environment کے درمیان۔ وہ data فراہم کرتے ہیں جو robots کو world perceive کرنے، اپنی state سمجھنے، اور decisions بنانے کے قابل بناتا ہے۔ یہ سمجھنا کہ sensors کیسے ROS 2 کے ساتھ integrate ہوتے ہیں essential ہے functional humanoid robots بنانے کے لیے۔

## Humanoid Robots میں Sensor Types

Humanoid robots multiple sensor types استعمال کرتے ہیں اپنے environment اور internal state کے بارے میں information جمع کرنے کے لیے۔ ہر sensor type different information فراہم کرتا ہے جو robot perception اور decision-making میں contribute کرتا ہے۔

### Vision Sensors (Cameras)

**Vision sensors** environment سے visual information capture کرتے ہیں، robots کو دیکھنے اور اپنے surroundings سمجھنے کے قابل بناتے ہوئے۔

#### Vision Sensors کیسے کام کرتے ہیں

Cameras light capture کرتے ہیں اور اسے digital images میں convert کرتے ہیں:

- **Image capture**: Light lens کے ذریعے داخل ہوتی ہے، image sensor کو hit کرتی ہے
- **Digital conversion**: Sensor light کو pixel values میں convert کرتا ہے
- **Image processing**: Raw data usable format میں processed ہوتی ہے
- **Data publishing**: Images ROS 2 topics پر published ہوتی ہیں

#### Humanoid Robotics Use Cases

Vision sensors humanoid robots کو enable کرتے ہیں:

- **Navigate** landmarks اور obstacles recognize کر کے
- **Objects manipulate** items identify اور locate کر کے
- **Humans کے ساتھ interact** faces اور gestures recognize کر کے
- **Scenes understand** spatial relationships analyze کر کے

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

یہ example دکھاتا ہے کہ vision sensors کیسے ROS 2 کے ساتھ integrate ہوتے ہیں:
- **Subscribing** camera topic (`/camera/image_raw`) کو
- **Processing** image data perception کے لیے
- **Publishing** results دوسرے nodes کو

### Proprioceptive Sensors (IMUs، Joint Encoders)

**Proprioceptive sensors** robot کی internal state measure کرتے ہیں، body position، orientation، اور movement کے بارے میں information فراہم کرتے ہوئے۔

#### Inertial Measurement Units (IMUs)

IMUs orientation اور acceleration measure کرتے ہیں:

- **Gyroscopes**: Angular velocity measure کرتے ہیں (rotation rate)
- **Accelerometers**: Linear acceleration measure کرتے ہیں
- **Magnetometers**: Magnetic field measure کرتے ہیں (heading کے لیے)

IMUs critical information فراہم کرتے ہیں:

- **Balance control** کے لیے: Robot orientation سمجھنا
- **Motion planning** کے لیے: Body movement track کرنا
- **Fall detection** کے لیے: Detect کرنا جب robot falling ہو

#### Joint Encoders

Joint encoders joint angles measure کرتے ہیں:

- **Position feedback**: ہر joint کا current angle
- **Velocity feedback**: Joint movement کی rate
- **Torque feedback**: Joints پر applied force

Joint encoders enable کرتے ہیں:

- **Precise control**: Exact joint positions جاننا
- **Coordination**: Multiple joints synchronize کرنا
- **Safety**: Joint limits اور collisions detect کرنا

#### Humanoid Robotics Use Cases

Proprioceptive sensors humanoid robots کو enable کرتے ہیں:

- **Balance maintain** body orientation اور joint positions sense کر کے
- **Movement coordinate** تمام joint states track کر کے
- **Falls detect** acceleration اور orientation monitor کر کے
- **Motions plan** current body configuration سمجھ کر

### Tactile Sensors

**Tactile sensors** contact اور force detect کرتے ہیں، robots کو touch sense کرنے اور objects کے ساتھ interaction کے قابل بناتے ہوئے۔

#### Tactile Sensors کیسے کام کرتے ہیں

Tactile sensors measure کرتے ہیں:

- **Contact detection**: کیا robot کچھ touch کر رہا ہے
- **Force magnitude**: Contact کتنا hard ہے
- **Force direction**: Applied force کی direction
- **Contact location**: Robot پر کہاں contact occur ہوتا ہے

#### Humanoid Robotics Use Cases

Tactile sensors humanoid robots کو enable کرتے ہیں:

- **Objects grasp** contact sense کر کے اور grip force adjust کر کے
- **Collisions detect** unexpected contact sense کر کے
- **Safely interact** humans کے ساتھ touch sense کر کے
- **Objects manipulate** contact forces feel کر کے

## ROS 2 کے ذریعے Sensor Data Flow

Sensor data ROS 2 کے ذریعے flow کرتا ہے **publish-subscribe pattern** استعمال کرتے ہوئے، جیسا کہ [ماڈیول 1 کے communication patterns](/ur/modules/module-1-ros2-nervous-system/communication-patterns#publish-subscribe-pattern-topics) میں discuss کیا گیا ہے۔ یہ decoupled، asynchronous communication کو ممکن بناتا ہے sensors اور processing nodes کے درمیان۔

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

*Figure 1: Sensor data flow ROS 2 topics کے ذریعے، دکھاتا ہے کہ مختلف sensor types کیسے data publish کرتے ہیں جو processing nodes consume کرتے ہیں perception اور decision-making کے لیے۔*

### Sensors کیسے Data Publish کرتے ہیں Topics پر

Sensors ROS 2 topics پر data publish کرتے ہیں following pattern استعمال کرتے ہوئے:

1. **Sensor node** hardware سے data capture کرتا ہے
2. **Data formatting** sensor data کو ROS 2 message format میں convert کرتا ہے
3. **Topic publishing** message کو topic پر send کرتا ہے
4. **Subscriber nodes** data receive اور process کرتے ہیں

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

یہ example demonstrate کرتا ہے:
- **Publishers create** کرنا different sensor types کے لیے
- **Data format** کرنا ROS 2 messages کے طور پر
- **Regular intervals پر publish** کرنا (proprioceptive sensors کے لیے 100 Hz)
- **Multiple sensor types** different topics پر publish کرتے ہوئے

## Sensors Robot Perception اور Decision-Making کو کیسے Enable کرتے ہیں

Sensors raw data فراہم کرتے ہیں جو robots کو enable کرتا ہے:

1. **Environment perceive** vision اور tactile sensors کے ذریعے
2. **Internal state understand** proprioceptive sensors کے ذریعے
3. **Decisions make** combined sensor information کی بنیاد پر
4. **Actions execute** sensor feedback سے informed

### Perception Pipeline

Perception pipeline sensor data process کرتا ہے:

1. **Raw sensor data** → Individual sensor readings
2. **Sensor fusion** → Multiple sensors سے data combine کرنا
3. **Feature extraction** → Relevant information identify کرنا
4. **State estimation** → Current situation سمجھنا
5. **Decision making** → Appropriate actions choose کرنا

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

یہ example دکھاتا ہے کہ:
- **Multiple sensors** different types کی information فراہم کرتے ہیں
- **Sensor fusion** comprehensive understanding کے لیے data combine کرتا ہے
- **Perception** raw data سے meaningful information extract کرتا ہے
- **Decision-making** perception استعمال کرتا ہے actions choose کرنے کے لیے

## Summary

Humanoid robots multiple sensor types استعمال کرتے ہیں: vision sensors (cameras) visual perception کے لیے، proprioceptive sensors (IMUs، joint encoders) internal state کے لیے، اور tactile sensors contact detection کے لیے۔ Sensor data ROS 2 topics کے ذریعے flow کرتا ہے publish-subscribe pattern استعمال کرتے ہوئے، decoupled communication کو ممکن بناتے ہوئے sensors اور processing nodes کے درمیان۔ Sensors robot perception کو ممکن بناتے ہیں raw data فراہم کر کے جو fused، processed، اور decision-making کے لیے استعمال ہوتا ہے۔ ROS 2 کے ساتھ sensor integration کو سمجھنا essential ہے functional humanoid robots بنانے کے لیے۔

## Next Steps

اب جب کہ آپ sensor integration کو سمجھ گئے ہیں، [Humanoid Applications](/ur/modules/module-2-digital-twins-simulation/humanoid-applications) پر جائیں تاکہ سیکھیں کہ digital twins کیسے apply ہوتے ہیں practice میں humanoid robotics development کے لیے۔

## Related Content

- **[ماڈیول 1: ROS 2 Topics](/ur/modules/module-1-ros2-nervous-system/communication-patterns#publish-subscribe-pattern-topics)** - Publish-subscribe pattern کی تفصیلی وضاحت جو sensor data کے لیے استعمال ہوتا ہے
- **[ماڈیول 1: ROS 2 Nodes](/ur/modules/module-1-ros2-nervous-system/ros2-fundamentals#nodes)** - سمجھنا کہ sensor nodes کیسے کام کرتے ہیں
