---
id: humanoid-applications
title: Humanoid Robotics Applications
sidebar_position: 4
description: ROS 2 concepts کو humanoid robotics applications سے جوڑنا sensor integration، actuator coordination، اور locomotion control شامل کرتے ہوئے۔
tags: [ros2, humanoid-robotics, applications, sensors, actuators, locomotion]
learning_objectives: [lo-003]
---

# Humanoid Robotics Applications

اب جب کہ آپ ROS 2 کے core concepts اور communication patterns کو سمجھ گئے ہیں، آئیے دیکھتے ہیں کہ یہ خاص طور پر humanoid robotics پر کیسے apply ہوتے ہیں۔ Humanoid robots unique challenges پیش کرتے ہیں جو ROS 2 کی distributed communication architecture کو particularly valuable بناتے ہیں۔

## Humanoid Robotics میں ROS 2

Humanoid robots سب سے پیچیدہ robotic systems میں سے ہیں، درکار coordination کے درمیان:

- **متعدد sensors** (vision، proprioception، touch، balance)
- **کثیر actuators** (joints arms، legs، hands، head میں)
- **پیچیدہ processing** (perception، planning، control)
- **Real-time coordination** stable، natural movement کے لیے

ROS 2 کی distributed architecture اس پیچیدگی کو manage کرنا ممکن بناتی ہے specialized nodes کو اجازت دے کر robot کے operation کے مختلف aspects handle کرنے کے لیے۔

## Topics کے ساتھ Sensor Integration

Humanoid robots extensive sensor arrays پر rely کرتے ہیں اپنے environment کو perceive کرنے اور اپنی state کو سمجھنے کے لیے۔ ROS 2 topics اس continuous sensor data کو stream کرنے کے لیے ideal ہیں۔

### Vision Sensors

Humanoid robots typically multiple cameras رکھتے ہیں (head-mounted، hand-mounted) جو continuous image streams generate کرتے ہیں:

```python
# Example: Camera sensor node publishing images
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image

class HeadCameraNode(Node):
    def __init__(self):
        super().__init__('head_camera')
        self.publisher = self.create_publisher(Image, 'sensors/head_camera/image', 10)
        self.timer = self.create_timer(0.033, self.publish_image)  # 30 FPS
    
    def publish_image(self):
        # Capture image from head-mounted camera
        msg = Image()
        # ... populate with camera data ...
        self.publisher.publish(msg)
```

Multiple processing nodes ان image topics کو subscribe کر سکتے ہیں:
- **Object detection node** - Scene میں objects identify کرتا ہے
- **Face recognition node** - Human faces recognize کرتا ہے
- **Navigation node** - Localization کے لیے visual information استعمال کرتا ہے

### Proprioceptive Sensors

Proprioceptive sensors (joint encoders، IMUs، force sensors) robot کی body state کے بارے میں continuous feedback فراہم کرتے ہیں:

```python
# Example: Joint state publisher
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import JointState

class JointStatePublisher(Node):
    def __init__(self):
        super().__init__('joint_state_publisher')
        self.publisher = self.create_publisher(JointState, 'sensors/joint_states', 10)
        self.timer = self.create_timer(0.01, self.publish_states)  # 100 Hz
    
    def publish_states(self):
        msg = JointState()
        # Populate with joint positions, velocities, efforts
        # ... read from robot hardware ...
        self.publisher.publish(msg)
```

یہ joint state information flow کرتی ہے:
- **Control nodes** - ہر joint کے closed-loop control کے لیے
- **Balance node** - Stability برقرار رکھنے کے لیے
- **Planning node** - Motion planning کے لیے

## Services کے ساتھ Actuator Coordination

Humanoid robots کے پاس کثیر actuators ہیں (typically 20-40+ joints) جنہیں precisely coordinate کیا جانا چاہیے۔ Services on-demand actuator control اور configuration کے لیے useful ہیں۔

### Coordinated Movement

جب ایک humanoid robot کو coordinated movement perform کرنے کی ضرورت ہو (جیسے object تک reach کرنا)، multiple joints کو مل کر move کرنا چاہیے:

