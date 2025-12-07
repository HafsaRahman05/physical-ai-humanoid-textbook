---
id: communication-patterns
title: Communication Patterns
sidebar_position: 3
description: "ROS 2 communication patterns کو سمجھنا: publish-subscribe (topics)، request-response (services)، اور action-based patterns۔"
tags: [ros2, communication-patterns, topics, services, actions, publish-subscribe]
learning_objectives: [lo-002]
---

# Communication Patterns

اب جب کہ آپ core ROS 2 concepts کو سمجھ گئے ہیں، آئیے دیکھتے ہیں کہ یہ components کیسے communicate کرتے ہیں۔ ROS 2 تین distinct communication patterns فراہم کرتا ہے، ہر ایک robotic systems میں مختلف types کی interactions کے لیے optimized ہے۔

## Communication Patterns کا Overview

ROS 2 تین primary communication patterns پیش کرتا ہے:

1. **Publish-Subscribe (Topics)** - Asynchronous، one-to-many communication
2. **Request-Response (Services)** - Synchronous، one-to-one communication
3. **Action-Based** - Asynchronous، long-running tasks feedback کے ساتھ

ہر pattern کو کب استعمال کریں یہ سمجھنا effective robotic systems ڈیزائن کرنے کے لیے crucial ہے۔

## Publish-Subscribe Pattern (Topics)

**Publish-subscribe pattern** ROS 2 میں سب سے عام communication mechanism ہے۔ یہ **asynchronous، decoupled communication** کو ممکن بناتا ہے جہاں:

- **Publishers** ایک topic پر messages بھیجتے ہیں بغیر جانے کہ کون انہیں receive کرتا ہے
- **Subscribers** ایک topic سے messages receive کرتے ہیں بغیر جانے کہ کون انہیں بھیجتا ہے
- Multiple publishers اور subscribers same topic استعمال کر سکتے ہیں
- Communication **one-way** ہے (publisher → subscriber)

### Topics کب استعمال کریں

Topics کے لیے ideal ہیں:

- **Continuous data streams** - Sensor data (camera images، IMU readings، joint positions)
- **State information** - Robot pose، battery level، system status
- **Commands** - Movement commands، mode changes
- **Broadcasting** - Information جو multiple nodes کو simultaneously درکار ہے

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

یہ example دکھاتا ہے کہ ایک camera node کیسے images کو ایک topic پر publish کرتا ہے، اور ایک image processing node subscribe کرتا ہے ان images کو receive اور process کرنے کے لیے۔ Multiple processing nodes same topic کو subscribe کر سکتے ہیں اگر ضرورت ہو۔

### Publish-Subscribe کے Advantages

- **Decoupled** - Publishers اور subscribers کو ایک دوسرے کے بارے میں جاننے کی ضرورت نہیں
- **Scalable** - Publishers کو modify کیے بغیر more subscribers شامل کرنا آسان
- **Asynchronous** - No blocking، nodes independently اپنا کام جاری رکھتے ہیں
- **One-to-many** - ایک publisher multiple subscribers کو serve کر سکتا ہے

## Request-Response Pattern (Services)

**Request-response pattern** (services) **synchronous communication** فراہم کرتا ہے جہاں:

- ایک **client** node ایک **server** node کو request بھیجتا ہے
- Client **waits** کرتا ہے response کا
- Communication **two-way** ہے (request → response)
- Interaction **blocking** ہے - client waits کرتا ہے جب تک server respond نہیں کرتا

### Services کب استعمال کریں

Services کے لیے ideal ہیں:

- **On-demand actions** - "Turn on the camera،" "Get current battery level"
- **Configuration changes** - "Set motor speed to 50%،" "Change control mode"
- **Query operations** - "What is the robot's current position?"
- **Synchronous operations** - جب آپ کو immediate response درکار ہو

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

