# Physical AI Humanoid Robotics Textbook

A comprehensive educational textbook covering Physical AI, Humanoid Robotics, and ROS 2.

## Modules

### Module 1: The Robotic Nervous System (ROS 2)

Learn about ROS 2 as the communication framework for robotic systems, covering:
- ROS 2 fundamentals (nodes, topics, services, actions)
- Communication patterns
- Humanoid robotics applications
- Workspace structure

## Development

This textbook is built with [Docusaurus](https://docusaurus.io/).

### Installation

```bash
npm install
```

### Local Development

```bash
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions when changes are pushed to the main branch.

**Live Site**: https://hafsarahman05.github.io/physical-ai-humanoid-textbook/

**Deployment Process**:
- Push changes to `main` or `master` branch
- GitHub Actions automatically builds and deploys the site
- Site is available at the URL above within 5-10 minutes

For detailed deployment instructions and troubleshooting, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## License

This project is licensed under the MIT License.