```python
# Example: Actuator coordination service
import rclpy
from rclpy.node import Node
from example_interfaces.srv import SetBool

class ArmControlService(Node):
    def __init__(self):
        super().__init__('arm_control')
        self.srv = self.create_service(
            SetBool,
            'control/arm/move_to_pose',
            self.move_arm_callback
        )
    
    def move_arm_callback(self, request, response):
        if request.data:  # If request is to move
            # Coordinate multiple joints to reach target pose
            # Shoulder, elbow, wrist joints move together
            response.success = self.execute_coordinated_movement()
            response.message = "Arm movement executed" if response.success else "Movement failed"
        return response
```

### Configuration Services

Services actuator parameters configure کرنے کے لیے بھی useful ہیں:

```python
# Example: Setting joint limits or control parameters
class JointConfigService(Node):
    def __init__(self):
        super().__init__('joint_config')
        self.srv = self.create_service(
            # Custom service type for joint configuration
            'joint_config',
            self.config_callback
        )
    
    def config_callback(self, request, response):
        # Set joint speed limits, torque limits, etc.
        # This is a synchronous operation - we need confirmation
        response.success = True
        return response
```

## Actions کے ساتھ Locomotion Control

Walking اور دوسرے locomotion behaviors long-running tasks ہیں جنہیں continuous feedback اور adapt یا cancel کرنے کی ability درکار ہے۔ Actions ان scenarios کے لیے perfect ہیں۔

### Walking Action

```python
# Example: Walking action for humanoid robot
import rclpy
from rclpy.node import Node
from rclpy.action import ActionServer
# Custom action type for navigation
from custom_msgs.action import WalkToGoal

class WalkingActionServer(Node):
    def __init__(self):
        super().__init__('walking_server')
        self._action_server = ActionServer(
            self,
            WalkToGoal,
            'locomotion/walk',
            self.walk_callback
        )
    
    def walk_callback(self, goal_handle):
        goal = goal_handle.request
        feedback_msg = WalkToGoal.Feedback()
        
        # Execute walking with continuous feedback
        total_steps = self.calculate_steps(goal.target_pose)
        current_step = 0
        
        while current_step < total_steps:
            # Execute one walking step
            # Update balance, shift weight, lift foot, place foot
            current_step += 1
            
            # Provide feedback
            feedback_msg.current_step = current_step
            feedback_msg.total_steps = total_steps
            feedback_msg.current_pose = self.get_current_pose()
            goal_handle.publish_feedback(feedback_msg)
            
            # Check for cancellation (e.g., obstacle detected)
            if goal_handle.is_cancel_requested:
                goal_handle.canceled()
                return WalkToGoal.Result()
        
        # Walking complete
        goal_handle.succeed()
        result = WalkToGoal.Result()
        result.final_pose = self.get_current_pose()
        return result
```

یہ walking action فراہم کرتا ہے:
- **Continuous feedback** progress پر (current step، current pose)
- **Cancel کرنے کی ability** اگر obstacle detect ہو
- **Final result** achieved pose کے ساتھ

## Robot Subsystems پر ROS 2 Components کا Mapping

یہاں ہے کہ ROS 2 components ایک humanoid robot کے subsystems پر کیسے map ہوتے ہیں:

| Robot Subsystem | ROS 2 Component | Communication Pattern | Example |
|----------------|-----------------|----------------------|---------|
| Vision System | Camera nodes | Topics | Head camera → Image processing nodes |
| Proprioception | Sensor nodes | Topics | Joint encoders → State estimation |
| Balance Control | Control nodes | Topics + Services | IMU data (topic) → Balance service calls |
| Arm Control | Actuator nodes | Services | Reach command → Arm coordination service |
| Leg Control | Locomotion nodes | Actions | Walk command → Walking action |
| Planning | Planning nodes | Topics + Services | Sensor data (topics) → Plan requests (services) |
| High-level Control | Behavior nodes | Actions | "Pick up object" → Manipulation action |

### ROS Controllers سے Python Agents کو Bridging

