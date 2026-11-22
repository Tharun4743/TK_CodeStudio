/* TK Code Studio overlay — injected by the local proxy or dev plugin. */
(() => {
  if (window.__liveEditLoaded) return;
  window.__liveEditLoaded = true;

  const TOKEN = window.__LIVE_TOKEN || 'local-dev';
  const host = document.createElement('div');
  host.id = '__live-host';
  host.style.cssText = 'all:initial;position:fixed;inset:0;pointer-events:none;z-index:2147483647';
  document.documentElement.appendChild(host);
  const root = host.attachShadow({ mode: 'open' });

  root.innerHTML = `
  <style>
    *{box-sizing:border-box;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif}
    .box{position:fixed;pointer-events:none;border-radius:3px;display:none}
    #hover{outline:1.5px dashed #10b981;background:rgba(16,185,129,.06)}
    #sel{outline:2px solid #10b981;background:rgba(16,185,129,.08);pointer-events:none}
    .handle{position:absolute;background:#10b981;border:1.5px solid #fff;border-radius:2px;pointer-events:auto;z-index:9999}
    .handle-r{right:-4px;top:50%;transform:translateY(-50%);width:7px;height:18px;cursor:ew-resize}
    .handle-b{bottom:-4px;left:50%;transform:translateX(-50%);width:18px;height:7px;cursor:ns-resize}
    .handle-se{right:-4px;bottom:-4px;width:9px;height:9px;border-radius:50%;cursor:nwse-resize}
    #tag{position:fixed;display:none;background:#10b981;color:#fff;font-size:11px;padding:2px 6px;border-radius:3px;pointer-events:none;white-space:nowrap}
    #size-pill{position:fixed;display:none;background:#111827;color:#10b981;font-weight:600;font-size:11px;padding:3px 7px;border-radius:4px;border:1px solid #10b981;pointer-events:none;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,.5);z-index:99999}
    .bar{position:fixed;pointer-events:auto;display:flex;gap:4px;padding:4px;background:#111827;border-radius:8px;box-shadow:0 6px 24px rgba(0,0,0,.35);align-items:center}
    #tools{display:none;flex-wrap:wrap;max-width:540px}
    button{all:unset;cursor:pointer;color:#e5e7eb;font-size:12px;padding:5px 9px;border-radius:5px;white-space:nowrap;transition:background .15s}
    button:hover{background:#374151}
    button.primary{background:#10b981;color:#fff}button.primary:hover{background:#059669}
    button.danger:hover{background:#b91c1c}
    .brand-badge{display:flex;align-items:center;gap:5px;font-size:12px;font-weight:700;color:#f3f4f6;padding:3px 8px;border-radius:5px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);white-space:nowrap;letter-spacing:.3px}
    .brand-icon{color:#10b981;font-size:13px}
    #active-el-pill{color:#a7f3d0;font-size:11px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;padding:3px 8px;border-radius:5px;background:rgba(16,185,129,.12);border:1px solid rgba(16,185,129,.25);max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    #active-el-pill .dim{color:#94a3b8;font-size:10px;margin-left:4px}
    .native-picker{position:absolute;opacity:0;pointer-events:none;width:0;height:0}
    .mode-toggle{display:flex;align-items:center;gap:6px;font-weight:600;padding:5px 11px;border-radius:6px;transition:all .15s ease}
    .mode-toggle.on{background:#059669;color:#fff}
    .mode-toggle.on:hover{background:#047857}
    .mode-toggle.off{background:#374151;color:#9ca3af}
    .mode-toggle.off:hover{background:#4b5563;color:#f3f4f6}
    .mode-dot{width:8px;height:8px;border-radius:50%;background:#34d399;box-shadow:0 0 8px #34d399;transition:all .15s ease}
    .mode-toggle.off .mode-dot{background:#6b7280;box-shadow:none}
    #main{left:50%;bottom:18px;transform:translateX(-50%);align-items:center;padding:5px 6px;transition:all .2s ease;z-index:999999}
    #main.mode-off .edit-only{display:none}
    .sep{width:1px;background:#374151;margin:2px 2px}
    #count{color:#9ca3af;font-size:12px;padding:0 6px}
    #list{position:fixed;left:50%;bottom:62px;transform:translateX(-50%);width:340px;max-height:260px;overflow:auto;background:#111827;color:#d1d5db;border-radius:8px;padding:8px;font-size:12px;display:none;pointer-events:auto;box-shadow:0 6px 24px rgba(0,0,0,.35)}
    #list div{padding:5px 6px;border-bottom:1px solid #1f2937}
    #result{position:fixed;right:16px;bottom:16px;width:380px;max-height:55vh;overflow:auto;background:#111827;color:#d1d5db;border-radius:10px;padding:10px 12px;font-size:12px;line-height:1.45;display:none;pointer-events:auto;box-shadow:0 8px 30px rgba(0,0,0,.4)}
    #result h4{margin:0 0 6px;font-size:12px;color:#fff;display:flex;justify-content:space-between;align-items:center}
    #result .ok{color:#86efac}#result .warn{color:#fcd34d}#result .mut{color:#9ca3af;word-break:break-all}
    #result div.row{padding:4px 0;border-top:1px solid #1f2937}
    #toast{position:fixed;left:50%;bottom:72px;transform:translateX(-50%);background:#111827;color:#fff;font-size:12px;padding:8px 12px;border-radius:8px;display:none;max-width:420px;z-index:999999}

    /* Dual Slider Popover */
    .popover{position:fixed;display:none;background:#111827;border:1px solid #374151;border-radius:10px;padding:12px;box-shadow:0 12px 36px rgba(0,0,0,.6);z-index:9999999;width:300px;color:#f3f4f6;pointer-events:auto}
    .pop-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;font-size:12px;font-weight:700;color:#f9fafb}
    .close-btn{all:unset;cursor:pointer;color:#9ca3af;font-size:13px;padding:2px 6px;border-radius:4px}
    .close-btn:hover{color:#fff;background:#374151}
    .slider-group{margin-bottom:10px}
    .slider-label-row{display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#9ca3af;margin-bottom:5px}
    .dim-badge{color:#10b981;font-weight:700;font-family:ui-monospace,monospace;font-size:11px;background:rgba(16,185,129,.12);padding:2px 6px;border-radius:4px;border:1px solid rgba(16,185,129,.25)}
    .slider-row{display:flex;align-items:center;gap:6px}
    .step-btn{all:unset;cursor:pointer;background:#1f2937;color:#e5e7eb;font-weight:700;font-size:13px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:4px;user-select:none;border:1px solid #374151}
    .step-btn:hover{background:#374151;color:#fff}
    .studio-slider{flex:1;-webkit-appearance:none;appearance:none;height:6px;background:#374151;border-radius:3px;outline:none}
    .studio-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:15px;height:15px;border-radius:50%;background:#10b981;cursor:ew-resize;border:2px solid #fff;box-shadow:0 0 6px rgba(16,185,129,.5)}
    .studio-slider::-moz-range-thumb{width:15px;height:15px;border-radius:50%;background:#10b981;cursor:ew-resize;border:2px solid #fff}
    .pop-actions{display:flex;flex-direction:column;gap:8px;margin-top:12px;border-top:1px solid #1f2937;padding-top:10px}
    .ratio-btn{all:unset;cursor:pointer;font-size:11px;font-weight:600;padding:5px 8px;border-radius:5px;background:#1f2937;color:#9ca3af;text-align:center;transition:all .15s;border:1px solid #374151}
    .ratio-btn.locked{background:rgba(16,185,129,.15);color:#34d399;border:1px solid rgba(16,185,129,.35)}
    .ratio-btn:hover{color:#fff}
    .preset-pills{display:flex;gap:4px;justify-content:space-between}
    .pill-btn{all:unset;cursor:pointer;font-size:10px;padding:3px 6px;background:#1f2937;color:#9ca3af;border-radius:4px;text-align:center;flex:1;border:1px solid #374151}
    .pill-btn:hover{background:#374151;color:#fff}
  </style>
  <div id="hover" class="box"></div>
  <div id="sel" class="box">
    <div class="handle handle-r" title="Drag to adjust width"></div>
    <div class="handle handle-b" title="Drag to adjust height"></div>
    <div class="handle handle-se" title="Drag to adjust width & height"></div>
  </div>
  <div id="tag"></div>
  <div id="size-pill"></div>
  <div id="tools" class="bar"></div>
  <div id="list"></div>
  <div id="result"></div>
  <div id="toast"></div>
  <input type="color" id="native-color" class="native-picker" value="#10b981">
  <input type="color" id="native-bg" class="native-picker" value="#141417">

  <!-- Dual Slider Popover -->
  <div id="slider-popover" class="popover">
    <div class="pop-header">
      <span id="pop-title">⚡ Sizing & Sliders</span>
      <button id="pop-close" class="close-btn" title="Close (Esc)">✕</button>
    </div>
    <div class="slider-group">
      <div class="slider-label-row">
        <span>↔ Horizontal (Width)</span>
        <span id="w-badge" class="dim-badge">24px</span>
      </div>
      <div class="slider-row">
        <button id="w-minus" class="step-btn" title="-1px">-</button>
        <input type="range" id="w-slider" min="8" max="280" value="24" class="studio-slider">
        <button id="w-plus" class="step-btn" title="+1px">+</button>
      </div>
    </div>
    <div class="slider-group">
      <div class="slider-label-row">
        <span>↕ Vertical (Height)</span>
        <span id="h-badge" class="dim-badge">24px</span>
      </div>
      <div class="slider-row">
        <button id="h-minus" class="step-btn" title="-1px">-</button>
        <input type="range" id="h-slider" min="8" max="280" value="24" class="studio-slider">
        <button id="h-plus" class="step-btn" title="+1px">+</button>
      </div>
    </div>
    <div class="pop-actions">
      <button id="lock-ratio-btn" class="ratio-btn locked" title="Lock 1:1 Aspect Ratio">🔗 1:1 Aspect Ratio Locked</button>
      <div class="preset-pills">
        <button class="pill-btn" data-size="16">16px</button>
        <button class="pill-btn" data-size="20">20px</button>
        <button class="pill-btn" data-size="24">24px</button>
        <button class="pill-btn" data-size="32">32px</button>
        <button class="pill-btn" data-size="48">48px</button>
        <button class="pill-btn" data-size="64">64px</button>
      </div>
    </div>
  </div>

  <div id="main" class="bar">
    <div class="brand-badge"><span class="brand-icon">⚡</span><span>TK Code Studio</span></div>
    <span class="sep"></span>
    <button id="toggle" class="mode-toggle on" title="Toggle Edit Mode (Alt+E)"><span class="mode-dot"></span><span id="toggle-label">Edit: ON</span></button>
    <span class="sep edit-only"></span>
    <span id="active-el-pill" class="edit-only">Click element to edit</span>
    <span class="sep edit-only"></span>
    <button id="undo" class="edit-only" title="Undo Last Change (Ctrl+Z)">Undo</button>
    <button id="redo" class="edit-only" title="Redo Undone Change (Ctrl+Y / Ctrl+Shift+Z)">Redo</button>
    <button id="cnt" class="edit-only" title="View Pending Changes"><span id="count">0 changes</span></button>
    <span class="sep edit-only"></span>
    <button id="save" class="primary edit-only" title="Save to Code (Ctrl+S)">Save to code</button>
  </div>`;

  const $ = s => root.querySelector(s);
  const hoverBox = $('#hover'), selBox = $('#sel'), tagEl = $('#tag'), tools = $('#tools'), activeElPill = $('#active-el-pill');
  const colorInput = $('#native-color'), bgInput = $('#native-bg');
  const sliderPop = $('#slider-popover'), wSlider = $('#w-slider'), hSlider = $('#h-slider');
  const wBadge = $('#w-badge'), hBadge = $('#h-badge'), lockBtn = $('#lock-ratio-btn');

  let on = true, hovered = null, selected = null, editing = null;
  const textChanges = new Map();   // key -> {old,new,selector,html}
  const ops = [];                  // structural changes
  const editedEls = new Set();     // elements whose text baseline resets after a save

  // ---- Bidirectional Undo & Redo History Stack ----
  const undoStack = [];
  const redoStack = [];

  function record(undoFn, redoFn) {
    undoStack.push({ undo: undoFn, redo: redoFn });
    redoStack.length = 0; // Clear redo history on new action
    updateUndoRedoUI();
  }

  function doUndo() {
    if (editing) commitEdit();
    const action = undoStack.pop();
    if (!action) return toast('Nothing to undo');
    action.undo();
    redoStack.push(action);
    updateUndoRedoUI();
    refresh();
    toast('↩️ Undone');
  }

  function doRedo() {
    if (editing) commitEdit();
    const action = redoStack.pop();
    if (!action) return toast('Nothing to redo');
    action.redo();
    undoStack.push(action);
    updateUndoRedoUI();
    refresh();
    toast('↪️ Redone');
  }

  function updateUndoRedoUI() {
    const u = $('#undo'), r = $('#redo');
    if (u) u.style.opacity = undoStack.length ? '1' : '0.4';
    if (r) r.style.opacity = redoStack.length ? '1' : '0.4';
  }

  const ids = new WeakMap(); let nextId = 1;
  const idOf = el => { if (!ids.has(el)) ids.set(el, nextId++); return ids.get(el); };
  const inUI = t => t === host || host.contains(t);

  function cssPath(el) {
    const parts = [];
    while (el && el.nodeType === 1 && el !== document.body && parts.length < 7) {
      if (el.id) { parts.unshift('#' + el.id); break; }
      let s = el.tagName.toLowerCase();
      const cls = [...el.classList].slice(0, 2).join('.');
      if (cls) s += '.' + cls;
      const sib = el.parentElement ? [...el.parentElement.children].filter(c => c.tagName === el.tagName) : [];
      if (sib.length > 1) s += `:nth-of-type(${sib.indexOf(el) + 1})`;
      parts.unshift(s); el = el.parentElement;
    }
    return parts.join(' > ');
  }
  const html = el => el.outerHTML.replace(/\s+/g, ' ').slice(0, 1800);
  const txt = el => (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120);
  const label = el => el.tagName.toLowerCase() + ([...el.classList][0] ? '.' + [...el.classList][0] : '');
  const isButton = el => el.matches('button,[role=button],input[type=submit],input[type=button],a.btn,a[class*=button],a[class*=btn]');
  const isInput = el => el.matches('input,textarea,select');
  const isImage = el => el.matches('img,picture,image,figure') || (el.style && el.style.backgroundImage && el.style.backgroundImage !== 'none');
  const isIcon = el => el && (
    el.tagName.toLowerCase() === 'svg' ||
    el.matches('svg, [class*=lucide], [data-lucide], i.fa, i.bi, i[class*=icon], span[class*=icon]') ||
    el.closest('svg') !== null
  );

  const sizePill = $('#size-pill');
  let resizing = false;
  const directTexts = el => [...el.childNodes].filter(n => n.nodeType === 3 && n.nodeValue.trim()).map(n => n.nodeValue.trim().replace(/\s+/g, ' '));

  // Anti-Corner Collapse SVG Target Resolver:
  // NEVER allow internal path, circle, or polygon to be selected independently
  function resolveSelectable(el) {
    if (!el || inUI(el)) return null;
    const svg = el.closest('svg');
    if (svg && !inUI(svg)) return svg;
    const iconEl = el.closest('i[class*=icon], span[class*=icon], [class*=lucide], [data-lucide]');
    if (iconEl && !inUI(iconEl)) return iconEl;
    return el;
  }

  function toast(msg, ms = 3500) {
    const t = $('#toast'); t.textContent = msg; t.style.display = 'block';
    clearTimeout(toast._t); toast._t = setTimeout(() => (t.style.display = 'none'), ms);
  }

  // ---- drawing ----
  function place(box, el) {
    if (!el || !el.isConnected) { box.style.display = 'none'; return; }
    const r = el.getBoundingClientRect();
    Object.assign(box.style, { display: 'block', left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
  }
  function frame() {
    place(hoverBox, on && hovered !== selected ? hovered : null);
    place(selBox, selected);
    if (selected && selected.isConnected) {
      const r = selected.getBoundingClientRect();
      tagEl.textContent = label(selected); tagEl.style.display = 'block';
      tagEl.style.left = Math.max(4, r.left) + 'px'; tagEl.style.top = Math.max(4, r.top - 20) + 'px';
      tools.style.display = 'flex';
      const tw = tools.offsetWidth;
      tools.style.left = Math.min(Math.max(8, r.left), innerWidth - tw - 8) + 'px';
      tools.style.top = (r.bottom + 44 > innerHeight ? Math.max(8, r.top - 56) : r.bottom + 8) + 'px';
    } else {
      tagEl.style.display = 'none';
      tools.style.display = 'none';
      sliderPop.style.display = 'none';
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // ---- selection ----
  function updateElementPill() {
    if (!activeElPill) return;
    if (selected && selected.isConnected) {
      const r = selected.getBoundingClientRect();
      activeElPill.innerHTML = `&lt;${label(selected)}&gt; <span class="dim">${Math.round(r.width)}×${Math.round(r.height)}</span>`;
    } else {
      activeElPill.textContent = 'Click element to edit';
    }
  }

  function select(el) {
    if (editing) commitEdit();
    if (sliderPop) sliderPop.style.display = 'none';
    selected = el ? resolveSelectable(el) : null;
    buildTools();
    updateElementPill();
  }

  function buildTools() {
    tools.innerHTML = '';
    if (!selected) return;
    const add = (name, fn, cls = '', tip = '') => {
      const b = document.createElement('button');
      b.textContent = name;
      if (cls) b.className = cls;
      if (tip) b.title = tip;
      b.onclick = e => { e.stopPropagation(); fn(); };
      tools.appendChild(b);
    };

    if (isIcon(selected)) {
      add('Size & Sliders ⚡', openSliderPopover, 'primary', 'Interactive Width & Height Sliders (Alt+R)');
      add('Stroke 📏', promptStrokeWidth, '', 'Adjust Stroke Width (1px, 1.5px, 2px, 2.5px)');
      add('Color 🎨', triggerColorPicker, '', 'Icon Color (Alt+K)');
      add('BG 🖌️', triggerBgPicker, '', 'Icon Background (Alt+B)');
      add('Rotate 🔄', promptIconRotate, '', 'Rotate Icon (90°, 180°, 270°, Flip)');
      add('Swap Icon 📷', promptSwapIcon, '', 'Replace Icon / Upload SVG');
    } else {
      add('Edit text', startEdit, '', 'Inline Text Edit (Double Click)');
      add('Size & Sliders 📐', openSliderPopover, '', 'Adjust Dimensions / Sliders (Alt+R)');
      add('Font 🔤', promptFontSize, '', 'Font Size');
      add('Color 🎨', triggerColorPicker, '', 'Dynamic Text Color (Alt+K)');
      add('BG 🖌️', triggerBgPicker, '', 'Dynamic Background Color (Alt+B)');
    }

    add('Move ↑', moveUp, '', 'Move Element Up (Alt+↑)');
    add('Move ↓', moveDown, '', 'Move Element Down (Alt+↓)');
    if (isImage(selected)) add('Replace 📷', promptImageUpload, '', 'Replace Image Asset');
    add('Parent ↑', () => selected.parentElement && selected.parentElement !== document.documentElement && select(selected.parentElement), '', 'Select Parent (Alt+P)');
    add('Child ↓', () => selected.firstElementChild && select(selected.firstElementChild), '', 'Select Child (Alt+C)');
    add('Duplicate', duplicate, '', 'Duplicate Element (Ctrl+D)');
    if (isButton(selected)) add(isDisabled(selected) ? 'Enable' : 'Disable', toggleDisabled);
    add('Delete', del, 'danger', 'Delete Element (Del)');
  }

  // ---- Dual Slider Popover Engine ----
  let ratioLocked = true;

  function openSliderPopover() {
    if (!selected) return;
    const r = selected.getBoundingClientRect();
    const curW = Math.max(8, Math.round(r.width));
    const curH = Math.max(8, Math.round(r.height));

    ratioLocked = isIcon(selected); // Icons default to 1:1 locked ratio
    updateRatioBtn();

    wSlider.value = curW;
    hSlider.value = curH;
    wBadge.textContent = curW + 'px';
    hBadge.textContent = curH + 'px';

    const popW = 300;
    sliderPop.style.display = 'block';
    sliderPop.style.left = Math.min(Math.max(12, r.left), innerWidth - popW - 12) + 'px';
    sliderPop.style.top = (r.bottom + 50 > innerHeight ? Math.max(12, r.top - 200) : r.bottom + 10) + 'px';
  }

  function updateRatioBtn() {
    if (!lockBtn) return;
    lockBtn.classList.toggle('locked', ratioLocked);
    lockBtn.textContent = ratioLocked ? '🔗 1:1 Aspect Ratio Locked' : '🔓 Independent Width & Height';
  }

  lockBtn.onclick = () => {
    ratioLocked = !ratioLocked;
    updateRatioBtn();
  };

  $('#pop-close').onclick = () => { sliderPop.style.display = 'none'; };

  function setupSliderListeners() {
    const prevStyle = () => selected ? selected.getAttribute('style') || '' : '';
    let startStyle = '';

    const onStartSliding = () => {
      if (selected) startStyle = selected.getAttribute('style') || '';
    };

    wSlider.onmousedown = onStartSliding;
    hSlider.onmousedown = onStartSliding;

    wSlider.oninput = () => {
      if (!selected) return;
      const w = parseInt(wSlider.value, 10);
      let h = parseInt(hSlider.value, 10);
      if (ratioLocked) {
        h = w;
        hSlider.value = h;
        hBadge.textContent = h + 'px';
      }
      wBadge.textContent = w + 'px';
      applyLiveDimensions(selected, w, h);
    };

    hSlider.oninput = () => {
      if (!selected) return;
      let h = parseInt(hSlider.value, 10);
      let w = parseInt(wSlider.value, 10);
      if (ratioLocked) {
        w = h;
        wSlider.value = w;
        wBadge.textContent = w + 'px';
      }
      hBadge.textContent = h + 'px';
      applyLiveDimensions(selected, w, h);
    };

    const commitSliderChange = () => {
      if (!selected) return;
      const w = parseInt(wSlider.value, 10);
      const h = parseInt(hSlider.value, 10);
      const el = selected;
      const oldStyle = startStyle;
      const newStyle = el.getAttribute('style') || '';

      const op = {
        type: 'resize',
        isIcon: isIcon(el),
        width: w + 'px',
        height: h + 'px',
        style: newStyle,
        ...meta(el)
      };
      ops.push(op);

      record(
        () => {
          if (oldStyle) el.setAttribute('style', oldStyle);
          else el.removeAttribute('style');
          const idx = ops.indexOf(op);
          if (idx !== -1) ops.splice(idx, 1);
          refresh();
        },
        () => {
          applyLiveDimensions(el, w, h);
          if (!ops.includes(op)) ops.push(op);
          refresh();
        }
      );
      refresh();
      toast(`📐 Resized <${el.tagName.toLowerCase()}> to ${w}px × ${h}px`);
    };

    wSlider.onchange = commitSliderChange;
    hSlider.onchange = commitSliderChange;

    // Step +/- Buttons
    $('#w-minus').onclick = () => {
      wSlider.value = Math.max(8, parseInt(wSlider.value, 10) - 2);
      wSlider.oninput();
      commitSliderChange();
    };
    $('#w-plus').onclick = () => {
      wSlider.value = Math.min(280, parseInt(wSlider.value, 10) + 2);
      wSlider.oninput();
      commitSliderChange();
    };
    $('#h-minus').onclick = () => {
      hSlider.value = Math.max(8, parseInt(hSlider.value, 10) - 2);
      hSlider.oninput();
      commitSliderChange();
    };
    $('#h-plus').onclick = () => {
      hSlider.value = Math.min(280, parseInt(hSlider.value, 10) + 2);
      hSlider.oninput();
      commitSliderChange();
    };

    // Preset Pills
    sliderPop.querySelectorAll('.pill-btn').forEach(btn => {
      btn.onclick = () => {
        if (!selected) return;
        const sz = parseInt(btn.dataset.size, 10);
        onStartSliding();
        wSlider.value = sz;
        hSlider.value = sz;
        wBadge.textContent = sz + 'px';
        hBadge.textContent = sz + 'px';
        applyLiveDimensions(selected, sz, sz);
        commitSliderChange();
      };
    });
  }
  setupSliderListeners();

  // Core Layout & Dimension Engine:
  // Shields icons from flexbox crushing, zero-width collapse, and corner-merging bugs
  function applyLiveDimensions(el, w, h) {
    if (!el) return;
    const wPx = w + 'px';
    const hPx = h + 'px';

    if (isIcon(el)) {
      const svg = el.tagName.toLowerCase() === 'svg' ? el : el.querySelector('svg');
      const target = svg || el;

      // 1. Prevent parent flexbox containers from crushing or squishing icon into any corner
      target.style.setProperty('flex-shrink', '0', 'important');
      target.style.setProperty('display', 'inline-block', 'important');
      target.style.setProperty('width', wPx, 'important');
      target.style.setProperty('height', hPx, 'important');
      target.style.setProperty('min-width', wPx, 'important');
      target.style.setProperty('min-height', hPx, 'important');
      target.style.setProperty('max-width', wPx, 'important');
      target.style.setProperty('max-height', hPx, 'important');

      // 2. Synchronize SVG dimension attributes
      if (target.tagName.toLowerCase() === 'svg') {
        target.setAttribute('width', String(w));
        target.setAttribute('height', String(h));
      }

      // 3. Clear any illegal width/height attributes on internal shapes (<path>, <circle>) that cause (0,0) collapse
      target.querySelectorAll('path, circle, rect, polygon, line, polyline').forEach(s => {
        s.style.removeProperty('width');
        s.style.removeProperty('height');
      });
    } else {
      el.style.width = wPx;
      el.style.height = hPx;
    }
    updateElementPill();
  }

  // ---- Icon Stroke Width, Rotation & Swapping ----
  function promptStrokeWidth() {
    if (!selected) return;
    const svg = selected.tagName.toLowerCase() === 'svg' ? selected : selected.querySelector('svg');
    const target = svg || selected;
    const cur = target.style.strokeWidth || target.getAttribute('stroke-width') || '2';
    const choice = prompt(
      `📏 Adjust Icon Line / Stroke Width (Current: ${cur}):\n` +
      `1 = Hairline / Thin (1px)\n` +
      `2 = Clean / Standard (1.5px)\n` +
      `3 = Medium / Bold (2px)\n` +
      `4 = Heavy (2.5px)\n` +
      `5 = Extra Heavy (3px)\n` +
      `Or enter custom (e.g. "1.75"):`,
      '2'
    );
    if (!choice) return;
    let sw = '';
    const c = choice.trim();
    if (c === '1') sw = '1';
    else if (c === '2') sw = '1.5';
    else if (c === '3') sw = '2';
    else if (c === '4') sw = '2.5';
    else if (c === '5') sw = '3';
    else sw = choice.trim();

    const prevSw = target.style.strokeWidth;
    const prevAttr = target.getAttribute('stroke-width');
    const prevStyle = target.getAttribute('style') || '';

    const applySw = val => {
      target.style.setProperty('stroke-width', val, 'important');
      if (target.tagName.toLowerCase() === 'svg') target.setAttribute('stroke-width', val);
      target.querySelectorAll('path, circle, line, polyline').forEach(p => {
        p.style.setProperty('stroke-width', val, 'important');
        if (p.hasAttribute('stroke-width')) p.setAttribute('stroke-width', val);
      });
      if (!ops.includes(op)) ops.push(op);
      refresh();
    };

    const revertSw = () => {
      if (prevStyle) target.setAttribute('style', prevStyle);
      else target.style.removeProperty('stroke-width');
      if (prevAttr) target.setAttribute('stroke-width', prevAttr);
      else target.removeAttribute('stroke-width');
      target.querySelectorAll('path, circle, line, polyline').forEach(p => {
        p.style.removeProperty('stroke-width');
      });
      const idx = ops.indexOf(op);
      if (idx !== -1) ops.splice(idx, 1);
      refresh();
    };

    const op = {
      type: 'style',
      property: 'strokeWidth',
      value: sw,
      style: target.getAttribute('style'),
      ...meta(target)
    };
    ops.push(op);
    applySw(sw);
    record(revertSw, () => applySw(sw));
    toast(`📏 Set icon stroke width to ${sw}`);
  }

  function promptIconRotate() {
    if (!selected) return;
    const choice = prompt(
      `🔄 Rotate / Flip Icon:\n` +
      `1 = Rotate 90°\n` +
      `2 = Rotate 180°\n` +
      `3 = Rotate 270°\n` +
      `4 = Flip Horizontal\n` +
      `5 = Flip Vertical\n` +
      `6 = Reset Rotation (0°)\n` +
      `Or enter custom (e.g. "rotate(45deg)"):`,
      '1'
    );
    if (!choice) return;
    let t = '';
    const c = choice.trim();
    if (c === '1') t = 'rotate(90deg)';
    else if (c === '2') t = 'rotate(180deg)';
    else if (c === '3') t = 'rotate(270deg)';
    else if (c === '4') t = 'scaleX(-1)';
    else if (c === '5') t = 'scaleY(-1)';
    else if (c === '6') t = 'none';
    else t = choice.trim();

    applyStyle('transform', t, `Icon transform set to ${t}`);
  }

  function promptSwapIcon() {
    if (!selected) return;
    const choice = prompt(
      `📷 Swap Icon:\n` +
      `1 = Upload SVG / PNG image from computer\n` +
      `2 = Checkmark Icon (✓)\n` +
      `3 = Close / X Icon (✕)\n` +
      `4 = Search Icon (🔍)\n` +
      `5 = Bell / Notification Icon (🔔)\n` +
      `6 = User / Profile Icon (👤)\n` +
      `7 = Refresh Icon (🔄)\n` +
      `8 = Arrow Right (→)\n` +
      `9 = Trash / Delete Icon (🗑️)\n` +
      `Or enter "paste" to paste raw <svg> markup:`,
      '1'
    );
    if (!choice) return;
    const c = choice.trim().toLowerCase();
    if (c === '1' || c === 'upload') {
      promptImageUpload();
      return;
    }
    const presets = {
      '2': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
      '3': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
      '4': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
      '5': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
      '6': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      '7': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',
      '8': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
      '9': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>'
    };
    let newSvgMarkup = presets[c];
    if (c === 'paste' || !newSvgMarkup) {
      newSvgMarkup = prompt('Paste full <svg ...>...</svg> code here:');
    }
    if (!newSvgMarkup) return;

    const el = selected;
    const oldHtml = el.outerHTML;
    const parser = new DOMParser();
    const doc = parser.parseFromString(newSvgMarkup, 'image/svg+xml');
    const newSvg = doc.querySelector('svg');
    if (!newSvg) return toast('Invalid SVG code.');

    if (el.className) newSvg.setAttribute('class', el.className);
    if (el.style.cssText) newSvg.style.cssText = el.style.cssText;

    const parent = el.parentElement;
    parent.replaceChild(newSvg, el);
    select(newSvg);

    const op = {
      type: 'icon_swap',
      oldHtml,
      newHtml: newSvg.outerHTML,
      ...meta(newSvg)
    };
    ops.push(op);

    record(
      () => {
        parent.replaceChild(el, newSvg);
        const idx = ops.indexOf(op);
        if (idx !== -1) ops.splice(idx, 1);
        select(el);
        refresh();
      },
      () => {
        parent.replaceChild(newSvg, el);
        if (!ops.includes(op)) ops.push(op);
        select(newSvg);
        refresh();
      }
    );
    toast('📷 Swapped icon!');
  }

  // ---- Structure Ops (Move, Delete, Duplicate) ----
  function moveUp() {
    const el = selected;
    if (!el || !el.parentElement) return;
    const prev = el.previousElementSibling;
    if (!prev) return toast('Already first element in its container');
    const parent = el.parentElement;
    parent.insertBefore(el, prev);
    const op = { type: 'move', direction: 'before', targetSelector: cssPath(prev), ...meta(el) };
    ops.push(op);

    record(
      () => {
        parent.insertBefore(prev, el);
        const idx = ops.indexOf(op);
        if (idx !== -1) ops.splice(idx, 1);
        refresh();
      },
      () => {
        parent.insertBefore(el, prev);
        if (!ops.includes(op)) ops.push(op);
        refresh();
      }
    );
    refresh();
    toast('Moved element up ↑');
  }

  function moveDown() {
    const el = selected;
    if (!el || !el.parentElement) return;
    const next = el.nextElementSibling;
    if (!next) return toast('Already last element in its container');
    const parent = el.parentElement;
    parent.insertBefore(next, el);
    const op = { type: 'move', direction: 'after', targetSelector: cssPath(next), ...meta(el) };
    ops.push(op);

    record(
      () => {
        parent.insertBefore(el, next);
        const idx = ops.indexOf(op);
        if (idx !== -1) ops.splice(idx, 1);
        refresh();
      },
      () => {
        parent.insertBefore(next, el);
        if (!ops.includes(op)) ops.push(op);
        refresh();
      }
    );
    refresh();
    toast('Moved element down ↓');
  }

  function applyStyle(prop, val, msg) {
    const el = selected; if (!el) return;
    const prev = el.style[prop];
    const prevStyle = el.getAttribute('style') || '';
    el.style[prop] = val;
    const op = { type: 'style', property: prop, value: val, style: el.getAttribute('style'), ...meta(el) };
    ops.push(op);

    record(
      () => {
        if (prevStyle) el.setAttribute('style', prevStyle);
        else el.style[prop] = prev;
        const idx = ops.indexOf(op);
        if (idx !== -1) ops.splice(idx, 1);
        refresh();
      },
      () => {
        el.style[prop] = val;
        if (!ops.includes(op)) ops.push(op);
        refresh();
      }
    );
    refresh();
    if (msg) toast(`🎨 ${msg}`);
  }

  function rgbToHex(rgb) {
    if (!rgb || rgb === 'transparent' || rgb === 'rgba(0, 0, 0, 0)') return '#10b981';
    if (rgb.startsWith('#')) return rgb.length === 4 ? '#' + rgb[1]+rgb[1]+rgb[2]+rgb[2]+rgb[3]+rgb[3] : rgb.slice(0, 7);
    const m = rgb.match(/\d+/g);
    if (!m || m.length < 3) return '#10b981';
    return '#' + ((1 << 24) + (parseInt(m[0]) << 16) + (parseInt(m[1]) << 8) + parseInt(m[2])).toString(16).slice(1);
  }

  // Unified SVG and Element Color Engine
  function applyColorToElement(targetEl, val) {
    if (!targetEl) return;
    targetEl.style.color = val;

    if (isIcon(targetEl)) {
      const svg = targetEl.tagName.toLowerCase() === 'svg' ? targetEl : targetEl.querySelector('svg');
      if (svg) {
        svg.style.color = val;
        const strokeAttr = svg.getAttribute('stroke');
        const fillAttr = svg.getAttribute('fill');
        const computedStroke = window.getComputedStyle(svg).stroke;
        const computedFill = window.getComputedStyle(svg).fill;

        if (strokeAttr !== 'none' && computedStroke !== 'none') {
          svg.style.stroke = val;
        }
        if (fillAttr !== 'none' && computedFill !== 'none' && computedFill !== 'rgba(0, 0, 0, 0)') {
          svg.style.fill = val;
        }
        svg.querySelectorAll('path, circle, rect, polygon, line, polyline').forEach(p => {
          if (p.getAttribute('stroke') && p.getAttribute('stroke') !== 'none') p.style.stroke = val;
          if (p.getAttribute('fill') && p.getAttribute('fill') !== 'none') p.style.fill = val;
        });
      }
    }
  }

  function triggerColorPicker() {
    if (!selected) return;
    const targetEl = selected;
    const cur = window.getComputedStyle(targetEl).color;
    colorInput.value = rgbToHex(cur);
    const prevColor = targetEl.style.color;
    const prevStyle = targetEl.getAttribute('style') || '';

    colorInput.oninput = ev => {
      applyColorToElement(targetEl, ev.target.value);
    };

    colorInput.onchange = ev => {
      const val = ev.target.value;
      applyColorToElement(targetEl, val);
      const op = { type: 'style', property: 'color', value: val, style: targetEl.getAttribute('style'), ...meta(targetEl) };
      ops.push(op);

      record(
        () => {
          if (prevStyle) targetEl.setAttribute('style', prevStyle);
          else targetEl.style.color = prevColor;
          const idx = ops.indexOf(op);
          if (idx !== -1) ops.splice(idx, 1);
          refresh();
        },
        () => {
          applyColorToElement(targetEl, val);
          if (!ops.includes(op)) ops.push(op);
          refresh();
        }
      );
      refresh();
      toast(`🎨 Color set to ${val}`);
    };

    colorInput.click();
  }

  function triggerBgPicker() {
    if (!selected) return;
    const targetEl = selected;
    const cur = window.getComputedStyle(targetEl).backgroundColor;
    bgInput.value = rgbToHex(cur);
    const prevBg = targetEl.style.backgroundColor;
    const prevStyle = targetEl.getAttribute('style') || '';

    bgInput.oninput = ev => {
      targetEl.style.backgroundColor = ev.target.value;
    };

    bgInput.onchange = ev => {
      const val = ev.target.value;
      targetEl.style.backgroundColor = val;
      const op = { type: 'style', property: 'backgroundColor', value: val, style: targetEl.getAttribute('style'), ...meta(targetEl) };
      ops.push(op);

      record(
        () => {
          if (prevStyle) targetEl.setAttribute('style', prevStyle);
          else targetEl.style.backgroundColor = prevBg;
          const idx = ops.indexOf(op);
          if (idx !== -1) ops.splice(idx, 1);
          refresh();
        },
        () => {
          targetEl.style.backgroundColor = val;
          if (!ops.includes(op)) ops.push(op);
          refresh();
        }
      );
      refresh();
      toast(`🖌️ Background set to ${val}`);
    };

    bgInput.click();
  }

  function promptFontSize() {
    if (!selected) return;
    const cur = parseInt(window.getComputedStyle(selected).fontSize) || 16;
    const choice = prompt(
      `Adjust Font / Typography Size (Current: ${cur}px):\n` +
      `1 = A- (-2px -> ${cur - 2}px)\n` +
      `2 = A+ (+2px -> ${cur + 2}px)\n` +
      `3 = Small (12px)\n` +
      `4 = Normal (16px)\n` +
      `5 = Large (20px)\n` +
      `6 = Extra Large (28px)\n` +
      `7 = Huge Headline (40px)\n` +
      `Or enter custom size (e.g. "24px"):`,
      `${cur}px`
    );
    if (!choice) return;
    let newSize = '';
    const c = choice.trim().toLowerCase();
    if (c === '1' || c === 'a-') newSize = `${Math.max(8, cur - 2)}px`;
    else if (c === '2' || c === 'a+') newSize = `${cur + 2}px`;
    else if (c === '3') newSize = '12px';
    else if (c === '4') newSize = '16px';
    else if (c === '5') newSize = '20px';
    else if (c === '6') newSize = '28px';
    else if (c === '7') newSize = '40px';
    else newSize = choice.trim();
    applyStyle('fontSize', newSize, `Font size set to ${newSize}`);
  }

  function promptImageUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      if (!input.files || !input.files[0]) return;
      const file = input.files[0];
      toast('📤 Uploading image asset...', 5000);
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await fetch('/__live/upload-asset', {
            method: 'POST',
            headers: { 'content-type': 'application/json', 'x-live-token': TOKEN },
            body: JSON.stringify({ name: file.name, data: reader.result })
          });
          const d = await res.json();
          if (!d.ok) throw new Error(d.error || 'Upload failed');
          const targetEl = selected;
          const oldSrc = targetEl.tagName.toLowerCase() === 'img' ? (targetEl.getAttribute('src') || '') : (targetEl.style.backgroundImage || '');
          const newSrc = d.url;
          if (targetEl.tagName.toLowerCase() === 'img') targetEl.src = newSrc;
          else targetEl.style.backgroundImage = `url('${newSrc}')`;
          const op = { type: 'asset_swap', oldSrc, newSrc, ...meta(targetEl) };
          ops.push(op);

          record(
            () => {
              if (targetEl.tagName.toLowerCase() === 'img') targetEl.src = oldSrc;
              else targetEl.style.backgroundImage = oldSrc;
              const idx = ops.indexOf(op);
              if (idx !== -1) ops.splice(idx, 1);
              refresh();
            },
            () => {
              if (targetEl.tagName.toLowerCase() === 'img') targetEl.src = newSrc;
              else targetEl.style.backgroundImage = `url('${newSrc}')`;
              if (!ops.includes(op)) ops.push(op);
              refresh();
            }
          );
          refresh();
          toast(`📷 Replaced image with ${d.url}!`);
        } catch (err) {
          toast(`❌ Image upload failed: ${err.message}`);
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  function initAssetDrop() {
    window.addEventListener('dragover', e => {
      if (!on) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      const target = resolveSelectable(e.target);
      if (!inUI(target) && target.nodeType === 1) hovered = target;
    }, true);

    window.addEventListener('drop', async e => {
      if (!on || inUI(e.target)) return;
      const files = e.dataTransfer?.files;
      if (!files || !files.length) return;
      const file = files[0];
      if (!file.type.startsWith('image/')) return;
      e.preventDefault(); e.stopPropagation();

      const targetEl = selected || (e.target && !inUI(e.target) ? resolveSelectable(e.target) : null);
      if (!targetEl || targetEl === document.body || targetEl === document.documentElement) return;

      toast('📤 Uploading image asset...', 5000);
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await fetch('/__live/upload-asset', {
            method: 'POST',
            headers: { 'content-type': 'application/json', 'x-live-token': TOKEN },
            body: JSON.stringify({ name: file.name, data: reader.result })
          });
          const d = await res.json();
          if (!d.ok) throw new Error(d.error || 'Upload failed');

          const oldSrc = targetEl.tagName.toLowerCase() === 'img' ? (targetEl.getAttribute('src') || '') : (targetEl.style.backgroundImage || '');
          const newSrc = d.url;

          if (targetEl.tagName.toLowerCase() === 'img') {
            targetEl.src = newSrc;
          } else {
            targetEl.style.backgroundImage = `url('${newSrc}')`;
          }

          const op = { type: 'asset_swap', oldSrc, newSrc, ...meta(targetEl) };
          ops.push(op);

          record(
            () => {
              if (targetEl.tagName.toLowerCase() === 'img') targetEl.src = oldSrc;
              else targetEl.style.backgroundImage = oldSrc;
              const idx = ops.indexOf(op);
              if (idx !== -1) ops.splice(idx, 1);
              refresh();
            },
            () => {
              if (targetEl.tagName.toLowerCase() === 'img') targetEl.src = newSrc;
              else targetEl.style.backgroundImage = `url('${newSrc}')`;
              if (!ops.includes(op)) ops.push(op);
              refresh();
            }
          );
          select(targetEl);
          refresh();
          toast(`📷 Replaced image with ${d.url}!`);
        } catch (err) {
          toast(`❌ Image upload failed: ${err.message}`);
        }
      };
      reader.readAsDataURL(file);
    }, true);
  }

  function promptSize() {
    if (!selected) return;
    openSliderPopover();
  }

  function initResizeHandles() {
    const handles = selBox.querySelectorAll('.handle');
    handles.forEach(h => {
      h.addEventListener('mousedown', e => {
        if (!selected) return;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        resizing = true;
        const startX = e.clientX;
        const startY = e.clientY;
        const rect = selected.getBoundingClientRect();
        const startW = rect.width;
        const startH = rect.height;
        const prevStyle = selected.getAttribute('style') || '';
        const prevW = selected.style.width;
        const prevH = selected.style.height;

        const isR = h.classList.contains('handle-r');
        const isB = h.classList.contains('handle-b');
        const isSE = h.classList.contains('handle-se');

        let currentW = Math.round(startW);
        let currentH = Math.round(startH);

        const onMouseMove = ev => {
          if (!resizing) return;
          const dx = ev.clientX - startX;
          const dy = ev.clientY - startY;

          if (isIcon(selected)) {
            // Icons keep clean 1:1 aspect ratio during drag
            const dMax = isSE ? Math.max(dx, dy) : (isR ? dx : dy);
            const sz = Math.max(12, Math.round(startW + dMax));
            currentW = sz;
            currentH = sz;
            applyLiveDimensions(selected, sz, sz);
          } else {
            if (isR || isSE) {
              currentW = Math.max(16, Math.round(startW + dx));
              selected.style.width = currentW + 'px';
            }
            if (isB || isSE) {
              currentH = Math.max(16, Math.round(startH + dy));
              selected.style.height = currentH + 'px';
            }
          }

          const currentRect = selected.getBoundingClientRect();
          sizePill.textContent = `${currentW}px × ${currentH}px`;
          sizePill.style.display = 'block';
          sizePill.style.left = (currentRect.right - 40) + 'px';
          sizePill.style.top = (currentRect.bottom + 8) + 'px';
        };

        const onMouseUp = () => {
          if (!resizing) return;
          resizing = false;
          window.removeEventListener('mousemove', onMouseMove, true);
          window.removeEventListener('mouseup', onMouseUp, true);
          sizePill.style.display = 'none';

          if (currentW === Math.round(startW) && currentH === Math.round(startH)) return;

          const wStr = currentW + 'px';
          const hStr = currentH + 'px';
          const el = selected;
          const op = {
            type: 'resize',
            isIcon: isIcon(el),
            width: wStr,
            height: hStr,
            style: el.getAttribute('style'),
            ...meta(el)
          };
          ops.push(op);

          record(
            () => {
              if (prevStyle) el.setAttribute('style', prevStyle);
              else { el.style.width = prevW; el.style.height = prevH; }
              const idx = ops.indexOf(op);
              if (idx !== -1) ops.splice(idx, 1);
              refresh();
            },
            () => {
              applyLiveDimensions(el, currentW, currentH);
              if (!ops.includes(op)) ops.push(op);
              refresh();
            }
          );

          refresh();
          toast(`📐 Resized <${el.tagName.toLowerCase()}> to ${wStr} × ${hStr}`);
        };

        window.addEventListener('mousemove', onMouseMove, true);
        window.addEventListener('mouseup', onMouseUp, true);
      }, true);
    });
  }

  document.addEventListener('mousemove', e => { if (on && !inUI(e.target)) hovered = resolveSelectable(e.target); }, true);
  document.addEventListener('click', e => {
    if (!on || inUI(e.target)) return;
    if (editing && editing.contains(e.target)) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    const target = resolveSelectable(e.target);
    if (!target || target === document.documentElement || target === document.body) return select(null);
    select(target);
  }, true);
  document.addEventListener('dblclick', e => {
    if (on && !inUI(e.target)) {
      e.preventDefault();
      const target = resolveSelectable(e.target);
      select(target);
      startEdit();
    }
  }, true);
  document.addEventListener('submit', e => { if (on) e.preventDefault(); }, true);

  // ---- Smart Component Text Editing ----
  function startEdit() {
    let el = selected; if (!el) return;
    let texts = directTexts(el);
    if (!texts.length) {
      const textChildren = [...el.querySelectorAll('*')].filter(c => directTexts(c).length > 0);
      if (textChildren.length === 1) {
        select(textChildren[0]);
        el = textChildren[0];
        texts = directTexts(el);
      } else if (textChildren.length > 1) {
        const choices = textChildren.slice(0, 8).map((c, i) => `${i + 1} = "${txt(c).slice(0, 45)}"`).join('\n');
        const pick = prompt(
          `Select text in <${label(el)}> to edit:\n\n${choices}\n\nEnter number (1-${Math.min(8, textChildren.length)}):`,
          '1'
        );
        if (!pick) return;
        const idx = parseInt(pick.trim(), 10) - 1;
        const chosen = (idx >= 0 && idx < textChildren.length) ? textChildren[idx] : textChildren[0];
        select(chosen);
        el = chosen;
        texts = directTexts(el);
      }
    }
    if (!texts.length) {
      const fullText = (el.textContent || '').trim();
      if (fullText) {
        const newText = prompt(`Edit text for <${label(el)}>:`, fullText);
        if (newText !== null && newText !== fullText) {
          const oldText = fullText;
          el.textContent = newText;
          const key0 = String(idOf(el)), prefix = key0 + ':0';
          const base = { selector: cssPath(el), html: html(el), ctx: context(el, [oldText, newText]) };
          textChanges.set(prefix, { old: oldText, new: newText, ...base });
          editedEls.add(el);

          record(
            () => {
              el.textContent = oldText;
              textChanges.delete(prefix);
              refresh();
            },
            () => {
              el.textContent = newText;
              textChanges.set(prefix, { old: oldText, new: newText, ...base });
              refresh();
            }
          );
          refresh();
          toast(`Updated text in <${label(el)}>`);
        }
        return;
      }
      return toast('No editable text found in this component.');
    }
    if (!el.__liveOrig) el.__liveOrig = texts;
    editing = el; el.__before = texts;
    el.contentEditable = 'true'; el.focus();
    const rng = document.createRange(); rng.selectNodeContents(el);
    const s = getSelection(); s.removeAllRanges(); s.addRange(rng);
    el.addEventListener('keydown', editKeys); el.addEventListener('paste', pastePlain);
    el.addEventListener('blur', commitEdit, { once: true });
  }

  const editKeys = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); editing && editing.blur(); }
    if (e.key === 'Escape') { e.preventDefault(); editing.__cancel = true; editing.blur(); }
    e.stopPropagation();
  };
  const pastePlain = e => { e.preventDefault(); document.execCommand('insertText', false, (e.clipboardData || window.clipboardData).getData('text/plain')); };

  function commitEdit() {
    const el = editing; if (!el) return; editing = null;
    el.removeEventListener('keydown', editKeys); el.removeEventListener('paste', pastePlain);
    el.removeAttribute('contenteditable');
    const orig = el.__liveOrig, before = el.__before, cur = directTexts(el);
    if (el.__cancel) { el.__cancel = false; revertTexts(el, before); return; }
    const key0 = String(idOf(el)), prefix = key0 + ':';
    const prev = [...textChanges].filter(([k]) => k.startsWith(prefix));
    prev.forEach(([k]) => textChanges.delete(k));
    editedEls.add(el);
    const base = { selector: cssPath(el), html: html(el), ctx: context(el, orig.concat(cur)) };

    const curChanges = new Map();
    if (cur.length === orig.length) {
      cur.forEach((t, i) => {
        if (t !== orig[i]) {
          const item = { old: orig[i], new: t, ...base };
          textChanges.set(prefix + i, item);
          curChanges.set(prefix + i, item);
        }
      });
    } else {
      const a = orig.join(' ').split(/\s+/), b = cur.join(' ').split(/\s+/);
      let p = 0; while (p < a.length && p < b.length && a[p] === b[p]) p++;
      let s = 0; while (s < a.length - p && s < b.length - p && a[a.length - 1 - s] === b[b.length - 1 - s]) s++;
      let lo = p, ao = a.length - s, bo = b.length - s;
      if (lo === ao) { if (lo > 0) lo--; else if (ao < a.length) { ao++; bo++; } }
      const o = a.slice(lo, ao).join(' '), n = b.slice(lo, bo).join(' ');
      if (o && o !== n) {
        const item = { old: o, new: n, ...base };
        textChanges.set(prefix + 'span', item);
        curChanges.set(prefix + 'span', item);
      }
    }

    record(
      () => {
        revertTexts(el, before);
        [...textChanges.keys()].filter(k => k.startsWith(prefix)).forEach(k => textChanges.delete(k));
        prev.forEach(([k, v]) => textChanges.set(k, v));
        refresh();
      },
      () => {
        revertTexts(el, cur);
        [...curChanges.entries()].forEach(([k, v]) => textChanges.set(k, v));
        refresh();
      }
    );
    refresh();
  }

  function revertTexts(el, texts) {
    const nodes = [...el.childNodes].filter(n => n.nodeType === 3 && n.nodeValue.trim());
    if (nodes.length === texts.length) nodes.forEach((n, i) => { n.nodeValue = texts[i]; });
    else if (!el.children.length) el.textContent = texts.join(' ');
  }

  function context(el, own) {
    let p = el.parentElement, depth = 0;
    while (p && p !== document.body && depth < 5) {
      const leaves = [...p.querySelectorAll('*')].filter(n => n !== el && directTexts(n).length);
      if (leaves.length >= 2) {
        const out = [];
        for (const n of leaves) for (const t of directTexts(n)) if (t.length > 2 && t.length < 140 && !own.includes(t) && !out.includes(t)) out.push(t);
        return out.slice(0, 10);
      }
      p = p.parentElement; depth++;
    }
    return [];
  }

  const meta = el => ({ tag: el.tagName.toLowerCase(), text: txt(el), selector: cssPath(el), html: html(el), parentText: el.parentElement ? [...el.parentElement.children].slice(0, 6).map(txt) : [] });

  function duplicate() {
    const el = selected; if (!el || !el.parentElement) return;
    const clone = el.cloneNode(true);
    el.after(clone);
    const op = { type: 'duplicate', ...meta(el) };
    ops.push(op);

    record(
      () => {
        clone.remove();
        const idx = ops.indexOf(op);
        if (idx !== -1) ops.splice(idx, 1);
        select(el);
        refresh();
      },
      () => {
        el.after(clone);
        if (!ops.includes(op)) ops.push(op);
        select(clone);
        refresh();
      }
    );
    select(clone);
    refresh();
    toast('Card duplicated. Edit its text, then Save.');
  }

  function del() {
    const el = selected; if (!el || !el.parentElement) return;
    const parent = el.parentElement, next = el.nextSibling;
    const op = { type: 'delete', ...meta(el) };
    ops.push(op);
    el.remove();
    select(null);

    record(
      () => {
        parent.insertBefore(el, next);
        const idx = ops.indexOf(op);
        if (idx !== -1) ops.splice(idx, 1);
        select(el);
        refresh();
      },
      () => {
        el.remove();
        if (!ops.includes(op)) ops.push(op);
        select(null);
        refresh();
      }
    );
    refresh();
  }

  const isDisabled = el => el.disabled === true || el.getAttribute('aria-disabled') === 'true';
  function toggleDisabled() {
    const el = selected; const now = !isDisabled(el);
    const apply = v => { if ('disabled' in el) el.disabled = v; el.setAttribute('aria-disabled', String(v)); el.style.opacity = v ? '.5' : ''; };
    apply(now);
    const op = { type: 'attr', name: 'disabled', value: now, ...meta(el) };
    ops.push(op);

    record(
      () => {
        apply(!now);
        const idx = ops.indexOf(op);
        if (idx !== -1) ops.splice(idx, 1);
        buildTools();
        refresh();
      },
      () => {
        apply(now);
        if (!ops.includes(op)) ops.push(op);
        buildTools();
        refresh();
      }
    );
    buildTools();
    refresh();
  }

  // ---- Changes and Persistence ----
  function refresh() {
    const n = textChanges.size + ops.length;
    $('#count').textContent = n + (n === 1 ? ' change' : ' changes');
    const list = $('#list');
    const opLabel = o => {
      if (o.type === 'resize') return `resize: &lt;${o.tag}&gt; ${esc(o.width || '')} × ${esc(o.height || '')}`;
      if (o.type === 'asset_swap') return `image: ${esc(o.newSrc || '')}`;
      if (o.type === 'icon_swap') return `icon swap: &lt;${o.tag}&gt;`;
      if (o.type === 'move') return `move: &lt;${o.tag}&gt; (${o.direction})`;
      if (o.type === 'style') return `style: &lt;${o.tag}&gt; ${o.property}=${esc(o.value)}`;
      if (o.type === 'attr') return `attr: &lt;${o.tag}&gt; ${o.name}=${o.value}`;
      return `${o.type}: &lt;${o.tag}&gt; ${esc((o.text || '').slice(0, 40))}`;
    };
    list.innerHTML = [...textChanges.values()].map(c => `<div>text: “${esc(c.old)}” → “${esc(c.new)}”</div>`).concat(ops.map(o => `<div>${opLabel(o)}</div>`)).join('') || '<div>No pending changes</div>';
    buildTools();
    updateUndoRedoUI();
  }
  const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  async function save() {
    if (editing) commitEdit();
    if (!textChanges.size && !ops.length) return toast('Nothing to save.');
    try {
      const r = await fetch('/__live/save', {
        method: 'POST', headers: { 'content-type': 'application/json', 'x-live-token': TOKEN },
        body: JSON.stringify({ edits: [...textChanges.values()], ops, page: location.pathname })
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      showResult(d);
      try { sessionStorage.setItem('__liveLast', JSON.stringify({ d, t: Date.now() })); } catch {}
      textChanges.clear(); ops.length = 0; undoStack.length = 0; redoStack.length = 0;
      editedEls.forEach(el => { if (el.isConnected) el.__liveOrig = directTexts(el); });
      editedEls.clear();
      refresh();
    } catch (e) { showResult({ error: e.message }); }
  }

  function showResult(d) {
    const el = $('#result');
    const head = (t) => `<h4><span>${t}</span><button id="rx">✕</button></h4>`;
    let h;
    if (d.error) {
      h = head('Save failed') + `<div class="warn">${esc(d.error)}</div>`;
    } else {
      h = head(`${(d.applied || []).length} written to source · ${(d.queued || []).length} queued`);
      h += (d.applied || []).map(a => `<div class="row"><span class="ok">✓</span> ${esc(a.file)}:${a.line}<div class="mut">“${esc(a.old)}” → “${esc(a.new)}”</div></div>`).join('');
      h += (d.queued || []).map(q => `<div class="row"><span class="warn">⚠ ${esc(q.type)}${q.reason ? ' — ' + esc(q.reason) : ''}</span></div>`).join('');
    }
    el.innerHTML = h; el.style.display = 'block';
    el.querySelector('#rx').onclick = () => { el.style.display = 'none'; try { sessionStorage.removeItem('__liveLast'); } catch {} };
  }
  try { const s = JSON.parse(sessionStorage.getItem('__liveLast') || 'null'); if (s && Date.now() - s.t < 120000) showResult(s.d); } catch {}

  function setEditMode(state) {
    on = Boolean(state);
    const btn = $('#toggle');
    const lbl = $('#toggle-label');
    const mainBar = $('#main');
    btn.classList.toggle('on', on);
    btn.classList.toggle('off', !on);
    if (mainBar) mainBar.classList.toggle('mode-off', !on);
    if (lbl) lbl.textContent = on ? 'Edit: ON' : 'Edit: OFF';
    if (!on) {
      select(null);
      hovered = null;
      hoverBox.style.display = 'none';
      selBox.style.display = 'none';
      tagEl.style.display = 'none';
      tools.style.display = 'none';
      if (sliderPop) sliderPop.style.display = 'none';
      toast('👁️ Browse Mode (Edit OFF) — Clicks navigate normally. Press Alt+E to edit.', 2500);
    } else {
      toast('✏️ Edit Mode ON — Click elements to edit. Press Alt+E to browse.', 2500);
    }
  }

  $('#save').onclick = save;
  $('#undo').onclick = doUndo;
  $('#redo').onclick = doRedo;
  $('#cnt').onclick = () => { const l = $('#list'); l.style.display = l.style.display === 'block' ? 'none' : 'block'; };
  $('#toggle').onclick = () => setEditMode(!on);

  document.addEventListener('keydown', e => {
    // Mode toggle
    if ((e.altKey && (e.key === 'e' || e.key === 'E')) || (e.ctrlKey && e.shiftKey && (e.key === 'e' || e.key === 'E'))) {
      e.preventDefault();
      setEditMode(!on);
      return;
    }
    if (!on) return;

    // Save: Ctrl+S
    if ((e.metaKey || e.ctrlKey) && (e.key === 's' || e.key === 'S')) {
      e.preventDefault(); save(); return;
    }

    // Redo: Ctrl+Y OR Ctrl+Shift+Z OR Cmd+Shift+Z
    if (
      (((e.metaKey || e.ctrlKey) && (e.key === 'y' || e.key === 'Y')) ||
       ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'z' || e.key === 'Z'))) &&
      !editing
    ) {
      e.preventDefault();
      doRedo();
      return;
    }

    // Undo: Ctrl+Z (without shift)
    if ((e.metaKey || e.ctrlKey) && (e.key === 'z' || e.key === 'Z') && !e.shiftKey && !editing) {
      e.preventDefault();
      doUndo();
      return;
    }

    // Duplicate: Ctrl+D
    if ((e.metaKey || e.ctrlKey) && (e.key === 'd' || e.key === 'D') && selected && !editing) {
      e.preventDefault(); duplicate(); return;
    }

    // Delete: Delete / Backspace
    if ((e.key === 'Delete' || e.key === 'Backspace') && selected && !editing) {
      e.preventDefault(); del(); return;
    }

    // Move Up: Alt+Up
    if (e.altKey && e.key === 'ArrowUp' && selected && !editing) {
      e.preventDefault(); moveUp(); return;
    }

    // Move Down: Alt+Down
    if (e.altKey && e.key === 'ArrowDown' && selected && !editing) {
      e.preventDefault(); moveDown(); return;
    }

    // Parent: Alt+P
    if (e.altKey && (e.key === 'p' || e.key === 'P') && selected && !editing) {
      e.preventDefault();
      if (selected.parentElement && selected.parentElement !== document.documentElement) select(selected.parentElement);
      return;
    }

    // Child: Alt+C
    if (e.altKey && (e.key === 'c' || e.key === 'C') && selected && !editing) {
      e.preventDefault();
      if (selected.firstElementChild) select(selected.firstElementChild);
      return;
    }

    // Color: Alt+K
    if (e.altKey && (e.key === 'k' || e.key === 'K') && selected && !editing) {
      e.preventDefault(); triggerColorPicker(); return;
    }

    // Background: Alt+B
    if (e.altKey && (e.key === 'b' || e.key === 'B') && selected && !editing) {
      e.preventDefault(); triggerBgPicker(); return;
    }

    // Sizing Sliders: Alt+R
    if (e.altKey && (e.key === 'r' || e.key === 'R') && selected && !editing) {
      e.preventDefault(); openSliderPopover(); return;
    }

    // Deselect / Close: Esc
    if (e.key === 'Escape' && !editing) {
      if (sliderPop && sliderPop.style.display === 'block') sliderPop.style.display = 'none';
      else select(null);
    }
  }, true);

  initResizeHandles();
  initAssetDrop();
  refresh();
})();
