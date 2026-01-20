import * as S from "three";
import { EventDispatcher as He, Vector3 as N, MOUSE as lt, TOUCH as ct, Spherical as ee, Quaternion as ne, Vector2 as Y, Ray as Xe, Plane as Ge, MathUtils as We, Matrix4 as he, Object3D as Ke } from "three";
const oe = { type: "change" }, Dt = { type: "start" }, ie = { type: "end" }, zt = new Xe(), se = new Ge(), qe = Math.cos(70 * We.DEG2RAD);
class Qe extends He {
  constructor(e, o) {
    super(), this.object = e, this.domElement = o, this.domElement.style.touchAction = "none", this.enabled = !0, this.target = new N(), this.cursor = new N(), this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minTargetRadius = 0, this.maxTargetRadius = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = !1, this.dampingFactor = 0.05, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !0, this.keyPanSpeed = 7, this.zoomToCursor = !1, this.autoRotate = !1, this.autoRotateSpeed = 2, this.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }, this.mouseButtons = { LEFT: lt.ROTATE, MIDDLE: lt.DOLLY, RIGHT: lt.PAN }, this.touches = { ONE: ct.ROTATE, TWO: ct.DOLLY_PAN }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this._domElementKeyEvents = null, this.getPolarAngle = function() {
      return r.phi;
    }, this.getAzimuthalAngle = function() {
      return r.theta;
    }, this.getDistance = function() {
      return this.object.position.distanceTo(this.target);
    }, this.listenToKeyEvents = function(s) {
      s.addEventListener("keydown", Et), this._domElementKeyEvents = s;
    }, this.stopListenToKeyEvents = function() {
      this._domElementKeyEvents.removeEventListener("keydown", Et), this._domElementKeyEvents = null;
    }, this.saveState = function() {
      t.target0.copy(t.target), t.position0.copy(t.object.position), t.zoom0 = t.object.zoom;
    }, this.reset = function() {
      t.target.copy(t.target0), t.object.position.copy(t.position0), t.object.zoom = t.zoom0, t.object.updateProjectionMatrix(), t.dispatchEvent(oe), t.update(), a = i.NONE;
    }, this.update = function() {
      const s = new N(), h = new ne().setFromUnitVectors(e.up, new N(0, 1, 0)), F = h.clone().invert(), L = new N(), $ = new ne(), Q = new N(), U = 2 * Math.PI;
      return function(Ve = null) {
        const te = t.object.position;
        s.copy(te).sub(t.target), s.applyQuaternion(h), r.setFromVector3(s), t.autoRotate && a === i.NONE && R(Z(Ve)), t.enableDamping ? (r.theta += c.theta * t.dampingFactor, r.phi += c.phi * t.dampingFactor) : (r.theta += c.theta, r.phi += c.phi);
        let G = t.minAzimuthAngle, W = t.maxAzimuthAngle;
        isFinite(G) && isFinite(W) && (G < -Math.PI ? G += U : G > Math.PI && (G -= U), W < -Math.PI ? W += U : W > Math.PI && (W -= U), G <= W ? r.theta = Math.max(G, Math.min(W, r.theta)) : r.theta = r.theta > (G + W) / 2 ? Math.max(G, r.theta) : Math.min(W, r.theta)), r.phi = Math.max(t.minPolarAngle, Math.min(t.maxPolarAngle, r.phi)), r.makeSafe(), t.enableDamping === !0 ? t.target.addScaledVector(y, t.dampingFactor) : t.target.add(y), t.target.sub(t.cursor), t.target.clampLength(t.minTargetRadius, t.maxTargetRadius), t.target.add(t.cursor), t.zoomToCursor && v || t.object.isOrthographicCamera ? r.radius = gt(r.radius) : r.radius = gt(r.radius * f), s.setFromSpherical(r), s.applyQuaternion(F), te.copy(t.target).add(s), t.object.lookAt(t.target), t.enableDamping === !0 ? (c.theta *= 1 - t.dampingFactor, c.phi *= 1 - t.dampingFactor, y.multiplyScalar(1 - t.dampingFactor)) : (c.set(0, 0, 0), y.set(0, 0, 0));
        let Lt = !1;
        if (t.zoomToCursor && v) {
          let yt = null;
          if (t.object.isPerspectiveCamera) {
            const St = s.length();
            yt = gt(St * f);
            const Mt = St - yt;
            t.object.position.addScaledVector(z, Mt), t.object.updateMatrixWorld();
          } else if (t.object.isOrthographicCamera) {
            const St = new N(E.x, E.y, 0);
            St.unproject(t.object), t.object.zoom = Math.max(t.minZoom, Math.min(t.maxZoom, t.object.zoom / f)), t.object.updateProjectionMatrix(), Lt = !0;
            const Mt = new N(E.x, E.y, 0);
            Mt.unproject(t.object), t.object.position.sub(Mt).add(St), t.object.updateMatrixWorld(), yt = s.length();
          } else
            console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."), t.zoomToCursor = !1;
          yt !== null && (this.screenSpacePanning ? t.target.set(0, 0, -1).transformDirection(t.object.matrix).multiplyScalar(yt).add(t.object.position) : (zt.origin.copy(t.object.position), zt.direction.set(0, 0, -1).transformDirection(t.object.matrix), Math.abs(t.object.up.dot(zt.direction)) < qe ? e.lookAt(t.target) : (se.setFromNormalAndCoplanarPoint(t.object.up, t.target), zt.intersectPlane(se, t.target))));
        } else t.object.isOrthographicCamera && (t.object.zoom = Math.max(t.minZoom, Math.min(t.maxZoom, t.object.zoom / f)), t.object.updateProjectionMatrix(), Lt = !0);
        return f = 1, v = !1, Lt || L.distanceToSquared(t.object.position) > u || 8 * (1 - $.dot(t.object.quaternion)) > u || Q.distanceToSquared(t.target) > 0 ? (t.dispatchEvent(oe), L.copy(t.object.position), $.copy(t.object.quaternion), Q.copy(t.target), !0) : !1;
      };
    }(), this.dispose = function() {
      t.domElement.removeEventListener("contextmenu", Qt), t.domElement.removeEventListener("pointerdown", Wt), t.domElement.removeEventListener("pointercancel", xt), t.domElement.removeEventListener("wheel", Kt), t.domElement.removeEventListener("pointermove", At), t.domElement.removeEventListener("pointerup", xt), t._domElementKeyEvents !== null && (t._domElementKeyEvents.removeEventListener("keydown", Et), t._domElementKeyEvents = null);
    };
    const t = this, i = {
      NONE: -1,
      ROTATE: 0,
      DOLLY: 1,
      PAN: 2,
      TOUCH_ROTATE: 3,
      TOUCH_PAN: 4,
      TOUCH_DOLLY_PAN: 5,
      TOUCH_DOLLY_ROTATE: 6
    };
    let a = i.NONE;
    const u = 1e-6, r = new ee(), c = new ee();
    let f = 1;
    const y = new N(), C = new Y(), g = new Y(), m = new Y(), d = new Y(), p = new Y(), b = new Y(), x = new Y(), w = new Y(), M = new Y(), z = new N(), E = new Y();
    let v = !1;
    const P = [], A = {};
    let T = !1;
    function Z(s) {
      return s !== null ? 2 * Math.PI / 60 * t.autoRotateSpeed * s : 2 * Math.PI / 60 / 60 * t.autoRotateSpeed;
    }
    function j(s) {
      const h = Math.abs(s * 0.01);
      return Math.pow(0.95, t.zoomSpeed * h);
    }
    function R(s) {
      c.theta -= s;
    }
    function O(s) {
      c.phi -= s;
    }
    const st = function() {
      const s = new N();
      return function(F, L) {
        s.setFromMatrixColumn(L, 0), s.multiplyScalar(-F), y.add(s);
      };
    }(), at = function() {
      const s = new N();
      return function(F, L) {
        t.screenSpacePanning === !0 ? s.setFromMatrixColumn(L, 1) : (s.setFromMatrixColumn(L, 0), s.crossVectors(t.object.up, s)), s.multiplyScalar(F), y.add(s);
      };
    }(), H = function() {
      const s = new N();
      return function(F, L) {
        const $ = t.domElement;
        if (t.object.isPerspectiveCamera) {
          const Q = t.object.position;
          s.copy(Q).sub(t.target);
          let U = s.length();
          U *= Math.tan(t.object.fov / 2 * Math.PI / 180), st(2 * F * U / $.clientHeight, t.object.matrix), at(2 * L * U / $.clientHeight, t.object.matrix);
        } else t.object.isOrthographicCamera ? (st(F * (t.object.right - t.object.left) / t.object.zoom / $.clientWidth, t.object.matrix), at(L * (t.object.top - t.object.bottom) / t.object.zoom / $.clientHeight, t.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), t.enablePan = !1);
      };
    }();
    function _(s) {
      t.object.isPerspectiveCamera || t.object.isOrthographicCamera ? f /= s : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), t.enableZoom = !1);
    }
    function wt(s) {
      t.object.isPerspectiveCamera || t.object.isOrthographicCamera ? f *= s : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), t.enableZoom = !1);
    }
    function ht(s, h) {
      if (!t.zoomToCursor)
        return;
      v = !0;
      const F = t.domElement.getBoundingClientRect(), L = s - F.left, $ = h - F.top, Q = F.width, U = F.height;
      E.x = L / Q * 2 - 1, E.y = -($ / U) * 2 + 1, z.set(E.x, E.y, 1).unproject(t.object).sub(t.object.position).normalize();
    }
    function gt(s) {
      return Math.max(t.minDistance, Math.min(t.maxDistance, s));
    }
    function Ut(s) {
      C.set(s.clientX, s.clientY);
    }
    function Fe(s) {
      ht(s.clientX, s.clientX), x.set(s.clientX, s.clientY);
    }
    function Yt(s) {
      d.set(s.clientX, s.clientY);
    }
    function Ae(s) {
      g.set(s.clientX, s.clientY), m.subVectors(g, C).multiplyScalar(t.rotateSpeed);
      const h = t.domElement;
      R(2 * Math.PI * m.x / h.clientHeight), O(2 * Math.PI * m.y / h.clientHeight), C.copy(g), t.update();
    }
    function Ee(s) {
      w.set(s.clientX, s.clientY), M.subVectors(w, x), M.y > 0 ? _(j(M.y)) : M.y < 0 && wt(j(M.y)), x.copy(w), t.update();
    }
    function Le(s) {
      p.set(s.clientX, s.clientY), b.subVectors(p, d).multiplyScalar(t.panSpeed), H(b.x, b.y), d.copy(p), t.update();
    }
    function De(s) {
      ht(s.clientX, s.clientY), s.deltaY < 0 ? wt(j(s.deltaY)) : s.deltaY > 0 && _(j(s.deltaY)), t.update();
    }
    function Te(s) {
      let h = !1;
      switch (s.code) {
        case t.keys.UP:
          s.ctrlKey || s.metaKey || s.shiftKey ? O(2 * Math.PI * t.rotateSpeed / t.domElement.clientHeight) : H(0, t.keyPanSpeed), h = !0;
          break;
        case t.keys.BOTTOM:
          s.ctrlKey || s.metaKey || s.shiftKey ? O(-2 * Math.PI * t.rotateSpeed / t.domElement.clientHeight) : H(0, -t.keyPanSpeed), h = !0;
          break;
        case t.keys.LEFT:
          s.ctrlKey || s.metaKey || s.shiftKey ? R(2 * Math.PI * t.rotateSpeed / t.domElement.clientHeight) : H(t.keyPanSpeed, 0), h = !0;
          break;
        case t.keys.RIGHT:
          s.ctrlKey || s.metaKey || s.shiftKey ? R(-2 * Math.PI * t.rotateSpeed / t.domElement.clientHeight) : H(-t.keyPanSpeed, 0), h = !0;
          break;
      }
      h && (s.preventDefault(), t.update());
    }
    function jt(s) {
      if (P.length === 1)
        C.set(s.pageX, s.pageY);
      else {
        const h = rt(s), F = 0.5 * (s.pageX + h.x), L = 0.5 * (s.pageY + h.y);
        C.set(F, L);
      }
    }
    function _t(s) {
      if (P.length === 1)
        d.set(s.pageX, s.pageY);
      else {
        const h = rt(s), F = 0.5 * (s.pageX + h.x), L = 0.5 * (s.pageY + h.y);
        d.set(F, L);
      }
    }
    function Vt(s) {
      const h = rt(s), F = s.pageX - h.x, L = s.pageY - h.y, $ = Math.sqrt(F * F + L * L);
      x.set(0, $);
    }
    function Ie(s) {
      t.enableZoom && Vt(s), t.enablePan && _t(s);
    }
    function Oe(s) {
      t.enableZoom && Vt(s), t.enableRotate && jt(s);
    }
    function Ht(s) {
      if (P.length == 1)
        g.set(s.pageX, s.pageY);
      else {
        const F = rt(s), L = 0.5 * (s.pageX + F.x), $ = 0.5 * (s.pageY + F.y);
        g.set(L, $);
      }
      m.subVectors(g, C).multiplyScalar(t.rotateSpeed);
      const h = t.domElement;
      R(2 * Math.PI * m.x / h.clientHeight), O(2 * Math.PI * m.y / h.clientHeight), C.copy(g);
    }
    function Xt(s) {
      if (P.length === 1)
        p.set(s.pageX, s.pageY);
      else {
        const h = rt(s), F = 0.5 * (s.pageX + h.x), L = 0.5 * (s.pageY + h.y);
        p.set(F, L);
      }
      b.subVectors(p, d).multiplyScalar(t.panSpeed), H(b.x, b.y), d.copy(p);
    }
    function Gt(s) {
      const h = rt(s), F = s.pageX - h.x, L = s.pageY - h.y, $ = Math.sqrt(F * F + L * L);
      w.set(0, $), M.set(0, Math.pow(w.y / x.y, t.zoomSpeed)), _(M.y), x.copy(w);
      const Q = (s.pageX + h.x) * 0.5, U = (s.pageY + h.y) * 0.5;
      ht(Q, U);
    }
    function Ne(s) {
      t.enableZoom && Gt(s), t.enablePan && Xt(s);
    }
    function Re(s) {
      t.enableZoom && Gt(s), t.enableRotate && Ht(s);
    }
    function Wt(s) {
      t.enabled !== !1 && (P.length === 0 && (t.domElement.setPointerCapture(s.pointerId), t.domElement.addEventListener("pointermove", At), t.domElement.addEventListener("pointerup", xt)), je(s), s.pointerType === "touch" ? Ue(s) : $e(s));
    }
    function At(s) {
      t.enabled !== !1 && (s.pointerType === "touch" ? Ye(s) : ke(s));
    }
    function xt(s) {
      _e(s), P.length === 0 && (t.domElement.releasePointerCapture(s.pointerId), t.domElement.removeEventListener("pointermove", At), t.domElement.removeEventListener("pointerup", xt)), t.dispatchEvent(ie), a = i.NONE;
    }
    function $e(s) {
      let h;
      switch (s.button) {
        case 0:
          h = t.mouseButtons.LEFT;
          break;
        case 1:
          h = t.mouseButtons.MIDDLE;
          break;
        case 2:
          h = t.mouseButtons.RIGHT;
          break;
        default:
          h = -1;
      }
      switch (h) {
        case lt.DOLLY:
          if (t.enableZoom === !1) return;
          Fe(s), a = i.DOLLY;
          break;
        case lt.ROTATE:
          if (s.ctrlKey || s.metaKey || s.shiftKey) {
            if (t.enablePan === !1) return;
            Yt(s), a = i.PAN;
          } else {
            if (t.enableRotate === !1) return;
            Ut(s), a = i.ROTATE;
          }
          break;
        case lt.PAN:
          if (s.ctrlKey || s.metaKey || s.shiftKey) {
            if (t.enableRotate === !1) return;
            Ut(s), a = i.ROTATE;
          } else {
            if (t.enablePan === !1) return;
            Yt(s), a = i.PAN;
          }
          break;
        default:
          a = i.NONE;
      }
      a !== i.NONE && t.dispatchEvent(Dt);
    }
    function ke(s) {
      switch (a) {
        case i.ROTATE:
          if (t.enableRotate === !1) return;
          Ae(s);
          break;
        case i.DOLLY:
          if (t.enableZoom === !1) return;
          Ee(s);
          break;
        case i.PAN:
          if (t.enablePan === !1) return;
          Le(s);
          break;
      }
    }
    function Kt(s) {
      t.enabled === !1 || t.enableZoom === !1 || a !== i.NONE || (s.preventDefault(), t.dispatchEvent(Dt), De(Be(s)), t.dispatchEvent(ie));
    }
    function Be(s) {
      const h = s.deltaMode, F = {
        clientX: s.clientX,
        clientY: s.clientY,
        deltaY: s.deltaY
      };
      switch (h) {
        case 1:
          F.deltaY *= 16;
          break;
        case 2:
          F.deltaY *= 100;
          break;
      }
      return s.ctrlKey && !T && (F.deltaY *= 10), F;
    }
    function Ze(s) {
      s.key === "Control" && (T = !0, document.addEventListener("keyup", qt, { passive: !0, capture: !0 }));
    }
    function qt(s) {
      s.key === "Control" && (T = !1, document.removeEventListener("keyup", qt, { passive: !0, capture: !0 }));
    }
    function Et(s) {
      t.enabled === !1 || t.enablePan === !1 || Te(s);
    }
    function Ue(s) {
      switch (Jt(s), P.length) {
        case 1:
          switch (t.touches.ONE) {
            case ct.ROTATE:
              if (t.enableRotate === !1) return;
              jt(s), a = i.TOUCH_ROTATE;
              break;
            case ct.PAN:
              if (t.enablePan === !1) return;
              _t(s), a = i.TOUCH_PAN;
              break;
            default:
              a = i.NONE;
          }
          break;
        case 2:
          switch (t.touches.TWO) {
            case ct.DOLLY_PAN:
              if (t.enableZoom === !1 && t.enablePan === !1) return;
              Ie(s), a = i.TOUCH_DOLLY_PAN;
              break;
            case ct.DOLLY_ROTATE:
              if (t.enableZoom === !1 && t.enableRotate === !1) return;
              Oe(s), a = i.TOUCH_DOLLY_ROTATE;
              break;
            default:
              a = i.NONE;
          }
          break;
        default:
          a = i.NONE;
      }
      a !== i.NONE && t.dispatchEvent(Dt);
    }
    function Ye(s) {
      switch (Jt(s), a) {
        case i.TOUCH_ROTATE:
          if (t.enableRotate === !1) return;
          Ht(s), t.update();
          break;
        case i.TOUCH_PAN:
          if (t.enablePan === !1) return;
          Xt(s), t.update();
          break;
        case i.TOUCH_DOLLY_PAN:
          if (t.enableZoom === !1 && t.enablePan === !1) return;
          Ne(s), t.update();
          break;
        case i.TOUCH_DOLLY_ROTATE:
          if (t.enableZoom === !1 && t.enableRotate === !1) return;
          Re(s), t.update();
          break;
        default:
          a = i.NONE;
      }
    }
    function Qt(s) {
      t.enabled !== !1 && s.preventDefault();
    }
    function je(s) {
      P.push(s.pointerId);
    }
    function _e(s) {
      delete A[s.pointerId];
      for (let h = 0; h < P.length; h++)
        if (P[h] == s.pointerId) {
          P.splice(h, 1);
          return;
        }
    }
    function Jt(s) {
      let h = A[s.pointerId];
      h === void 0 && (h = new Y(), A[s.pointerId] = h), h.set(s.pageX, s.pageY);
    }
    function rt(s) {
      const h = s.pointerId === P[0] ? P[1] : P[0];
      return A[h];
    }
    t.domElement.addEventListener("contextmenu", Qt), t.domElement.addEventListener("pointerdown", Wt), t.domElement.addEventListener("pointercancel", xt), t.domElement.addEventListener("wheel", Kt, { passive: !1 }), document.addEventListener("keydown", Ze, { passive: !0, capture: !0 }), this.update();
  }
}
const et = new S.Scene();
et.background = new S.Color(657935);
const V = new S.PerspectiveCamera(
  75,
  // FOV
  window.innerWidth / window.innerHeight,
  // Aspect ratio
  0.01,
  // Near plane
  1e4
  // Far plane
);
V.position.z = 5;
const nt = new S.WebGLRenderer({
  antialias: !0,
  powerPreference: "high-performance"
});
nt.setSize(window.innerWidth, window.innerHeight);
nt.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(nt.domElement);
const ae = nt.getContext();
console.log("WebGL Version:", ae.getParameter(ae.VERSION));
const ot = new Qe(V, nt.domElement);
ot.enableDamping = !0;
ot.dampingFactor = 0.05;
ot.screenSpacePanning = !0;
function Je() {
  V.aspect = window.innerWidth / window.innerHeight, V.updateProjectionMatrix(), nt.setSize(window.innerWidth, window.innerHeight), nt.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
window.addEventListener("resize", Je);
const tn = `/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                         VERTEX SHADER                                     ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║  This shader runs ONCE for each point in our point cloud.                 ║
 * ║  Its main job: transform 3D position → 2D screen position                 ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * GLSL (OpenGL Shading Language) Basics:
 * - Variables must have types (float, vec3, etc.)
 * - vec3 = vector of 3 floats (x,y,z or r,g,b)
 * - vec4 = vector of 4 floats (x,y,z,w or r,g,b,a)
 * - Swizzling: myVec.xyz, myVec.rgb, myVec.xy are all valid
 */


/* ═══════════════════════════════════════════════════════════════════════════
   UNIFORMS
   ═══════════════════════════════════════════════════════════════════════════
   
   Uniforms are "global" variables that are the SAME for all vertices.
   Set from JavaScript: material.uniforms.uTime.value = 1.5
   
   THREE.js automatically provides these built-in uniforms:
   - modelMatrix: object's position/rotation/scale
   - viewMatrix: camera's position/rotation
   - projectionMatrix: camera's perspective (FOV, aspect ratio)
   - modelViewMatrix: modelMatrix × viewMatrix (convenience)
*/

uniform float uTime;        // Current time in seconds (for animations)
uniform float uPointScale;  // Global scale multiplier for all points

// LOD uniforms
uniform float uMaxDistance;   // Maximum render distance (points beyond are hidden)
uniform float uFadeStart;     // Distance where points start to fade
uniform float uMinPointSize;  // Minimum point size
uniform float uMaxPointSize;  // Maximum point size

// Frustum culling uniforms (GPU-side)
// Each plane is represented as (normal.x, normal.y, normal.z, constant)
// 6 planes: left, right, top, bottom, near, far
uniform vec4 uFrustumPlanes[6];  // Frustum planes for GPU culling
uniform bool uFrustumCullingEnabled;  // Enable/disable frustum culling


/* ═══════════════════════════════════════════════════════════════════════════
   ATTRIBUTES
   ═══════════════════════════════════════════════════════════════════════════
   
   Attributes are variables that are DIFFERENT for each vertex.
   These come from our BufferGeometry:
   
   - position: automatically provided by THREE.js (vec3)
   - color: our custom attribute (vec3)
   - size: our custom attribute (float)
*/

attribute vec3 color;  // RGB color for this point (0-1 range)
attribute float size;  // Size of this point in pixels


/* ═══════════════════════════════════════════════════════════════════════════
   VARYINGS
   ═══════════════════════════════════════════════════════════════════════════
   
   Varyings pass data FROM vertex shader TO fragment shader.
   
   The GPU automatically interpolates these values.
   For points, there's no interpolation since each point is independent.
*/

varying vec3 vColor;      // Pass color to fragment shader
varying float vDistance;  // Pass distance from camera (for effects)


/* ═══════════════════════════════════════════════════════════════════════════
   MAIN FUNCTION
   ═══════════════════════════════════════════════════════════════════════════
   
   This is called once per vertex (once per point).
   We MUST set gl_Position (where the point appears on screen).
   We SHOULD set gl_PointSize (how big the point is).
*/

/**
 * Test if a point is inside the frustum (GPU-side culling)
 * @param vec3 point - Point position in world space
 * @returns bool - True if point is inside frustum
 */
bool pointInFrustum(vec3 point) {
  for (int i = 0; i < 6; i++) {
    vec4 plane = uFrustumPlanes[i];
    // Plane equation: dot(plane.xyz, point) + plane.w >= 0 means inside
    float distance = dot(plane.xyz, point) + plane.w;
    if (distance < 0.0) {
      return false; // Point is outside this plane
    }
  }
  return true; // Point is inside all planes
}


void main() {
  // --- STEP 0a: Skip points with size <= 0 (classification filter) ---
  // Points are hidden by setting their size attribute to 0
  if (size <= 0.0) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);  // Move off-screen
    gl_PointSize = 0.0;
    vColor = vec3(0.0);
    return;
  }

  // --- STEP 0b: GPU-side frustum culling ---
  if (uFrustumCullingEnabled && !pointInFrustum(position)) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);  // Move off-screen
    gl_PointSize = 0.0;
    vColor = vec3(0.0);
    return;
  }

  // --- STEP 1: Transform position to view space ---
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  
  // --- STEP 2: Calculate distance from camera ---
  vDistance = length(mvPosition.xyz);
  
  // --- STEP 3: LOD - Hide points beyond max distance ---
  // Move point off-screen if too far (faster than fragment discard)
  if (uMaxDistance > 0.0 && vDistance > uMaxDistance) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);  // Off-screen
    gl_PointSize = 0.0;
    vColor = vec3(0.0);
    return;
  }
  
  // --- STEP 4: Pass color to fragment shader ---
  // Fade color based on distance (if fade is enabled)
  vColor = color;
  if (uFadeStart > 0.0 && vDistance > uFadeStart) {
    float fade = 1.0 - (vDistance - uFadeStart) / (uMaxDistance - uFadeStart);
    vColor = color * fade;
  }
  
  // --- STEP 5: Calculate point size with distance attenuation ---
  // Formula: baseSize × scale ÷ distance
  // This mimics perspective: double the distance = half the size
  float baseSize = size * uPointScale * (300.0 / vDistance);
  
  // Apply LOD size limits
  float minSize = uMinPointSize > 0.0 ? uMinPointSize : 1.0;
  float maxSize = uMaxPointSize > 0.0 ? uMaxPointSize : 50.0;
  gl_PointSize = clamp(baseSize, minSize, maxSize);
  
  // --- STEP 6: Final position on screen ---
  gl_Position = projectionMatrix * mvPosition;
}
`, en = `/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                        FRAGMENT SHADER                                    ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║  This shader runs ONCE for each pixel of each point.                      ║
 * ║  Its main job: determine the final color of each pixel                    ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * Points are rendered as SQUARES by default.
 * We use the fragment shader to:
 * 1. Make them circular (discard corners)
 * 2. Add soft edges (smooth falloff)
 * 3. Apply final coloring
 */


/* ═══════════════════════════════════════════════════════════════════════════
   VARYINGS (received from vertex shader)
   ═══════════════════════════════════════════════════════════════════════════
*/

varying vec3 vColor;      // Color from vertex shader
varying float vDistance;  // Distance from camera


/* ═══════════════════════════════════════════════════════════════════════════
   MAIN FUNCTION
   ═══════════════════════════════════════════════════════════════════════════
   
   This runs once per PIXEL of each point.
   A 10×10 pixel point = 100 fragment shader calls!
   
   gl_PointCoord: built-in variable
   - Gives UV coordinates within the point square
   - (0,0) = top-left, (1,1) = bottom-right
   - (0.5, 0.5) = center of the point
*/

void main() {
  // --- SQUARE POINTS ---
  // WebGL renders points as squares by default.
  // We just output the color directly without any circular clipping.
  
  gl_FragColor = vec4(vColor, 1.0);
  
  
  
  /* ═══════════════════════════════════════════════════════════════════════
     ALTERNATIVE POINT SHAPES
     ═══════════════════════════════════════════════════════════════════════
     
     To use a different shape, replace the gl_FragColor line above with:
     
     --- CIRCULAR POINTS (soft edges) ---
     vec2 centerOffset = gl_PointCoord - vec2(0.5);
     float dist = length(centerOffset);
     if (dist > 0.5) discard;
     float alpha = 1.0 - smoothstep(0.4, 0.5, dist);
     gl_FragColor = vec4(vColor, alpha);
     
     --- CIRCULAR POINTS (hard edges) ---
     vec2 centerOffset = gl_PointCoord - vec2(0.5);
     if (length(centerOffset) > 0.5) discard;
     gl_FragColor = vec4(vColor, 1.0);
     
     --- GLOWING POINTS ---
     vec2 centerOffset = gl_PointCoord - vec2(0.5);
     float dist = length(centerOffset);
     float glow = 1.0 - dist * 2.0;
     gl_FragColor = vec4(vColor * (1.0 + glow * 0.5), glow * glow);
     
  */
}
`, K = new S.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uPointScale: { value: 1 },
    // LOD uniforms
    uMaxDistance: { value: 0 },
    // 0 = disabled
    uFadeStart: { value: 0 },
    // 0 = disabled
    uMinPointSize: { value: 1 },
    uMaxPointSize: { value: 50 },
    // Frustum culling uniforms (GPU-side)
    uFrustumPlanes: {
      value: [
        new S.Vector4(0, 0, 0, 0),
        // left
        new S.Vector4(0, 0, 0, 0),
        // right
        new S.Vector4(0, 0, 0, 0),
        // top
        new S.Vector4(0, 0, 0, 0),
        // bottom
        new S.Vector4(0, 0, 0, 0),
        // near
        new S.Vector4(0, 0, 0, 0)
        // far
      ]
    },
    uFrustumCullingEnabled: { value: !1 }
  },
  vertexShader: tn,
  fragmentShader: en,
  transparent: !0,
  depthWrite: !0,
  blending: S.NormalBlending
});
function zn(n) {
  K.uniforms.uTime.value = n;
}
function nn(n) {
  K.uniforms.uPointScale.value = n;
}
function ge(n) {
  n.maxDistance !== void 0 && (K.uniforms.uMaxDistance.value = n.maxDistance), n.fadeStart !== void 0 && (K.uniforms.uFadeStart.value = n.fadeStart), n.minPointSize !== void 0 && (K.uniforms.uMinPointSize.value = n.minPointSize), n.maxPointSize !== void 0 && (K.uniforms.uMaxPointSize.value = n.maxPointSize);
}
let Nt = {
  enabled: !1,
  maxDistance: 0,
  fadeStart: 0
};
function vn(n = 5e3, e = 4e3) {
  ge({
    maxDistance: n,
    fadeStart: e,
    minPointSize: 0.5,
    maxPointSize: 20
  }), Nt = { enabled: !0, maxDistance: n, fadeStart: e }, console.log(`LOD enabled: max distance ${n}, fade start ${e}`);
}
function Fn() {
  ge({
    maxDistance: 0,
    fadeStart: 0,
    minPointSize: 1,
    maxPointSize: 50
  }), Nt = { enabled: !1, maxDistance: 0, fadeStart: 0 }, console.log("LOD disabled");
}
function An() {
  return Nt;
}
function on(n) {
  n && n.length === 6 && (K.uniforms.uFrustumPlanes.value = n);
}
function re(n) {
  K.uniforms.uFrustumCullingEnabled.value = n;
}
const le = {
  0: { size: 20, hasColor: !1, hasGpsTime: !1 },
  1: { size: 28, hasColor: !1, hasGpsTime: !0 },
  2: { size: 26, hasColor: !0, hasGpsTime: !1 },
  3: { size: 34, hasColor: !0, hasGpsTime: !0 },
  // LAS 1.4 formats
  6: { size: 30, hasColor: !1, hasGpsTime: !0 },
  7: { size: 36, hasColor: !0, hasGpsTime: !0 },
  8: { size: 38, hasColor: !0, hasGpsTime: !0 }
  // + NIR
};
class xe {
  constructor() {
    this.lazPerf = null, this.maxPoints = 5e8, this.subsample = "auto";
  }
  /**
   * Load a LAS or LAZ file
   * 
   * @param {File} file - The file to load
   * @returns {Promise<Object>} Parsed point cloud data
   */
  async load(e) {
    console.log(`Loading: ${e.name} (${(e.size / 1024 / 1024).toFixed(2)} MB)`);
    const o = await this.readFileAsArrayBuffer(e);
    return e.name.toLowerCase().endsWith(".laz") ? await this.parseLAZ(o) : this.parseLAS(o);
  }
  /**
   * Read a File object as ArrayBuffer
   * 
   * FileReader API converts File → raw bytes
   */
  readFileAsArrayBuffer(e) {
    return new Promise((o, t) => {
      const i = new FileReader();
      i.onload = () => o(i.result), i.onerror = () => t(new Error("Failed to read file")), i.readAsArrayBuffer(e);
    });
  }
  /* ═══════════════════════════════════════════════════════════════════════
     LAS PARSING (Uncompressed)
     ═══════════════════════════════════════════════════════════════════════ */
  /**
   * Parse an uncompressed LAS file
   * 
   * @param {ArrayBuffer} buffer - Raw file bytes
   * @returns {Object} Parsed data
   */
  parseLAS(e) {
    const o = new DataView(e), t = this.parseHeader(o);
    if (console.log("LAS Header:", t), t.fileSignature !== "LASF")
      throw new Error("Invalid LAS file: missing LASF signature");
    const i = le[t.pointDataFormat];
    if (!i)
      throw new Error(`Unsupported point format: ${t.pointDataFormat}`);
    return {
      ...this.extractPoints(
        e,
        t,
        i
      ),
      // Includes centered bounds from extractPoints
      header: t
    };
  }
  /**
   * Parse the LAS Public Header Block
   * 
   * This reads fixed positions in the header where each field is stored.
   * LAS specification defines exact byte offsets for each field.
   */
  parseHeader(e) {
    return {
      // Bytes 0-3: File Signature ("LASF")
      fileSignature: ((t, i) => {
        let a = "";
        for (let u = 0; u < i; u++) {
          const r = e.getUint8(t + u);
          if (r === 0) break;
          a += String.fromCharCode(r);
        }
        return a;
      })(0, 4),
      // Bytes 24-25: Version (e.g., 1.4)
      versionMajor: e.getUint8(24),
      versionMinor: e.getUint8(25),
      // Bytes 94-95: Header Size
      headerSize: e.getUint16(94, !0),
      // true = little-endian
      // Bytes 96-99: Offset to Point Data
      // This tells us where the actual points begin
      offsetToPointData: e.getUint32(96, !0),
      // Bytes 104: Point Data Record Format (0-10)
      pointDataFormat: e.getUint8(104),
      // Bytes 105-106: Point Data Record Length
      pointDataRecordLength: e.getUint16(105, !0),
      // Bytes 107-110: Legacy Number of Points (32-bit, LAS 1.0-1.3)
      legacyPointCount: e.getUint32(107, !0),
      // Bytes 131-154: Scale Factors (crucial for accuracy!)
      // LAS stores X,Y,Z as integers. Real value = (integer × scale) + offset
      scaleX: e.getFloat64(131, !0),
      scaleY: e.getFloat64(139, !0),
      scaleZ: e.getFloat64(147, !0),
      // Bytes 155-178: Offsets
      offsetX: e.getFloat64(155, !0),
      offsetY: e.getFloat64(163, !0),
      offsetZ: e.getFloat64(171, !0),
      // Bytes 179-226: Bounding Box
      maxX: e.getFloat64(179, !0),
      minX: e.getFloat64(187, !0),
      maxY: e.getFloat64(195, !0),
      minY: e.getFloat64(203, !0),
      maxZ: e.getFloat64(211, !0),
      minZ: e.getFloat64(219, !0)
      // LAS 1.4: Bytes 247-254 have 64-bit point count
      // We'll check version and use appropriate count
    };
  }
  /**
   * Get the total number of points
   * 
   * LAS 1.4 uses 64-bit count at different offset
   * Earlier versions use 32-bit legacy count
   */
  getPointCount(e, o) {
    if (o.versionMajor === 1 && o.versionMinor >= 4) {
      const t = e.getUint32(247, !0);
      return e.getUint32(251, !0) * 4294967296 + t;
    } else
      return o.legacyPointCount;
  }
  /**
   * Calculate subsample step to stay under maxPoints
   * Always uses power-of-2 steps for grid alignment (points are always on a grid)
   */
  calculateSubsampleStep(e) {
    if (this.subsample !== "auto")
      return this.subsample;
    if (e <= this.maxPoints)
      return 1;
    const o = Math.ceil(e / this.maxPoints);
    let t = 1;
    for (; t < o && t < 64; )
      t *= 2;
    return t;
  }
  /**
   * Extract point data from LAS buffer
   * 
   * This is where we convert raw bytes → usable Float32Arrays
   */
  extractPoints(e, o, t) {
    const i = new DataView(e), a = this.getPointCount(i, o), u = this.calculateSubsampleStep(a), r = Math.ceil(a / u);
    console.log(`Total points in file: ${a.toLocaleString()}`), console.log(`Subsample step: ${u} (loading every ${u}${u === 1 ? "st" : u === 2 ? "nd" : u === 3 ? "rd" : "th"} point)`), console.log(`Points to load: ${r.toLocaleString()}`), console.log(`Point format: ${o.pointDataFormat}, Size: ${o.pointDataRecordLength} bytes`);
    const c = new Float32Array(r * 3), f = t.hasColor ? new Float32Array(r * 3) : null, y = new Float32Array(r), C = new Uint8Array(r), g = (o.maxX + o.minX) / 2, m = (o.maxY + o.minY) / 2, d = (o.maxZ + o.minZ) / 2;
    let p = o.offsetToPointData;
    const x = o.pointDataRecordLength * u;
    for (let z = 0; z < r; z++) {
      const E = i.getInt32(p + 0, !0), v = i.getInt32(p + 4, !0), P = i.getInt32(p + 8, !0), A = E * o.scaleX + o.offsetX - g, T = v * o.scaleY + o.offsetY - m, Z = P * o.scaleZ + o.offsetZ - d;
      c[z * 3] = A, c[z * 3 + 1] = Z, c[z * 3 + 2] = -T;
      const j = i.getUint16(p + 12, !0);
      y[z] = j / 65535;
      let R;
      if (o.pointDataFormat <= 5 ? R = p + 15 : R = p + 16, C[z] = i.getUint8(R), t.hasColor && f) {
        let O;
        switch (o.pointDataFormat) {
          case 2:
            O = p + 20;
            break;
          case 3:
            O = p + 28;
            break;
          case 7:
            O = p + 30;
            break;
          case 8:
            O = p + 30;
            break;
          default:
            O = p + 28;
        }
        const st = i.getUint16(O + 0, !0), at = i.getUint16(O + 2, !0), H = i.getUint16(O + 4, !0);
        f[z * 3] = st / 65535, f[z * 3 + 1] = at / 65535, f[z * 3 + 2] = H / 65535;
      }
      p += x;
    }
    const w = {
      min: {
        x: o.minX - g,
        y: o.minZ - d,
        // Swapped
        z: -(o.maxY - m)
      },
      max: {
        x: o.maxX - g,
        y: o.maxZ - d,
        // Swapped
        z: -(o.minY - m)
      }
    }, M = this.calculateGridInfo(o, w, r);
    return {
      positions: c,
      colors: f,
      intensities: y,
      classifications: C,
      pointCount: r,
      bounds: w,
      hasColor: t.hasColor,
      gridInfo: M
      // Grid metadata (always present)
    };
  }
  /**
   * Calculate grid information from LAS header scale factors
   * LAS files store points as integers with scale factors, so they're always on a grid
   * @param {Object} header - LAS header with scale factors
   * @param {Object} bounds - Bounding box
   * @param {number} pointCount - Number of points
   * @returns {Object} Grid information { spacing, dimensions, min }
   */
  calculateGridInfo(e, o, t) {
    const i = {
      x: e.scaleX,
      y: e.scaleZ,
      // Remember: we swapped Y and Z for Three.js
      z: e.scaleY
    }, a = o.max.x - o.min.x, u = o.max.y - o.min.y, r = o.max.z - o.min.z, c = {
      x: Math.ceil(a / i.x) + 1,
      y: Math.ceil(u / i.y) + 1,
      z: Math.ceil(r / i.z) + 1
    };
    return console.log(`Grid: spacing (${i.x.toFixed(3)}, ${i.y.toFixed(3)}, ${i.z.toFixed(3)}), dimensions (${c.x}, ${c.y}, ${c.z})`), {
      spacing: i,
      dimensions: c,
      min: { x: o.min.x, y: o.min.y, z: o.min.z }
    };
  }
  /* ═══════════════════════════════════════════════════════════════════════
     LAZ PARSING (Compressed)
     ═══════════════════════════════════════════════════════════════════════
     
     LAZ files use "laszip" compression, which is:
     - Lossless (exact same data as LAS)
     - ~10x compression ratio
     - Industry standard
     
     We use the 'laz-perf' library to decompress.
     
     ═══════════════════════════════════════════════════════════════════════ */
  /**
   * Parse a compressed LAZ file
   */
  async parseLAZ(e) {
    if (!this.lazPerf) {
      console.log("Loading LAZ decompressor...");
      const { create: T } = await import("laz-perf");
      this.lazPerf = await T({
        locateFile: (Z) => Z.endsWith(".wasm") ? "/laz-perf.wasm" : Z
      });
    }
    const o = new DataView(e), t = this.parseHeader(o);
    if (console.log("LAZ Header:", t), t.fileSignature !== "LASF")
      throw new Error("Invalid LAZ file: missing LASF signature");
    const i = t.pointDataFormat & 127;
    console.log(`Point format: ${t.pointDataFormat} → ${i} (uncompressed)`);
    const a = le[i];
    if (!a)
      throw new Error(`Unsupported point format: ${i}`);
    const u = this.getPointCount(o, t), r = this.calculateSubsampleStep(u), c = Math.ceil(u / r);
    console.log(`Total points in file: ${u.toLocaleString()}`), console.log(`Subsample step: ${r} (loading every ${r}${r === 1 ? "st" : r === 2 ? "nd" : r === 3 ? "rd" : "th"} point)`), console.log(`Points to load: ${c.toLocaleString()}`);
    const f = new Uint8Array(e), y = new this.lazPerf.LASZip();
    y.open(f, f.length);
    const C = y.getPointSize(), g = new Float32Array(c * 3), m = a.hasColor ? new Float32Array(c * 3) : null, d = new Float32Array(c), p = new Uint8Array(c), b = new Uint8Array(C), x = new DataView(b.buffer), w = (t.maxX + t.minX) / 2, M = (t.maxY + t.minY) / 2, z = (t.maxZ + t.minZ) / 2;
    let E = 0;
    const v = i <= 5 ? 15 : 16;
    for (let T = 0; T < u; T++) {
      if (y.getPoint(b), T % r !== 0) continue;
      const Z = x.getInt32(0, !0), j = x.getInt32(4, !0), R = x.getInt32(8, !0), O = Z * t.scaleX + t.offsetX - w, st = j * t.scaleY + t.offsetY - M, at = R * t.scaleZ + t.offsetZ - z;
      g[E * 3] = O, g[E * 3 + 1] = at, g[E * 3 + 2] = -st;
      const H = x.getUint16(12, !0);
      if (d[E] = H / 65535, p[E] = b[v], a.hasColor && m) {
        let _;
        switch (i) {
          case 2:
            _ = 20;
            break;
          case 3:
            _ = 28;
            break;
          case 7:
          case 8:
            _ = 30;
            break;
          default:
            _ = 28;
        }
        const wt = x.getUint16(_ + 0, !0), ht = x.getUint16(_ + 2, !0), gt = x.getUint16(_ + 4, !0);
        m[E * 3] = wt / 65535, m[E * 3 + 1] = ht / 65535, m[E * 3 + 2] = gt / 65535;
      }
      E++, T > 0 && T % 1e6 === 0 && console.log(`Decompressed ${(T / 1e6).toFixed(0)}M / ${(u / 1e6).toFixed(1)}M points (kept ${E.toLocaleString()})`);
    }
    y.delete(), console.log(`Finished: loaded ${E.toLocaleString()} points from ${u.toLocaleString()} total`);
    const P = {
      min: {
        x: t.minX - w,
        y: t.minZ - z,
        z: -(t.maxY - M)
      },
      max: {
        x: t.maxX - w,
        y: t.maxZ - z,
        z: -(t.minY - M)
      }
    }, A = this.calculateGridInfo(t, P, c);
    return {
      positions: g,
      colors: m,
      intensities: d,
      classifications: p,
      pointCount: c,
      bounds: P,
      hasColor: a.hasColor,
      header: t,
      gridInfo: A
      // Grid metadata (always present)
    };
  }
}
const ye = {
  0: [0.5, 0.5, 0.5],
  // Never classified - gray
  1: [0.5, 0.5, 0.5],
  // Unclassified - gray
  2: [0.6, 0.4, 0.2],
  // Ground - brown
  3: [0.5, 0.8, 0.3],
  // Low Vegetation - light green
  4: [0.3, 0.7, 0.2],
  // Medium Vegetation - green
  5: [0.1, 0.5, 0.1],
  // High Vegetation - dark green
  6: [0.9, 0.2, 0.2],
  // Building - red
  7: [1, 0, 1],
  // Low Point (noise) - magenta
  8: [0, 0.8, 0.8],
  // Reserved - cyan
  9: [0.2, 0.4, 0.9],
  // Water - blue
  10: [0.8, 0.8, 0],
  // Rail - yellow
  11: [0.3, 0.3, 0.3],
  // Road - dark gray
  17: [0.7, 0.7, 0.8]
  // Bridge - light gray
};
function Tt(n, e) {
  const o = new Float32Array(e * 3);
  for (let t = 0; t < e; t++) {
    const i = n[t], a = ye[i] || [0.5, 0.5, 0.5];
    o[t * 3] = a[0], o[t * 3 + 1] = a[1], o[t * 3 + 2] = a[2];
  }
  return o;
}
function It(n, e, o, t) {
  const i = new Float32Array(e * 3), a = [0.3, 0.3, 0.3];
  for (let u = 0; u < e; u++) {
    const r = n[u];
    if (r >= o && r <= t) {
      const c = ye[r] || [0.5, 0.5, 0.5];
      i[u * 3] = c[0], i[u * 3 + 1] = c[1], i[u * 3 + 2] = c[2];
    } else
      i[u * 3] = a[0], i[u * 3 + 1] = a[1], i[u * 3 + 2] = a[2];
  }
  return i;
}
const sn = {
  0: [0.2, 0.4, 0.8],
  // Never classified - Blue (unanalyzed)
  1: [0.3, 0.7, 0.9],
  // Unclassified - Cyan (assessed, no category)
  2: [0.2, 0.7, 0.3],
  // Ground/Stable - Green (stable)
  3: [0.9, 0.8, 0.2],
  // Low concern - Yellow (minor concern)
  4: [0.9, 0.4, 0.2]
  // Medium concern - Orange-Red (elevated risk)
};
function ft(n, e, o, t) {
  const i = new Float32Array(e * 3), a = [0.25, 0.25, 0.25];
  for (let u = 0; u < e; u++) {
    const r = n[u];
    if (r >= o && r <= t) {
      const c = sn[r] || [0.5, 0.5, 0.5];
      i[u * 3] = c[0], i[u * 3 + 1] = c[1], i[u * 3 + 2] = c[2];
    } else
      i[u * 3] = a[0], i[u * 3 + 1] = a[1], i[u * 3 + 2] = a[2];
  }
  return i;
}
function Ot(n, e) {
  const o = new Float32Array(e * 3);
  for (let t = 0; t < e; t++) {
    const i = n[t];
    o[t * 3] = i, o[t * 3 + 1] = i, o[t * 3 + 2] = i;
  }
  return o;
}
function X(n, e, o) {
  const t = new Float32Array(e * 3), i = o.min.y, u = o.max.y - i || 1;
  for (let r = 0; r < e; r++) {
    const f = (n[r * 3 + 1] - i) / u;
    if (f < 0.25) {
      const y = f / 0.25;
      t[r * 3] = 0, t[r * 3 + 1] = y, t[r * 3 + 2] = 1;
    } else if (f < 0.5) {
      const y = (f - 0.25) / 0.25;
      t[r * 3] = 0, t[r * 3 + 1] = 1, t[r * 3 + 2] = 1 - y;
    } else if (f < 0.75) {
      const y = (f - 0.5) / 0.25;
      t[r * 3] = y, t[r * 3 + 1] = 1, t[r * 3 + 2] = 0;
    } else {
      const y = (f - 0.75) / 0.25;
      t[r * 3] = 1, t[r * 3 + 1] = 1 - y, t[r * 3 + 2] = 0;
    }
  }
  return t;
}
const En = new xe();
let dt = null, k = null, mt = null, Pt = "rgb";
const Se = [];
function Ct() {
  return dt;
}
function pt() {
  return k;
}
function Ln() {
  return mt;
}
function bt() {
  return Pt;
}
function Dn(n) {
  Pt = n;
}
function Tn(n) {
  Se.push(n);
}
function an(n) {
  dt && (et.remove(dt), k.dispose()), mt = n, k = new S.BufferGeometry(), k.setAttribute(
    "position",
    new S.BufferAttribute(n.positions, 3)
  );
  const e = $t(Pt, n);
  k.setAttribute(
    "color",
    new S.BufferAttribute(e, 3)
  );
  const o = new Float32Array(n.pointCount);
  o.fill(2), k.setAttribute(
    "size",
    new S.BufferAttribute(o, 1)
  ), dt = new S.Points(k, K), et.add(dt), ln(n.bounds), console.log(`Displaying ${n.pointCount.toLocaleString()} points`);
  for (const t of Se)
    try {
      t(n, k, dt);
    } catch (i) {
      console.error("Point cloud load callback error:", i);
    }
  return n.pointCount;
}
let Rt = null;
function $t(n, e, o = null) {
  switch (n) {
    case "rgb":
      return e.colors && e.hasColor ? e.colors : X(e.positions, e.pointCount, e.bounds);
    case "height":
      return X(e.positions, e.pointCount, e.bounds);
    case "intensity":
      return Ot(e.intensities, e.pointCount);
    case "classification":
      return o && o.min !== void 0 && o.max !== void 0 ? It(
        e.classifications,
        e.pointCount,
        o.min,
        o.max
      ) : Tt(e.classifications, e.pointCount);
    case "cracking":
      console.log("=== CRACKING MODE ACTIVATED ==="), console.log("Point count:", e.pointCount), console.log("Classification range:", o), console.log(
        "Sample classifications (first 10 points):",
        Array.from(e.classifications.slice(0, 10))
      );
      let t;
      o && o.min !== void 0 && o.max !== void 0 ? t = ft(
        e.classifications,
        e.pointCount,
        o.min,
        o.max
      ) : t = ft(e.classifications, e.pointCount, 0, 4), console.log("Sample colors (first 5 points):");
      for (let i = 0; i < Math.min(5, e.pointCount); i++) {
        const a = i * 3;
        console.log(`  Point ${i}: R=${t[a].toFixed(2)} G=${t[a + 1].toFixed(2)} B=${t[a + 2].toFixed(2)}`);
      }
      return t;
    default:
      return X(e.positions, e.pointCount, e.bounds);
  }
}
function rn(n, e = null) {
  if (!mt || !k) return;
  Pt = n, Rt = e;
  const o = $t(n, mt, e), t = k.getAttribute("color");
  if (t)
    t.array = o, t.needsUpdate = !0;
  else {
    const i = new S.BufferAttribute(o, 3);
    k.setAttribute("color", i), i.needsUpdate = !0;
  }
  console.log(e ? `Color mode: ${n} (classifications ${e.min}-${e.max})` : `Color mode: ${n}`);
}
function In(n) {
  if (Rt = n, Pt === "classification" && mt && k) {
    const e = $t("classification", mt, n), o = k.getAttribute("color");
    if (o)
      o.array = e, o.needsUpdate = !0;
    else {
      const t = new S.BufferAttribute(e, 3);
      k.setAttribute("color", t), t.needsUpdate = !0;
    }
  }
}
function ce() {
  return Rt;
}
function ln(n) {
  const e = {
    x: (n.min.x + n.max.x) / 2,
    y: (n.min.y + n.max.y) / 2,
    z: (n.min.z + n.max.z) / 2
  }, o = {
    x: n.max.x - n.min.x,
    y: n.max.y - n.min.y,
    z: n.max.z - n.min.z
  }, t = Math.max(o.x, o.y, o.z), i = V.fov * Math.PI / 180, a = t / 2 / Math.tan(i / 2) * 1.5;
  V.position.set(
    e.x + a * 0.3,
    e.y + a * 0.5,
    e.z + a
  ), ot.target.set(e.x, e.y, e.z), nn(Math.max(0.1, Math.min(3, 10 / t))), ot.update();
}
const l = {
  pointCount: document.getElementById("point-count"),
  visibleCount: document.getElementById("visible-count"),
  fps: document.getElementById("fps"),
  zoomLevel: document.getElementById("zoom-level"),
  downsamplingFactor: document.getElementById("downsampling-factor"),
  fileName: document.getElementById("file-name"),
  format: document.getElementById("point-format"),
  lodStatus: document.getElementById("lod-status"),
  optimizerStatus: document.getElementById("optimizer-status"),
  optimizerToggle: document.getElementById("optimizer-toggle"),
  optimizerModeSelect: document.getElementById("optimizer-mode-select"),
  fpsSettings: document.getElementById("fps-settings"),
  fpsTarget: document.getElementById("fps-target"),
  fpsMin: document.getElementById("fps-min"),
  fpsMax: document.getElementById("fps-max"),
  fileSelect: document.getElementById("file-select"),
  fileBrowseBtn: document.getElementById("file-browse-btn"),
  fileInput: document.getElementById("file-input"),
  colorSelect: document.getElementById("color-select"),
  loading: document.getElementById("loading"),
  loadingProgress: document.getElementById("loading-progress"),
  annotationsPanel: document.getElementById("annotations-panel"),
  annotationsList: document.getElementById("annotations-list"),
  annotationForm: document.getElementById("annotation-form"),
  annotationText: document.getElementById("annotation-text"),
  annotationModeToggle: document.getElementById("annotation-mode-toggle"),
  annotationSave: document.getElementById("annotation-save"),
  annotationCancel: document.getElementById("annotation-cancel")
}, B = {
  // Point count display
  setPointCount(n) {
    l.pointCount && (l.pointCount.textContent = n.toLocaleString());
  },
  // Visible point count display
  setVisibleCount(n) {
    l.visibleCount && (l.visibleCount.textContent = n.toLocaleString());
  },
  // LOD status display
  setLODStatus(n, e = 0) {
    l.lodStatus && (n && e > 0 ? (l.lodStatus.textContent = `${e}m`, l.lodStatus.style.color = "#4fc3f7") : (l.lodStatus.textContent = "Off", l.lodStatus.style.color = "#888"));
  },
  // Optimizer status display
  setOptimizerStatus(n) {
    l.optimizerStatus && (n ? (l.optimizerStatus.textContent = "On", l.optimizerStatus.style.color = "#4fc3f7") : (l.optimizerStatus.textContent = "Off", l.optimizerStatus.style.color = "#888")), l.optimizerToggle && (n ? (l.optimizerToggle.textContent = "Disable Optimizer", l.optimizerToggle.classList.add("active")) : (l.optimizerToggle.textContent = "Enable Optimizer", l.optimizerToggle.classList.remove("active")));
  },
  // FPS display
  setFPS(n) {
    l.fps && (l.fps.textContent = n);
  },
  // Zoom level display
  setZoomLevel(n) {
    l.zoomLevel && (l.zoomLevel.textContent = `${n.toFixed(2)}x`);
  },
  // Downsampling factor display
  setDownsamplingFactor(n) {
    l.downsamplingFactor && (l.downsamplingFactor.textContent = `${n}x`);
  },
  // File name display
  setFileName(n) {
    l.fileName && (l.fileName.textContent = n);
  },
  // Format display
  setFormat(n) {
    l.format && (l.format.textContent = n);
  },
  // Color mode
  setColorMode(n) {
    l.colorSelect && (l.colorSelect.value = n);
  },
  getColorMode() {
    var n;
    return ((n = l.colorSelect) == null ? void 0 : n.value) || "rgb";
  },
  // Loading indicator
  showLoading() {
    l.loading && (l.loading.classList.add("visible"), l.loading.classList.remove("hidden"));
  },
  hideLoading() {
    l.loading && (l.loading.classList.remove("visible"), l.loading.classList.add("hidden"));
  },
  setProgress(n) {
    l.loadingProgress && (l.loadingProgress.innerHTML = n);
  },
  setError(n) {
    l.loadingProgress && (l.loadingProgress.innerHTML = `<span style="color:#ff6b6b">Error:</span> ${n.replace(/\n/g, "<br>")}`);
  },
  // Event binding
  onColorModeChange(n) {
    l.colorSelect && l.colorSelect.addEventListener("change", (e) => {
      n(e.target.value);
    });
  },
  onOptimizerToggle(n) {
    l.optimizerToggle && l.optimizerToggle.addEventListener("click", () => {
      n();
    });
  },
  onOptimizerModeChange(n) {
    l.optimizerModeSelect && l.optimizerModeSelect.addEventListener("change", (e) => {
      n(e.target.value);
    });
  },
  setOptimizerMode(n) {
    l.optimizerModeSelect && (l.optimizerModeSelect.value = n), l.fpsSettings && (n === "fps" ? l.fpsSettings.classList.add("visible") : l.fpsSettings.classList.remove("visible"));
  },
  onFPSSettingsChange(n) {
    l.fpsTarget && (l.fpsTarget.addEventListener("change", (e) => {
      n("targetFPS", parseFloat(e.target.value));
    }), l.fpsTarget.addEventListener("input", (e) => {
      n("targetFPS", parseFloat(e.target.value));
    })), l.fpsMin && (l.fpsMin.addEventListener("change", (e) => {
      n("minFPS", parseFloat(e.target.value));
    }), l.fpsMin.addEventListener("input", (e) => {
      n("minFPS", parseFloat(e.target.value));
    })), l.fpsMax && (l.fpsMax.addEventListener("change", (e) => {
      n("maxFPS", parseFloat(e.target.value));
    }), l.fpsMax.addEventListener("input", (e) => {
      n("maxFPS", parseFloat(e.target.value));
    }));
  },
  setFPSSettings(n) {
    l.fpsTarget && n.targetFPS !== void 0 && (l.fpsTarget.value = n.targetFPS), l.fpsMin && n.minFPS !== void 0 && (l.fpsMin.value = n.minFPS), l.fpsMax && n.maxFPS !== void 0 && (l.fpsMax.value = n.maxFPS);
  },
  // File selector
  populateFileSelect(n) {
    if (l.fileSelect) {
      if (l.fileSelect.innerHTML = "", n.length === 0) {
        const e = document.createElement("option");
        e.value = "", e.textContent = "No files found", l.fileSelect.appendChild(e);
        return;
      }
      n.forEach((e) => {
        const o = document.createElement("option");
        o.value = e.path, o.textContent = e.name, l.fileSelect.appendChild(o);
      });
    }
  },
  setFileSelect(n) {
    l.fileSelect && (l.fileSelect.value = n || "");
  },
  onFileSelectChange(n) {
    l.fileSelect && l.fileSelect.addEventListener("change", (e) => {
      n(e.target.value);
    });
  },
  onFileBrowseClick(n) {
    l.fileBrowseBtn && l.fileInput && l.fileBrowseBtn.addEventListener("click", () => {
      l.fileInput.click();
    }), l.fileInput && l.fileInput.addEventListener("change", (e) => {
      const o = e.target.files[0];
      o && (n(o), e.target.value = "");
    });
  },
  // Annotations
  updateAnnotationsList(n) {
    if (l.annotationsList) {
      if (l.annotationsList.innerHTML = "", n.length === 0) {
        const e = document.createElement("div");
        e.style.color = "#888", e.style.fontSize = "11px", e.style.textAlign = "center", e.style.padding = "10px", e.textContent = 'No annotations yet. Click "Add Mode" to start.', l.annotationsList.appendChild(e);
        return;
      }
      n.forEach((e) => {
        const o = document.createElement("div");
        o.className = "annotation-item", o.style.borderLeftColor = e.color;
        const t = document.createElement("div");
        t.className = "annotation-item-header";
        const i = document.createElement("span");
        i.style.color = "#888", i.style.fontSize = "10px", i.textContent = `Point #${e.pointIndex}`;
        const a = document.createElement("div");
        a.className = "annotation-item-actions";
        const u = document.createElement("button");
        u.textContent = "Edit", u.onclick = () => {
          this.showAnnotationForm(e);
        };
        const r = document.createElement("button");
        r.textContent = "Delete", r.onclick = () => {
          var f;
          confirm("Delete this annotation?") && ((f = this.onAnnotationDelete) == null || f.call(this, e.pointIndex));
        }, a.appendChild(u), a.appendChild(r), t.appendChild(i), t.appendChild(a);
        const c = document.createElement("div");
        c.className = "annotation-item-text", c.textContent = e.text, o.appendChild(t), o.appendChild(c), l.annotationsList.appendChild(o);
      });
    }
  },
  showAnnotationForm(n = null) {
    !l.annotationForm || !l.annotationText || (l.annotationForm.style.display = "block", n ? (l.annotationText.value = n.text, this.currentEditingAnnotation = n) : (l.annotationText.value = "", this.currentEditingAnnotation = null), l.annotationText.focus());
  },
  hideAnnotationForm() {
    l.annotationForm && (l.annotationForm.style.display = "none"), this.currentEditingAnnotation = null;
  },
  setAnnotationMode(n) {
    l.annotationModeToggle && (l.annotationModeToggle.textContent = n === "add" ? "View Mode" : "Add Mode", l.annotationModeToggle.classList.toggle("active", n === "add"));
  },
  onAnnotationModeToggle(n) {
    l.annotationModeToggle && l.annotationModeToggle.addEventListener("click", n);
  },
  onAnnotationSave(n) {
    l.annotationSave && l.annotationSave.addEventListener("click", () => {
      l.annotationText && n(l.annotationText.value);
    }), l.annotationText && l.annotationText.addEventListener("keydown", (e) => {
      e.key === "Enter" && !e.shiftKey && (e.preventDefault(), n(l.annotationText.value));
    });
  },
  onAnnotationCancel(n) {
    l.annotationCancel && l.annotationCancel.addEventListener("click", n);
  },
  getAnnotationText() {
    return l.annotationText ? l.annotationText.value : "";
  }
};
performance.now();
class cn extends Ke {
  constructor(e = document.createElement("div")) {
    super(), this.isCSS2DObject = !0, this.element = e, this.element.style.position = "absolute", this.element.style.userSelect = "none", this.element.setAttribute("draggable", !1), this.center = new Y(0.5, 0.5), this.addEventListener("removed", function() {
      this.traverse(function(o) {
        o.element instanceof Element && o.element.parentNode !== null && o.element.parentNode.removeChild(o.element);
      });
    });
  }
  copy(e, o) {
    return super.copy(e, o), this.element = e.element.cloneNode(!0), this.center = e.center, this;
  }
}
const ut = new N(), ue = new he(), de = new he(), fe = new N(), me = new N();
class un {
  constructor(e = {}) {
    const o = this;
    let t, i, a, u;
    const r = {
      objects: /* @__PURE__ */ new WeakMap()
    }, c = e.element !== void 0 ? e.element : document.createElement("div");
    c.style.overflow = "hidden", this.domElement = c, this.getSize = function() {
      return {
        width: t,
        height: i
      };
    }, this.render = function(m, d) {
      m.matrixWorldAutoUpdate === !0 && m.updateMatrixWorld(), d.parent === null && d.matrixWorldAutoUpdate === !0 && d.updateMatrixWorld(), ue.copy(d.matrixWorldInverse), de.multiplyMatrices(d.projectionMatrix, ue), f(m, m, d), g(m);
    }, this.setSize = function(m, d) {
      t = m, i = d, a = t / 2, u = i / 2, c.style.width = m + "px", c.style.height = d + "px";
    };
    function f(m, d, p) {
      if (m.isCSS2DObject) {
        ut.setFromMatrixPosition(m.matrixWorld), ut.applyMatrix4(de);
        const b = m.visible === !0 && ut.z >= -1 && ut.z <= 1 && m.layers.test(p.layers) === !0;
        if (m.element.style.display = b === !0 ? "" : "none", b === !0) {
          m.onBeforeRender(o, d, p);
          const w = m.element;
          w.style.transform = "translate(" + -100 * m.center.x + "%," + -100 * m.center.y + "%)translate(" + (ut.x * a + a) + "px," + (-ut.y * u + u) + "px)", w.parentNode !== c && c.appendChild(w), m.onAfterRender(o, d, p);
        }
        const x = {
          distanceToCameraSquared: y(p, m)
        };
        r.objects.set(m, x);
      }
      for (let b = 0, x = m.children.length; b < x; b++)
        f(m.children[b], d, p);
    }
    function y(m, d) {
      return fe.setFromMatrixPosition(m.matrixWorld), me.setFromMatrixPosition(d.matrixWorld), fe.distanceToSquared(me);
    }
    function C(m) {
      const d = [];
      return m.traverse(function(p) {
        p.isCSS2DObject && d.push(p);
      }), d;
    }
    function g(m) {
      const d = C(m).sort(function(b, x) {
        if (b.renderOrder !== x.renderOrder)
          return x.renderOrder - b.renderOrder;
        const w = r.objects.get(b).distanceToCameraSquared, M = r.objects.get(x).distanceToCameraSquared;
        return w - M;
      }), p = d.length;
      for (let b = 0, x = d.length; b < x; b++)
        d[b].element.style.zIndex = p - b;
    }
  }
}
const I = /* @__PURE__ */ new Map(), it = new S.Group();
et.add(it);
let D = null, J = null;
function be(n = null) {
  if (D) {
    if (n && J !== n) {
      D.domElement.parentNode && D.domElement.parentNode.removeChild(D.domElement), n.appendChild(D.domElement), J = n;
      const e = n.getBoundingClientRect();
      D.setSize(e.width, e.height);
    }
    return;
  }
  if (D = new un(), D.domElement.style.position = "absolute", D.domElement.style.top = "0px", D.domElement.style.left = "0px", D.domElement.style.pointerEvents = "none", D.domElement.style.zIndex = "10", n) {
    n.appendChild(D.domElement), J = n;
    const e = n.getBoundingClientRect();
    D.setSize(e.width, e.height);
  } else
    document.body.appendChild(D.domElement), J = null, D.setSize(window.innerWidth, window.innerHeight);
  window.addEventListener("resize", () => {
    if (D)
      if (J) {
        const e = J.getBoundingClientRect();
        D.setSize(e.width, e.height);
      } else
        D.setSize(window.innerWidth, window.innerHeight);
  });
}
const q = /* @__PURE__ */ new Map();
new S.Raycaster();
new S.Vector2();
let Pe = "view", Ce = 1, tt = null;
const kt = [], dn = "pointcloud_annotations_";
function fn(n, e, o, t = "#ff6b6b", i = null, a = !0) {
  return {
    id: Ce++,
    pointIndex: n,
    text: e,
    position: o.clone(),
    color: t,
    group: i,
    visible: a,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function mn(n) {
  return {
    id: n.id,
    pointIndex: n.pointIndex,
    text: n.text,
    position: [n.position.x, n.position.y, n.position.z],
    color: n.color,
    group: n.group,
    visible: n.visible,
    createdAt: n.createdAt
  };
}
function pn(n) {
  return {
    id: n.id,
    pointIndex: n.pointIndex,
    text: n.text,
    position: new S.Vector3(n.position[0], n.position[1], n.position[2]),
    color: n.color || "#ff6b6b",
    group: n.group || null,
    visible: n.visible !== void 0 ? n.visible : !0,
    createdAt: n.createdAt || (/* @__PURE__ */ new Date()).toISOString()
  };
}
function On(n, e) {
  const o = Ct(), t = pt();
  if (!o || !t)
    return console.log("[Point Picking] No points or geometry available"), null;
  const i = t.getAttribute("position");
  if (!i)
    return console.log("[Point Picking] No position attribute"), null;
  const a = i.count, u = (n + 1) * 0.5, r = 1 - (e + 1) * 0.5, c = nt.domElement, f = c.width, y = c.height, C = u * f, g = r * y, m = 20;
  let d = null, p = 1 / 0, b = -1;
  console.log(`[Point Picking] Checking ${a} points with ${m}px threshold`), console.log(`[Point Picking] Mouse screen: (${C.toFixed(1)}, ${g.toFixed(1)})`);
  const w = Math.max(1, Math.floor(a / 5e4)), M = new S.Vector3();
  new S.Vector3();
  for (let z = 0; z < a; z += w) {
    M.set(
      i.getX(z),
      i.getY(z),
      i.getZ(z)
    ), o.localToWorld(M), M.project(V);
    const E = (M.x + 1) * 0.5 * f, v = (1 - M.y) * 0.5 * y, P = E - C, A = v - g, T = Math.sqrt(P * P + A * A);
    M.z >= -1 && M.z <= 1 && T < m && T < p && (p = T, b = z, d = new S.Vector3(
      i.getX(z),
      i.getY(z),
      i.getZ(z)
    ), o.localToWorld(d));
  }
  if (b >= 0 && w > 1) {
    const z = w * 2, E = Math.max(0, b - z), v = Math.min(a, b + z);
    for (let P = E; P < v; P++) {
      if (P === b) continue;
      M.set(
        i.getX(P),
        i.getY(P),
        i.getZ(P)
      ), o.localToWorld(M), M.project(V);
      const A = (M.x + 1) * 0.5 * f, T = (1 - M.y) * 0.5 * y, Z = A - C, j = T - g, R = Math.sqrt(Z * Z + j * j);
      M.z >= -1 && M.z <= 1 && R < m && R < p && (p = R, b = P, d = new S.Vector3(
        i.getX(P),
        i.getY(P),
        i.getZ(P)
      ), o.localToWorld(d));
    }
  }
  return b >= 0 ? (console.log(`[Point Picking] Found closest point: index ${b}, distance: ${p.toFixed(1)}px`), {
    pointIndex: b,
    position: d
  }) : (console.log(`[Point Picking] No point found within ${m}px threshold`), null);
}
function Nn(n, e, o = "#ff6b6b", t = null, i = {}) {
  const a = pt(), u = Ct();
  if (!a)
    return console.warn("[addAnnotation] No geometry available"), null;
  const r = a.getAttribute("position");
  if (!r)
    return console.warn("[addAnnotation] No position attribute in geometry"), null;
  let c = n, f;
  if (t) {
    let m, d;
    if (t instanceof S.Vector3)
      m = t.x, d = t.z;
    else if (typeof t == "object" && "x" in t && "z" in t)
      m = t.x, d = t.z;
    else
      return console.warn("[addAnnotation] Invalid worldPosition format"), null;
    if (c = ve(m, d, {
      useTopmost: i.useTopmost !== void 0 ? i.useTopmost : !0
    }), c < 0)
      return console.warn("[addAnnotation] Could not find a point near the specified position"), null;
    console.log(`[addAnnotation] Mapped requested position (${m.toFixed(2)}, ${d.toFixed(2)}) to actual point index ${c}`);
  }
  if (c < 0 || c >= r.count)
    return console.warn(`[addAnnotation] Invalid point index: ${c}`), null;
  f = new S.Vector3(
    r.getX(c),
    r.getY(c),
    r.getZ(c)
  ), u && u.localToWorld(f);
  const y = i.group || null, C = i.visible !== void 0 ? i.visible : !0, g = fn(c, e, f, o, y, C);
  return I.set(c, g), Bt(g), Ft(), console.log(`[addAnnotation] Created annotation at actual point index ${c}:`, {
    position: f.toArray(),
    text: e,
    color: o,
    group: y
  }), g;
}
function Rn(n) {
  I.has(n) && (I.delete(n), Me(n), Ft());
}
function $n(n) {
  return I.get(n) || null;
}
function we() {
  return Array.from(I.values());
}
function kn(n, e) {
  const o = I.get(n);
  if (o) {
    o.text = e;
    const t = q.get(n);
    t && t.element && (t.element.textContent = e), Ft();
  }
}
function Bn() {
  I.clear(), Zt(), Ft();
}
function hn(n, e) {
  const o = I.get(n);
  if (!o) {
    console.warn(`[setAnnotationVisible] No annotation found for point index ${n}`);
    return;
  }
  o.visible = e;
  const t = q.get(n);
  t && (t.visible = e, t.element && (t.element.style.display = e ? "flex" : "none", t.element.querySelectorAll("*").forEach((a) => {
    e ? a.style.display === "none" && (a.style.display = "") : a.style.display = "none";
  }))), o.line && (o.line.visible = e), o.dot && (o.dot.visible = e), console.log(`[setAnnotationVisible] Set annotation ${n} visibility to ${e}`);
}
function Zn(n, e) {
  let o = 0;
  I.forEach((t, i) => {
    t.group === n && (hn(i, e), o++);
  }), console.log(`[setAnnotationGroupVisible] Set ${o} annotations in group '${n}' to ${e ? "visible" : "hidden"}`);
}
function Un() {
  const n = /* @__PURE__ */ new Set();
  return I.forEach((e) => {
    e.group && n.add(e.group);
  }), Array.from(n);
}
function Yn(n) {
  const e = [];
  return I.forEach((o) => {
    o.group === n && e.push(o);
  }), e;
}
function Bt(n) {
  Me(n.pointIndex), be();
  const e = 12, o = document.createElement("div");
  o.className = "annotation-container", o.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: none;
    position: relative;
  `;
  const t = document.createElement("div");
  t.className = "annotation-label", t.textContent = n.text, t.style.cssText = `
    padding: 6px 10px;
    background: rgba(20, 20, 30, 0.95);
    color: ${n.color};
    border: 2px solid ${n.color};
    border-radius: 4px;
    font-size: 12px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    white-space: nowrap;
    pointer-events: auto;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    max-width: 200px;
    word-wrap: break-word;
    white-space: normal;
    text-align: left;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  `, o.appendChild(t), t.addEventListener("mouseenter", () => {
    t.style.transform = "scale(1.05)", t.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.7)";
  }), t.addEventListener("mouseleave", () => {
    t.style.transform = "scale(1)", t.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.5)";
  });
  const i = new cn(o), a = n.position.clone();
  a.y += e, i.position.copy(a), i.userData.pointIndex = n.pointIndex, i.userData.annotationId = n.id, i.userData.pointPosition = n.position.clone(), i.userData.offsetY = e, et.add(i), q.set(n.pointIndex, i);
  const u = new S.Color(n.color), r = new S.LineBasicMaterial({
    color: u,
    transparent: !0,
    opacity: 0.8
  }), c = new S.BufferGeometry().setFromPoints([
    a.clone(),
    // Start at label position (above point)
    n.position.clone()
    // End at actual point position (on surface)
  ]), f = new S.Line(c, r);
  f.userData.pointIndex = n.pointIndex, f.userData.type = "annotationLine", it.add(f), n.line = f;
  const y = new S.SphereGeometry(0.3, 8, 8), C = new S.MeshBasicMaterial({ color: u }), g = new S.Mesh(y, C);
  g.position.copy(n.position), g.userData.pointIndex = n.pointIndex, g.userData.type = "annotationDot", it.add(g), n.dot = g, n.visible || (i.visible = !1, o.style.display = "none", t.style.display = "none", f.visible = !1, g.visible = !1), console.log(`[Annotations] Created annotation ${n.pointIndex}:`, {
    position: n.position.toArray(),
    labelPosition: i.position.toArray(),
    color: n.color,
    offsetY: e,
    hasLine: !0,
    hasDot: !0,
    visible: n.visible
  });
}
function Me(n) {
  const e = [];
  it.children.forEach((t) => {
    t.userData.pointIndex === n && e.push(t);
  }), e.forEach((t) => {
    it.remove(t), t.geometry && t.geometry.dispose(), t.material && t.material.dispose();
  });
  const o = I.get(n);
  if (o && (o.line = null, o.dot = null), q.has(n)) {
    const t = q.get(n);
    et.remove(t), t.element && t.element.parentNode && t.element.parentNode.removeChild(t.element), q.delete(n);
  }
}
function Zt() {
  it.children.forEach((n) => {
    n.geometry && n.geometry.dispose(), n.material && n.material.dispose();
  }), it.clear(), I.forEach((n) => {
    n.line = null, n.dot = null;
  }), q.forEach((n, e) => {
    et.remove(n), n.element && n.element.parentNode && n.element.parentNode.removeChild(n.element);
  }), q.clear();
}
function jn() {
  Zt(), I.forEach((n) => {
    const e = pt();
    if (e) {
      const o = e.getAttribute("position");
      if (o && n.pointIndex < o.count) {
        const t = new S.Vector3(
          o.getX(n.pointIndex),
          o.getY(n.pointIndex),
          o.getZ(n.pointIndex)
        ), i = Ct();
        i && i.localToWorld(t), n.position.copy(t);
      }
    }
    Bt(n);
  });
}
function _n() {
  if (!D) return;
  V.updateProjectionMatrix(), V.updateMatrixWorld(!0);
  const n = pt(), e = Ct();
  I.forEach((o) => {
    const t = q.get(o.pointIndex);
    if (!t) return;
    if (n && o.pointIndex >= 0) {
      const c = n.getAttribute("position");
      if (c && o.pointIndex < c.count) {
        const f = c.getX(o.pointIndex), y = c.getY(o.pointIndex), C = c.getZ(o.pointIndex), g = new S.Vector3(f, y, C);
        e && (e.updateMatrixWorld(), e.localToWorld(g)), o.position.copy(g);
      }
    }
    const i = t.userData.offsetY || 12, a = o.position.x, u = o.position.y + i, r = o.position.z;
    if (t.position.set(a, u, r), t.userData.pointPosition = o.position.clone(), t.updateMatrixWorld(!0), o.line && o.line.geometry) {
      const c = o.line.geometry.attributes.position;
      c && (c.setXYZ(0, a, u, r), c.setXYZ(1, o.position.x, o.position.y, o.position.z), c.needsUpdate = !0);
    }
    o.dot && o.dot.position.copy(o.position);
  }), D.render(et, V);
}
function Vn() {
  return D;
}
function Hn(n) {
  Pe = n;
}
function Xn() {
  return Pe;
}
function Gn(n) {
  kt.push(n);
}
function Ft() {
  xn(), kt.forEach((n) => {
    try {
      n(we());
    } catch (e) {
      console.error("Annotation change callback error:", e);
    }
  });
}
function gn(n) {
  tt = n;
}
function ze() {
  return tt ? dn + tt : null;
}
function xn() {
  if (!tt) {
    console.warn("[Annotations] No file ID set, cannot save annotations");
    return;
  }
  try {
    const n = ze(), e = Array.from(I.values()).map(mn);
    localStorage.setItem(n, JSON.stringify(e)), console.log(`[Annotations] Saved ${e.length} annotation(s) for file: ${tt}`);
  } catch (n) {
    console.error("[Annotations] Failed to save annotations:", n);
  }
}
function yn() {
  if (!tt) {
    console.warn("[Annotations] No file ID set, cannot load annotations");
    return;
  }
  try {
    const n = ze(), e = localStorage.getItem(n);
    if (!e) {
      console.log(`[Annotations] No stored annotations for file: ${tt}`);
      return;
    }
    const o = JSON.parse(e);
    I.clear(), Zt();
    let t = 0;
    o.forEach((i) => {
      const a = pn(i);
      I.set(a.pointIndex, a), a.id > t && (t = a.id);
    }), Ce = t + 1, I.forEach((i) => {
      Bt(i);
    }), kt.forEach((i) => {
      try {
        i(we());
      } catch (a) {
        console.error("Annotation change callback error:", a);
      }
    }), console.log(`[Annotations] Loaded ${o.length} annotation(s) for file: ${tt}`);
  } catch (n) {
    console.error("[Annotations] Failed to load annotations:", n);
  }
}
function Wn(n) {
  be(n);
}
function Kn() {
  if (D)
    if (J) {
      const n = J.getBoundingClientRect();
      D.setSize(n.width, n.height);
    } else
      D.setSize(window.innerWidth, window.innerHeight);
}
function ve(n, e, o = {}) {
  const t = pt();
  if (!t)
    return console.warn("[findNearestPointIndex] No geometry available"), -1;
  const i = t.getAttribute("position");
  if (!i)
    return console.warn("[findNearestPointIndex] No position attribute in geometry"), -1;
  const { maxDistance: a = 1 / 0, useTopmost: u = !0 } = o, r = a * a;
  let c = -1, f = 1 / 0, y = -1 / 0;
  for (let C = 0; C < i.count; C++) {
    const g = i.getX(C), m = i.getY(C), d = i.getZ(C), p = g - n, b = d - e, x = p * p + b * b;
    x > r || (u ? (x < f - 0.1 || x < f + 0.1 && m > y) && (f = x, c = C, y = m) : x < f && (f = x, c = C));
  }
  return c >= 0 ? console.log(`[findNearestPointIndex] Found point at index ${c}:`, {
    target: { x: n, z: e },
    horizontalDistance: Math.sqrt(f)
  }) : console.warn(`[findNearestPointIndex] No point found near (${n}, ${e})`), c;
}
function Sn(n, e, o = {}) {
  const t = pt(), i = Ct();
  if (!t || !i)
    return console.warn("[findNearestSurfacePoint] No geometry or points available"), null;
  const a = t.getAttribute("position");
  if (!a)
    return console.warn("[findNearestSurfacePoint] No position attribute in geometry"), null;
  const u = ve(n, e, o);
  if (u >= 0) {
    const r = new S.Vector3(
      a.getX(u),
      a.getY(u),
      a.getZ(u)
    );
    return i.localToWorld(r), console.log(`[findNearestSurfacePoint] Found point at index ${u}:`, {
      target: { x: n, z: e },
      found: r.toArray()
    }), r;
  }
  return console.warn(`[findNearestSurfacePoint] No point found near (${n}, ${e})`), null;
}
function qn(n, e, o = {}) {
  const t = e.min.x + n.x * (e.max.x - e.min.x), i = e.min.z + n.z * (e.max.z - e.min.z), a = Sn(t, i, o);
  return a || (console.warn("[normalizedToSurfacePosition] Falling back to simple bounds mapping"), new S.Vector3(
    t,
    e.min.y + n.y * (e.max.y - e.min.y),
    i
  ));
}
let pe = [];
const vt = new xe();
vt.maxPoints = 1e7;
vt.subsample = "auto";
async function bn(n) {
  B.showLoading(), B.setProgress(`Fetching ${n}...`);
  try {
    const e = await fetch(n);
    if (!e.ok)
      throw new Error(`File not found: ${n}

Place your .las/.laz file in: public/data/`);
    const o = await e.arrayBuffer();
    if (o.byteLength < 227)
      throw new Error(`File too small or not found: ${n}

Place your .las/.laz file in: public/data/`);
    const t = new TextDecoder().decode(new Uint8Array(o, 0, 4));
    if (t !== "LASF")
      throw new Error(`Not a valid LAS/LAZ file: ${n}

Expected LASF signature, got: "${t}"`);
    const i = n.split("/").pop(), a = i.toLowerCase().endsWith(".laz");
    B.setProgress(`Parsing ${(o.byteLength / 1024 / 1024).toFixed(1)} MB...`);
    let u;
    a ? u = await vt.parseLAZ(o) : u = vt.parseLAS(o);
    const r = an(u);
    return B.setFileName(i), B.setFormat(`v${u.header.versionMajor}.${u.header.versionMinor} F${u.header.pointDataFormat}`), B.setPointCount(r), B.setFileSelect(n), !u.hasColor && bt() === "rgb" && (B.setColorMode("height"), rn("height")), gn(n), yn(), console.log(`Loaded: ${i}`), B.hideLoading(), u;
  } catch (e) {
    return console.error("Failed to load file:", e), B.setError(e.message), B.setFileName("No file"), null;
  }
}
function Qn() {
  pe.length > 0 ? bn(pe[0].path) : (B.setProgress(`
      <span style="color:#ffcc00">No files found</span><br><br>
      Place a .las or .laz file in:<br>
      <code style="color:#6eb5ff">public/data/</code>
    `), B.setFileName("No file"), console.log(""), console.log("⚠️  No LAS/LAZ files found in public/data/"), console.log("   Drop a .las or .laz file there and refresh"));
}
class Pn {
  constructor() {
    this.enabled = !1, this.settings = {
      // Add your settings here
    }, this.downsamplingMode = "fps", this.visiblePointCount = 0, this.totalPointCount = 0, this.currentPointCount = 0, this.geometry = null, this.positions = null, this.lastCameraMatrix = null, this.cameraMovedThreshold = 0.01, this.frustumPlanes = null, this.gridInfo = null, this.gridCells = null, this.zoomLevel = 1, this.pointCloudCenter = null, this.initialDistance = null, this.currentSubsampleStep = 1, this.lastZoomLevel = null, this.zoomChangeThreshold = 0.1, this.originalData = null, this.points = null, this.currentColorMode = "rgb", this.currentClassificationRange = null, this.classificationFilter = null, this.minZoom = 1, this.maxZoom = 100, this.minSubsample = 50, this.targetFPS = 60, this.minFPS = 45, this.maxFPS = 90, this.maxSubsample = 50, this.fpsUpdateInterval = 0.25, this.lastFPSUpdate = 0, this.currentFPS = 60, this.fpsHistory = [], this.fpsHistorySize = 10, this.basePointSize = 2, this.gapFillMultiplier = 1.5, console.log("Optimizer initialized");
  }
  /**
   * Enable the optimizer
   */
  enable() {
    this.enabled = !0, re(!0), console.log("Optimizer enabled (GPU-side frustum culling)"), this.geometry && (this.lastCameraMatrix = null, console.log("Optimizer: Will recalculate frustum planes on next frame"));
  }
  /**
   * Disable the optimizer
   */
  disable() {
    this.enabled = !1, re(!1), this.originalData && this.geometry && this.currentSubsampleStep !== 1 ? this.restoreOriginalPointCloud() : this.visiblePointCount = this.totalPointCount, console.log("Optimizer disabled");
  }
  /**
   * Called once when a point cloud is loaded
   * @param {Object} data - Point cloud data from LASLoader
   * @param {THREE.BufferGeometry} geometry - The geometry object
   * @param {THREE.Points} points - The points mesh
   */
  onPointCloudLoaded(e, o, t) {
    this.totalPointCount = e.pointCount, this.currentPointCount = e.pointCount, this.visiblePointCount = e.pointCount, this.geometry = o, this.positions = e.positions, this.points = t, this.originalData = {
      positions: e.positions,
      colors: e.colors,
      intensities: e.intensities,
      classifications: e.classifications,
      pointCount: e.pointCount,
      hasColor: e.hasColor,
      bounds: e.bounds
    }, this.currentColorMode = bt(), this.gridInfo = e.gridInfo;
    const i = e.bounds;
    if (this.pointCloudCenter = new S.Vector3(
      (i.min.x + i.max.x) / 2,
      (i.min.y + i.max.y) / 2,
      (i.min.z + i.max.z) / 2
    ), this.initialDistance = null, this.zoomLevel = 1, this.lastZoomLevel = 1, this.currentSubsampleStep = 1, this.gridInfo) {
      const a = this.gridInfo.dimensions.x * this.gridInfo.dimensions.y * this.gridInfo.dimensions.z;
      console.log(`Optimizer: Grid-based optimizations enabled (${a.toLocaleString()} cells, computed on-demand)`);
    }
    this.lastCameraMatrix = null, this.frustumPlanes = null, console.log(`Optimizer: Point cloud loaded (${e.pointCount.toLocaleString()} points)`), console.log(`Optimizer: Downsampling mode: '${this.downsamplingMode}'`), this.downsamplingMode === "zoom" ? console.log(`Optimizer: Zoom-based downsampling (${this.minSubsample}x at ${this.minZoom}x zoom, 1x at ${this.maxZoom}x zoom)`) : this.downsamplingMode === "fps" && console.log(`Optimizer: FPS-based downsampling (target: ${this.targetFPS} FPS, range: ${this.minFPS}-${this.maxFPS} FPS)`), this.enabled && console.log("Optimizer: GPU-side frustum culling will be active");
  }
  /**
   * Get cell bounds for a given grid cell (computed on-demand to save memory)
   * @param {number} x - Grid X index
   * @param {number} y - Grid Y index
   * @param {number} z - Grid Z index
   * @returns {Object} Cell bounds { min: {x,y,z}, max: {x,y,z} }
   */
  getCellBounds(e, o, t) {
    if (!this.gridInfo) return null;
    const { spacing: i, min: a } = this.gridInfo;
    return {
      min: {
        x: a.x + e * i.x,
        y: a.y + o * i.y,
        z: a.z + t * i.z
      },
      max: {
        x: a.x + (e + 1) * i.x,
        y: a.y + (o + 1) * i.y,
        z: a.z + (t + 1) * i.z
      }
    };
  }
  /**
   * Called every frame before rendering
   * @param {THREE.Camera} camera - The scene camera
   * @param {number} deltaTime - Time since last frame (seconds)
   */
  update(e, o) {
    if (this.zoomLevel, this.updateZoomLevel(e), this.updateFPS(o), !this.enabled) {
      this.originalData && this.geometry && this.currentSubsampleStep !== 1 && this.restoreOriginalPointCloud(), this.visiblePointCount = this.currentPointCount;
      return;
    }
    this.originalData && this.geometry && (this.downsamplingMode === "zoom" ? this.updateDownsamplingZoom() : this.downsamplingMode === "fps" && this.updateDownsamplingFPS());
    const t = e.matrixWorldInverse.clone();
    (!this.lastCameraMatrix || this.cameraMatrixChanged(t, this.lastCameraMatrix)) && this.geometry && (this.updateFrustumPlanes(e), this.lastCameraMatrix = t.clone()), this.estimateVisiblePoints();
  }
  /**
   * Update FPS tracking (smoothed average)
   * @param {number} deltaTime - Time since last frame (seconds)
   */
  updateFPS(e) {
    if (e <= 0) return;
    const o = 1 / e;
    this.fpsHistory.push(o), this.fpsHistory.length > this.fpsHistorySize && this.fpsHistory.shift();
    const t = this.fpsHistory.reduce((i, a) => i + a, 0);
    this.currentFPS = t / this.fpsHistory.length;
  }
  /**
   * Update downsampling based on zoom level (zoom mode)
   */
  updateDownsamplingZoom() {
    if (this.lastZoomLevel === null || Math.abs(this.zoomLevel - this.lastZoomLevel) >= this.zoomChangeThreshold) {
      const o = this.calculateSubsampleStep(this.zoomLevel);
      o !== this.currentSubsampleStep && (this.updateDownsampling(o), this.currentSubsampleStep = o, this.lastZoomLevel = this.zoomLevel);
    }
  }
  /**
   * Calculate subsample step based on zoom level
   * Linear interpolation between minZoom (50x) and maxZoom (1x)
   * @param {number} zoom - Current zoom level
   * @returns {number} Subsample step (1 = all points, 50 = every 50th point)
   */
  calculateSubsampleStep(e) {
    const t = (Math.max(this.minZoom, Math.min(this.maxZoom, e)) - this.minZoom) / (this.maxZoom - this.minZoom), i = this.minSubsample - (this.minSubsample - 1) * t, a = Math.round(i);
    let u = a, r = 1;
    for (; r < a && r < 64; )
      r *= 2;
    const c = r / 2;
    return Math.abs(r - a) / a < 0.2 ? u = r : Math.abs(c - a) / a < 0.2 && (u = c), Math.max(1, u);
  }
  /**
   * Update downsampling based on FPS (fps mode)
   */
  updateDownsamplingFPS() {
    const e = performance.now() / 1e3;
    if (e - this.lastFPSUpdate < this.fpsUpdateInterval)
      return;
    this.lastFPSUpdate = e;
    let o = this.currentSubsampleStep;
    if (this.currentFPS < this.minFPS) {
      const t = this.currentFPS < 15 ? 4 : 2;
      o = Math.min(this.maxSubsample, Math.max(this.currentSubsampleStep * t, 4)), console.log(`Optimizer: FPS critically low (${this.currentFPS.toFixed(1)}), increasing downsampling ${t}x`);
    } else if (this.currentFPS > this.maxFPS && this.currentSubsampleStep > 1)
      o = Math.max(1, Math.floor(this.currentSubsampleStep / 2));
    else if (this.currentFPS >= this.minFPS && this.currentFPS <= this.maxFPS) {
      const t = this.currentFPS / this.targetFPS;
      t < 0.9 ? o = Math.min(this.maxSubsample, Math.ceil(this.currentSubsampleStep * 1.5)) : t > 1.1 && this.currentSubsampleStep > 1 && (o = Math.max(1, Math.floor(this.currentSubsampleStep / 1.5)));
    }
    o !== this.currentSubsampleStep && (this.updateDownsampling(o), this.currentSubsampleStep = o, console.log(`Optimizer: FPS-based downsampling updated to ${o}x (FPS: ${this.currentFPS.toFixed(1)})`));
  }
  /**
   * Update zoom level based on camera distance
   * @param {THREE.Camera} camera - The scene camera
   */
  updateZoomLevel(e) {
    if (!this.pointCloudCenter) return;
    const o = ot ? ot.target : this.pointCloudCenter, t = e.position.distanceTo(o);
    if (this.initialDistance === null) {
      this.initialDistance = t, this.zoomLevel = 1;
      return;
    }
    this.zoomLevel = this.initialDistance / t;
  }
  /**
   * Check if camera matrix changed significantly
   */
  cameraMatrixChanged(e, o) {
    if (!o) return !0;
    for (let t = 0; t < 16; t++)
      if (Math.abs(e.elements[t] - o.elements[t]) > this.cameraMovedThreshold)
        return !0;
    return !1;
  }
  /**
   * Update frustum planes for GPU-side culling
   * @param {THREE.Camera} camera - The scene camera
   */
  updateFrustumPlanes(e) {
    if (!this.geometry)
      return;
    const o = new S.Frustum(), t = new S.Matrix4();
    t.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse), o.setFromProjectionMatrix(t);
    const i = [];
    for (let a = 0; a < 6; a++) {
      const u = o.planes[a];
      i.push(new S.Vector4(
        u.normal.x,
        u.normal.y,
        u.normal.z,
        u.constant
      ));
    }
    on(i), this.frustumPlanes = i, Math.random() < 0.01 && console.log("Optimizer: Frustum planes updated (GPU-side culling active)");
  }
  /**
   * Estimate visible points (for UI display)
   * Uses grid-based culling if grid is detected (much faster!)
   * Otherwise falls back to point sampling
   * Uses current downsampled point count
   */
  estimateVisiblePoints() {
    const e = this.currentPointCount || 0;
    if (!this.frustumPlanes || !this.positions || e === 0) {
      this.visiblePointCount = e;
      return;
    }
    if (this.gridInfo) {
      this.estimateVisiblePointsGrid();
      return;
    }
    this.estimateVisiblePointsSampling();
  }
  /**
   * Grid-based visible point estimation (FAST and memory-efficient!)
   * Tests grid cells instead of individual points, computing cell bounds on-demand
   * Accounts for downsampling by using current point count
   */
  estimateVisiblePointsGrid() {
    const e = this.currentPointCount || 0;
    if (!this.gridInfo || !this.frustumPlanes) {
      this.visiblePointCount = e;
      return;
    }
    const { dimensions: o } = this.gridInfo, t = o.x * o.y * o.z, i = this.totalPointCount > 0 ? e / this.totalPointCount : 1, a = Math.max(1, Math.floor(1 / i)), u = Math.max(1, this.zoomLevel), r = Math.min(2e5, Math.floor(1e5 * u)), c = Math.max(1, Math.floor(t / r));
    let f = 0, y = 0;
    new S.Vector3();
    for (let g = 0; g < o.z; g += c * a)
      for (let m = 0; m < o.y; m += c * a)
        for (let d = 0; d < o.x; d += c * a) {
          const p = this.getCellBounds(d, m, g);
          if (!p) continue;
          y++;
          let b = !0;
          for (let x = 0; x < 6; x++) {
            const w = this.frustumPlanes[x], M = w.x >= 0 ? p.min.x : p.max.x, z = w.y >= 0 ? p.min.y : p.max.y, E = w.z >= 0 ? p.min.z : p.max.z;
            if (w.x * M + w.y * z + w.z * E + w.w < 0) {
              b = !1;
              break;
            }
          }
          b && f++;
        }
    const C = y > 0 ? f / y : 0;
    if (y > 0 && f === 0 && e > 0 && this.zoomLevel > 1) {
      const g = Math.max(1, Math.floor(e / (this.zoomLevel * 10)));
      this.visiblePointCount = g;
    } else
      this.visiblePointCount = Math.max(0, Math.floor(e * C));
  }
  /**
   * Fallback: sample points for visible count estimation
   * Uses current downsampled point count
   */
  estimateVisiblePointsSampling() {
    const e = this.currentPointCount || 0, t = Math.min(1e4, e), i = Math.max(1, Math.floor(e / t));
    let a = 0;
    const u = new S.Vector3();
    for (let c = 0; c < e; c += i) {
      const f = c * 3;
      u.set(
        this.positions[f],
        this.positions[f + 1],
        this.positions[f + 2]
      );
      let y = !0;
      for (let C = 0; C < 6; C++) {
        const g = this.frustumPlanes[C];
        if (g.x * u.x + g.y * u.y + g.z * u.z + g.w < 0) {
          y = !1;
          break;
        }
      }
      y && a++;
    }
    const r = t > 0 ? a / t : 0;
    this.visiblePointCount = Math.floor(e * r);
  }
  /**
   * Called when the camera moves significantly
   * @param {THREE.Camera} camera - The scene camera
   */
  onCameraMove(e) {
    this.enabled;
  }
  /**
   * Update optimizer settings
   * @param {Object} newSettings - Settings to merge
   */
  setSettings(e) {
    this.settings = { ...this.settings, ...e }, console.log("Optimizer settings updated:", this.settings);
  }
  /**
   * Set FPS-based downsampling settings
   * @param {Object} fpsSettings - FPS settings object
   * @param {number} fpsSettings.targetFPS - Target FPS to maintain
   * @param {number} fpsSettings.minFPS - Minimum FPS before aggressive downsampling
   * @param {number} fpsSettings.maxFPS - Maximum FPS before reducing downsampling
   */
  setFPSSettings(e) {
    e.targetFPS !== void 0 && (this.targetFPS = Math.max(30, Math.min(120, e.targetFPS))), e.minFPS !== void 0 && (this.minFPS = Math.max(15, Math.min(60, e.minFPS))), e.maxFPS !== void 0 && (this.maxFPS = Math.max(60, Math.min(144, e.maxFPS))), console.log(`Optimizer: FPS settings updated (target: ${this.targetFPS}, range: ${this.minFPS}-${this.maxFPS})`);
  }
  /**
   * Get current FPS settings
   * @returns {Object} FPS settings
   */
  getFPSSettings() {
    return {
      targetFPS: this.targetFPS,
      minFPS: this.minFPS,
      maxFPS: this.maxFPS
    };
  }
  /**
   * Set classification filter for point visibility
   * Points with classifications NOT in the filter will have size=0 (hidden)
   * @param {number[]|null} filter - Array of classification values to show, or null to show all
   */
  setClassificationFilter(e) {
    this.classificationFilter = e, this.originalData && this.geometry && this.updateDownsampling(this.currentSubsampleStep);
  }
  /**
   * Get current classification filter
   * @returns {number[]|null} Current filter or null
   */
  getClassificationFilter() {
    return this.classificationFilter;
  }
  /**
   * Get current optimizer stats (for UI display)
   * @returns {Object} Stats object
   */
  getStats() {
    return {
      enabled: this.enabled,
      visiblePointCount: this.visiblePointCount,
      totalPointCount: this.totalPointCount,
      // Always returns original count
      currentPointCount: this.currentPointCount,
      // Current downsampled count
      zoomLevel: this.zoomLevel,
      currentFPS: this.currentFPS,
      downsamplingMode: this.downsamplingMode,
      downsamplingFactor: this.currentSubsampleStep
      // Current downsampling step (1x = no downsampling)
    };
  }
  /**
   * Set downsampling mode
   * @param {string} mode - 'zoom' or 'fps'
   */
  setDownsamplingMode(e) {
    if (e !== "zoom" && e !== "fps") {
      console.warn(`Invalid downsampling mode: ${e}. Must be 'zoom' or 'fps'`);
      return;
    }
    this.downsamplingMode = e, console.log(`Optimizer: Downsampling mode set to '${e}'`), this.originalData && this.geometry && this.currentSubsampleStep !== 1 && this.restoreOriginalPointCloud();
  }
  /**
   * Get current downsampling mode
   * @returns {string} Current mode ('zoom' or 'fps')
   */
  getDownsamplingMode() {
    return this.downsamplingMode;
  }
  /**
   * Get current zoom level
   * @returns {number} Zoom level (1.0 = default, >1.0 = zoomed in, <1.0 = zoomed out)
   */
  getZoomLevel() {
    return this.zoomLevel;
  }
  /**
   * Update colors when color mode changes
   * Regenerates colors for the currently downsampled geometry
   */
  updateColors() {
    if (!this.originalData || !this.geometry) return;
    const e = this.geometry.getAttribute("position");
    if (!e) return;
    const o = e.count, t = e.array;
    this.currentColorMode = bt();
    let i;
    this.currentColorMode === "rgb" && this.originalData.colors && this.originalData.hasColor ? i = X(t, o, this.originalData.bounds) : this.currentColorMode === "height" ? i = X(t, o, this.originalData.bounds) : i = X(t, o, this.originalData.bounds), this.geometry.setAttribute("color", new S.BufferAttribute(i, 3));
  }
  /**
   * Update geometry with new downsampling based on zoom level
   * Uses grid structure for efficient point selection
   * @param {number} subsampleStep - New subsample step (1 = all points, 50 = every 50th point)
   */
  updateDownsampling(e) {
    if (!this.originalData || !this.geometry || !this.gridInfo)
      return;
    const o = performance.now(), { positions: t, pointCount: i } = this.originalData, a = Math.max(1, Math.floor(e)), u = Math.ceil(i / a), r = new Float32Array(u * 3), c = new Float32Array(u), f = a * this.gapFillMultiplier, y = this.basePointSize * f, C = this.classificationFilter && this.classificationFilter.length > 0, g = C ? new Set(this.classificationFilter) : null, m = this.originalData.classifications != null;
    let d = 0;
    for (let v = 0; v < i; v += a) {
      const P = v * 3;
      if (r[d * 3] = t[P], r[d * 3 + 1] = t[P + 1], r[d * 3 + 2] = t[P + 2], C && m) {
        const A = this.originalData.classifications[v];
        c[d] = g.has(A) ? y : 0;
      } else
        c[d] = y;
      d++;
    }
    const p = r.slice(0, d * 3), b = c.slice(0, d);
    this.currentColorMode = bt(), this.currentClassificationRange = ce();
    let x;
    if (this.currentColorMode === "rgb" && this.originalData.colors && this.originalData.hasColor) {
      x = new Float32Array(d * 3);
      let v = 0;
      for (let P = 0; P < i; P += a) {
        const A = P * 3;
        x[v * 3] = this.originalData.colors[A], x[v * 3 + 1] = this.originalData.colors[A + 1], x[v * 3 + 2] = this.originalData.colors[A + 2], v++;
      }
    } else if (this.currentColorMode === "height")
      x = X(p, d, this.originalData.bounds);
    else if (this.currentColorMode === "intensity" && this.originalData.intensities) {
      const v = new Float32Array(d);
      let P = 0;
      for (let A = 0; A < i; A += a)
        v[P++] = this.originalData.intensities[A];
      x = Ot(v, d);
    } else if (this.currentColorMode === "classification" && this.originalData.classifications) {
      const v = new Uint8Array(d);
      let P = 0;
      for (let A = 0; A < i; A += a)
        v[P++] = this.originalData.classifications[A];
      this.currentClassificationRange && this.currentClassificationRange.min !== void 0 && this.currentClassificationRange.max !== void 0 ? x = It(
        v,
        d,
        this.currentClassificationRange.min,
        this.currentClassificationRange.max
      ) : x = Tt(v, d);
    } else if (this.currentColorMode === "cracking" && this.originalData.classifications) {
      const v = new Uint8Array(d);
      let P = 0;
      for (let A = 0; A < i; A += a)
        v[P++] = this.originalData.classifications[A];
      this.currentClassificationRange && this.currentClassificationRange.min !== void 0 && this.currentClassificationRange.max !== void 0 ? x = ft(
        v,
        d,
        this.currentClassificationRange.min,
        this.currentClassificationRange.max
      ) : x = ft(v, d, 0, 4);
    } else
      x = X(p, d, this.originalData.bounds);
    const w = this.geometry.getAttribute("position"), M = this.geometry.getAttribute("color"), z = this.geometry.getAttribute("size");
    w && w.array.length === p.length ? (w.array.set(p), w.needsUpdate = !0) : this.geometry.setAttribute("position", new S.BufferAttribute(p, 3)), M && M.array.length === x.length ? (M.array.set(x), M.needsUpdate = !0) : this.geometry.setAttribute("color", new S.BufferAttribute(x, 3)), z && z.array.length === b.length ? (z.array.set(b), z.needsUpdate = !0) : this.geometry.setAttribute("size", new S.BufferAttribute(b, 1)), this.geometry.setDrawRange(0, d), this.positions = p, this.currentPointCount = d, this.frustumPlanes ? this.estimateVisiblePoints() : this.visiblePointCount = d;
    const E = performance.now() - o;
    console.log(`Optimizer: Updated downsampling to ${e}x (${d.toLocaleString()} / ${this.totalPointCount.toLocaleString()} points, size: ${y.toFixed(1)}x) in ${E.toFixed(1)}ms`);
  }
  /**
   * Restore original point cloud (remove downsampling)
   * Called when optimizer is disabled
   */
  restoreOriginalPointCloud() {
    if (!this.originalData || !this.geometry)
      return;
    const e = performance.now(), { positions: o, pointCount: t } = this.originalData;
    this.currentColorMode = bt(), this.currentClassificationRange = ce();
    let i;
    this.currentColorMode === "rgb" && this.originalData.colors && this.originalData.hasColor ? i = this.originalData.colors : this.currentColorMode === "height" ? i = X(o, t, this.originalData.bounds) : this.currentColorMode === "intensity" && this.originalData.intensities ? i = Ot(this.originalData.intensities, t) : this.currentColorMode === "classification" && this.originalData.classifications ? this.currentClassificationRange && this.currentClassificationRange.min !== void 0 && this.currentClassificationRange.max !== void 0 ? i = It(
      this.originalData.classifications,
      t,
      this.currentClassificationRange.min,
      this.currentClassificationRange.max
    ) : i = Tt(this.originalData.classifications, t) : this.currentColorMode === "cracking" && this.originalData.classifications ? this.currentClassificationRange && this.currentClassificationRange.min !== void 0 && this.currentClassificationRange.max !== void 0 ? i = ft(
      this.originalData.classifications,
      t,
      this.currentClassificationRange.min,
      this.currentClassificationRange.max
    ) : i = ft(this.originalData.classifications, t, 0, 4) : i = X(o, t, this.originalData.bounds);
    const a = new Float32Array(t);
    if (this.classificationFilter && this.classificationFilter.length > 0 && this.originalData.classifications) {
      const C = new Set(this.classificationFilter);
      for (let g = 0; g < t; g++) {
        const m = this.originalData.classifications[g];
        a[g] = C.has(m) ? this.basePointSize : 0;
      }
    } else
      a.fill(this.basePointSize);
    const r = this.geometry.getAttribute("position"), c = this.geometry.getAttribute("color"), f = this.geometry.getAttribute("size");
    r && r.array.length === o.length ? (r.array.set(o), r.needsUpdate = !0) : this.geometry.setAttribute("position", new S.BufferAttribute(o, 3)), c && c.array.length === i.length ? (c.array.set(i), c.needsUpdate = !0) : this.geometry.setAttribute("color", new S.BufferAttribute(i, 3)), f && f.array.length === a.length ? (f.array.set(a), f.needsUpdate = !0) : this.geometry.setAttribute("size", new S.BufferAttribute(a, 1)), this.geometry.setDrawRange(0, t), this.positions = o, this.currentPointCount = t, this.currentSubsampleStep = 1, this.frustumPlanes ? this.estimateVisiblePoints() : this.visiblePointCount = t;
    const y = performance.now() - e;
    console.log(`Optimizer: Restored original point cloud (${t.toLocaleString()} points) in ${y.toFixed(1)}ms`);
  }
  /**
   * Clean up resources
   */
  dispose() {
    console.log("Optimizer disposed");
  }
}
const Cn = new Pn();
window.optimizer = Cn;
export {
  cn as CSS2DObject,
  un as CSS2DRenderer,
  S as THREE,
  Nn as addAnnotation,
  it as annotationMarkers,
  I as annotations,
  pe as availableFiles,
  V as camera,
  Bn as clearAnnotations,
  ot as controls,
  Fn as disableLOD,
  an as displayPointCloud,
  vn as enableLOD,
  ve as findNearestPointIndex,
  Sn as findNearestSurfacePoint,
  we as getAllAnnotations,
  $n as getAnnotation,
  Un as getAnnotationGroups,
  Xn as getAnnotationMode,
  Yn as getAnnotationsByGroup,
  ce as getClassificationColorRange,
  bt as getColorMode,
  Ln as getData,
  pt as getGeometry,
  An as getLODState,
  Vn as getLabelRenderer,
  Ct as getPoints,
  be as initLabelRenderer,
  En as lasLoader,
  yn as loadAnnotations,
  bn as loadFromPath,
  Qn as loadInitialFile,
  vt as loader,
  K as material,
  qn as normalizedToSurfacePosition,
  Gn as onAnnotationChange,
  Tn as onPointCloudLoad,
  Cn as optimizer,
  On as pickPoint,
  Rn as removeAnnotation,
  nt as renderer,
  Kn as resizeLabelRenderer,
  et as scene,
  Zn as setAnnotationGroupVisible,
  Hn as setAnnotationMode,
  hn as setAnnotationVisible,
  In as setClassificationColorRange,
  Dn as setColorMode,
  gn as setCurrentFileId,
  re as setFrustumCullingEnabled,
  ge as setLOD,
  Wn as setLabelRendererContainer,
  nn as setPointScale,
  kn as updateAnnotation,
  _n as updateAnnotationMarkers,
  rn as updateColors,
  on as updateFrustumPlanes,
  jn as updateMarkers,
  zn as updateTime
};