High-level Python agents (AI systems، planning algorithms، decision-making modules) اکثر low-level ROS 2 controllers کے ساتھ communicate کرنے کی ضرورت ہوتی ہے جو robot hardware manage کرتے ہیں۔ **Agent bridging** patterns اور mechanisms کو refer کرتا ہے جو ان high-level systems کو ROS 2-based robot controllers سے connect کرتے ہیں `rclpy` (ROS 2 Python client library) استعمال کرتے ہوئے۔

#### Agent-Controller Communication Patterns

Python agents ROS 2 controllers سے bridge کر سکتے ہیں ROS 2 میں available same communication patterns استعمال کرتے ہوئے:

- **Topics**: Commands streaming کرنے یا continuous state updates receive کرنے کے لیے
- **Services**: On-demand requests اور synchronous operations کے لیے
- **Actions**: Long-running tasks کے لیے جنہیں feedback اور cancellation درکار ہے

ہر pattern agent-controller communication میں مختلف needs serve کرتا ہے، agents کو اجازت دیتا ہے کہ وہ اپنی specific interaction کے لیے most appropriate mechanism choose کریں۔

#### Example: Agent Using Topics

Agents can publish commands to topics that controllers subscribe to:

```python
# Example: Python agent publishing movement commands to ROS 2 controller
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist

class AgentNode(Node):
    """High-level agent that bridges to ROS 2 controllers via topics"""
    
    def __init__(self):
        super().__init__('agent_node')
        # Agent publishes commands to controller
        self.command_publisher = self.create_publisher(
            Twist,
            '/robot/cmd_vel',  # Controller subscribes to this topic
            10
        )
        # Agent subscribes to robot state from controller
        self.state_subscription = self.create_subscription(
            JointState,
            '/joint_states',  # Controller publishes state here
            self.state_callback,
            10
        )
        self.current_state = None
    
    def state_callback(self, msg):
        """Receive robot state from controller"""
        self.current_state = msg
        # Agent can make decisions based on current state
    
    def send_movement_command(self, linear_x, angular_z):
        """Agent sends movement command to controller"""
        msg = Twist()
        msg.linear.x = linear_x
        msg.angular.z = angular_z
        self.command_publisher.publish(msg)
        self.get_logger().info(f'Agent sent command: linear={linear_x}, angular={angular_z}')
```

یہ pattern agents کو continuous commands بھیجنے کے قابل بناتا ہے (جیسے velocity commands) جبکہ state updates receive کرتے ہیں، control کے لیے feedback loop بناتے ہوئے۔

#### Example: Agent Using Services

Agents controllers کی فراہم کردہ services کو call کر سکتے ہیں on-demand operations کے لیے:

```python
# Example: Python agent calling controller service
import rclpy
from rclpy.node import Node
from example_interfaces.srv import Trigger

class AgentNode(Node):
    """High-level agent bridging to ROS 2 controller via services"""
    
    def __init__(self):
        super().__init__('agent_node')
        # Agent creates service client to call controller service
        self.arm_control_client = self.create_client(
            Trigger,
            '/robot/arm/activate'  # Controller provides this service
        )
    
    def activate_arm(self):
        """Agent requests controller to activate arm"""
        request = Trigger.Request()
        future = self.arm_control_client.call_async(request)
        rclpy.spin_until_future_complete(self, future)
        
        if future.result().success:
            self.get_logger().info('Agent successfully activated arm via controller')
            return True
        else:
            self.get_logger().warn('Agent failed to activate arm')
            return False
```

یہ pattern useful ہے جب agents کو controllers سے specific actions request کرنے کی ضرورت ہو اور proceeding سے پہلے confirmation کا انتظار کرنا ہو۔

#### Example: Agent Using Actions

Agents complex behaviors کے لیے actions استعمال کر سکتے ہیں جنہیں feedback درکار ہے:

