# Annotation Height Gap Fix Implementation Plan

## Problem
The annotation markers have a visible gap between the colored dot at the end of the annotation line and the actual point cloud surface. This is because:
1. The CSS line has a fixed pixel height (80px) that doesn't scale with zoom
2. The 3D world offset (12 units) doesn't translate to a consistent screen pixel distance
3. When zoomed in/out, the pixel distance changes but the CSS line stays fixed

## Solution
Replace the CSS-based line and dot with THREE.js Line objects and Sphere meshes that exist in 3D world space and always connect properly regardless of camera position.

## Implementation Steps

- [x] **1. Modify createMarker() function**
  - Remove CSS line div element
  - Remove CSS dot div element
  - Keep only the text label in the container
  - Create THREE.Line connecting label position to point position
  - Create THREE.Mesh (small sphere) at the actual point position
  - Store references to line and dot on the annotation object
  - Add line and dot to annotationMarkers group

- [x] **2. Update removeMarker() function**
  - Properly dispose of THREE.Line geometry and material
  - Properly dispose of THREE.Mesh (dot) geometry and material
  - Remove both from annotationMarkers group

- [x] **3. Update clearMarkers() function**
  - Handle disposal of lines and dots (meshes) in addition to existing cleanup

- [x] **4. Update updateAnnotationMarkers() function**
  - Each frame, update line geometry to connect current label position to point position
  - Ensure line endpoints are updated with positions.needsUpdate = true

- [x] **5. Test the implementation**
  - Verify line connects directly from label to point on surface
  - Verify dot appears exactly on the point cloud surface
  - Verify proper behavior when zooming in/out
  - Verify proper behavior when rotating camera

## Technical Details

### Line Creation
```javascript
const lineMaterial = new THREE.LineBasicMaterial({
  color: annotation.color,
  transparent: true,
  opacity: 0.8
});

const lineGeometry = new THREE.BufferGeometry().setFromPoints([
  labelPosition,  // Above the point
  pointPosition   // On the surface
]);

const line = new THREE.Line(lineGeometry, lineMaterial);
```

### Dot Creation
```javascript
const dotGeometry = new THREE.SphereGeometry(0.3, 8, 8);
const dotMaterial = new THREE.MeshBasicMaterial({ color: annotation.color });
const dot = new THREE.Mesh(dotGeometry, dotMaterial);
dot.position.copy(pointPosition);
```

### Line Update (per frame)
```javascript
const positions = annotation.line.geometry.attributes.position;
positions.setXYZ(0, label.position.x, label.position.y, label.position.z);
positions.setXYZ(1, annotation.position.x, annotation.position.y, annotation.position.z);
positions.needsUpdate = true;
```

## Files Modified
- `C:\Users\nafiz\Documents\Cascade Dynamics\Custom Pointcloud Renderer\src\core\annotations.js`
