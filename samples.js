(function () {
  "use strict";

  const temporaryReviews = new Map();

  function tag(name, className, text) {
    const element = document.createElement(name);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function button(text, className) {
    const element = tag("button", className, text);
    element.type = "button";
    return element;
  }

  function actions(options, select, label) {
    const group = tag("div", "pbs-options");
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", label);
    const buttons = options.map((text, index) => {
      const control = button(text, "pbs-option");
      control.addEventListener("click", () => select(index));
      group.append(control);
      return control;
    });
    return { group, mark: index => buttons.forEach((control, i) =>
      control.setAttribute("aria-pressed", String(i === index))) };
  }

  function title(root, name, description) {
    root.append(tag("h3", "pbs-title", name), tag("p", "pbs-intro", description));
  }

  function resultBox() {
    const box = tag("div", "pbs-result");
    box.setAttribute("aria-live", "polite");
    box.setAttribute("aria-atomic", "true");
    return box;
  }

  function campus(root) {
    title(root, "这个时刻能签到吗？", "合成场次在 19:00 开始，持续 60 分钟。假设学生已报名，组织者已开启现场签到，且学生使用有效签到码。");
    const timeline = tag("ol", "pbs-clock");
    [["18:45", "签到开放"], ["19:00", "活动开始"], ["19:30", "签到截止"], ["20:00", "活动结束"]].forEach(([time, label]) => {
      const item = tag("li");
      item.append(tag("time", "", time), tag("span", "", label));
      timeline.append(item);
    });
    const minutes = [18 * 60 + 44, 18 * 60 + 45, 19 * 60 + 15, 19 * 60 + 30, 19 * 60 + 31];
    const times = ["18:44", "18:45", "19:15", "19:30", "19:31"];
    const output = resultBox();
    const options = actions(times, update, "选择模拟签到时间");
    root.append(timeline, tag("p", "pbs-label", "选择模拟签到时间"), options.group, output);
    function update(index) {
      options.mark(index);
      const minute = minutes[index];
      let verdict, reason;
      if (minute < 18 * 60 + 45) {
        verdict = "签到尚未开放";
        reason = "本场从 18:45 起接受签到。";
      } else if (minute >= 19 * 60 + 30) {
        verdict = "已过签到时段";
        reason = "19:30 起停止接收签到，活动仍会继续到 20:00。";
      } else {
        verdict = "处于可签到时段";
        reason = "开放时刻算在窗口内，截止时刻起停止接收。";
      }
      output.replaceChildren(tag("strong", "", times[index] + " · " + verdict), tag("p", "", reason));
    }
    update(1);
  }

  const bills = [
    { order: "000127", kind: "收款", code: "金额不符", left: [[4, "128.00"]], right: [[4, "118.00"]],
      finding: "系统侧比渠道侧多 10.00 元。业务单号与收款类型一致，可回查第 4 行核实原因。" },
    { order: "000130", kind: "收款", code: "重复键", left: [[6, "88.00"], [7, "88.00"]], right: [[6, "88.00"]],
      finding: "系统有两行相同的业务键，渠道只有一行。应逐笔核实，这两行可能代表不同明细。" },
    { order: "000129", kind: "退款", code: "仅渠道", left: [], right: [[5, "16.00"]],
      finding: "渠道列有 16.00 元退款，系统账里找不到同单号、同类型的记录。" }
  ];

  function billSide(label, rows) {
    const side = tag("div", "pbs-side");
    side.append(tag("h4", "", label));
    if (!rows.length) side.append(tag("p", "pbs-no-row", "无对应记录"));
    for (const [line, amount] of rows) {
      const entry = tag("p", "pbs-row");
      entry.append(tag("span", "", "第 " + line + " 行"), tag("strong", "", amount + " 元"));
      side.append(entry);
    }
    return side;
  }

  function ledger(root) {
    title(root, "从差异查回原始账单", "选取随包合成账单中的一笔，核对系统与渠道金额。复核说明暂存在本页，刷新即清空。");
    const selected = actions(bills.map(record => record.code), select, "选择差异类型");
    const evidence = resultBox();
    const form = tag("form", "pbs-review");
    const label = tag("label", "pbs-field");
    const note = tag("textarea");
    note.rows = 2;
    note.required = true;
    note.maxLength = 240;
    note.placeholder = "写下你的判断或下一步核查事项";
    label.append(tag("span", "pbs-label", "复核说明"), note);
    const save = button("保存本页说明", "pbs-submit");
    save.type = "submit";
    const history = tag("div", "pbs-history");
    history.setAttribute("aria-live", "polite");
    const drafts = new Map();
    let active = null;
    form.append(label, save);
    root.append(selected.group, evidence, form, history);
    function showReviews() {
      const reviews = temporaryReviews.get(active.order) || [];
      history.replaceChildren();
      if (!reviews.length) return;
      history.append(tag("strong", "pbs-label", "本页复核记录"));
      const list = tag("ol");
      for (const text of reviews) list.append(tag("li", "", text));
      history.append(list);
    }
    function select(index) {
      if (active) drafts.set(active.order, note.value);
      selected.mark(index);
      active = bills[index];
      note.value = drafts.get(active.order) || "";
      note.setCustomValidity("");
      const sides = tag("div", "pbs-sides");
      sides.append(billSide("系统账单", active.left), billSide("渠道账单", active.right));
      evidence.replaceChildren(tag("strong", "", active.order + " · " + active.kind), sides, tag("p", "", active.finding));
      showReviews();
    }
    note.addEventListener("input", () => note.setCustomValidity(""));
    form.addEventListener("submit", event => {
      event.preventDefault();
      const text = note.value.trim();
      if (!text) {
        note.setCustomValidity("请先填写复核说明。");
        note.reportValidity();
        return;
      }
      const reviews = temporaryReviews.get(active.order) || [];
      reviews.push(text);
      temporaryReviews.set(active.order, reviews);
      note.value = "";
      drafts.delete(active.order);
      showReviews();
    });
    select(0);
  }

  const timeline = [
    ["10:21:21.344", "发现积压", "健康接口返回 HTTP 200。队列中 4 项排队、1 项运行，最早未完成任务已等待 95 秒，触发 45 秒阈值。"],
    ["10:21:24.446", "值班签收", "值班人确认收到告警。事件继续保持待恢复状态，签收本身不会消除积压。"],
    ["10:21:25.750", "解除故障", "演练条件已解除，监控开始等待探测结果。此时事件仍然打开。"],
    ["10:21:25.764", "首次正常", "HTTP 200，耗时 15 毫秒，排队和运行均为 0。收到第一次健康采样，继续观察。"],
    ["10:21:27.721", "确认恢复", "连续两次健康采样，排队和运行均为 0，事件关闭。这次演练累计 3 次异常采样，归入同一起事件。"]
  ];

  function incident(root) {
    title(root, "回放一次积压告警", "隔离演练 #1 的已录事件。选取时间点，查看当时的探测与处置记录。以下时间均为北京时间。");
    const output = resultBox();
    const steps = actions(timeline.map(row => row[1]), select, "选择演练记录");
    root.append(steps.group, output);
    function select(index) {
      steps.mark(index);
      const [at, name, body] = timeline[index];
      output.replaceChildren(tag("time", "pbs-record-time", "2026-11-27  " + at), tag("strong", "", name), tag("p", "", body));
    }
    select(0);
  }

  function clinic(root) {
    title(root, "把释放的一席分给谁？", "离线模拟 · R001 已约，R003 和 R004 依次候补。取消原预约后，可以选择按时确认，或模拟十分钟的确认期限到期。");
    const result = resultBox();
    const controls = tag("div", "pbs-options pbs-clinic-actions");
    controls.setAttribute("role", "group");
    controls.setAttribute("aria-label", "模拟候补操作");
    const release = button("取消 R001 的预约", "pbs-option");
    const confirm = button("确认当前留位", "pbs-option");
    const advance = button("推进 10 分钟", "pbs-option");
    const restart = button("重新模拟", "pbs-option");
    controls.append(release, confirm, advance, restart);
    root.append(result, controls);
    let booked, held, queue, elapsed;
    const clock = () => {
      const minute = 8 * 60 + 40 + elapsed;
      return String(Math.floor(minute / 60)).padStart(2, "0") + ":" + String(minute % 60).padStart(2, "0");
    };
    function update(message) {
      const status = booked ? booked + " 已约" : held ? "为 " + held + " 留位" : "余位 1 席";
      result.replaceChildren(tag("strong", "", clock() + " · " + status),
        tag("p", "", message), tag("p", "", "候补队列　" + (queue.join(" → ") || "无人候补")));
      release.hidden = booked !== "R001";
      confirm.hidden = advance.hidden = !held;
      restart.hidden = booked === "R001";
    }
    function reset() {
      booked = "R001"; held = ""; queue = ["R003", "R004"]; elapsed = 0;
      update("当前这一席由 R001 占用。");
    }
    release.addEventListener("click", () => {
      booked = "";
      held = queue.shift();
      update(held + " 获得十分钟确认时间，这一席已计入占用。");
      confirm.focus({preventScroll:true});
    });
    confirm.addEventListener("click", () => {
      booked = held; held = "";
      update("确认成功，原留位转为正式预约。");
      restart.focus({preventScroll:true});
    });
    advance.addEventListener("click", () => {
      elapsed += 10;
      const expired = held;
      held = queue.shift() || "";
      update(expired + " 的留位到期。" + (held ? "轮到 " + held + " 确认。" : "候补队列已清空，号源可重新安排。"));
      if (!held) restart.focus({preventScroll:true});
    });
    restart.addEventListener("click", () => { reset(); release.focus({preventScroll:true}); });
    reset();
  }

  function manual(root) {
    title(root, "直接查手册原文", "用词语或编号查这两份固定版本的手册。展开结果即可核对原文，离线也能使用。");
    const corpus = window.manualSampleCorpus;
    const form = tag("form", "pbs-review pbs-manual-form");
    const label = tag("label", "pbs-field");
    const input = tag("input", "pbs-manual-query");
    input.type = "search";
    input.required = true;
    input.maxLength = 160;
    input.value = "10 分钟留位";
    input.placeholder = "如：留位、前导零、R001";
    label.append(tag("span", "pbs-label", "查询词或编号"), input);
    const submit = button("查原文", "pbs-submit");
    submit.type = "submit";
    form.append(label, submit);
    const output = tag("div", "pbs-manual-output");
    const notice = tag("p", "pbs-manual-count");
    notice.setAttribute("role", "status");
    const list = tag("div");
    output.append(notice, list);
    let scope = "all";
    const scopes = ["all", "clinic", "ledger"];
    const filters = actions(["全部手册", "门诊预约", "双账核对"], i => {
      scope = scopes[i];
      filters.mark(i);
      searchText();
    }, "选择手册范围");
    filters.mark(0);
    root.append(filters.group, form, output);

    function terms(text) {
      const parts = text.normalize("NFKC").toLowerCase().match(/[\u3400-\u9fff]+|[a-z0-9]+(?:[._/-][a-z0-9]+)*/g) || [];
      const result = new Set();
      for (const part of parts) {
        if (/^[a-z0-9]/.test(part) || part.length === 1) result.add(part);
        else for (let i = 0; i < part.length - 1; i++) result.add(part.slice(i, i + 2));
      }
      return result;
    }
    const indexed = corpus.map(section => ({section, words:terms(section.text)}));
    function searchText() {
      const query = input.value.trim().normalize("NFKC").toLowerCase();
      const words = [...terms(query)];
      const pool = indexed.filter(row => scope === "all" || row.section.project === scope);
      const weights = words.map(word => Math.log(1 + indexed.length / (1 + indexed.filter(row => row.words.has(word)).length)));
      const hits = pool.map(({section, words:available}) => {
        const score = words.reduce((sum, word, i) => sum + (available.has(word) ? weights[i] : 0), 0);
        return {section, score:score + (query && section.text.toLowerCase().includes(query) ? 5 : 0)};
      }).filter(row => row.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);
      notice.textContent = hits.length ? "匹配原文 · " + hits.length + " 段" : "没有找到匹配的原文，可换一个词或编号。";
      list.replaceChildren();
      for (const [i, {section}] of hits.entries()) {
        const details = tag("details", "pbs-manual-hit");
        details.open = i === 0;
        const range = section.start === section.end ? String(section.start) : section.start + "–" + section.end;
        const summary = tag("summary", "", section.document + " · 第 " + range + " 行");
        const passage = tag("p", "", section.text);
        const link = tag("a", "textlink", section.version + " · GitHub 原文 ↗");
        link.href = section.url;
        link.target = "_blank";
        link.rel = "noopener";
        details.append(summary, passage, link);
        list.append(details);
      }
    }
    form.addEventListener("submit", event => {event.preventDefault(); searchText();});
    searchText();
  }

  function review(root) {
    title(root, "把一句“系统响应要快”改成验收条款", "合成样例。先检查原句，再填写可测试的业务条件并保存一条修订草案。");
    const original = tag("blockquote", "pbs-quoted", "系统响应要快。");
    const inspect = button("核对原句", "pbs-submit");
    const editor = tag("div", "pbs-criteria");
    editor.hidden = true;
    const missing = tag("p", "pbs-intro", "原句没有指定要测试的操作、负载和合格的响应时间。");
    const fill = button("填入示例条件", "pbs-option");
    const form = tag("form", "pbs-review");
    const group = tag("div", "pbs-criteria-fields");
    function field(caption, kind, placeholder) {
      const label = tag("label", "pbs-field");
      const input = tag("input");
      input.type = kind;
      input.placeholder = placeholder;
      input.required = true;
      input.maxLength = 65;
      if (kind === "number") { input.min = "1"; input.max = "600000"; input.step = "1"; }
      label.append(tag("span", "pbs-label", caption), input);
      group.append(label);
      return input;
    }
    const action = field("要测试的操作", "text", "如：查询工单详情");
    const load = field("测试负载", "text", "如：50 个并发用户");
    const limit = field("P95 响应时间上限（毫秒）", "number", "如：800");
    const save = button("生成验收草案", "pbs-submit");
    save.type = "submit";
    const draft = resultBox();
    draft.hidden = true;
    form.append(group, save);
    editor.append(missing, fill, form, draft);
    root.append(original, inspect, editor);
    inspect.addEventListener("click", () => {
      editor.hidden = false;
      inspect.hidden = true;
      fill.focus();
    });
    fill.addEventListener("click", () => {
      action.value = "查询工单详情";
      load.value = "50 个并发用户";
      action.setCustomValidity("");
      load.setCustomValidity("");
      limit.value = "800";
      draft.hidden = true;
      save.focus();
    });
    form.addEventListener("input", () => {
      draft.hidden = true;
      action.setCustomValidity("");
      load.setCustomValidity("");
    });
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!action.value.trim() || !load.value.trim()) {
        const blank = !action.value.trim() ? action : load;
        blank.setCustomValidity("请填写可以用于测试的条件。");
        blank.reportValidity();
        return;
      }
      draft.replaceChildren(tag("strong", "", "修订草案"), tag("p", "", "在"+load.value.trim()+"的负载下，"+action.value.trim()+"的 P95 响应时间应不超过 "+limit.value+" 毫秒。"),
        tag("p", "pbs-intro", "这是待确认的验收目标。实际性能需要通过测试测量。"));
      draft.hidden = false;
    });
  }

  function access(root) {
    const link = tag("a", "button", "打开报表授权演练 ↗");
    link.href = "demos/access/index.html";
    root.append(tag("p", "pbs-intro", "以运营同事身份申请区域经营周报，再切换到负责人审批。回到申请人视图读一次报表，推进演示时钟后，再用同一个入口检查访问结果。"), link);
  }

  function funnel(root) {
    const link = tag("a", "button", "体验一次报名 ↗");
    link.href = "demos/funnel/index.html#try";
    root.append(tag("p", "pbs-intro", "先看一眼活动的样例漏斗，再打开校园活动、完成报名，回来对照刚刚增加的三条事件。"), link);
  }

  function inventory(root) {
    const link = tag("a", "button", "体验一次离线盘点 ↗");
    link.href = "demos/inventory/index.html";
    root.append(tag("p", "pbs-intro", "以第一位仓员身份给 A01 的牛皮纸封箱胶带录入 23 卷。恢复联网后同步，切换第二位仓员录入 24 卷，再到主管工作台复核。"), link);
  }

  function searchlab(root) {
    const query = encodeURIComponent("屏幕挂灯");
    const demo = projects.searchlab.mainURL;
    const shop = tag("a", "button primary", "试搜屏幕挂灯 ↗");
    shop.href = demo + "#shop?q=" + query;
    const evaluation = tag("a", "button", "查看同词的排序对照 ↗");
    evaluation.href = demo + "#evaluation?q=" + query;
    const wrongHit = tag("a", "textlink", "查看一次误召回 ↗");
    wrongHit.href = demo + "#evaluation?q=hdmi-splitter&outcome=more-unrelated";
    const actions = tag("div", "linkrow");
    actions.append(shop, evaluation, wrongHit);
    root.append(tag("p", "pbs-intro", "先在商店试搜“屏幕挂灯”，对比三种规格，再把有现货的款式加入购物袋。切到同词的排序对照，看这些挂灯是怎样被找到的。"), actions);
  }

  function apiregression(root) {
    const demo = projects.apiregression.mainURL;
    const first = tag("a", "button primary", "查看订单金额断言 ↗");
    first.href = demo + "&candidate=candidate-a&case=order-detail&path=%24.data.amountCents";
    const second = tag("a", "button", "运行修订版本 ↗");
    second.href = demo + "&candidate=candidate-b";
    const actions = tag("div", "linkrow");
    actions.append(first, second);
    root.append(tag("p", "pbs-intro", "先打开订单金额断言，对照两版原始 JSON，再运行修订版核对放行结论和允许的变更。"), actions);
  }

  function coldchain(root) {
    const demo = projects.coldchain.mainURL;
    const excursion = tag("a", "button primary", "回放持续超温 ↗");
    excursion.href = demo + "&trip=cc-1028";
    const gap = tag("a", "button", "核对传感器断报 ↗");
    gap.href = demo + "&trip=cc-1026";
    const actions = tag("div", "linkrow");
    actions.append(excursion, gap);
    root.append(tag("p", "pbs-intro", "先看 25 分钟的连续超温采样，再打开断报车次，确认缺少的 5 次采样如何影响证据。"), actions);
  }

  function logprivacy(root) {
    const demo = projects.logprivacy.mainURL;
    const baseline = tag("a", "button primary", "定位基线问题 ↗");
    baseline.href = demo + "&view=baseline";
    const candidate = tag("a", "button", "检查候选规则 ↗");
    candidate.href = demo;
    const actions = tag("div", "linkrow");
    actions.append(baseline, candidate);
    root.append(tag("p", "pbs-intro", "打开基线定位漏遮与误遮，再切到候选规则，核对诊断字段和导出状态。"), actions);
  }

  function roster(root) {
    const demo = projects.roster.mainURL;
    const normal = tag("a", "button primary", "查看一周班表 ↗");
    normal.href = demo;
    const absence = tag("a", "button", "复核请假缺口 ↗");
    absence.href = demo + "&case=absence";
    const actions = tag("div", "linkrow");
    actions.append(normal, absence);
    root.append(tag("p", "pbs-intro", "先看排满的常规周，再复核周日晚班缺口。恢复专席可用日期后可重算。"), actions);
  }

  function lineage(root) {
    const demo = projects.lineage.mainURL;
    const block = tag("a", "button primary", "追查金额字段影响 ↗");
    block.href = demo;
    const safe = tag("a", "button", "查看未引用字段 ↗");
    safe.href = demo + "&case=unused";
    const actions = tag("div", "linkrow");
    actions.append(block, safe);
    root.append(tag("p", "pbs-intro", "从金额字段追到看板，再用旧备注对照什么情况下清单中没有下游。"), actions);
  }

  function a11y(root) {
    const demo = projects.a11y.mainURL;
    const baseline = tag("a", "button primary", "查看原始问题 ↗");
    baseline.href = demo;
    const fixed = tag("a", "button", "体验修复流程 ↗");
    fixed.href = demo + "&view=fixed";
    const actions = tag("div", "linkrow");
    actions.append(baseline, fixed);
    root.append(tag("p", "pbs-intro", "先查原始预约表的问题，再切到修复版用 Tab 和 Enter 完成一次预约。"), actions);
  }

  function canary(root) {
    const demo = projects.canary.mainURL;
    const regression = tag("a", "button primary", "回放回滚窗口 ↗");
    regression.href = demo;
    const stable = tag("a", "button", "查看稳定放量 ↗");
    stable.href = demo + "&case=healthy";
    const actions = tag("div", "linkrow");
    actions.append(regression, stable);
    root.append(tag("p", "pbs-intro", "核对回滚和放量案例中相同时间点的指标，找出形成建议的连续窗口。"), actions);
  }

  const samples = { campus, ledger, incident, clinic, manual, review, access, funnel, inventory, searchlab, apiregression, coldchain, logprivacy, roster, lineage, a11y, canary };
  window.mountProjectSample = function (element, projectId) {
    if (!element) return;
    const root = tag("div", "pbs-sample");
    const mount = Object.hasOwn(samples, projectId) ? samples[projectId] : null;
    element.replaceChildren();
    if (!mount) return;
    element.append(root);
    mount(root);
  };
})();