```python
# Example: Python agent using action to control robot behavior
import rclpy
from rclpy.node import Node
from rclpy.action import ActionClient
from nav2_msgs.action import NavigateToPose

class AgentNode(Node):
    """High-level agent bridging to ROS 2 controller via actions"""
    
    def __init__(self):
        super().__init__('agent_node')
        # Agent creates action client
        self._action_client = ActionClient(
            self,
            NavigateToPose,
            '/robot/navigate_to_pose'  # Controller provides this action
        )
    
    def navigate_to_goal(self, target_x, target_y):
        """Agent sends navigation goal to controller via action"""
        goal_msg = NavigateToPose.Goal()
        goal_msg.pose.pose.position.x = target_x
        goal_msg.pose.pose.position.y = target_y
        
        self._action_client.wait_for_server()
        send_goal_future = self._action_client.send_goal_async(
            goal_msg,
            feedback_callback=self.feedback_callback
        )
        rclpy.spin_until_future_complete(self, send_goal_future)
        
        goal_handle = send_goal_future.result()
        if not goal_handle.accepted:
            self.get_logger().error('Agent goal rejected by controller')
            return
        
        # Wait for result
        result_future = goal_handle.get_result_async()
        rclpy.spin_until_future_complete(self, result_future)
        
        result = result_future.result().result
        self.get_logger().info(f'Agent navigation completed: {result}')
    
    def feedback_callback(self, feedback_msg):
        """Agent receives feedback from controller during action execution"""
        self.get_logger().info(
            f'Agent received feedback: distance remaining = {feedback_msg.distance_remaining}'
        )
```

یہ pattern agents کو complex behaviors execute کرنے کے قابل بناتا ہے (جیسے navigation) جبکہ progress updates receive کرتے ہیں اور cancel کرنے کی ability برقرار رکھتے ہیں اگر ضرورت ہو۔

یہ bridging patterns Python agents کو ROS 2 کی communication infrastructure leverage کرنے کی اجازت دیتے ہیں جبکہ high-level decision-making (agents) اور low-level control (controllers) کے درمیان separation برقرار رکھتے ہیں۔ ان communication patterns کے بارے میں مزید تفصیلات کے لیے، [Communication Patterns](/ur/modules/module-1-ros2-nervous-system/communication-patterns) دیکھیں۔

## Complete System Example

ایک humanoid robot میں object اٹھاتے ہوئے:

1. **Vision nodes** topics پر camera images publish کرتے ہیں
2. **Object detection node** images کو subscribe کرتا ہے، object location کو ایک topic پر publish کرتا ہے
3. **Planning node** object location کو subscribe کرتا ہے، trajectory plan کرنے کے لیے arm control service کو call کرتا ہے
4. **Arm control service** multiple joints کو synchronously coordinate کرتا ہے
5. **Grasping action** finger positions پر feedback کے ساتھ grasp execute کرتا ہے
6. **Balance node** continuously IMU data (topic) کو subscribe کرتا ہے stability برقرار رکھنے کے لیے

یہ demonstrate کرتا ہے کہ تمام تین communication patterns ایک حقیقی humanoid robot application میں کیسے مل کر کام کرتے ہیں۔

## Key Takeaways

1. **Topics** continuous sensor data کو multiple processing nodes تک stream کرتے ہیں
2. **Services** synchronous، on-demand actions کے لیے actuators coordinate کرتے ہیں
3. **Actions** complex behaviors execute کرتے ہیں جیسے walking feedback اور cancellation کے ساتھ
4. **Humanoid robots** تمام تین patterns simultaneously استعمال کرتے ہیں different subsystems کے لیے
5. **ROS 2 کی distributed architecture** humanoid systems کی پیچیدگی کو manage کرنا ممکن بناتی ہے

## Next Steps

اب جب کہ آپ سمجھ گئے ہیں کہ ROS 2 humanoid robotics پر کیسے apply ہوتا ہے، [Workspace Overview](/ur/modules/module-1-ros2-nervous-system/workspace-overview) پر جائیں تاکہ ROS 2 workspace structure کے بارے میں سیکھیں، یا key terms کے quick reference کے لیے [Glossary](/ur/modules/module-1-ros2-nervous-system/glossary) review کریں۔

