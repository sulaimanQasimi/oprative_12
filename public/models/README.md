# 3D Warehouse Models

This directory contains 3D models used for the warehouse landing page.

## Required Models

- `warehouse.glb` - A 3D model of a warehouse with shelves, forklifts, and other warehouse elements

## Obtaining Models

1. You can create your own models using Blender or other 3D modeling software
2. Export the model in glTF/GLB format which is optimized for web use
3. Place the exported file in this directory as `warehouse.glb`

## Alternative Options

If you don't have a model, the application will fall back to a simple procedurally generated warehouse made with Three.js primitives.

## Model Requirements

For best performance:
- Keep the model under 5MB
- Use low-poly modeling techniques
- Compress textures to reduce file size
- Use a reasonable number of lights and shadows 