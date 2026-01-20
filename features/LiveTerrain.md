# Live Terrain Page
The page containing the pointcloud and controls to interact with it.

## Pointcloud
- The pointcloud renderer should be based off the pointcloud render in C:\Users\nafiz\Documents\Cascade Dynamics\Custom Pointcloud Renderer
- The pointcloud should be loaded from /public/data

## View Mode Menu
A menu letting the user switch between different pointcloud view modes
- Default
- Height
- Cracking
- Micro Movements
- Risk

## Information Menu
A menu containing various sections of information that the user can switch between
  
### On Click Data
- Add 3 annotations to the pointcloud
- Clicking on these 3 annotations will display 4 different weather data KPI cards
- Use placeholder labels + values

### Installations
- Have a list of 5 tower installations that are color coded
- Each tower installation has 4 attached hardware technologies
  - LIDAR
  - Thermal
  - Camera
  - Probes
- Each hardware techonolgy's status should be displayed

### Past Events
- Past events should list 3 past events
- Each event should contain the event type and how similar the state of the terrain at the time of the event is to the current state of the terrain.
- Clicking on the event should pull up a comparsison between the historic pointcloud and the 

### Tracking
- Display informaiton about currently tracked trucks and machines
- Display the trucks and machines on the pointcloud
