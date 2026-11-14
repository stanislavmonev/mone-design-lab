# INCOGNOTO — architectural construction sequence for Blender 4.x
# Run: blender -b -t 8 --python blender/incognito_build.py
# Output: render/frames/0001.png ... (180 frames)
import bpy, math, random
from mathutils import Vector
random.seed(17)
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene
scene.render.engine='CYCLES'
scene.cycles.samples=48
scene.render.resolution_x=1920; scene.render.resolution_y=1080; scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
scene.render.film_transparent=False
scene.world.color=(.13,.14,.16)
scene.frame_start=1; scene.frame_end=180; scene.render.fps=30
def mat(name,color,metal=0,rough=.55,emit=0):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
 p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough
 if emit:p.inputs['Emission Color'].default_value=(*color,1);p.inputs['Emission Strength'].default_value=emit
 return m
stone=mat('warm limestone',(.62,.56,.47));stone2=mat('travertine edge',(.77,.71,.61));bronze=mat('anodized dark bronze',(.14,.115,.09),.75,.22);glass=mat('reflective smoked glazing',(.075,.12,.15),.65,.12);light=mat('warm interiors',(.95,.65,.32),.1,.4,1.3);dark=mat('dark stone podium',(.11,.105,.1));green=mat('deep green foliage',(.1,.18,.115));ground=mat('wet courtyard',(.11,.12,.12),.35,.21)
def cube(name,loc,scale,material,begin=1,end=None,bevel=0):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name
 o.dimensions=scale;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 o.data.materials.append(material)
 if bevel:
  mod=o.modifiers.new('subtle precision edges','BEVEL');mod.width=bevel;mod.segments=2
  o.modifiers.new('weighted normals','WEIGHTED_NORMAL')
 if end:
  o.scale.z=.001;o.keyframe_insert(data_path='scale',frame=begin)
  o.scale.z=1;o.keyframe_insert(data_path='scale',frame=end)
  for fc in o.animation_data.action.fcurves:
   for k in fc.keyframe_points:k.interpolation='BEZIER'
 return o
cube('site plinth',(0,-.25,0),(11,.45,9),dark)
cube('courtyard',(0,-.52,0),(70,.08,70),ground)
for f in range(5):
 y=f*1.35+.1; start=12+f*22; finish=start+25
 cube(f'level {f+1} structural slab',(0,y,0),(9,.22,6.4),stone2,start,finish,.035)
 cube(f'level {f+1} upper slab',(0,y+1.24,0),(9.1,.17,6.5),stone2,start+8,finish+8,.025)
 for x in [-4.25,4.25]:
  for z in [-2.9,2.9]:cube('load bearing stone pier',(x,y+.67,z),(.3,1.2,.34),stone,start+3,finish+3,.018)
 for x in [-3.4,-2.25,-1.1,.05,1.2,2.35,3.5]:
  cube('floor to ceiling glazing',(x,y+.68,3.0),(1.07,1.07,.065),glass,start+12,finish+13)
  cube('bronze mullion',(x+.54,y+.68,3.06),(.065,1.18,.09),bronze,start+12,finish+13)
  cube('warm interior',(x,y+.67,2.86),(1.0,.92,.02),light,start+17,finish+16)
 cube('deep cantilevered balcony',(0,y+.08,3.68),(9.2,.12,1.4),stone,start+13,finish+14,.025)
 cube('glass balustrade',(0,y+.5,4.35),(9,.72,.06),glass,start+16,finish+16)
 cube('bronze handrail',(0,y+.87,4.37),(9.05,.045,.08),bronze,start+16,finish+16)
 cube('sculptural facade volume',((-3.3 if f%2==0 else 3.1),y+.65,3.12),(.92,1.15,.5),stone,start+14,finish+17,.02)
cube('roof terrace canopy',(0,7.05,0),(9.8,.24,6.9),stone2,138,164,.035)
cube('roof parapet',(0,7.3,-3.2),(9.8,.46,.17),bronze,150,170)
def tree(x,z,s):
 bpy.ops.mesh.primitive_cylinder_add(vertices=8,radius=.09*s,depth=1.1*s,location=(x,.38*s,z));bpy.context.object.data.materials.append(bronze)
 for dx,dz,dy,rad in [(0,0,1.1,.68),(.3,.1,1.3,.53),(-.3,-.1,1.25,.48)]:
  bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2,radius=rad*s,location=(x+dx*s,dy*s,z+dz*s));bpy.context.object.data.materials.append(green)
for x,z,s in [(-6,2,1.5),(6.3,1.7,1.25),(-6,-3,1.2),(6,-3,1.3)]:tree(x,z,s)
# architectural camera: single continuous dolly/orbit, no jump cuts
def aim(obj,target):obj.rotation_euler=(Vector(target)-obj.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(15,9,22));cam=bpy.context.object;scene.camera=cam;cam.data.type='ORTHO';cam.data.ortho_scale=19
for frame,position,scale in [(1,(16,8,24),20),(90,(14,9,21),19),(180,(12,10,19),18)]:
 cam.location=position;cam.data.ortho_scale=scale;aim(cam,(0,3,0));cam.keyframe_insert('location',frame=frame);cam.keyframe_insert('rotation_euler',frame=frame);cam.data.keyframe_insert('ortho_scale',frame=frame)
def area(name,loc,power,color,size):
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.name=name;o.data.energy=power;o.data.color=color;o.data.shape='DISK';o.data.size=size;aim(o,(0,2,0))
area('large softbox',(2,15,12),3000,(1,.82,.66),12);area('sky fill',(-11,10,-7),2600,(.65,.77,1),15)
scene.view_settings.view_transform='AgX'
scene.render.filepath='//render/frames/'
# Uncomment next line to render entire sequence:
# bpy.ops.render.render(animation=True)
print('INCOGNOTO: 180-frame animated architectural scene prepared. Uncomment render call to export frames.')
