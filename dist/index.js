"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("react/jsx-runtime"),t=require("react");function r(e,t,r,n){return new(r||(r=Promise))((function(o,i){function a(e){try{s(n.next(e))}catch(e){i(e)}}function l(e){try{s(n.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?o(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(a,l)}s((n=n.apply(e,t||[])).next())}))}"function"==typeof SuppressedError&&SuppressedError;const n={drawingEnabled:!1,isGrayscale:!1,cursor:"crosshair",copyImageToClipBoard:!0,imageQuality:"high",rect:{outterBackgroundColor:"rgba(0, 0, 0, 0.1)",borderWidth:1,borderColor:"#F14236",borderStyle:"dashed"},helperText:{show:!0,backgroundColor:"#F14236",textColor:"#fff",position:"bottom-right",fontSize:10,padding:2}},o={low:.1,medium:.5,high:1},i=(e,i,a=n)=>{const l=null!=e?e:t.useRef(null),[s,c]=t.useState(null),[d,u]=t.useState(!1),h=t.useMemo((()=>({width:0,height:0,x:0,y:0})),[]),[g,v]=t.useState(h),p=t.useMemo((()=>Object.assign(Object.assign({},n),a)),[a]),f=t.useCallback((()=>{if(!s)return;const e=s.getContext("2d");null==e||e.clearRect(0,0,s.width,s.height),v(h)}),[s]);t.useEffect((()=>{var e,t;const r=l.current;if(r){if(v(h),[...(null===(e=r.parentElement)||void 0===e?void 0:e.children)||[]].forEach((e=>{var t;"CANVAS"===e.tagName&&e.classList.contains("drawer-layer")&&(null===(t=r.parentElement)||void 0===t||t.removeChild(e))})),!p.drawingEnabled)return;const n=r.cloneNode(!0);n.className="drawer-layer",n.removeAttribute("style"),n.style.position="absolute",n.style.cursor=p.cursor||"crosshair",n.style.inset="0",n.style.zIndex="10",n.style.background="transparent";const o=n.getContext("2d");o&&(o.clearRect(0,0,n.width,n.height),o.fillStyle=(null===(t=p.rect)||void 0===t?void 0:t.outterBackgroundColor)||"rgba(0, 0, 0, 0.1)",o.fillRect(0,0,n.width,n.height)),c(n),r.after(n)}}),[l,p.drawingEnabled,h]);const b=t.useCallback((()=>{if(!g||!l.current)return null;const{x:e,y:t,width:r,height:n}=g,i=document.createElement("canvas");i.width=Math.abs(r),i.height=Math.abs(n);const a=i.getContext("2d");if(a){const{backgroundColor:o,background:s}=l.current.style;a.fillStyle=o||s||"#ffffff",a.fillRect(0,0,i.width,i.height),p.isGrayscale&&(a.filter="grayscale(100%)"),null==a||a.drawImage(l.current,e,t,Math.abs(r),Math.abs(n),0,0,Math.abs(r),Math.abs(n)),p.isGrayscale&&(a.filter="none")}return i.toDataURL("image/png",o[p.imageQuality])}),[g,l,p.isGrayscale]);return t.useEffect((()=>{if(!s)return;const e=s.getContext("2d");if(!e)return;if(!p.drawingEnabled)return void e.clearRect(0,0,s.width,s.height);const t=e=>{const t=s.getBoundingClientRect(),r=s.width/t.width,n=s.height/t.height,o=(e.clientX-t.left)*r,i=(e.clientY-t.top)*n;v((e=>Object.assign(Object.assign({},e),{x:o,y:i}))),u(!0)},n=t=>{var r,n,o,i,a,l,c,u,h,f,b,y,m,w;if(!d)return;const x=s.getBoundingClientRect(),C=s.width/x.width,E=s.height/x.height,S=(t.clientX-x.left)*C,O=(t.clientY-x.top)*E,k=S-g.x,j=O-g.y;v((e=>Object.assign(Object.assign({},e),{width:k,height:j}))),e.clearRect(0,0,s.width,s.height),e.fillStyle=(null===(r=p.rect)||void 0===r?void 0:r.outterBackgroundColor)||"rgba(0, 0, 0, 0.1)",e.fillRect(0,0,s.width,s.height);const R=null===(n=p.rect)||void 0===n?void 0:n.borderWidth;if(e.clearRect(g.x,g.y,k,j),"dashed"===(null===(o=p.rect)||void 0===o?void 0:o.borderStyle)?e.setLineDash([2*R,R]):"dotted"===(null===(i=p.rect)||void 0===i?void 0:i.borderStyle)?e.setLineDash([R,R]):e.setLineDash([]),e.strokeStyle=null===(a=p.rect)||void 0===a?void 0:a.borderColor,e.lineWidth=R,e.strokeRect(g.x-R/2,g.y-R/2,k+R,j+R),!p.helperText||p.helperText.show){if(!(null===(l=p.helperText)||void 0===l?void 0:l.show))return;const t=(null===(c=p.helperText)||void 0===c?void 0:c.value)||"Press Enter to submit, Escape to cancel";e.font=`${(null===(u=p.helperText)||void 0===u?void 0:u.fontSize)||16}px ${(null===(h=p.helperText)||void 0===h?void 0:h.fontFamily)||"Arial"}`,e.textBaseline="bottom",e.textAlign="right";const r=e.measureText(t),n=(null===(f=p.helperText)||void 0===f?void 0:f.padding)||8,o=r.width,i=(null===(b=p.helperText)||void 0===b?void 0:b.fontSize)||16,a=2*i+n;e.fillStyle=(null===(y=p.helperText)||void 0===y?void 0:y.backgroundColor)||"rgba(36, 172, 71, 0.9)";const s=(null===(m=p.helperText)||void 0===m?void 0:m.position)||"bottom-right";let d=0,v=0,x=0,C=0;const[E,S]=s.split("-");switch(E){case"top":v=g.y-a,d=g.y-i;break;case"bottom":v=g.y+j-i-2*n+a,d=g.y+j+a-n}switch(S){case"left":C=g.x,x=g.x+o+n;break;case"right":C=g.x+k-o-2*n,x=g.x+k-n;break;default:C=g.x+(k-o)/2-2*n,x=g.x+(k+o)/2-n}e.fillRect(C,v,o+2*n,i+2*n),e.fillStyle=(null===(w=p.helperText)||void 0===w?void 0:w.textColor)||"white",e.fillText(t,x,d),e.setLineDash([])}},o=()=>{u(!1)},a=e=>r(void 0,void 0,void 0,(function*(){if(e.preventDefault(),"Enter"===e.key){if(0===g.height||0===g.width)return;const e={isCanceled:!1,capturedImage:b(),rectCoords:g};null==i||i(e),p.copyImageToClipBoard&&(yield((e,t="image/png")=>r(void 0,void 0,void 0,(function*(){try{const r=e.replace(/^data:.+;base64,/,""),n=atob(r),o=new Array(n.length);for(let e=0;e<n.length;e++)o[e]=n.charCodeAt(e);const i=new Uint8Array(o),a=new Blob([i],{type:t}),l=new ClipboardItem({[t]:a});yield navigator.clipboard.write([l]),console.log("Base64 image copied to clipboard!")}catch(e){console.error("Failed to copy Base64 image to clipboard:",e)}})))(e.capturedImage)),u(!1)}if("Escape"===e.key){f();null==i||i({isCanceled:!0,capturedImage:null,rectCoords:null})}}));return s.addEventListener("mousedown",t),s.addEventListener("mousemove",n),s.addEventListener("mouseup",o),document.body.addEventListener("keydown",a,{passive:!1}),()=>{s.removeEventListener("mousedown",t),s.removeEventListener("mousemove",n),s.removeEventListener("mouseup",o),document.body.removeEventListener("keydown",a)}}),[s,d,g,p,b,i,f]),{canvasRef:l}},a=t.forwardRef(((r,n)=>{var{drawingEnabled:o=!1,containerDivClassName:a="",onImageCaptured:l,onCaptureCanceled:s,option:c}=r,d=function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]])}return r}(r,["drawingEnabled","containerDivClassName","onImageCaptured","onCaptureCanceled","option"]);const u=t.useRef(null),h=t.useMemo((()=>!!o),[o]);return t.useImperativeHandle(n,(()=>u.current)),i(u,(e=>{const{isCanceled:t,capturedImage:r,rectCoords:n}=e;if(r&&n){const e=r,{width:t,height:o}=n;null==l||l({src:e,width:t,height:o,coordinates:n})}t&&(null==s||s())}),Object.assign(Object.assign({},c),{drawingEnabled:h})),e.jsx("div",Object.assign({style:{position:"relative"},className:a},{children:e.jsx("canvas",Object.assign({className:"react-canvas-snap_canvas",ref:u},d))}))}));a.displayName="Canvas",exports.Canvas=a,exports.useCanvasSnap=i;
//# sourceMappingURL=index.js.map
