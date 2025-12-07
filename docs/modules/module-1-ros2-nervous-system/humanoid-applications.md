---
id: humanoid-applications
title: Humanoid Robotics Applications
sidebar_position: 4
description: Connecting ROS 2 concepts to humanoid robotics applications including sensor integration, actuator coordination, and locomotion control.
tags: [ros2, humanoid-robotics, applications, sensors, actuators, locomotion]
learning_objectives: [lo-003]
---

# Humanoid Robotics Applications

Now that you understand ROS 2's core concepts and communication patterns, let's explore how these apply specifically to humanoid robotics. Humanoid robots present unique challenges that make ROS 2's distributed communication architecture particularly valuable.

## ROS 2 in Humanoid Robotics

Humanoid robots are among the most complex robotic systems, requiring coordination between:

- **Multiple sensors** (vision, proprioception, touch, balance)
- **Numerous actuators** (joints in arms, legs, hands, head)
- **Complex processing** (perception, planning, control)
- **Real-time coordination** for stable, natural movement

ROS 2's distributed architecture makes it possible to manage this complexity by allowing specialized nodes to handle different aspects of the robot's operation.

## Sensor Integration with Topics

Humanoid robots rely on extensive sensor arrays to perceive their environment and understand their own state. ROS 2 topics are ideal for streaming this continuous sensor data.

### Vision Sensors

Humanoid robots typically have multiple cameras (head-mounted, hand-mounted) that generate continuous image streams:

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

Multiple processing nodes can subscribe to these image topics:
- **Object detection node** - Identifies objects in the scene
- **Face recognition node** - Recognizes human faces
- **Navigation node** - Uses visual information for localization

### Proprioceptive Sensors

Proprioceptive sensors (joint encoders, IMUs, force sensors) provide continuous feedback about the robot's body state:

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

This joint state information flows to:
- **Control nodes** - For closed-loop control of each joint
- **Balance node** - For maintaining stability
- **Planning node** - For motion planning

## Actuator Coordination with Services

Humanoid robots have many actuators (typically 20-40+ joints) that must be coordinated precisely. Services are useful for on-demand actuator control and configuration.

### Coordinated Movement

When a humanoid robot needs to perform a coordinated movement (like reaching for an object), multiple joints must move together:

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

Services are also useful for configuring actuator parameters:

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

## Locomotion Control with Actions

Walking and other locomotion behaviors are long-running tasks that require continuous feedback and the ability to adapt or cancel. Actions are perfect for these scenarios.

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

This walking action provides:
- **Continuous feedback** on progress (current step, current pose)
- **Ability to cancel** if an obstacle is detected
- **Final result** with the achieved pose

## Mapping ROS 2 Components to Robot Subsystems

Here's how ROS 2 components map to a humanoid robot's subsystems:

| Robot Subsystem | ROS 2 Component | Communication Pattern | Example |
|----------------|-----------------|----------------------|---------|
| Vision System | Camera nodes | Topics | Head camera → Image processing nodes |
| Proprioception | Sensor nodes | Topics | Joint encoders → State estimation |
| Balance Control | Control nodes | Topics + Services | IMU data (topic) → Balance service calls |
| Arm Control | Actuator nodes | Services | Reach command → Arm coordination service |
| Leg Control | Locomotion nodes | Actions | Walk command → Walking action |
| Planning | Planning nodes | Topics + Services | Sensor data (topics) → Plan requests (services) |
| High-level Control | Behavior nodes | Actions | "Pick up object" → Manipulation action |

### Bridging Python Agents to ROS Controllers

High-level Python agents (AI systems, planning algorithms, decision-making modules) often need to communicate with low-level ROS 2 controllers that manage robot hardware. **Agent bridging** refers to the patterns and mechanisms that connect these high-level systems to ROS 2-based robot controllers using `rclpy` (ROS 2 Python client library).

#### Agent-Controller Communication Patterns

Python agents can bridge to ROS 2 controllers using the same communication patterns available in ROS 2:

- **Topics**: For streaming commands or receiving continuous state updates
- **Services**: For on-demand requests and synchronous operations
- **Actions**: For long-running tasks that require feedback and cancellation

Each pattern serves different needs in agent-controller communication, allowing agents to choose the most appropriate mechanism for their specific interaction.

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

This pattern enables agents to send continuous commands (like velocity commands) while receiving state updates, creating a feedback loop for control.

#### Example: Agent Using Services

Agents can call services provided by controllers for on-demand operations:

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

This pattern is useful when agents need to request specific actions from controllers and wait for confirmation before proceeding.

#### Example: Agent Using Actions

Agents can use actions for complex behaviors that require feedback:

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

This pattern enables agents to execute complex behaviors (like navigation) while receiving progress updates and maintaining the ability to cancel if needed.

These bridging patterns allow Python agents to leverage ROS 2's communication infrastructure while maintaining separation between high-level decision-making (agents) and low-level control (controllers). For more details on these communication patterns, see [Communication Patterns](./communication-patterns.md).

## Complete System Example

In a humanoid robot picking up an object:

1. **Vision nodes** publish camera images to topics
2. **Object detection node** subscribes to images, publishes object location to a topic
3. **Planning node** subscribes to object location, calls arm control service to plan trajectory
4. **Arm control service** coordinates multiple joints synchronously
5. **Grasping action** executes the grasp with feedback on finger positions
6. **Balance node** continuously subscribes to IMU data (topic) to maintain stability

This demonstrates how all three communication patterns work together in a real humanoid robot application.

## Key Takeaways

1. **Topics** stream continuous sensor data to multiple processing nodes
2. **Services** coordinate actuators for synchronous, on-demand actions
3. **Actions** execute complex behaviors like walking with feedback and cancellation
4. **Humanoid robots** use all three patterns simultaneously for different subsystems
5. **ROS 2's distributed architecture** makes it possible to manage the complexity of humanoid systems

## Next Steps

Now that you understand how ROS 2 applies to humanoid robotics, proceed to [Workspace Overview](./workspace-overview.md) to learn about ROS 2 workspace structure, or review the [Glossary](./glossary.md) for quick reference to key terms.