یہ example دکھاتا ہے کہ ایک status checker node کیسے robot کی status کو service server سے request کر سکتا ہے اور immediate response receive کر سکتا ہے۔

### Request-Response کے Advantages

- **Synchronous** - Continuing سے پہلے guaranteed response
- **Reliable** - Client جانتا ہے کہ request succeed ہوئی یا fail
- **Simple** - Straightforward request-response model
- **On-demand** - صرف explicitly requested ہونے پر execute ہوتا ہے

## Action-Based Pattern

**Action-based pattern** topics اور services دونوں کے aspects کو combine کرتا ہے:

- Services کی طرح، actions کا ایک **goal** ہوتا ہے (task شروع کرنے کی request)
- Topics کی طرح، actions execution کے دوران **continuous feedback** فراہم کرتے ہیں
- Actions task complete ہونے پر ایک **final result** فراہم کرتے ہیں
- Communication **asynchronous** ہے - client completion کا انتظار کرتے ہوئے block نہیں ہوتا

### Actions کب استعمال کریں

Actions کے لیے ideal ہیں:

- **Long-running tasks** - Navigation، manipulation، complex behaviors
- **Tasks requiring feedback** - Execution کے دوران progress updates
- **Cancellable operations** - Tasks جو stop کرنے کی ضرورت پڑ سکتی ہے
- **Complex behaviors** - Multi-step processes جو وقت لیتے ہیں

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

یہ example دکھاتا ہے کہ ایک navigation action server کیسے ایک long-running task execute کرتا ہے جبکہ progress پر continuous feedback فراہم کرتا ہے۔

### Action-Based کے Advantages

- **Feedback** - Long-running tasks کے دوران continuous updates
- **Cancellable** - Tasks stop کی جا سکتی ہیں اگر ضرورت ہو
- **Asynchronous** - Client execution کے دوران block نہیں ہوتا
- **Flexible** - Request-response کو continuous updates کے ساتھ combine کرتا ہے

## صحیح Pattern کا انتخاب

یہاں appropriate communication pattern select کرنے کے لیے ایک decision guide ہے:

| Scenario | Recommended Pattern | Reason |
|----------|-------------------|--------|
| Continuous sensor data | **Topic** | Asynchronous، multiple subscribers |
| On-demand status check | **Service** | Synchronous، immediate response needed |
| Navigation to location | **Action** | Long-running، needs progress feedback |
| Broadcasting commands | **Topic** | One-to-many، asynchronous |
| Configuration change | **Service** | Synchronous، need confirmation |
| Complex manipulation | **Action** | Long-running، needs feedback اور cancellation |

### Key Decision Factors

1. **کیا آپ کو response درکار ہے؟** → Service یا Action استعمال کریں
2. **کیا task long-running ہے؟** → Action استعمال کریں
3. **کیا آپ کو execution کے دوران feedback درکار ہے؟** → Action استعمال کریں
4. **کیا یہ continuous data ہے؟** → Topic استعمال کریں
5. **کیا multiple nodes کو information درکار ہے؟** → Topic استعمال کریں

## Summary

- **Topics (Publish-Subscribe)**: Continuous، asynchronous data streams کے لیے بہترین
- **Services (Request-Response)**: On-demand، synchronous interactions کے لیے بہترین
- **Actions**: Long-running tasks کے لیے بہترین جنہیں feedback کی ضرورت ہے

ان patterns کو سمجھنا اور ہر ایک کو کب استعمال کریں effective ROS 2 systems ڈیزائن کرنے کے لیے essential ہے، خاص طور پر complex applications میں جیسے humanoid robotics۔

## Next Steps

اب جب کہ آپ ROS 2 communication patterns کو سمجھ گئے ہیں، [Humanoid Robotics Applications](/ur/modules/module-1-ros2-nervous-system/humanoid-applications) پر جائیں تاکہ دیکھیں کہ یہ patterns حقیقی humanoid robot scenarios میں کیسے apply ہوتے ہیں۔
