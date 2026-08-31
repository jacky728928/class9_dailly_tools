/* =========================================================================
   班级管理工具 - 应用逻辑 app.js
   职责：加载/持久化数据 · 四模块渲染与编辑 · GitHub Contents API 云端同步
   ========================================================================= */
(function () {
  "use strict";

  const DATA_KEY = "classManager.data.v1";
  const SET_KEY = "classManager.settings.v1";
  const WEEKDAYS = ["周一", "周二", "周三", "周四", "周五"];
  const STATUS = {
    present: { label: "到", cls: "present" },
    absent:  { label: "缺", cls: "absent" },
    late:    { label: "迟", cls: "late" },
    leave:   { label: "请", cls: "leave" }
  };

  /* ---------- 状态 ---------- */
  let data = loadData();
  let settings = loadSettings();
  let activeTab = "schedule";
  let editState = { schedule: false, cleaning: false };
  let attDate = "";
  let cleanWeekIdx = 0;

  function loadData() {
    try {
      const raw = localStorage.getItem(DATA_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore corrupt */ }
    return deepClone(window.CLASS_DATA || {});
  }
  function loadSettings() {
    try {
      return JSON.parse(localStorage.getItem(SET_KEY)) || {};
    } catch (e) { return {}; }
  }
  function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

  function persist() {
    data.meta.updated = todayStr();
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
    markDirty(true);
  }
  function resetToFile() {
    localStorage.removeItem(DATA_KEY);
    data = deepClone(window.CLASS_DATA);
    attDate = latestAttDate() || todayStr();
    cleanWeekIdx = Math.max(0, (data.cleaning.schedule.length || 1) - 1);
    markDirty(false);
    renderAll();
    toast("已重置为文件中的数据", "ok");
  }

  let dirty = false;
  function markDirty(v) {
    dirty = v;
    const chip = document.getElementById("syncChip");
    if (!chip) return;
    chip.className = "sync-chip " + (dirty ? "dirty" : "clean");
  }

  /* ---------- 工具 ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }
  function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function escapeHtml(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function studentName(id) { const s = data.students.find(x => x.id === id); return s ? s.name : "？"; }
  function todayStr() { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function fmtDate(s) { if (!s) return "—"; const m = s.match(/(\d+)-(\d+)-(\d+)/); return m ? `${m[1]}-${m[2]}-${m[3]}` : s; }

  function subjectColor(subj) {
    const c = (data.meta.subjectColors || {})[subj] || "#94a3b8";
    return c;
  }
  function subjectInk(hex) {
    // derive a readable ink from bg (kept simple)
    return shade(hex, -0.35);
  }
  function subjectSoft(hex) { return shade(hex, 0.88); }
  function shade(hex, amt) {
    const h = hex.replace("#", "");
    const n = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
    let r = parseInt(n.slice(0, 2), 16), g = parseInt(n.slice(2, 4), 16), b = parseInt(n.slice(4, 6), 16);
    if (amt < 0) { const f = 1 + amt; r = Math.round(r * f); g = Math.round(g * f); b = Math.round(b * f); }
    else { r = Math.round(r + (255 - r) * amt); g = Math.round(g + (255 - g) * amt); b = Math.round(b + (255 - b) * amt); }
    return `#${[r, g, b].map(v => v.toString(16).padStart(2, "0")).join("")}`;
  }

  function toast(msg, type) {
    const wrap = document.getElementById("toastWrap");
    if (!wrap) return alert(msg);
    const t = el("div", "toast" + (type ? " " + type : ""), escapeHtml(msg));
    wrap.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }

  /* ---------- 标签切换 ---------- */
  function switchTab(name) {
    activeTab = name;
    $all(".tab").forEach(t => t.classList.toggle("active", t.dataset.tab === name));
    $all(".panel").forEach(p => p.classList.toggle("active", p.id === "panel-" + name));
  }

  /* =====================================================================
     模块 1：课表
     ===================================================================== */
  function renderSchedule() {
    const sch = data.schedule;
    const grid = $("#scheduleGrid");
    grid.innerHTML = "";

    // header row
    const headFirst = el("div", "sch-cell sch-head", "节次");
    grid.appendChild(headFirst);
    WEEKDAYS.forEach(d => grid.appendChild(el("div", "sch-cell sch-head", d)));

    const nowIdx = currentPeriodIndex();
    sch.periods.forEach((p, pi) => {
      if (p.break) {
        const bcell = el("div", "sch-cell sch-break");
        bcell.style.gridColumn = "1 / -1";
        if (pi === nowIdx) bcell.classList.add("sch-now");
        bcell.innerHTML = `<span class="sch-period">${escapeHtml(p.label || "午休")}</span><span class="sch-time">${escapeHtml(p.time || "")}</span>`;
        grid.appendChild(bcell);
        return;
      }
      const timeCell = el("div", "sch-cell");
      timeCell.innerHTML = `<div class="sch-period">第${p.index}节</div><div class="sch-time">${escapeHtml(p.time)}</div>`;
      if (editState.schedule) {
        const rm = el("button", "btn btn-sm btn-ghost btn-danger", "✕");
        rm.style.cssText = "align-self:flex-start;padding:1px 6px;font-size:10px;";
        rm.title = "删除该节";
        rm.onclick = () => { if (confirm("删除第" + p.index + "节？")) { sch.periods.splice(pi, 1); WEEKDAYS.forEach(d => { if (sch.days[d]) sch.days[d].splice(pi, 1); }); let n = 0; sch.periods.forEach(pp => { if (!pp.break) { n++; pp.index = n; } }); persist(); renderSchedule(); } };
        timeCell.appendChild(rm);
      }
      grid.appendChild(timeCell);

      WEEKDAYS.forEach(d => {
        const entry = (sch.days[d] && sch.days[d][pi]) || { subject: "自习", teacher: "" };
        const cell = el("div", "sch-cell");
        if (pi === nowIdx) cell.classList.add("sch-now");
        const col = subjectColor(entry.subject);
        cell.innerHTML = `<span class="subj-tag" style="--subject-color:${col}">${escapeHtml(entry.subject)}</span>` +
          (entry.teacher ? `<div class="sch-teacher">${escapeHtml(entry.teacher)}</div>` : "") +
          (entry.room ? `<div class="sch-room">${escapeHtml(entry.room)}</div>` : "");
        if (editState.schedule) {
          cell.style.cursor = "pointer";
          cell.title = "编辑";
          cell.onclick = () => openCellEditor(d, pi, entry);
        }
        grid.appendChild(cell);
      });
    });

    // 编辑/添加控件
    const tb = $("#scheduleToolbar");
    tb.innerHTML = "";
    const toggleBtn = el("button", "btn" + (editState.schedule ? " btn-primary" : ""), editState.schedule ? "完成编辑" : "编辑课表");
    toggleBtn.onclick = () => { editState.schedule = !editState.schedule; renderSchedule(); };
    tb.appendChild(toggleBtn);
    if (editState.schedule) {
      const add = el("button", "btn btn-sm", "+ 添加节次");
      add.onclick = () => {
        const idx = sch.periods.filter(p => !p.break).length + 1;
        sch.periods.push({ index: idx, time: "00:00-00:00" });
        WEEKDAYS.forEach(d => { if (!sch.days[d]) sch.days[d] = []; sch.days[d].push({ subject: "自习", teacher: "" }); });
        persist(); renderSchedule();
      };
      tb.appendChild(add);
    }
  }

  function currentPeriodIndex() {
    const now = new Date();
    const day = now.getDay(); // 0 Sun .. 6 Sat
    if (day === 0 || day === 6) return -1;
    const mins = now.getHours() * 60 + now.getMinutes();
    let idx = -1;
    data.schedule.periods.forEach((p, i) => {
      const m = p.time.match(/(\d+):(\d+)-(\d+):(\d+)/);
      if (!m) return;
      const start = +m[1] * 60 + +m[2];
      if (mins >= start) idx = i;
    });
    return idx;
  }

  function openCellEditor(day, pi, entry) {
    const subjects = Object.keys(data.meta.subjectColors || {});
    const opts = subjects.map(s => `<option ${s === entry.subject ? "selected" : ""}>${escapeHtml(s)}</option>`).join("") + `<option ${subjects.indexOf(entry.subject) < 0 ? "selected" : ""} value="__other">其他…</option>`;
    openModal({
      title: `编辑 ${day} · 第${(data.schedule.periods[pi] || {}).index || (pi + 1)}节`,
      body: `
        <div class="form-group">
          <label>科目</label>
          <select class="select" id="cellSubject">${opts}</select>
          <input class="input" id="cellSubjectCustom" placeholder="自定义科目" style="margin-top:6px;${entry.subject && subjects.indexOf(entry.subject) < 0 ? "" : "display:none"}" value="${escapeHtml(subjects.indexOf(entry.subject) < 0 ? entry.subject : "")}">
        </div>
        <div class="form-group">
          <label>任课老师</label>
          <input class="input" id="cellTeacher" value="${escapeHtml(entry.teacher)}" placeholder="老师姓名">
        </div>
        <div class="form-group">
          <label>教室</label>
          <input class="input" id="cellRoom" value="${escapeHtml(entry.room || "")}" placeholder="如 高二9班 / 1341教室">
        </div>`,
      footer: `<button class="btn btn-ghost" data-close>取消</button><button class="btn btn-primary" id="cellSave">保存</button>`
    });
    $("#cellSubject").onchange = (e) => { $("#cellSubjectCustom").style.display = e.target.value === "__other" ? "" : "none"; };
    $("#cellSave").onclick = () => {
      let subj = $("#cellSubject").value;
      if (subj === "__other") subj = $("#cellSubjectCustom").value.trim() || "自习";
      const teacher = $("#cellTeacher").value.trim();
      const room = $("#cellRoom").value.trim();
      if (!data.schedule.days[day]) data.schedule.days[day] = [];
      data.schedule.days[day][pi] = { subject: subj, teacher, room };
      persist(); renderSchedule(); closeModal(); toast("课表已更新", "ok");
    };
  }

  /* =====================================================================
     模块 2：作业收交
     ===================================================================== */
  function renderHomework() {
    const list = $("#hwList");
    list.innerHTML = "";
    const tb = $("#hwToolbar");
    tb.innerHTML = "";
    const addBtn = el("button", "btn btn-primary", "+ 新增作业");
    addBtn.onclick = openHomeworkEditor;
    tb.appendChild(addBtn);

    if (!data.homework.length) { list.appendChild(emptyState("暂无作业记录", "点击右上角新增")); return; }

    // 按截止日期升序
    const sorted = data.homework.slice().sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""));
    const total = data.students.length;
    const today = todayStr();

    sorted.forEach(hw => {
      const submitted = new Set(hw.submittedIds || []);
      const count = submitted.size;
      const pct = total ? Math.round((count / total) * 100) : 0;
      const overdue = hw.dueDate && hw.dueDate < today && count < total;
      const col = subjectColor(hw.subject);

      const card = el("div", "card hw-card");
      card.innerHTML = `
        <div class="hw-top">
          <span class="subj-tag" style="--subject-color:${col}">${escapeHtml(hw.subject)}</span>
          <span class="hw-title">${escapeHtml(hw.title)}</span>
          <span class="hw-dates">
            <span><b>布置</b> ${fmtDate(hw.assignedDate)}</span>
            <span class="${overdue ? "hw-overdue" : ""}"><b>截止</b> ${fmtDate(hw.dueDate)}${overdue ? " · 逾期" : ""}</span>
          </span>
        </div>
        <div class="hw-progress">
          <div class="hw-progress-meta">
            <span>已交 <b style="font-family:var(--font-num)">${count}</b> / ${total}</span>
            <span style="font-family:var(--font-num)">${pct}%</span>
          </div>
          <div class="progress-track"><div class="progress-fill ${pct === 100 ? "full" : (pct < 50 ? "low" : "")}" style="width:${pct}%"></div></div>
        </div>
        <div class="hw-missing">
          <div class="hw-missing-label">点击切换提交状态（绿=已交 · 红=未交）</div>
          <div class="chip-list" data-hwid="${escapeHtml(hw.id)}"></div>
        </div>
        <div class="hw-row-toggle">
          <span style="display:flex;gap:8px">
            <button class="btn btn-sm" data-all="${escapeHtml(hw.id)}">全部已交</button>
            <button class="btn btn-sm" data-clear="${escapeHtml(hw.id)}">全部未交</button>
          </span>
          <button class="btn btn-sm btn-ghost btn-danger" data-del="${escapeHtml(hw.id)}">删除</button>
        </div>`;
      const chips = $(".chip-list", card);
      data.students.forEach(s => {
        const on = submitted.has(s.id);
        const c = el("span", "chip " + (on ? "submitted" : "missing"), `${escapeHtml(s.name)}`);
        c.onclick = () => {
          if (on) hw.submittedIds = (hw.submittedIds || []).filter(x => x !== s.id);
          else (hw.submittedIds = hw.submittedIds || []).push(s.id);
          persist(); renderHomework();
        };
        chips.appendChild(c);
      });
      $("[data-all]", card).onclick = () => { hw.submittedIds = data.students.map(s => s.id); persist(); renderHomework(); toast("已标记全员已交", "ok"); };
      $("[data-clear]", card).onclick = () => { hw.submittedIds = []; persist(); renderHomework(); };
      $("[data-del]", card).onclick = () => { if (confirm("删除作业「" + hw.title + "」？")) { data.homework = data.homework.filter(x => x.id !== hw.id); persist(); renderHomework(); } };
      list.appendChild(card);
    });
  }

  function openHomeworkEditor() {
    const subjects = Object.keys(data.meta.subjectColors || {});
    openModal({
      title: "新增作业",
      body: `
        <div class="form-group"><label>科目</label>
          <select class="select" id="hwSubject">${subjects.map(s => `<option>${escapeHtml(s)}</option>`).join("")}</select>
        </div>
        <div class="form-group"><label>标题</label><input class="input" id="hwTitle" placeholder="如 《课时练》P12-13"></div>
        <div class="form-row2">
          <div class="form-group"><label>布置日期</label><input class="input" type="date" id="hwAssigned" value="${todayStr()}"></div>
          <div class="form-group"><label>截止日期</label><input class="input" type="date" id="hwDue"></div>
        </div>`,
      footer: `<button class="btn btn-ghost" data-close>取消</button><button class="btn btn-primary" id="hwSave">添加</button>`
    });
    $("#hwSave").onclick = () => {
      const title = $("#hwTitle").value.trim();
      if (!title) { toast("请填写标题", "err"); return; }
      const hw = {
        id: "hw" + Date.now().toString(36),
        subject: $("#hwSubject").value,
        title,
        assignedDate: $("#hwAssigned").value || todayStr(),
        dueDate: $("#hwDue").value || "",
        submittedIds: []
      };
      data.homework.push(hw);
      persist(); renderHomework(); closeModal(); toast("作业已添加", "ok");
    };
  }

  /* =====================================================================
     模块 3：考勤
     ===================================================================== */
  function latestAttDate() {
    const keys = Object.keys(data.attendance || {}).sort();
    return keys.length ? keys[keys.length - 1] : "";
  }
  function getAttRecord(date) {
    if (!data.attendance[date]) {
      data.attendance[date] = data.students.map(s => ({ studentId: s.id, status: "present" }));
    }
    return data.attendance[date];
  }
  function renderAttendance() {
    if (!attDate) attDate = latestAttDate() || todayStr();
    const tb = $("#attToolbar");
    tb.innerHTML = `
      <div class="field"><label>日期</label><input class="input" type="date" id="attDate" value="${attDate}"></div>
      <button class="btn btn-sm" id="attAllPresent">全部到勤</button>`;

    const rec = getAttRecord(attDate);
    const stats = { present: 0, absent: 0, late: 0, leave: 0 };
    rec.forEach(r => { if (stats[r.status] != null) stats[r.status]++; });
    const total = data.students.length || 1;
    const rate = Math.round((stats.present / total) * 100);

    const statsEl = $("#attStats");
    statsEl.innerHTML = `
      <div class="stat-card rate"><div class="num">${rate}%</div><div class="lbl">出勤率</div></div>
      <div class="stat-card present"><div class="num">${stats.present}</div><div class="lbl">到勤</div></div>
      <div class="stat-card absent"><div class="num">${stats.absent}</div><div class="lbl">缺勤</div></div>
      <div class="stat-card late"><div class="num">${stats.late}</div><div class="lbl">迟到</div></div>
      <div class="stat-card leave"><div class="num">${stats.leave}</div><div class="lbl">请假</div></div>`;

    const list = $("#attList");
    list.innerHTML = "";
    const byId = {};
    rec.forEach(r => byId[r.studentId] = r.status);
    data.students.forEach(s => {
      const cur = byId[s.id] || "present";
      const row = el("div", "att-row");
      row.innerHTML = `<span class="att-no">${escapeHtml(s.studentNo)}</span><span class="att-name">${escapeHtml(s.name)}</span>`;
      const seg = el("div", "seg");
      Object.keys(STATUS).forEach(k => {
        const b = el("button", (cur === k ? "on " + k : ""), STATUS[k].label);
        b.onclick = () => {
          const r = rec.find(x => x.studentId === s.id);
          if (r) r.status = k; else rec.push({ studentId: s.id, status: k });
          persist(); renderAttendance();
        };
        seg.appendChild(b);
      });
      row.appendChild(seg);
      list.appendChild(row);
    });

    $("#attDate").onchange = (e) => { attDate = e.target.value; renderAttendance(); };
    $("#attAllPresent").onclick = () => {
      const rec2 = getAttRecord(attDate);
      rec2.forEach(r => r.status = "present");
      persist(); renderAttendance(); toast("已标记全员到勤", "ok");
    };
  }

  /* =====================================================================
     模块 4：卫生打扫排班
     ===================================================================== */
  function renderCleaning() {
    const sch = data.cleaning.schedule;
    if (!sch.length) { data.cleaning.schedule = [{ weekStart: todayStr(), weekLabel: "第1周", tasks: [] }]; }
    if (cleanWeekIdx >= sch.length) cleanWeekIdx = sch.length - 1;

    const tb = $("#cleanToolbar");
    tb.innerHTML = `
      <div class="field"><label>周次</label>
        <select class="select" id="cleanWeek">${sch.map((w, i) => `<option value="${i}" ${i === cleanWeekIdx ? "selected" : ""}>${escapeHtml(w.weekLabel)} (${fmtDate(w.weekStart)})</option>`).join("")}</select>
      </div>
      <button class="btn btn-sm" id="cleanAddWeek">+ 新增周</button>
      <button class="btn btn-sm" id="cleanCopy">复制上周</button>
      <button class="btn" id="cleanToggle">${editState.cleaning ? "完成编辑" : "编辑排班"}</button>`;

    const week = sch[cleanWeekIdx];
    const grid = $("#cleanGrid");
    grid.innerHTML = "";
    const colors = ["#4f46e5", "#14b8a6", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"];
    (week.tasks || []).forEach((task, ti) => {
      const col = colors[ti % colors.length];
      const card = el("div", "card area-card");
      card.style.setProperty("--area-color", col);
      const peopleHtml = editState.cleaning ? "" : (task.studentIds.length
        ? task.studentIds.map(id => `<span class="person-chip">${escapeHtml(studentName(id))}</span>`).join("")
        : `<span class="person-chip empty">未分配</span>`);
      card.innerHTML = `<div class="area-name">${escapeHtml(task.area)}</div><div class="area-people" data-ti="${ti}">${peopleHtml}</div>
        ${editState.cleaning ? `<div style="margin-top:10px;display:flex;gap:6px"><button class="btn btn-sm" data-assign="${ti}">分配学生</button><button class="btn btn-sm btn-ghost btn-danger" data-rmarea="${ti}">删除区域</button></div>` : ""}`;
      grid.appendChild(card);
    });

    if (editState.cleaning) {
      const addArea = el("div", "card card-pad", `<button class="btn btn-sm" id="cleanAddArea" style="width:100%">+ 添加区域</button>`);
      grid.appendChild(addArea);
      $("#cleanAddArea").onclick = () => openAreaEditor(week);
      $("[data-assign]") && $all("[data-assign]", grid).forEach(b => b.onclick = () => openAssignEditor(week, +b.dataset.assign));
      $all("[data-rmarea]", grid).forEach(b => b.onclick = () => { week.tasks.splice(+b.dataset.rmarea, 1); persist(); renderCleaning(); });
    }

    $("#cleanWeek").onchange = (e) => { cleanWeekIdx = +e.target.value; renderCleaning(); };
    $("#cleanAddWeek").onclick = () => openWeekEditor();
    $("#cleanCopy").onclick = () => {
      if (cleanWeekIdx === 0) { toast("已是第一周，无上周可复制", "err"); return; }
      const prev = sch[cleanWeekIdx - 1];
      week.tasks = deepClone(prev.tasks).map(t => ({ ...t, studentIds: t.studentIds.slice() }));
      persist(); renderCleaning(); toast("已复制上周排班", "ok");
    };
    $("#cleanToggle").onclick = () => { editState.cleaning = !editState.cleaning; renderCleaning(); };
  }

  function openWeekEditor() {
    openModal({
      title: "新增一周",
      body: `
        <div class="form-group"><label>周次标签</label><input class="input" id="wkLabel" placeholder="如 第3周"></div>
        <div class="form-group"><label>起始日期</label><input class="input" type="date" id="wkStart" value="${todayStr()}"></div>`,
      footer: `<button class="btn btn-ghost" data-close>取消</button><button class="btn btn-primary" id="wkSave">添加</button>`
    });
    $("#wkSave").onclick = () => {
      const w = { weekStart: $("#wkStart").value || todayStr(), weekLabel: $("#wkLabel").value.trim() || "第" + (data.cleaning.schedule.length + 1) + "周", tasks: [] };
      data.cleaning.schedule.push(w);
      cleanWeekIdx = data.cleaning.schedule.length - 1;
      persist(); renderCleaning(); closeModal(); toast("已添加新周", "ok");
    };
  }

  function openAreaEditor(week) {
    openModal({
      title: "添加区域",
      body: `<div class="form-group"><label>区域名称</label><input class="input" id="areaName" placeholder="如 窗台与窗台槽"></div>`,
      footer: `<button class="btn btn-ghost" data-close>取消</button><button class="btn btn-primary" id="areaSave">添加</button>`
    });
    $("#areaSave").onclick = () => {
      const n = $("#areaName").value.trim();
      if (!n) { toast("请输入区域名", "err"); return; }
      week.tasks.push({ area: n, studentIds: [] });
      persist(); renderCleaning(); closeModal();
    };
  }

  function openAssignEditor(week, ti) {
    const task = week.tasks[ti];
    const have = new Set(task.studentIds);
    openModal({
      title: `分配 · ${task.area}`,
      body: `<div class="help">点击学生切换分配。</div><div class="multi-select" id="assignBox"></div>`,
      footer: `<button class="btn btn-ghost" data-close>取消</button><button class="btn btn-primary" id="assignSave">保存</button>`
    });
    const box = $("#assignBox");
    data.students.forEach(s => {
      const on = have.has(s.id);
      const c = el("span", "chip " + (on ? "submitted" : ""), escapeHtml(s.name));
      c.onclick = () => {
        if (have.has(s.id)) { have.delete(s.id); c.classList.remove("submitted"); }
        else { have.add(s.id); c.classList.add("submitted"); }
      };
      box.appendChild(c);
    });
    $("#assignSave").onclick = () => {
      task.studentIds = data.students.filter(s => have.has(s.id)).map(s => s.id);
      persist(); renderCleaning(); closeModal(); toast("已更新值日生", "ok");
    };
  }

  /* ---------- 通用 ---------- */
  function emptyState(title, sub) {
    return el("div", "empty", `<div class="ico">📭</div><div style="font-weight:600">${escapeHtml(title)}</div><div>${escapeHtml(sub || "")}</div>`);
  }

  /* ---------- 模态框 ---------- */
  function openModal({ title, body, footer }) {
    const mask = document.getElementById("modalMask");
    mask.querySelector(".modal-head h3").textContent = title;
    mask.querySelector(".modal-body").innerHTML = body;
    mask.querySelector(".modal-foot").innerHTML = footer;
    mask.classList.add("open");
    $all("[data-close]", mask).forEach(b => b.onclick = closeModal);
  }
  function closeModal() { document.getElementById("modalMask").classList.remove("open"); }

  /* =====================================================================
     GitHub 同步
     ===================================================================== */
  function openSettings() {
    const s = settings;
    openModal({
      title: "云端同步设置",
      body: `
        <div class="form-row2">
          <div class="form-group"><label>仓库 Owner</label><input class="input" id="ghOwner" value="${escapeHtml(s.owner || "")}" placeholder="如 your-name"></div>
          <div class="form-group"><label>仓库名 Repo</label><input class="input" id="ghRepo" value="${escapeHtml(s.repo || "")}" placeholder="如 class-data"></div>
        </div>
        <div class="form-row2">
          <div class="form-group"><label>分支</label><input class="input" id="ghBranch" value="${escapeHtml(s.branch || "main")}" placeholder="main"></div>
          <div class="form-group"><label>文件路径</label><input class="input" id="ghPath" value="${escapeHtml(s.path || "data.js")}" placeholder="data.js"></div>
        </div>
        <div class="form-group">
          <label>GitHub Token (PAT)</label>
          <input class="input" id="ghToken" type="password" value="${escapeHtml(s.token || "")}" placeholder="github_pat_... 或 ghp_...">
          <div class="help warn">⚠ 用细粒度 token，仅授该仓库 <code>Contents: write</code> 权限。Token 仅存本浏览器 localStorage，请勿在公共电脑留存。</div>
        </div>
        <div class="help">部署：把本目录推送到 GitHub 仓库，开启 Pages 即可访问；提交时通过 API 写回 data.js。</div>`,
      footer: `<button class="btn btn-ghost" id="ghResetFile">重置为文件数据</button><div style="flex:1"></div><button class="btn btn-ghost" data-close>取消</button><button class="btn btn-primary" id="ghSave">保存设置</button>`
    });
    $("#ghSave").onclick = () => {
      settings = {
        owner: $("#ghOwner").value.trim(),
        repo: $("#ghRepo").value.trim(),
        branch: $("#ghBranch").value.trim() || "main",
        path: $("#ghPath").value.trim() || "data.js",
        token: $("#ghToken").value.trim()
      };
      localStorage.setItem(SET_KEY, JSON.stringify(settings));
      closeModal(); toast("设置已保存", "ok");
    };
    $("#ghResetFile").onclick = () => { if (confirm("清空本地改动，重新载入 data.js 文件中的数据？")) { closeModal(); resetToFile(); } };
  }

  function buildDataJsText() {
    return "/* 班级管理数据 · 由班级管理工具自动生成 " + (data.meta.updated || "") + " */\n" +
      "window.CLASS_DATA = " + JSON.stringify(data, null, 2) + ";\n";
  }
  function toBase64(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }

  async function syncToCloud() {
    if (!settings.owner || !settings.repo || !settings.token) {
      toast("请先在设置中填写仓库与 Token", "err"); openSettings(); return;
    }
    const chip = document.getElementById("syncChip");
    chip.className = "sync-chip syncing";
    const base = `https://api.github.com/repos/${encodeURIComponent(settings.owner)}/${encodeURIComponent(settings.repo)}/contents/${encodeURIComponent(settings.path)}`;
    const auth = { Authorization: "Bearer " + settings.token, Accept: "application/vnd.github+json" };
    try {
      const get = await fetch(`${base}?ref=${encodeURIComponent(settings.branch)}`, { headers: auth });
      let sha = null;
      if (get.status === 404) {
        // file not exists yet, create without sha
      } else if (!get.ok) {
        const e = await get.json().catch(() => ({}));
        throw new Error("读取失败 " + get.status + "：" + (e.message || get.statusText));
      } else {
        const j = await get.json();
        sha = j.sha;
      }
      const content = toBase64(buildDataJsText());
      const put = await fetch(base, {
        method: "PUT",
        headers: { ...auth, "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "chore(data): 更新班级数据 " + (data.meta.updated || todayStr()),
          content,
          sha,
          branch: settings.branch
        })
      });
      if (!put.ok) {
        const e = await put.json().catch(() => ({}));
        throw new Error("提交失败 " + put.status + "：" + (e.message || put.statusText));
      }
      markDirty(false);
      chip.className = "sync-chip clean";
      toast("已同步到云端 ✓", "ok");
    } catch (err) {
      chip.className = "sync-chip error";
      toast(err.message || "同步失败", "err");
      console.error(err);
    }
  }

  /* ---------- 渲染入口 ---------- */
  function renderTopbar() {
    $("#brandClassName").textContent = data.meta.className || "班级管理";
    $("#brandSemester").textContent = data.meta.semester || "";
  }
  function renderAll() {
    renderTopbar();
    renderSchedule();
    renderHomework();
    renderAttendance();
    renderCleaning();
    markDirty(dirty);
  }

  /* ---------- 初始化 ---------- */
  function init() {
    // 绑定标签
    $all(".tab").forEach(t => t.addEventListener("click", () => switchTab(t.dataset.tab)));
    document.getElementById("btnSettings").onclick = openSettings;
    document.getElementById("btnSync").onclick = syncToCloud;
    document.getElementById("modalMask").addEventListener("click", (e) => { if (e.target.id === "modalMask") closeModal(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

    attDate = latestAttDate() || todayStr();
    cleanWeekIdx = Math.max(0, (data.cleaning.schedule.length || 1) - 1);
    renderAll();
    markDirty(false);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
