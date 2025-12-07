---
id: workspace-overview
title: Workspace Overview
sidebar_position: 5
description: ROS 2 workspace structure اور organization کا conceptual overview detailed installation steps کے بغیر۔
tags: [ros2, workspace, structure, organization]
learning_objectives: []
---

# Workspace Overview

ROS 2 workspace structure کو سمجھنا آپ کو conceptualize کرنے میں مدد کرتا ہے کہ ROS 2 projects کیسے منظم ہوتے ہیں۔ یہ section workspace concepts کا brief overview فراہم کرتا ہے detailed installation procedures کے بغیر۔

## ROS 2 Workspace کیا ہے؟

ایک **ROS 2 workspace** ایک directory structure ہے جہاں آپ اپنا ROS 2 code، packages، اور build artifacts organize کرتے ہیں۔ اسے اپنے project کے home directory کے طور پر سوچیں—آپ کے روبوٹ کے software سے متعلق ہر چیز یہاں رہتی ہے۔

## Workspace Structure

ایک typical ROS 2 workspace کی یہ structure ہے:

```
workspace/
├── src/                    # Source code directory
│   └── my_robot_package/   # Your ROS 2 packages
│       ├── package.xml     # Package metadata
│       ├── setup.py        # Python package setup
│       └── my_robot_package/
│           └── nodes/      # Your node implementations
├── build/                  # Build artifacts (generated)
├── install/                # Installed packages (generated)
└── log/                    # Build logs (generated)
```

### Key Components

- **`src/`** - آپ کا source code اور ROS 2 packages شامل ہیں
- **`build/`** - Intermediate build files (compilation کے دوران created)
- **`install/`** - Installed packages استعمال کے لیے تیار (building کے بعد created)
- **`log/`** - Build اور runtime logs

## Packages

ایک **package** ROS 2 میں organization کی fundamental unit ہے۔ ہر package:

- Related functionality شامل کرتا ہے (مثلاً، sensor drivers، control algorithms)
- ایک `package.xml` file رکھتا ہے جو package کو describe کرتی ہے
- Nodes، libraries، configuration files، اور مزید شامل کر سکتا ہے
- دوسرے packages پر depend کر سکتا ہے

### Package Structure Example

```
my_sensor_package/
├── package.xml          # Package metadata and dependencies
├── setup.py             # Python package configuration
└── my_sensor_package/
    ├── __init__.py
    └── nodes/
        └── camera_node.py  # Your node implementation
```

## Build System

ROS 2 ایک build system استعمال کرتا ہے:

- آپ کے code کو **compile** کرنے کے لیے (C++ packages کے لیے)
- Python packages کو **install** کرنے کے لیے
- Packages کے درمیان **dependencies resolve** کرنے کے لیے
- Message اور service definitions **generate** کرنے کے لیے

Build process `build/` اور `install/` directories کو automatically create کرتا ہے۔

## Workspace Concepts

### Source Space (`src/`)

یہ وہ جگہ ہے جہاں آپ اپنا code لکھتے ہیں۔ آپ یہاں packages بناتے ہیں، اور ہر package شامل کرتا ہے:

- Node implementations
- Message/service/action definitions
- Configuration files
- Launch files (multiple nodes شروع کرنے کے لیے)

### Install Space (`install/`)

Building کے بعد، ROS 2 packages کو `install/` directory میں install کرتا ہے۔ یہ وہ جگہ ہے جہاں:

- Executable nodes located ہیں
- Python packages installed ہیں
- Message/service/action definitions available ہیں
- Configuration files accessible ہیں

### Environment Setup

Workspace استعمال کرنے کے لیے، آپ اسے "source" کرتے ہیں، جو installed packages کو ROS 2 کے لیے available بناتا ہے۔ یہ typically کیا جاتا ہے:

```bash
source install/setup.bash  # For bash
# or
source install/setup.zsh  # For zsh
```

یہ command environment variables set up کرتی ہے تاکہ ROS 2 آپ کے packages کو find کر سکے۔

## Python Package Example

ROS 2 میں Python packages کے لیے:

```python
# setup.py - Package configuration
from setuptools import setup
from glob import glob

setup(
    name='my_sensor_package',
    version='0.0.1',
    packages=['my_sensor_package'],
    data_files=[
        ('share/ament_index/resource_index/packages',
            ['resource/my_sensor_package']),
        ('share/my_sensor_package', ['package.xml']),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    entry_points={
        'console_scripts': [
            'camera_node = my_sensor_package.nodes.camera_node:main',
        ],
    },
)
```

یہ configuration:
- Package name اور version define کرتی ہے
- Specify کرتی ہے کہ کون سے Python modules شامل ہیں
- Entry points define کرتی ہے (executable nodes)
- Dependencies list کرتی ہے

## Workspace Organization Best Practices

1. **One package per functionality** - Packages کو focused اور modular رکھیں
2. **Clear naming** - Descriptive package اور node names استعمال کریں
3. **Dependency management** - `package.xml` میں dependencies declare کریں
4. **Version control** - اپنی `src/` directory track کریں، `build/`، `install/`، `log/` ignore کریں

### URDF for Humanoid Robots

**URDF (Unified Robot Description Format)** ROS 2 میں robot structure describe کرنے کے لیے ایک XML-based standard ہے۔ URDF files define کرتی ہیں کہ روبوٹ کیسے بنایا گیا ہے: اس کے body segments (links)، وہ کیسے connect ہوتے ہیں (joints)، اور ان کی physical properties۔ Humanoid robots کے لیے، URDF robot کی anatomy describe کرنے کا standardized way فراہم کرتا ہے، simulation، visualization، اور control systems کو robot کی structure سمجھنے کے قابل بناتا ہے۔

