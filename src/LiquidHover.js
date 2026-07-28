import { createElement as h, useEffect, useRef, useState } from "react";
import { isDesktopHoverEnabled } from "./hoverEffects.js";

const VERT = `
precision highp float;

varying vec2 vUv;
attribute vec2 a_position;

varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform vec2 u_texel;

void main () {
  vUv = .5 * (a_position + 1.);
  vL = vUv - vec2(u_texel.x, 0.);
  vR = vUv + vec2(u_texel.x, 0.);
  vT = vUv + vec2(0., u_texel.y);
  vB = vUv - vec2(0., u_texel.y);
  gl_Position = vec4(a_position, 0., 1.);
}
`;

const FRAG_ADVECT = `
precision highp float;
precision highp sampler2D;

varying vec2 vUv;
uniform sampler2D u_velocity_texture;
uniform sampler2D u_input_texture;
uniform vec2 u_texel;
uniform vec2 u_output_textel;
uniform float u_dt;
uniform float u_dissipation;

vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
  vec2 st = uv / tsize - 0.5;
  vec2 iuv = floor(st);
  vec2 fuv = fract(st);
  vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
  vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
  vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
  vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
  return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
}

void main () {
  vec2 coord = vUv - u_dt * bilerp(u_velocity_texture, vUv, u_texel).xy * u_texel;
  vec4 velocity = bilerp(u_input_texture, coord, u_output_textel);
  gl_FragColor = u_dissipation * velocity;
}
`;

const FRAG_DIVERGENCE = `
precision highp float;
precision highp sampler2D;

varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D u_velocity_texture;

void main () {
  float L = texture2D(u_velocity_texture, vL).x;
  float R = texture2D(u_velocity_texture, vR).x;
  float T = texture2D(u_velocity_texture, vT).y;
  float B = texture2D(u_velocity_texture, vB).y;
  float div = .25 * (R - L + T - B);
  gl_FragColor = vec4(div, 0., 0., 1.);
}
`;

const FRAG_PRESSURE = `
precision highp float;
precision highp sampler2D;

varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D u_pressure_texture;
uniform sampler2D u_divergence_texture;

void main () {
  float L = texture2D(u_pressure_texture, vL).x;
  float R = texture2D(u_pressure_texture, vR).x;
  float T = texture2D(u_pressure_texture, vT).x;
  float B = texture2D(u_pressure_texture, vB).x;
  float divergence = texture2D(u_divergence_texture, vUv).x;
  float pressure = (L + R + B + T - divergence) * .25;
  gl_FragColor = vec4(pressure, 0., 0., 1.);
}
`;

const FRAG_GRAD_SUB = `
precision highp float;
precision highp sampler2D;

varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D u_pressure_texture;
uniform sampler2D u_velocity_texture;

void main () {
  float L = texture2D(u_pressure_texture, vL).x;
  float R = texture2D(u_pressure_texture, vR).x;
  float T = texture2D(u_pressure_texture, vT).x;
  float B = texture2D(u_pressure_texture, vB).x;
  vec2 velocity = texture2D(u_velocity_texture, vUv).xy;
  velocity.xy -= vec2(R - L, T - B);
  gl_FragColor = vec4(velocity, 0., 1.);
}
`;

const FRAG_POINT = `
precision highp float;
precision highp sampler2D;

varying vec2 vUv;
uniform sampler2D u_input_texture;
uniform float u_ratio;
uniform float u_img_ratio;
uniform vec3 u_point_value;
uniform vec2 u_point;
uniform float u_point_size;

void main () {
  vec2 p = vUv - u_point.xy;
  p.x *= u_ratio;
  vec3 splat = .6 * pow(2., -dot(p, p) / u_point_size) * u_point_value;
  vec3 base = texture2D(u_input_texture, vUv).xyz;
  gl_FragColor = vec4(base + splat, 1.);
}
`;

/* Contain (full image in cell — matches Selected Work object-fit: contain).
 * u_canvas_scale compensates CSS overscan (120% canvas clipped to 100%). */
