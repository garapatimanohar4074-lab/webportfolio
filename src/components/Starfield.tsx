import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let rafId: number | null = null;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const CONFIG = {
        bgColor: '#0a0a24',
        flameColor: '#aee9ff',
        flameColor2: '#c79bff',
        flameAmt: 0.2,
        colorA: '#aef6cf',
        colorB: '#5fe6a0',
        colorC: '#eafff2',
        opacity: 2,
        pointSize: 50,
        brightness: 1.85,
        drift: 2.35,
        twinkle: 1,
        spin: 0.03,
        repelRadius: 5,
        repelStrength: 0.35,
        scrollPush: 8,
        scrollDrift: 6,
        scrollSpin: 0.1,
        parallax: 0.6,
      } as const;

      const LAYERS = { NONE: 0, TORUS_SCENE: 1, BLOOM_SCENE: 2, ENTIRE_SCENE: 3 };

      function hexToVec3(hex: string) {
        const n = parseInt(hex.slice(1), 16);
        return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
      }

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.VSMShadowMap;
      renderer.setClearColor(0x000000);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);
      scene.fog = new THREE.Fog(0x000000, 0, 15);

      const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 80);
      camera.position.set(0, 0, 5);
      camera.layers.enable(LAYERS.TORUS_SCENE);
      camera.layers.enable(LAYERS.BLOOM_SCENE);
      camera.layers.enable(LAYERS.ENTIRE_SCENE);
      scene.add(camera);

      const renderScene = new RenderPass(scene, camera);

      const torusComposer = new EffectComposer(renderer);
      torusComposer.renderToScreen = false;
      torusComposer.addPass(renderScene);
      torusComposer.addPass(new ShaderPass(GammaCorrectionShader));
      torusComposer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.22, 0.2, 0));
      torusComposer.addPass(new ShaderPass(CopyShader));

      const bloomComposer = new EffectComposer(renderer);
      bloomComposer.renderToScreen = false;
      bloomComposer.addPass(renderScene);
      bloomComposer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.4, 0.55, 0));
      bloomComposer.addPass(new ShaderPass(GammaCorrectionShader));

      const FinalShader = {
        uniforms: {
          iTime: { value: 0 },
          tDiffuse: { value: null },
          torusTexture: { value: null },
          bloomTexture: { value: null },
          haloTexture: { value: null },
          uBg: { value: hexToVec3(CONFIG.bgColor) },
          uFlameA: { value: hexToVec3(CONFIG.flameColor) },
          uFlameB: { value: hexToVec3(CONFIG.flameColor2) },
          uFlameAmt: { value: CONFIG.flameAmt },
        },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }`,
        fragmentShader: `
          uniform float iTime; uniform sampler2D tDiffuse; uniform sampler2D bloomTexture; uniform sampler2D torusTexture; uniform sampler2D haloTexture;
          uniform vec3 uBg; uniform vec3 uFlameA; uniform vec3 uFlameB; uniform float uFlameAmt;
          varying vec2 vUv;
          vec3 warp3d(vec3 pos, float t){ float curv=.8,a=1.9,b=0.7; pos*=2.;
            pos.x+=curv*sin(t+a*pos.y)+t*b; pos.y+=curv*cos(t+a*pos.x);
            pos.y+=curv*sin(t+a*pos.z)+t*b; pos.z+=curv*cos(t+a*pos.y);
            pos.z+=curv*sin(t+a*pos.x)+t*b; pos.x+=curv*cos(t+a*pos.z);
            return 0.5+0.5*cos(pos.xyz+vec3(1,2,4)); }
          void main(){
            vec2 uv = 2.*vUv - 1.;
            vec3 w = pow(warp3d(vec3(uv.x, sin(uv.y), uv.y), iTime*1.5), vec3(1.5));
            vec3 flame = 1.5*uFlameA*w.x; flame*=w.y; flame += uFlameB*w.z;
            flame *= smoothstep(0.25, 1., abs(uv.y));
            float md = smoothstep(-0.7, 1., -uv.y*uv.x); flame *= md*md;
            vec3 bg = uBg * (1.0 - 0.4 * length(uv));
            vec3 halo = texture2D(haloTexture, vUv).xyz;
            gl_FragColor = vec4(bg + flame*uFlameAmt + texture2D(bloomTexture, vUv).xyz + texture2D(torusTexture, vUv).xyz + texture2D(tDiffuse, vUv).xyz + halo, 1.);
          }
        `,
      } as any;

      const finalPass = new ShaderPass(FinalShader as any);
      const finalComposer = new EffectComposer(renderer);
      finalComposer.addPass(renderScene);
      finalComposer.addPass(finalPass);

      finalPass.uniforms.haloTexture.value = new THREE.CanvasTexture(document.createElement('canvas'));

      const count = 4200;
      const depth = 30;
      const positions = new Float32Array(count * 3);
      const palette = new Float32Array(count);
      const bright = new Float32Array(count);
      const scales = new Float32Array(count);
      const phases = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 24;
        positions[i3 + 1] = (Math.random() - 0.5) * 16;
        positions[i3 + 2] = (Math.random() - 0.5) * depth;
        palette[i] = Math.floor(Math.random() * 3);
        bright[i] = 0.7 + Math.random() * 0.6;
        scales[i] = 0.5 + Math.pow(Math.random(), 1.4) * 2.5;
        phases[i] = Math.random();
      }

      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geom.setAttribute('aScale', new THREE.Float32BufferAttribute(scales, 1));
      geom.setAttribute('aPhase', new THREE.Float32BufferAttribute(phases, 1));
      geom.setAttribute('aPalette', new THREE.Float32BufferAttribute(palette, 1));
      geom.setAttribute('aBright', new THREE.Float32BufferAttribute(bright, 1));

      const starMaterial = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: CONFIG.pointSize },
          uOpacity: { value: 0 },
          uDrift: { value: 0 },
          uDepth: { value: depth },
          uTwinkle: { value: CONFIG.twinkle },
          uCursor: { value: new THREE.Vector3() },
          uRepelRadius: { value: CONFIG.repelRadius },
          uRepelStrength: { value: CONFIG.repelStrength },
          uActivity: { value: 0 },
          uColorA: { value: hexToVec3(CONFIG.colorA) },
          uColorB: { value: hexToVec3(CONFIG.colorB) },
          uColorC: { value: hexToVec3(CONFIG.colorC) },
          uBrightness: { value: CONFIG.brightness },
        },
        vertexShader: `
          uniform float uTime; uniform float uSize; uniform float uDrift; uniform float uDepth; uniform float uTwinkle;
          uniform vec3 uCursor; uniform float uRepelRadius; uniform float uRepelStrength; uniform float uActivity;
          uniform vec3 uColorA; uniform vec3 uColorB; uniform vec3 uColorC;
          attribute float aScale; attribute float aPhase; attribute float aPalette; attribute float aBright;
          varying vec3 vColor; varying float vTwinkle;
          void main() {
            vec3 pos = position;
            pos.z = mod(pos.z + uDrift + (uDepth * 0.5), uDepth) - (uDepth * 0.5);

            float tw = sin(uTime * 1.6 + aPhase * 6.2831);
            vTwinkle = (1.0 - uTwinkle) + uTwinkle * (0.55 + 0.45 * tw);

            vec4 modelPosition = modelMatrix * vec4(pos, 1.0);

            vec3 toParticle = modelPosition.xyz - uCursor;
            float dist = length(toParticle);
            float falloff = smoothstep(uRepelRadius, 0.0, dist);
            modelPosition.xyz += normalize(toParticle + vec3(0.0001)) * falloff * uRepelStrength * uActivity;

            vec4 viewPosition = viewMatrix * modelPosition;
            gl_Position = projectionMatrix * viewPosition;
            gl_PointSize = uSize * aScale;
            gl_PointSize *= (1.0 / -viewPosition.z);

            vec3 base = aPalette < 0.5 ? uColorA : (aPalette < 1.5 ? uColorB : uColorC);
            vColor = base * aBright;
          }
        `,
        fragmentShader: `
          uniform float uOpacity; uniform float uBrightness;
          varying vec3 vColor; varying float vTwinkle;
          void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float d = length(uv);
            if (d > 0.5) discard;
            float strength = pow(1.0 - d * 2.0, 4.0);
            vec3 color = mix(vec3(0.0), vColor, strength);
            gl_FragColor = vec4(color * uBrightness, strength * uOpacity * vTwinkle);
          }
        `,
      });

      const points = new THREE.Points(geom, starMaterial);
      points.frustumCulled = false;
      points.layers.set(LAYERS.ENTIRE_SCENE);
      const group = new THREE.Group();
      group.add(points);
      scene.add(group);

      function setSize(w: number, h: number) {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(w, h, false);
        camera.aspect = w / h; camera.updateProjectionMatrix();
        torusComposer.setSize(w, h);
        bloomComposer.setSize(w, h);
        finalComposer.setSize(w, h);
      }
      setSize(innerWidth, innerHeight);

      function wireTargets() {
        finalPass.uniforms.bloomTexture.value = bloomComposer.renderTarget1.texture;
        finalPass.uniforms.torusTexture.value = torusComposer.renderTarget1.texture;
      }
      wireTargets();

      const POINTER: any = {
        ndc: new THREE.Vector2(0, 0),
        world: new THREE.Vector3(0, 0, 0),
        lastMove: performance.now(),
        active: false,
        activity: 0,
      };

      const mouseSmooth = { x: 0, y: 0 };

      const handleMouseMove = (e: MouseEvent) => {
        POINTER.ndc.x = (e.clientX / innerWidth) * 2 - 1;
        POINTER.ndc.y = -(e.clientY / innerHeight) * 2 + 1;
        POINTER.active = true;
        POINTER.lastMove = performance.now();
      };

      const handleMouseOut = () => {
        POINTER.active = false;
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseout', handleMouseOut, { passive: true });

      function updatePointer() {
        const targetWorld = new THREE.Vector3(0, 0, 0);
        if (POINTER.active) {
          const ndc = new THREE.Vector3(POINTER.ndc.x, POINTER.ndc.y, 0.5);
          ndc.unproject(camera);
          const dir = ndc.clone().sub(camera.position);
          if (Math.abs(dir.z) > 1e-4) {
            const t = -camera.position.z / dir.z;
            if (t > 0 && isFinite(t)) targetWorld.copy(camera.position).add(dir.multiplyScalar(t));
          }
        }
        POINTER.world.lerp(targetWorld, 0.12);
        const idle = (performance.now() - POINTER.lastMove) / 1000;
        const want = (POINTER.active && idle < 3) ? 1 : 0;
        POINTER.activity += (want - POINTER.activity) * 0.06;
        starMaterial.uniforms.uCursor.value.copy(POINTER.world);
        starMaterial.uniforms.uActivity.value = POINTER.activity;
      }

      let scrollTarget = 0, scrollSmooth = 0, scrollCurrent = 0;
      function onScroll() {
        const sh = document.documentElement.scrollHeight - innerHeight;
        const y = window.scrollY;
        scrollTarget = THREE.MathUtils.clamp(y / Math.max(1, sh), 0, 1);
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      let t0 = performance.now() / 1000;
      let uDrift = 0;
      const appearStart = performance.now();

      function animate() {
        if (!mounted) return;
        rafId = requestAnimationFrame(animate);
        const now = performance.now();
        const t = now / 1000;
        let dt = t - t0; if (dt > 0.05) dt = 0.05;
        t0 = t;

        starMaterial.uniforms.uTime.value = t;
        finalPass.uniforms.iTime.value = t;

        scrollSmooth = THREE.MathUtils.lerp(scrollSmooth, scrollTarget, 0.10);
        scrollCurrent = THREE.MathUtils.lerp(scrollCurrent, scrollSmooth, 0.06);
        mouseSmooth.x = THREE.MathUtils.lerp(mouseSmooth.x, POINTER.ndc.x, 0.06);
        mouseSmooth.y = THREE.MathUtils.lerp(mouseSmooth.y, POINTER.ndc.y, 0.06);

        updatePointer();

        const scroll = scrollCurrent;
        uDrift += dt * (CONFIG.drift + scroll * CONFIG.scrollDrift);
        starMaterial.uniforms.uDrift.value = uDrift;

        const mx = mouseSmooth.x * CONFIG.parallax;
        const my = mouseSmooth.y * CONFIG.parallax;
        camera.position.set(mx * 0.6, my * 0.6, 5 - scroll * CONFIG.scrollPush);
        camera.lookAt(mx * 0.6, my * 0.6, -10);

        const elapsed = now - appearStart;
        const fade = THREE.MathUtils.clamp((elapsed - 300) / 1400, 0, 1);
        starMaterial.uniforms.uOpacity.value = fade * CONFIG.opacity;

        group.rotation.z += dt * (CONFIG.spin + scroll * CONFIG.scrollSpin);

        finalPass.uniforms.bloomTexture.value = bloomComposer.renderTarget1.texture;
        finalPass.uniforms.torusTexture.value = torusComposer.renderTarget1.texture;

        camera.layers.set(LAYERS.TORUS_SCENE);
        torusComposer.render();

        camera.layers.set(LAYERS.BLOOM_SCENE);
        bloomComposer.render();

        camera.layers.set(LAYERS.ENTIRE_SCENE);
        finalComposer.render();
      }

      // initial render then reveal
      renderer.render(scene, camera);
      if (mounted) setLoading(false);
      animate();

      function onResize() {
        setSize(innerWidth, innerHeight);
        torusComposer.setSize(innerWidth, innerHeight);
        bloomComposer.setSize(innerWidth, innerHeight);
        finalComposer.setSize(innerWidth, innerHeight);
        onScroll();
      }
      window.addEventListener('resize', onResize, { passive: true });

      // cleanup
      return () => {
        mounted = false;
        if (rafId) cancelAnimationFrame(rafId);
        try { renderer.dispose(); } catch (e) { /* ignore */ }
        window.removeEventListener('resize', onResize);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseout', handleMouseOut);
      };
    }, []);

  return (
    <>
      {loading && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#cbd5e1', zIndex: 9999, fontFamily: 'system-ui,Segoe UI,Roboto,Arial', fontSize: 14 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 12 }}>Loading starfield…</div>
            <div style={{ width: 160, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
              <div className="__sf-progress" style={{ width: '0%', height: '100%', background: 'linear-gradient(90deg,#aef6cf,#5fe6a0,#eafff2)', transition: 'width 800ms ease' }} />
            </div>
          </div>
        </div>
      )}
      <canvas id="starfield-canvas" ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', display: 'block', zIndex: 0, pointerEvents: 'none' }} />
    </>
  );
};

export default Starfield;
