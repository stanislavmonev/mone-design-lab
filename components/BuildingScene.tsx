'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const STONE='#c6b9a4', STONE_DARK='#9b8c77', BRONZE='#4b4035', GLASS='#18242a';
function Box({p,s,c,metal=0,rough=.65,emissive,ei=0}:{p:[number,number,number],s:[number,number,number],c:string,metal?:number,rough?:number,emissive?:string,ei?:number}){return <mesh position={p} castShadow receiveShadow><boxGeometry args={s}/><meshStandardMaterial color={c} metalness={metal} roughness={rough} emissive={emissive||'#000000'} emissiveIntensity={ei}/></mesh>}
function Glass({p,s,lit=false}:{p:[number,number,number],s:[number,number,number],lit?:boolean}){return <mesh position={p}><boxGeometry args={s}/><meshPhysicalMaterial color={lit?'#89745c':GLASS} metalness={.42} roughness={.12} transparent opacity={.83} clearcoat={1} clearcoatRoughness={.08} emissive={lit?'#ba8851':'#000000'} emissiveIntensity={lit?.24:0}/></mesh>}
function Plant({p,scale=1}:{p:[number,number,number],scale?:number}){return <group position={p} scale={scale}><Box p={[0,.15,0]} s={[.42,.3,.42]} c="#6d685b"/><mesh position={[0,.48,0]} castShadow><icosahedronGeometry args={[.38,1]}/><meshStandardMaterial color="#39483b" roughness={.95}/></mesh><mesh position={[.2,.6,.08]} castShadow><icosahedronGeometry args={[.26,1]}/><meshStandardMaterial color="#4e5c48" roughness={.95}/></mesh></group>}
function Residence({progress}:{progress:number}){const group=useRef<THREE.Group>(null);const floors=5;useFrame(({clock})=>{if(group.current){group.current.rotation.y=-.43+progress*.19+Math.sin(clock.elapsedTime*.16)*.015;group.current.position.y=-.48+progress*.13}});const eased=useMemo(()=>Array.from({length:floors},(_,i)=>THREE.MathUtils.smoothstep(progress,.065+i*.125,.25+i*.125)),[progress]);return <group ref={group}>
{/* podium and entrance */}
<Box p={[0,-.3,0]} s={[9,.48,7.2]} c="#363733"/><Box p={[0,-.03,0]} s={[7.5,.13,5.3]} c={STONE_DARK}/><Box p={[0,.45,2.63]} s={[2.6,.9,.12]} c={BRONZE} metal={.55}/><Glass p={[0,.43,2.71]} s={[2.22,.75,.08]}/><Box p={[0,.04,3.1]} s={[3,.07,1.4]} c="#b9b1a4"/>
{Array.from({length:floors},(_,floor)=>{const v=eased[floor];if(v<.002)return null;const y=floor*.96+.2;return <group key={floor} position={[0,y,0]} scale={[1,v,1]}>
{/* stone slabs with cantilevered alternating terraces */}
<Box p={[0,.03,0]} s={[7.1,.17,5.05]} c={STONE}/><Box p={[0,.93,0]} s={[7.18,.15,5.13]} c={STONE}/>
<Box p={[-3.45,.5,-.1]} s={[.22,.85,4.9]} c={STONE_DARK}/><Box p={[3.45,.5,-.1]} s={[.22,.85,4.9]} c={STONE}/>
<Box p={[0,.5,-2.39]} s={[6.8,.83,.2]} c={STONE_DARK}/>
{/* front wall, deeply inset glass and bronze mullions */}
{Array.from({length:6},(_,i)=>{const x=-2.78+i*1.12;return <group key={i}><Glass p={[x,.51,2.36]} s={[1.035,.72,.08]} lit={progress>.86&&(i+floor)%3===0}/><Box p={[x+.55,.51,2.45]} s={[.075,.83,.12]} c={BRONZE} metal={.8} rough={.26}/><Box p={[x,.49,2.29]} s={[.018,.76,.035]} c="#8d8374" metal={.7}/></group>})}
{/* sculpted side windows */}
{Array.from({length:3},(_,i)=><group key={i}><Glass p={[3.58,.5,-1.53+i*1.5]} s={[.07,.68,1.26]} lit={progress>.87&&i===1}/><Box p={[3.64,.5,-.83+i*1.5]} s={[.11,.85,.075]} c={BRONZE} metal={.7}/></group>)}
{/* alternating sculptural travertine volumes */}
{floor%2===0?<><Box p={[-2.92,.5,2.45]} s={[.78,.85,.35]} c={STONE}/><Box p={[2.83,.5,2.44]} s={[.84,.85,.35]} c={STONE}/></>:<><Box p={[1.95,.5,2.47]} s={[1.05,.85,.3]} c={STONE_DARK}/><Box p={[-3.05,.5,2.46]} s={[.65,.85,.3]} c={STONE}/></>}
{/* floating balcony, transparent rail and metallic edge */}
<Box p={[0,.06,2.87]} s={[7.45,.11,1.04]} c={STONE_DARK}/><Glass p={[0,.44,3.35]} s={[7.32,.63,.045]}/><Box p={[0,.76,3.37]} s={[7.35,.04,.075]} c={BRONZE} metal={.7}/><Box p={[-3.65,.43,2.95]} s={[.055,.63,.88]} c={BRONZE} metal={.6}/><Box p={[3.65,.43,2.95]} s={[.055,.63,.88]} c={BRONZE} metal={.6}/>
{progress>.68&&<><Plant p={[-3.05,.17,2.86]} scale={.55}/><Plant p={[3.02,.17,2.86]} scale={.6}/></>}
</group>})}
{progress>.72&&<group position={[0,5,0]} scale={[1,THREE.MathUtils.smoothstep(progress,.72,.92),1]}><Box p={[0,0,0]} s={[7.6,.24,5.4]} c={STONE}/><Box p={[0,.16,0]} s={[7.75,.1,5.55]} c="#403d37"/><Box p={[-2.9,.47,-1.5]} s={[.1,.55,1.5]} c={BRONZE}/><Box p={[2.9,.47,-1.5]} s={[.1,.55,1.5]} c={BRONZE}/><Box p={[0,.73,-1.5]} s={[6,.12,1.8]} c={STONE_DARK}/></group>}
{/* landscaped site */}
{progress>.78&&<><Plant p={[-4.25,0,2.2]} scale={1.25}/><Plant p={[4.4,0,1.9]} scale={1.2}/><Plant p={[-4.15,0,-2]} scale={.95}/><Plant p={[4.2,0,-2]} scale={.85}/></>}
</group>}
export default function BuildingScene({progress}:{progress:number}){return <Canvas shadows dpr={[1,1.75]} camera={{position:[11,7.3,15],fov:32}} gl={{antialias:true,alpha:true,toneMapping:THREE.ACESFilmicToneMapping}}><color attach="background" args={['#242522']}/><ambientLight intensity={1.3}/><hemisphereLight args={['#f0e2d2','#4c514c',2]}/><directionalLight position={[8,13,9]} intensity={3.5} color="#f5e7d2" castShadow shadow-mapSize={[2048,2048]} shadow-bias={-.0003}/><directionalLight position={[-7,6,-5]} intensity={2} color="#8c9aa5"/><pointLight position={[0,4,6]} intensity={16} color="#e8b77e" distance={13}/><Residence progress={progress}/><ContactShadows position={[0,-.77,0]} opacity={.48} scale={20} blur={2.8} far={13}/><Environment preset="sunset"/></Canvas>}