const FRAG_OUTPUT = `
precision highp float;
precision highp sampler2D;

varying vec2 vUv;
uniform float u_ratio;
uniform float u_img_ratio;
uniform float u_disturb_power;
uniform sampler2D u_output_texture;
uniform sampler2D u_velocity_texture;
uniform sampler2D u_text_texture;
uniform vec2 u_point;
uniform float u_canvas_scale;
uniform float u_inner_scale;

vec2 get_img_uv() {
  vec2 uv = vUv - 0.5;
  /* Undo CSS overscan zoom so the clipped viewport shows the full image */
  uv *= u_canvas_scale;
  uv /= u_inner_scale;

  float containerAspect = u_ratio;
  float imageAspect = u_img_ratio;
  vec2 scale = vec2(1.0);
  /* Contain: fit entire image (letterbox when aspect differs) */
  if (containerAspect > imageAspect) {
    scale.x = imageAspect / containerAspect;
  } else {
    scale.y = containerAspect / imageAspect;
  }
  uv *= scale;
  return uv + 0.5;
}

vec2 get_frame_uv() {
  vec2 uv = vUv - 0.5;
  uv *= u_canvas_scale;
  uv /= u_inner_scale;
  return uv + 0.5;
}

float get_img_frame_alpha(vec2 uv, float img_frame_width) {
  float img_frame_alpha = smoothstep(0., img_frame_width, uv.x) * smoothstep(1., 1. - img_frame_width, uv.x);
  img_frame_alpha *= smoothstep(0., img_frame_width, uv.y) * smoothstep(1., 1. - img_frame_width, uv.y);
  return img_frame_alpha;
}

vec3 sample_image_smooth(vec2 uv) {
  vec2 uvc = clamp(uv, 0.0, 1.0);
  vec3 base = texture2D(u_text_texture, vec2(uvc.x, 1.0 - uvc.y)).rgb;

  float yBelow = step(uv.y, 0.0);
  float yAbove = step(1.0, uv.y);
  float xLeft = step(uv.x, 0.0);
  float xRight = step(1.0, uv.x);
  float outOfBounds = max(max(yBelow, yAbove), max(xLeft, xRight));

  if (outOfBounds > 0.0) {
    float d = 0.002;
    vec3 sum = vec3(0.0);
    sum += texture2D(u_text_texture, vec2(clamp(uvc.x - d, 0.0, 1.0), 1.0 - clamp(uvc.y - d, 0.0, 1.0))).rgb;
    sum += texture2D(u_text_texture, vec2(clamp(uvc.x, 0.0, 1.0), 1.0 - clamp(uvc.y - d, 0.0, 1.0))).rgb;
    sum += texture2D(u_text_texture, vec2(clamp(uvc.x + d, 0.0, 1.0), 1.0 - clamp(uvc.y - d, 0.0, 1.0))).rgb;
    sum += texture2D(u_text_texture, vec2(clamp(uvc.x - d, 0.0, 1.0), 1.0 - clamp(uvc.y, 0.0, 1.0))).rgb;
    sum += texture2D(u_text_texture, vec2(clamp(uvc.x, 0.0, 1.0), 1.0 - clamp(uvc.y, 0.0, 1.0))).rgb;
    sum += texture2D(u_text_texture, vec2(clamp(uvc.x + d, 0.0, 1.0), 1.0 - clamp(uvc.y, 0.0, 1.0))).rgb;
    sum += texture2D(u_text_texture, vec2(clamp(uvc.x - d, 0.0, 1.0), 1.0 - clamp(uvc.y + d, 0.0, 1.0))).rgb;
    sum += texture2D(u_text_texture, vec2(clamp(uvc.x, 0.0, 1.0), 1.0 - clamp(uvc.y + d, 0.0, 1.0))).rgb;
    sum += texture2D(u_text_texture, vec2(clamp(uvc.x + d, 0.0, 1.0), 1.0 - clamp(uvc.y + d, 0.0, 1.0))).rgb;
    base = sum / 9.0;
  }
  return base;
}

void main () {
  float offset = texture2D(u_output_texture, vUv).r;

  vec2 velocity = texture2D(u_velocity_texture, vUv).xy;
  velocity += .001;

  vec2 img_uv = get_img_uv();
  img_uv -= u_disturb_power * normalize(velocity) * offset;
  img_uv -= u_disturb_power * normalize(velocity) * offset;

  vec2 frame_uv = get_frame_uv();
  frame_uv -= u_disturb_power * normalize(velocity) * offset;

  vec3 img = sample_image_smooth(img_uv);
  float opacity = get_img_frame_alpha(frame_uv, .002);
  gl_FragColor = vec4(img * opacity, opacity);
}
`;

