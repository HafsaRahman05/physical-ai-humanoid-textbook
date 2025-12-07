---
id: ros2-fundamentals
title: ROS 2 Fundamentals
sidebar_position: 2
description: Core ROS 2 concepts including nodes، topics، services، اور actions کے ساتھ Python code examples۔
tags: [ros2, nodes, topics, services, actions, fundamentals]
learning_objectives: [lo-001, lo-002]
---

# ROS 2 Fundamentals

اب جب کہ ہم ROS 2 کے کردار کو روبوٹک اعصابی نظام کے طور پر سمجھ گئے ہیں، آئیے بنیادی building blocks کو دریافت کریں جو اس communication کو ممکن بناتے ہیں۔ یہ core concepts foundation بناتے ہیں ہر چیز کے لیے جو آپ ROS 2 کے بارے میں سیکھیں گے۔

## ROS 2 کیا ہے؟

**ROS 2** ایک open-source middleware framework ہے جو robotics applications کے لیے communication infrastructure فراہم کرتا ہے۔ traditional operating system کے برعکس، ROS 2 hardware کو directly manage نہیں کرتا۔ اس کے بجائے، یہ فراہم کرتا ہے:

- **Communication mechanisms** distributed robotic systems کے لیے
- **Standardized interfaces** common robotic tasks کے لیے
- **Tools اور libraries** robot software بنانے کے لیے
- **Language support** Python، C++، اور دوسرے languages شامل کرتے ہوئے

ROS 2 آپ کو complex robotic systems بنانے کے قابل بناتا ہے specialized components (nodes) کو جوڑ کر جو well-defined channels (topics، services، actions) کے ذریعے communicate کرتے ہیں۔

## Core Concepts

ROS 2 چار fundamental concepts کے ارد گرد بنایا گیا ہے جو مل کر ایک distributed robotic system بناتے ہیں:

### Nodes

ایک **node** ROS 2 میں ایک process ہے جو computation انجام دیتا ہے۔ node کو اپنے روبوٹ کے "اعصابی نظام" میں ایک specialized worker کے طور پر سوچیں۔ ہر node کی ایک specific responsibility ہے:

- ایک sensor node camera سے data پڑھ سکتا ہے
- ایک processing node اس image data کا تجزیہ کر سکتا ہے
- ایک control node فیصلہ کر سکتا ہے کہ کیا action لینا ہے
- ایک actuator node اس action کو execute کر سکتا ہے

Nodes independent processes ہیں جو same computer پر چل سکتے ہیں یا robot system میں multiple computers میں distributed ہو سکتے ہیں۔

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

یہ example Python میں ایک ROS 2 node کی basic structure دکھاتا ہے۔ node بنایا جاتا ہے، initialized کیا جاتا ہے، اور پھر "spun" کیا جاتا ہے تاکہ یہ running رہے اور messages process کرے۔

### Topics

ایک **topic** ایک named communication channel ہے جو **publish-subscribe pattern** استعمال کرتا ہے۔ Topics one-to-many communication کو ممکن بناتے ہیں: ایک node ایک topic پر messages publish کرتا ہے، اور multiple nodes subscribe کر سکتے ہیں ان messages کو receive کرنے کے لیے۔

Topics کے لیے ideal ہیں:
- **Sensor data streaming** - Continuous data جیسے camera images، IMU readings
- **State information** - Robot pose، battery level، system status
- **Commands** - Movement commands، mode changes

Publish-subscribe pattern **asynchronous** اور **decoupled** ہے—publishers کو جاننے کی ضرورت نہیں کہ کون subscribe کر رہا ہے، اور subscribers کو جاننے کی ضرورت نہیں کہ کون publish کر رہا ہے۔

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

یہ example دکھاتا ہے کہ ایک node کیسے sensor data کو ایک topic پر publish کرتا ہے۔ دوسرے nodes 'sensor_data' topic کو subscribe کر سکتے ہیں ان readings کو receive کرنے کے لیے۔

### Services

ایک **service** **synchronous request-response communication** فراہم کرتا ہے۔ Topics کے برعکس (جو one-way ہیں)، services ایک node کو اجازت دیتے ہیں کہ وہ دوسرے node سے action یا information request کرے اور response کا انتظار کرے۔

Services کے لیے ideal ہیں:
- **On-demand actions** - "Turn on the camera،" "Get current battery level"
- **Configuration changes** - "Set motor speed to 50%"
- **Query operations** - "What is the robot's current position?"

Services **client-server model** استعمال کرتے ہیں: ایک node service فراہم کرتا ہے (server)، اور دوسرے nodes اسے call کرتے ہیں (clients)۔

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

یہ example ایک service server دکھاتا ہے جو status requests کا جواب دیتا ہے۔ دوسرے nodes اس service کو call کر سکتے ہیں robot کی status حاصل کرنے کے لیے۔

### Actions

ایک **action** **long-running tasks کے لیے ڈیزائن کیا گیا ہے جو feedback فراہم کرتے ہیں**۔ Actions topics اور services دونوں کے aspects کو combine کرتے ہیں:

- Services کی طرح، actions کا ایک goal (request) ہوتا ہے
- Topics کی طرح، actions execution کے دوران continuous feedback فراہم کرتے ہیں
- Actions complete ہونے پر ایک final result بھی فراہم کرتے ہیں

Actions کے لیے ideal ہیں:
- **Navigation tasks** - ایک location پر move کرنا progress updates کے ساتھ
- **Manipulation tasks** - ایک object کو grasp کرنا approach پر feedback کے ساتھ
- **Complex behaviors** - Multi-step processes جو وقت لیتے ہیں

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

یہ example ایک action server دکھاتا ہے جو ایک long-running task execute کرتا ہے جبکہ client کو periodic feedback فراہم کرتا ہے۔

## Concept Relationships

یہ چار concepts مل کر ایک complete ROS 2 system بناتے ہیں:

- **Nodes** workers ہیں جو computation انجام دیتے ہیں
- **Topics** asynchronous، one-to-many communication کو ممکن بناتے ہیں
- **Services** synchronous، request-response interactions کو ممکن بناتے ہیں
- **Actions** long-running tasks کو feedback کے ساتھ ممکن بناتے ہیں

ایک humanoid robot میں، آپ کے پاس ہو سکتا ہے:
- Sensor nodes topics پر publish کرتے ہیں (camera images، joint positions)
- Processing nodes topics کو subscribe کرتے ہیں اور results publish کرتے ہیں
- Control nodes services کو call کرتے ہیں specific actions request کرنے کے لیے
- Planning nodes actions استعمال کرتے ہیں complex behaviors execute کرنے کے لیے جیسے walking

## Key Takeaways

1. **ROS 2 middleware ہے** - یہ communication infrastructure فراہم کرتا ہے، direct hardware control نہیں
2. **Nodes independent processes ہیں** - ہر ایک ایک specific function انجام دیتا ہے
3. **Topics decoupled communication کو ممکن بناتے ہیں** - Publishers اور subscribers کو ایک دوسرے کے بارے میں جاننے کی ضرورت نہیں
4. **Services synchronous interactions فراہم کرتے ہیں** - On-demand requests اور responses کے لیے
5. **Actions long-running tasks handle کرتے ہیں** - Execution کے دوران continuous feedback کے ساتھ

## Next Steps

اب جب کہ آپ core ROS 2 concepts کو سمجھ گئے ہیں، [Communication Patterns](/ur/modules/module-1-ros2-nervous-system/communication-patterns) پر جائیں تاکہ سیکھیں کہ ہر communication mechanism کو effectively کب اور کیسے استعمال کریں۔
