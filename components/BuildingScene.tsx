'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

const limestone='#d6c7ae', shadowStone='#a89b88', bronze='#67513b', black='#171e20';
type V=[number,number,number];
function Solid({at,size,color,metalness=0,roughness=.78}:{at:V,size:V,color:string,metalness?:number,roughness?:number}){return <mesh position={at} castShadow receiveShadow><boxGeometry args={size}/><meshStandardMaterial color={color} metalness={metalness} roughness={roughness}/></mesh>}
function Window({at,size,lit=false}:{at:V,size:V,lit?:boolean}){return <mesh position={at}><boxGeometry args={size}/><meshPhysicalMaterial color={lit?'#92714f':'#263b40'} metalness={.3} roughness={.08} transmission={.28} thickness={.12} transparent opacity={.78} emissive={lit?'#dca466':'#000000'} emissiveIntensity={lit?.55:0} clearcoat={1}/></mesh>}
function Tree({at,scale=1}:{at:V,scale?:number}){return <group position={at} scale={scale}><mesh position={[0,.85,0]} castShadow><cylinderGeometry args={[.085,.13,1.7,9]}/><meshStandardMaterial color="#514538"/></mesh>{[[0,1.9,0,.8],[-.43,1.65,.17,.58],[.35,2.13,-.16,.65],[.14,1.55,.43,.54]].map((v,i)=><mesh key={i} position={[v[0],v[1],v[2]]} castShadow><icosahedronGeometry args={[v[3],2]}/><meshStandardMaterial color={i%2?'#344a39':'#405744'} roughness={1}/></mesh>)}</group>}
function Apartment({floor}:{floor:number}){const y=floor*1.23+.52;return <group position={[0,y,0]}>
<Solid at={[0,-.07,0]} size={[10.1,.2,6.6]} color={limestone}/>
<Solid at={[0,1.18,0]} size={[10.2,.21,6.7]} color={limestone}/>
<Solid at={[-4.91,.55,0]} size={[.27,1.12,6.35]} color={limestone}/>
<Solid at={[4.91,.55,0]} size={[.27,1.12,6.35]} color={limestone}/>
<Solid at={[0,.55,-3.14]} size={[9.7,1.1,.21]} color={shadowStone}/>
{Array.from({length:8},(_,i)=>{const x=-4.13+i*1.18;return <group key={i}>
<Window at={[x,.57,3.1]} size={[1.11,1.03,.09]} lit={(i+floor)%3!==0}/>
<Solid at={[x+.58,.56,3.18]} size={[.058,1.12,.13]} color={bronze} metalness={.7} roughness={.24}/>
<Solid at={[x,.57,3.19]} size={[1.11,.035,.11]} color={bronze} metalness={.65}/>
</group>})}
<Solid at={[-3.9,.55,3.21]} size={[.75,1.1,.27]} color={limestone}/>
<Solid at={[3.93,.55,3.21]} size={[.75,1.1,.27]} color={limestone}/>
<Solid at={[0,-.055,3.69]} size={[10.4,.13,1.28]} color={shadowStone}/>
<Window at={[0,.49,4.29]} size={[10.18,.89,.048]}/>
<Solid at={[0,.96,4.29]} size={[10.28,.046,.065]} color={bronze} metalness={.75}/>
{Array.from({length:9},(_,i)=><Solid key={i} at={[-4.85+i*1.2,.49,4.3]} size={[.032,.94,.07]} color={bronze} metalness={.8}/>)}
{[0,1,2].map((i)=><group key={i}><Window at={[5.06,.55,-2+i*1.9]} size={[.06,.95,1.5]} lit={i!==1}/><Solid at={[5.12,.55,-1.18+i*1.9]} size={[.08,1.12,.07]} color={bronze}/></group>)}
{floor%2===0?<Solid at={[-2.65,.55,3.34]} size={[1.8,1.1,.32]} color={limestone}/>:<Solid at={[2.35,.55,3.34]} size={[2.15,1.1,.32]} color={limestone}/>}
{[-4.48,4.48].map((x,i)=><group key={i}><Solid at={[x,.12,3.73]} size={[.54,.26,.53]} color="#777165"/><mesh position={[x,.47,3.73]} castShadow><sphereGeometry args={[.34,12,9]}/><meshStandardMaterial color="#3e5740"/></mesh></group>)}
</group>}
function Furniture(){return <group position={[0,5.46,0]}>
<Solid at={[0,-.02,0]} size={[9.4,.08,6.2]} color="#b9a48a"/>
<Solid at={[0,1.2,-3]} size={[9.4,2.4,.12]} color="#8d7967"/>
<Solid at={[-2.2,.34,.3]} size={[2.9,.5,1.35]} color="#e6dbcb"/>
<Solid at={[-2.2,.69,-.25]} size={[2.9,.7,.23]} color="#e6dbcb"/>
<Solid at={[-.45,.25,1.25]} size={[1.65,.12,.9]} color="#bd9d75"/>
<Solid at={[-.45,.12,1.25]} size={[.28,.25,.28]} color={bronze} metalness={.7}/>
<Solid at={[2.3,.37,-1.75]} size={[2.5,.7,.55]} color="#53483e"/>
<Solid at={[2.3,.78,-1.72]} size={[2.5,.09,.6]} color="#bba184"/>
<Solid at={[1.2,.02,.5]} size={[4.1,.025,2.5]} color="#988875"/>
<mesh position={[0,1.85,-.4]}><sphereGeometry args={[.18,16,12]}/><meshStandardMaterial color="#dcb981" emissive="#e8ae6b" emissiveIntensity={2}/></mesh>
<pointLight position={[0,1.8,0]} intensity={15} color="#ffd4a1" distance={8}/>
</group>}
function Architecture({progress}:{progress:number}){return <group>
<mesh position={[0,-.54,0]} receiveShadow><boxGeometry args={[50,.15,50]}/><meshStandardMaterial color="#343c34" roughness={1}/></mesh>
<Solid at={[0,-.34,0]} size={[12,.35,9]} color="#5b5850"/>
<Solid at={[0,-.13,0]} size={[10.4,.18,7]} color={limestone}/>
<Solid at={[0,.31,3.23]} size={[3.4,.7,.2]} color={bronze} metalness={.7}/>
<Window at={[0,.3,3.36]} size={[3.1,.62,.08]} lit/>
{Array.from({length:5},(_,i)=>{const t=THREE.MathUtils.smoothstep(progress,.035+i*.085,.17+i*.085);return <group key={i} position={[0,i*1.23,0]} scale={[1,Math.max(.001,t),1]} visible={t>.001}><Apartment floor={0}/></group>})}
<group position={[0,6.16,0]} scale={[1,Math.max(.001,THREE.MathUtils.smoothstep(progress,.46,.6)),1]}>
<Solid at={[0,.06,0]} size={[10.5,.3,7]} color={limestone}/>
<Solid at={[0,.25,0]} size={[10.7,.09,7.2]} color="#5d554a"/>
<Solid at={[0,.52,-2.15]} size={[8.3,.07,1.5]} color={bronze} metalness={.6}/>
{Array.from({length:7},(_,i)=><Solid key={i} at={[-3.7+i*1.22,.38,-2.15]} size={[.065,.32,1.5]} color={bronze}/>)}
</group>
{progress>.59&&<><Tree at={[-7,-.47,2.8]} scale={1.65}/><Tree at={[7.4,-.47,1.8]} scale={1.7}/><Tree at={[-8,-.47,-4]} scale={1.2}/><Tree at={[8,-.47,-4]} scale={1.25}/>
{Array.from({length:12},(_,i)=><mesh key={i} position={[-5.5+i,.01,5.8]}><sphereGeometry args={[.22,8,7]}/><meshStandardMaterial color={i%2?'#506347':'#40533d'}/></mesh>)}
<Solid at={[0,-.37,7.5]} size={[4.2,.08,6]} color="#8b8174"/>
{Array.from({length:6},(_,i)=><Solid key={i} at={[0,-.26,5.2+i*.55]} size={[3.5,.025,.05]} color="#c2b59f"/>)}
</>}
{progress>.75&&<Furniture/>}
</group>}
function CameraMotion({progress}:{progress:number}){const {camera}=useThree();const aim=useRef(new THREE.Vector3(0,3,0));useFrame((_,delta)=>{const p=THREE.MathUtils.clamp(progress,0,1);const orbit=THREE.MathUtils.smoothstep(p,.12,.66);const approach=THREE.MathUtils.smoothstep(p,.67,.85);const enter=THREE.MathUtils.smoothstep(p,.85,1);const pos=new THREE.Vector3(15-8*orbit,9-1.8*orbit,21-6*orbit).lerp(new THREE.Vector3(0,5.8,5.2),approach).lerp(new THREE.Vector3(-1.2,6.05,1.5),enter);camera.position.lerp(pos,1-Math.exp(-delta*6));const look=new THREE.Vector3(0,3.25,0).lerp(new THREE.Vector3(0,6.1,0),approach).lerp(new THREE.Vector3(1,5.95,-1.3),enter);aim.current.lerp(look,1-Math.exp(-delta*6));camera.lookAt(aim.current)});return null}
export default function BuildingScene({progress}:{progress:number}){return <Canvas shadows dpr={[1,1.6]} camera={{position:[15,9,21],fov:37}} gl={{antialias:true,alpha:false,toneMapping:THREE.ACESFilmicToneMapping}}><color attach="background" args={['#232b2b']}/><fog attach="fog" args={['#232b2b',29,58]}/><ambientLight intensity={.75}/><hemisphereLight args={['#c9d5db','#4d4539',1.8]}/><directionalLight position={[9,14,10]} intensity={3.3} color="#ffcf9d" castShadow shadow-mapSize={[2048,2048]}/><directionalLight position={[-10,8,-7]} intensity={2.3} color="#8ca4b9"/><pointLight position={[0,5,6]} color="#e9ac6d" intensity={25} distance={16}/><Architecture progress={progress}/><CameraMotion progress={progress}/><ContactShadows position={[0,-.48,0]} opacity={.48} scale={35} blur={2.4} far={18}/><Environment preset="sunset"/></Canvas>}