/**
 * Originkit Liquid Distortion — WebGL fluid hover on an image.
 * Defaults match preview: intensity 40.
 */
export function LiquidHover({
  imageSrc,
  resolution = 10,
  cursorSize = 50,
  intensity = 40,
  className = "",
  "aria-label": ariaLabel,
  onReady,
  onError,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const onReadyRef = useRef(onReady);
  const onErrorRef = useRef(onError);
  onReadyRef.current = onReady;
  onErrorRef.current = onError;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !imageSrc) return undefined;

    const glMaybe = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    if (!glMaybe) {
      onErrorRef.current?.();
      return undefined;
    }
    const gl = glMaybe;
    gl.getExtension("OES_texture_float");
    gl.getExtension("OES_texture_float_linear");
    const halfFloat = gl.getExtension("OES_texture_half_float");
    const halfFloatLinear = gl.getExtension("OES_texture_half_float_linear");
    gl.clearColor(0, 0, 0, 0);

    const cp = intensity / 100;
    const params = {
      cursorRadiusPx: cursorSize,
      cursorPower: 5 + ((cp - 0.1) * (50 - 5)) / (1 - 0.1),
      distortionPower: intensity / 100,
    };
    const overscanFactor = 1.05;
    const innerScale = 1;
    const pressureItersActive = 6;
    const pressureItersIdle = 2;
    const maxIdleFrames = 40;
    let idleFrames = 0;
    const pointer = {
      x: 0.65 * container.clientWidth,
      y: 0.5 * container.clientHeight,
      dx: 0,
      dy: 0,
      moved: false,
    };
    const res = { w: 0, h: 0 };
    let outputColor = null;
    let velocity = null;
    let divergence = null;
    let pressure = null;
    let imageTexture = null;
    let imgRatio = 1;
    let isHovering = true; // WorkLiquidPhoto mounts this on pointer enter
    let visible = true;
    let cancelled = false;
    let fboInternalFormat = gl.RGB;
    let fboType = gl.FLOAT;

    function createShader(source, type) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader) || "Shader compile error";
        gl.deleteShader(shader);
        throw new Error(info);
      }
      return shader;
    }

    function createProgramFromSources(vsSource, fsSource) {
      const program = gl.createProgram();
      const vs = createShader(vsSource, gl.VERTEX_SHADER);
      const fs = createShader(fsSource, gl.FRAGMENT_SHADER);
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.bindAttribLocation(program, 0, "a_position");
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || "Program link error");
      }
      const uniforms = {};
      const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < uniformCount; i++) {
        const active = gl.getActiveUniform(program, i);
        if (!active) continue;
        uniforms[active.name] = gl.getUniformLocation(program, active.name);
      }
      return { program, uniforms };
    }

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      gl.STATIC_DRAW
    );
    const ebo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([0, 1, 2, 0, 2, 3]),
      gl.STATIC_DRAW
    );

    function blit(target = null) {
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);
      if (target == null) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }

    function tryCreateFBO(w, h, internalFormat, type) {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, gl.RGB, type, null);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      );
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      if (status !== gl.FRAMEBUFFER_COMPLETE) {
        gl.deleteFramebuffer(fbo);
        gl.deleteTexture(texture);
        return null;
      }
      return {
        fbo,
        width: w,
        height: h,
        attach(id) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        },
      };
    }

    function createFBO(w, h) {
      let fbo = tryCreateFBO(w, h, fboInternalFormat, fboType);
      if (fbo) return fbo;
      if (halfFloat && fboType !== halfFloat.HALF_FLOAT_OES) {
        fboInternalFormat = gl.RGB;
        fboType = halfFloat.HALF_FLOAT_OES;
        if (halfFloatLinear) {
          /* linear filtering available */
        }
        fbo = tryCreateFBO(w, h, fboInternalFormat, fboType);
        if (fbo) return fbo;
      }
      fboInternalFormat = gl.RGB;
      fboType = gl.UNSIGNED_BYTE;
      fbo = tryCreateFBO(w, h, fboInternalFormat, fboType);
      if (!fbo) throw new Error("WebGL FBO unavailable");
      return fbo;
    }

    function createDoubleFBO(w, h) {
      let fbo1 = createFBO(w, h);
      let fbo2 = createFBO(w, h);
      return {
        width: w,
        height: h,
        texelSizeX: 1 / w,
        texelSizeY: 1 / h,
        read: () => fbo1,
        write: () => fbo2,
        swap() {
          const tmp = fbo1;
          fbo1 = fbo2;
          fbo2 = tmp;
        },
      };
    }

    let splatProgram;
    let divergenceProgram;
    let pressureProgram;
    let gradientSubtractProgram;
    let advectionProgram;
    let displayProgram;

    try {
      splatProgram = createProgramFromSources(VERT, FRAG_POINT);
      divergenceProgram = createProgramFromSources(VERT, FRAG_DIVERGENCE);
      pressureProgram = createProgramFromSources(VERT, FRAG_PRESSURE);
      gradientSubtractProgram = createProgramFromSources(VERT, FRAG_GRAD_SUB);
      advectionProgram = createProgramFromSources(VERT, FRAG_ADVECT);
      displayProgram = createProgramFromSources(VERT, FRAG_OUTPUT);
    } catch {
      onErrorRef.current?.();
      return undefined;
    }

    function initFBOs() {
      outputColor = createDoubleFBO(res.w, res.h);
      velocity = createDoubleFBO(res.w, res.h);
      divergence = createFBO(res.w, res.h);
      pressure = createDoubleFBO(res.w, res.h);
    }

    function updatePointerPosition(eX, eY) {
      pointer.moved = true;
      pointer.dx = 6 * (eX - pointer.x);
      pointer.dy = 6 * (eY - pointer.y);
      pointer.x = eX;
      pointer.y = eY;
    }

    function resizeCanvas() {
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(2, Math.round(width * overscanFactor * dpr));
      canvas.height = Math.max(2, Math.round(height * overscanFactor * dpr));
      const cssW = width * overscanFactor;
      const cssH = height * overscanFactor;
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      const ratio = cssW / cssH;
      const baseResolution = 128 + ((resolution - 1) * (512 - 128)) / 9;
      res.w = Math.max(32, Math.round(baseResolution * ratio));
      res.h = Math.max(32, Math.round(baseResolution));
    }

    function getPointerUV() {
      const cssW = container.clientWidth * overscanFactor;
      const cssH = container.clientHeight * overscanFactor;
      const dx = 0.5 * (cssW - container.clientWidth);
      const dy = 0.5 * (cssH - container.clientHeight);
      const u = (pointer.x + dx) / cssW;
      const v = 1 - (pointer.y + dy) / cssH;
      return { u, v };
    }

    function loadImage(src) {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (cancelled) return;
        imgRatio = img.naturalWidth / Math.max(1, img.naturalHeight);
        imageTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, imageTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, imageTexture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          img
        );
        onReadyRef.current?.();
        if (!rafRef.current && !cancelled && visible) {
          idleFrames = 0;
          rafRef.current = requestAnimationFrame(render);
        }
      };
      img.onerror = () => onErrorRef.current?.();
      img.src = src;
    }

    function setupEvents() {
      const onEnter = () => {
        isHovering = true;
        idleFrames = 0;
        if (!rafRef.current && !cancelled && visible) {
          rafRef.current = requestAnimationFrame(render);
        }
      };
      const onLeave = () => {
        isHovering = false;
        pointer.moved = false;
      };
      const onMove = (e) => {
        if (!isHovering) return;
        const rect = container.getBoundingClientRect();
        updatePointerPosition(e.clientX - rect.left, e.clientY - rect.top);
      };
      const onPointerDown = (e) => {
        isHovering = true;
        const rect = container.getBoundingClientRect();
        updatePointerPosition(e.clientX - rect.left, e.clientY - rect.top);
      };
      const onResize = () => {
        try {
          resizeCanvas();
          initFBOs();
        } catch {
          onErrorRef.current?.();
        }
      };

      container.addEventListener("pointerenter", onEnter);
      container.addEventListener("pointerleave", onLeave);
      container.addEventListener("pointermove", onMove);
      container.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("resize", onResize);
      const resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(container);

      const io = new IntersectionObserver(
        ([entry]) => {
          visible = Boolean(entry?.isIntersecting);
          if (visible && !rafRef.current && !cancelled) {
            rafRef.current = requestAnimationFrame(render);
          }
        },
        { rootMargin: "80px" }
      );
      io.observe(container);

      return () => {
        container.removeEventListener("pointerenter", onEnter);
        container.removeEventListener("pointerleave", onLeave);
        container.removeEventListener("pointermove", onMove);
        container.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("resize", onResize);
        resizeObserver.disconnect();
        io.disconnect();
      };
    }

    function render() {
      if (cancelled) return;
      if (!visible) {
        rafRef.current = null;
        return;
      }

      const active = isHovering || pointer.moved;
      if (active) {
        idleFrames = 0;
      } else {
        idleFrames += 1;
      }

      // After hover ends, wind down briefly then stop RAF entirely.
      if (!active && idleFrames > maxIdleFrames) {
        rafRef.current = null;
        return;
      }

      const dt = 1 / 60;
      const runSim = active || idleFrames < 12;

      if (pointer.moved) {
        pointer.moved = false;
        gl.useProgram(splatProgram.program);
        gl.uniform1i(
          splatProgram.uniforms.u_input_texture,
          velocity.read().attach(1)
        );
        gl.uniform1f(
          splatProgram.uniforms.u_ratio,
          container.clientWidth / Math.max(1, container.clientHeight)
        );
        const uv = getPointerUV();
        gl.uniform2f(splatProgram.uniforms.u_point, uv.u, uv.v);
        gl.uniform3f(
          splatProgram.uniforms.u_point_value,
          pointer.dx,
          -pointer.dy,
          0
        );
        const ch = Math.max(1, container.clientHeight);
        const rr = params.cursorRadiusPx / ch;
        gl.uniform1f(splatProgram.uniforms.u_point_size, rr * rr);
        blit(velocity.write());
        velocity.swap();
        gl.uniform1i(
          splatProgram.uniforms.u_input_texture,
          outputColor.read().attach(1)
        );
        gl.uniform3f(
          splatProgram.uniforms.u_point_value,
          params.cursorPower * 0.001,
          0,
          0
        );
        blit(outputColor.write());
        outputColor.swap();
      }

      if (runSim) {
        gl.useProgram(divergenceProgram.program);
        gl.uniform2f(
          divergenceProgram.uniforms.u_texel,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
        gl.uniform1i(
          divergenceProgram.uniforms.u_velocity_texture,
          velocity.read().attach(1)
        );
        blit(divergence);

        gl.useProgram(pressureProgram.program);
        gl.uniform2f(
          pressureProgram.uniforms.u_texel,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
        gl.uniform1i(
          pressureProgram.uniforms.u_divergence_texture,
          divergence.attach(1)
        );
        const iters = active ? pressureItersActive : pressureItersIdle;
        for (let i = 0; i < iters; i++) {
          gl.uniform1i(
            pressureProgram.uniforms.u_pressure_texture,
            pressure.read().attach(2)
          );
          blit(pressure.write());
          pressure.swap();
        }

        gl.useProgram(gradientSubtractProgram.program);
        gl.uniform2f(
          gradientSubtractProgram.uniforms.u_texel,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
        gl.uniform1i(
          gradientSubtractProgram.uniforms.u_pressure_texture,
          pressure.read().attach(1)
        );
        gl.uniform1i(
          gradientSubtractProgram.uniforms.u_velocity_texture,
          velocity.read().attach(2)
        );
        blit(velocity.write());
        velocity.swap();

        gl.useProgram(advectionProgram.program);
        gl.uniform2f(
          advectionProgram.uniforms.u_texel,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
        gl.uniform2f(
          advectionProgram.uniforms.u_output_textel,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
        gl.uniform1i(
          advectionProgram.uniforms.u_velocity_texture,
          velocity.read().attach(1)
        );
        gl.uniform1i(
          advectionProgram.uniforms.u_input_texture,
          velocity.read().attach(1)
        );
        gl.uniform1f(advectionProgram.uniforms.u_dt, dt);
        gl.uniform1f(advectionProgram.uniforms.u_dissipation, 0.97);
        blit(velocity.write());
        velocity.swap();

        gl.useProgram(advectionProgram.program);
        gl.uniform2f(
          advectionProgram.uniforms.u_texel,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
        gl.uniform2f(
          advectionProgram.uniforms.u_output_textel,
          outputColor.texelSizeX,
          outputColor.texelSizeY
        );
        gl.uniform1i(
          advectionProgram.uniforms.u_velocity_texture,
          velocity.read().attach(1)
        );
        gl.uniform1i(
          advectionProgram.uniforms.u_input_texture,
          outputColor.read().attach(2)
        );
        gl.uniform1f(advectionProgram.uniforms.u_dt, 8 * dt);
        gl.uniform1f(advectionProgram.uniforms.u_dissipation, 0.98);
        blit(outputColor.write());
        outputColor.swap();
      }

      gl.useProgram(displayProgram.program);
      const uv2 = getPointerUV();
      gl.uniform2f(displayProgram.uniforms.u_point, uv2.u, uv2.v);
      gl.uniform1i(
        displayProgram.uniforms.u_velocity_texture,
        velocity.read().attach(2)
      );
      gl.uniform1f(
        displayProgram.uniforms.u_ratio,
        container.clientWidth / Math.max(1, container.clientHeight)
      );
      gl.uniform1f(displayProgram.uniforms.u_img_ratio, imgRatio);
      gl.uniform1f(
        displayProgram.uniforms.u_disturb_power,
        params.distortionPower
      );
      gl.uniform1i(
        displayProgram.uniforms.u_output_texture,
        outputColor.read().attach(1)
      );
      gl.uniform1f(displayProgram.uniforms.u_canvas_scale, overscanFactor);
      gl.uniform1f(displayProgram.uniforms.u_inner_scale, innerScale);
      if (imageTexture) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, imageTexture);
        gl.uniform1i(displayProgram.uniforms.u_text_texture, 0);
      }
      blit();

      rafRef.current = requestAnimationFrame(render);
    }

    let cleanupEvents = () => {};
    try {
      resizeCanvas();
      initFBOs();
      cleanupEvents = setupEvents();
      loadImage(imageSrc);
      // Don't spin the sim until the user interacts — first paint via img fallback.
      // RAF starts on pointerenter / when intersecting after hover once.
    } catch {
      onErrorRef.current?.();
      return undefined;
    }

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      cleanupEvents();
    };
  }, [imageSrc, resolution, cursorSize, intensity]);

  return h(
    "div",
    {
      ref: containerRef,
      className: ["liquid-hover", className].filter(Boolean).join(" "),
      "aria-label": ariaLabel,
      role: ariaLabel ? "img" : undefined,
    },
    h("canvas", {
      ref: canvasRef,
      className: "liquid-hover__canvas",
      "aria-hidden": true,
    })
  );
}

/** Selected Work tile — static image by default; liquid WebGL only on hover. */
export function WorkLiquidPhoto({
  src,
  alt,
  intensity = 40,
  reduceMotion = false,
  loading = "lazy",
  fetchPriority = "auto",
}) {
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [liquidOn, setLiquidOn] = useState(false);
  const canLiquid = !reduceMotion && !failed;
  const showLiquid = canLiquid && liquidOn;

  return h(
    "div",
    {
      className: "work-item__media",
      onPointerEnter:
        canLiquid && !liquidOn
          ? () => {
              if (isDesktopHoverEnabled()) {
                setLiquidOn(true);
              }
            }
          : undefined,
    },
    h("img", {
      className: [
        "work-item__photo",
        showLiquid && ready ? "work-item__photo--under" : "",
      ]
        .filter(Boolean)
        .join(" "),
      src,
      alt,
      width: 2592,
      height: 1888,
      loading,
      decoding: "async",
      fetchPriority,
    }),
    showLiquid
      ? h(LiquidHover, {
          className: "work-item__liquid",
          imageSrc: src,
          intensity,
          resolution: 5,
          ariaLabel: alt,
          onReady: () => setReady(true),
          onError: () => setFailed(true),
        })
      : null
  );
}