#### URDF Structure

ایک URDF file robot کو describe کرتی ہے several key elements استعمال کرتے ہوئے:

- **Links**: Rigid body segments represent کرتے ہیں (مثلاً، torso، upper arm، lower arm، hand)
- **Joints**: Define کرتے ہیں کہ links کیسے connect ہوتے ہیں اور وہ ایک دوسرے کے relative کیسے move کر سکتے ہیں
- **Visual Geometry**: Describe کرتی ہے کہ روبوٹ کیسا لگتا ہے (3D models، colors، materials)
- **Collision Geometry**: Physics simulation کے لیے collision boundaries define کرتی ہے
- **Physical Properties**: Mass، inertia، اور دوسری physical characteristics

URDF میں ہر link robot کے body کا ایک حصہ represent کرتا ہے، اور joints links کے درمیان relationships define کرتے ہیں—وہ کیسے rotate، translate، یا fixed relative to each other رہ سکتے ہیں۔

#### Humanoid-Specific URDF Elements

Humanoid robots کے لیے، URDF typically شامل کرتا ہے:

- **Torso**: Central body segment جو limbs سے connect ہوتا ہے
- **Limbs**: Arms (shoulder، upper arm، forearm، hand) اور legs (hip، thigh، shin، foot)
- **Head**: Head segment optional neck joint کے ساتھ
- **Joints**: Rotation کے لیے revolute joints (shoulders، elbows، hips، knees) اور rigid connections کے لیے fixed joints

ایک humanoid URDF structure یوں لگ سکتا ہے:

```xml
<!-- Simplified example of humanoid URDF structure -->
<robot name="humanoid_robot">
  <!-- Torso (base link) -->
  <link name="torso">
    <visual>
      <geometry>
        <box size="0.3 0.2 0.4"/>
      </geometry>
    </visual>
  </link>
  
  <!-- Left shoulder joint -->
  <joint name="left_shoulder" type="revolute">
    <parent link="torso"/>
    <child link="left_upper_arm"/>
    <axis xyz="0 1 0"/>
    <limit lower="-1.57" upper="1.57"/>
  </joint>
  
  <!-- Left upper arm link -->
  <link name="left_upper_arm">
    <visual>
      <geometry>
        <cylinder radius="0.05" length="0.3"/>
      </geometry>
    </visual>
  </link>
  
  <!-- Additional joints and links for elbow, wrist, etc. -->
</robot>
```

یہ structure ROS 2 systems کو robot کی kinematic chain سمجھنے کے قابل بناتا ہے—ایک joint میں movement connected links کی position کو کیسے affect کرتی ہے۔

#### URDF اور ROS 2

URDF files **robot description** system کے ذریعے ROS 2 کے ساتھ integrate ہوتی ہیں۔ ROS 2 nodes URDF files load کر سکتے ہیں:

- **Robot visualize** کرنے کے لیے RViz میں (ROS 2 visualization tool)
- **Robot state publish** کرنے کے لیے `robot_state_publisher` node استعمال کرتے ہوئے
- **Simulation enable** کرنے کے لیے Gazebo جیسے simulators کو robot structure فراہم کر کے
- **Control systems support** کرنے کے لیے kinematic relationships define کر کے

`robot_state_publisher` node URDF پڑھتا ہے اور robot کی current state (joint positions) transforms کے طور پر publish کرتا ہے، دوسرے nodes کو سمجھنے کے قابل بناتا ہے کہ robot کا ہر حصہ 3D space میں کہاں located ہے۔ یہ inverse kinematics (target position تک پہنچنے کے لیے joint angles calculate کرنا) اور collision checking جیسے tasks کے لیے essential ہے۔

ROS 2 topics اور robot state کیسے communicate ہوتی ہے اس کے بارے میں مزید معلومات کے لیے، [Communication Patterns](/ur/modules/module-1-ros2-nervous-system/communication-patterns) دیکھیں۔

## Conceptual Understanding

اس ماڈیول کے لیے، سمجھنے کے لیے key concepts ہیں:

- **Workspace** = آپ کی project directory
- **Package** = Related functionality کی ایک unit
- **Node** = ایک executable process (package میں رہتا ہے)
- **Build** = Process جو آپ کے code کو execution کے لیے prepare کرتا ہے
- **Install** = وہ جگہ جہاں ROS 2 آپ کے built packages کو find کرتا ہے

آپ کو exact build commands یا installation procedures جاننے کی ضرورت نہیں ابھی—وہ بعد کے modules میں cover ہوں گے جو hands-on development پر focus کرتے ہیں۔

## Key Takeaways

1. **Workspace** آپ کے ROS 2 code اور packages organize کرتا ہے
2. **Packages** related functionality اور nodes شامل کرتے ہیں
3. **Build system** آپ کے packages compile اور install کرتا ہے
4. **Install space** وہ جگہ ہے جہاں ROS 2 runtime میں آپ کے packages کو find کرتا ہے
5. **Modular organization** complex robot systems کو manageable بناتا ہے

## Next Steps

آپ نے اب ماڈیول 1 کا core content مکمل کر لیا ہے! آپ سمجھ گئے ہیں:

- ROS 2 کا کردار بطور روبوٹک اعصابی نظام
- Core concepts: nodes، topics، services، actions
- Communication patterns اور ہر ایک کو کب استعمال کریں
- ROS 2 humanoid robotics پر کیسے apply ہوتا ہے
- Workspace structure concepts

Quick reference کے لیے [Glossary](/ur/modules/module-1-ros2-nervous-system/glossary) review کریں، یا ماڈیول 2 (جب available ہو) پر جائیں تاکہ ROS 2 development میں deeper dive کریں۔
